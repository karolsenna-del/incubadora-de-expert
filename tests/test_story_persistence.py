import importlib.util
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch, Mock

spec = importlib.util.spec_from_file_location('story', Path(__file__).parents[1] / '.github/scripts/publicar_story.py')
story = importlib.util.module_from_spec(spec)
spec.loader.exec_module(story)


class PersistenceTests(unittest.TestCase):
    def test_push_retries_are_bounded_and_do_not_publish(self):
        with patch.object(story.subprocess, 'run', return_value=Mock(returncode=1)) as run:
            with self.assertRaisesRegex(RuntimeError, '3 tentativas'):
                story.sync_master()
        self.assertEqual(run.call_count, 3)

    def test_rejected_push_fetches_and_rebases_again(self):
        results = [Mock(returncode=x) for x in [0, 0, 1, 0, 0, 0]]
        with patch.object(story.subprocess, 'run', side_effect=results) as run:
            story.sync_master()
        self.assertEqual([c.args[0][1] for c in run.call_args_list], ['fetch', 'rebase', 'push'] * 2)

    def test_conflict_aborts_without_push(self):
        with patch.object(story.subprocess, 'run', side_effect=[Mock(returncode=0), Mock(returncode=1), Mock(returncode=0)]) as run:
            with self.assertRaisesRegex(RuntimeError, 'rebase'):
                story.sync_master()
        self.assertEqual(run.call_args.args[0], ['git', 'rebase', '--abort'])

    def test_receipt_keeps_all_ids(self):
        with tempfile.TemporaryDirectory() as tmp:
            receipt = Path(tmp) / 'receipt.json'
            with patch.object(story, 'RECEIPT_FILE', str(receipt)):
                story.record_receipt('example-2026-11-15', ['123', '456'])
            import json
            self.assertEqual(json.loads(receipt.read_text())['media_ids'], ['123', '456'])

    def test_reservation_is_pushed_before_returning_path(self):
        with tempfile.TemporaryDirectory() as tmp:
            queue = Path(tmp) / 'fila'
            (queue / 'slug').mkdir(parents=True)
            with patch.object(story, 'FILA_DIR', str(queue)), patch.object(story, 'PROCESSING_DIR', str(Path(tmp) / 'processing')), patch.object(story, 'persist_changes') as persist:
                path = story.reserve_story('slug')
                persist.assert_called_once()
                self.assertTrue(Path(path).is_dir())
                self.assertFalse((queue / 'slug').exists())
