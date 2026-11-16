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
        self.assertIn("fetch-depth: 0", workflow)
        self.assertIn("${{ inputs.slug }}", workflow)
        self.assertIn("required: false", workflow)
        self.assertIn("if: always()", workflow)
        self.assertIn("actions/upload-artifact@v4", workflow)
        self.assertNotIn("workflow_run:", workflow)
        self.assertNotIn("push:", workflow)


if __name__ == "__main__":
    unittest.main()
