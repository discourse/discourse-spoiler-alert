import { acceptance } from "discourse/tests/helpers/qunit-helpers";
import { test } from "qunit";
import { visit } from "@ember/test-helpers";
import toMarkdown from "discourse/lib/to-markdown";

acceptance("To Markdown", function (needs) {
  needs.settings({ spoiler_enabled: true, enable_rich_text_paste: true });

  test("to-markdown", async (assert) => {
    await visit("/");

    let html = `<div>Text with a</div><div class="spoiled">spoiled</div><div>word.</div>`;
    let markdown = `Text with a\n\n[spoiler]spoiled[/spoiler]\n\nword.`;

    assert.strictEqual(
      toMarkdown(html),
      markdown,
      "it should create spoiler tag"
    );

    html = `Inline <span class="spoiled">spoiled</span> word.`;
    markdown = `Inline [spoiler]spoiled[/spoiler] word.`;
    assert.strictEqual(
      toMarkdown(html),
      markdown,
      "it should inline create spoiler tag"
    );
  });
});
