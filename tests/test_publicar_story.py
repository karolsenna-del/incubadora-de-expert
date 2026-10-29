import importlib.util
import os
import tempfile
import unittest
from datetime import date
from pathlib import Path

SCRIPT_PATH = Path(__file__).parents[1] / ".github" / "scripts" / "publicar_story.py"
spec = importlib.util.spec_from_file_location("publicar_story", SCRIPT_PATH)
if spec is None or spec.loader is None:
    raise RuntimeError(f"Nao foi possivel carregar {SCRIPT_PATH}")
publicar_story = importlib.util.module_from_spec(spec)
spec.loader.exec_module(publicar_story)


class SelectStorySlugTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.queue = Path(self.temp_dir.name) / "fila"
        self.queue.mkdir()
        self.today = date(2026, 10, 29)

    def tearDown(self):
        self.temp_dir.cleanup()

    def add_story(self, slug):
        path = self.queue / slug
        path.mkdir()
        return path

    def test_explicit_slug_selects_exact_queue_directory(self):
        self.add_story("expert360-domingo-2026-10-25")
        wanted = "expert360-quinta-2026-10-29"
        self.add_story(wanted)

        selected = publicar_story.select_story_slug(self.queue, wanted, self.today)

        self.assertEqual(selected, wanted)

    def test_explicit_slug_must_exist_as_directory_in_queue(self):
        with self.assertRaisesRegex(ValueError, "nao existe na fila"):
            publicar_story.select_story_slug(self.queue, "inexistente-2026-10-29", self.today)

        (self.queue / "arquivo-2026-10-29").write_text("not a directory")
        with self.assertRaisesRegex(ValueError, "nao existe na fila"):
            publicar_story.select_story_slug(self.queue, "arquivo-2026-10-29", self.today)

    def test_explicit_slug_rejects_path_traversal_and_separators(self):
        invalid_slugs = (
            "../fora",
            "subdir/story",
            r"subdir\story",
            ".",
            "..",
            "/tmp/fora",
            " com-espaco-2026-10-29 ",
            "slug\0invalido",
        )
        for slug in invalid_slugs:
            with (
                self.subTest(slug=slug),
                self.assertRaisesRegex(ValueError, "Slug invalido"),
            ):
                publicar_story.select_story_slug(self.queue, slug, self.today)

    def test_explicit_slug_rejects_symlink_that_escapes_queue(self):
        outside = Path(self.temp_dir.name) / "outside"
        outside.mkdir()
        os.symlink(outside, self.queue / "link-2026-10-29")

        with self.assertRaisesRegex(ValueError, "Slug invalido"):
            publicar_story.select_story_slug(self.queue, "link-2026-10-29", self.today)

    def test_scheduled_run_selects_only_current_date(self):
        self.add_story("aaa-backlog-2026-10-25")
        wanted = "expert360-quinta-2026-10-29"
        self.add_story(wanted)
        self.add_story("zzz-futuro-2026-10-30")

        selected = publicar_story.select_story_slug(self.queue, None, self.today)

        self.assertEqual(selected, wanted)

    def test_scheduled_run_returns_none_when_today_has_no_story(self):
        self.add_story("aaa-backlog-2026-10-25")

        selected = publicar_story.select_story_slug(self.queue, None, self.today)

        self.assertIsNone(selected)

    def test_scheduled_run_refuses_ambiguous_current_date_in_sorted_order(self):
        self.add_story("zeta-2026-10-29")
        self.add_story("alfa-2026-10-29")

        with self.assertRaisesRegex(
            ValueError,
            r"Mais de uma Story para 2026-10-29: alfa-2026-10-29, zeta-2026-10-29",
        ):
            publicar_story.select_story_slug(self.queue, None, self.today)


if __name__ == "__main__":
    unittest.main()
