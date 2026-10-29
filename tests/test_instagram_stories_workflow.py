import unittest
from pathlib import Path

WORKFLOW = (
    Path(__file__).parents[1]
    / ".github"
    / "workflows"
    / "instagram-stories-scheduler.yml"
)


class InstagramStoriesWorkflowTests(unittest.TestCase):
    def test_checkout_tracks_latest_master_for_queued_dispatches(self):
        workflow = WORKFLOW.read_text(encoding="utf-8")

        self.assertIn("group: instagram-stories-publisher", workflow)
        self.assertIn("cancel-in-progress: false", workflow)
        self.assertIn("ref: master", workflow)
        self.assertIn("STORY_SLUG:", workflow)


if __name__ == "__main__":
    unittest.main()
