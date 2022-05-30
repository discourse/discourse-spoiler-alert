import { discourseModule } from "discourse/tests/helpers/qunit-helpers";
import { test } from "qunit";
import toMarkdown from "discourse/lib/to-markdown";
import { withPluginApi } from "discourse/lib/plugin-api";
import { initializeSpoiler } from "discourse/plugins/discourse-spoiler-alert/initializers/spoiler-alert";

discourseModule("Spoiler Alert | Unit | to-markdown", function (hooks) {
  hooks.beforeEach(function () {
    withPluginApi("0.5", initializeSpoiler);
  });

  test("handles spoiler tags", function (assert) {
    let html = `<div>Text with a</div><div class="spoiled">spoiled</div><div>word.</div>`;
    let markdown = `Text with a\n\n[spoiler]spoiled[/spoiler]\n\nword.`;

    assert.strictEqual(
      toMarkdown(html),
      markdown,
      "it should create block spoiler tag"
    );

    html = `Inline <span class="spoiled">spoiled</span> word.`;
    markdown = `Inline [spoiler]spoiled[/spoiler] word.`;
    assert.strictEqual(
      toMarkdown(html),
      markdown,
      "it should create inline spoiler tag"
    );
  });
});
