import {
  acceptance,
  exists,
  query,
} from "discourse/tests/helpers/qunit-helpers";
import { test } from "qunit";
import { click, fillIn, visit } from "@ember/test-helpers";
import I18n from "I18n";
import selectKit from "discourse/tests/helpers/select-kit-helper";
import { clearPopupMenuOptionsCallback } from "discourse/controllers/composer";

acceptance("Spoiler Button", function (needs) {
  needs.user();
  needs.settings({ spoiler_enabled: true });
  needs.hooks.beforeEach(() => {
    clearPopupMenuOptionsCallback();
  });

  test("spoiler button", async (assert) => {
    const popUpMenu = selectKit(".toolbar-popup-menu-options");

    await visit("/");

    assert.ok(exists("#create-topic"), "the create button is visible");

    await click("#create-topic");
    await popUpMenu.expand();
    await popUpMenu.selectRowByValue("insertSpoiler");

    assert.strictEqual(
      query(".d-editor-input").value,
      `[spoiler]${I18n.t("composer.spoiler_text")}[/spoiler]`,
      "it should contain the right output"
    );

    let textarea = query(".d-editor-input");
    assert.strictEqual(
      textarea.selectionStart,
      9,
      "it should start highlighting at the right position"
    );
    assert.strictEqual(
      textarea.selectionEnd,
      I18n.t("composer.spoiler_text").length + 9,
      "it should end highlighting at the right position"
    );

    await fillIn(".d-editor-input", "This is hidden");

    textarea.selectionStart = 0;
    textarea.selectionEnd = textarea.value.length;

    await popUpMenu.expand();
    await popUpMenu.selectRowByValue("insertSpoiler");

    assert.strictEqual(
      query(".d-editor-input").value,
      `[spoiler]This is hidden[/spoiler]`,
      "it should contain the right output"
    );

    assert.strictEqual(
      textarea.selectionStart,
      9,
      "it should start highlighting at the right position"
    );
    assert.strictEqual(
      textarea.selectionEnd,
      23,
      "it should end highlighting at the right position"
    );

    await fillIn(".d-editor-input", "Before this is hidden After");

    textarea.selectionStart = 7;
    textarea.selectionEnd = 21;

    await popUpMenu.expand();
    await popUpMenu.selectRowByValue("insertSpoiler");

    assert.strictEqual(
      query(".d-editor-input").value,
      `Before [spoiler]this is hidden[/spoiler] After`,
      "it should contain the right output"
    );

    assert.strictEqual(
      textarea.selectionStart,
      16,
      "it should start highlighting at the right position"
    );
    assert.strictEqual(
      textarea.selectionEnd,
      30,
      "it should end highlighting at the right position"
    );

    await fillIn(".d-editor-input", "Before\nthis is hidden\nAfter");

    textarea.selectionStart = 7;
    textarea.selectionEnd = 21;

    await popUpMenu.expand();
    await popUpMenu.selectRowByValue("insertSpoiler");

    assert.strictEqual(
      query(".d-editor-input").value,
      `Before\n[spoiler]this is hidden[/spoiler]\nAfter`,
      "it should contain the right output"
    );

    assert.strictEqual(
      textarea.selectionStart,
      16,
      "it should start highlighting at the right position"
    );
    assert.strictEqual(
      textarea.selectionEnd,
      30,
      "it should end highlighting at the right position"
    );

    // enforce block mode when selected text is multiline
    await fillIn(".d-editor-input", "Before\nthis is\n\nhidden\nAfter");

    textarea.selectionStart = 7;
    textarea.selectionEnd = 22;

    await popUpMenu.expand();
    await popUpMenu.selectRowByValue("insertSpoiler");

    assert.strictEqual(
      query(".d-editor-input").value,
      `Before\n[spoiler]\nthis is\n\nhidden\n[/spoiler]\nAfter`,
      "it should contain the right output"
    );

    assert.strictEqual(
      textarea.selectionStart,
      17,
      "it should start highlighting at the right position"
    );
    assert.strictEqual(
      textarea.selectionEnd,
      32,
      "it should end highlighting at the right position"
    );
  });
});
