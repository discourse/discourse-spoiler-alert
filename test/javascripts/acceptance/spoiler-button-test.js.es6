import { acceptance } from "helpers/qunit-helpers";
import { clearPopupMenuOptionsCallback } from "discourse/controllers/composer";

acceptance("Spoiler Button", {
  loggedIn: true,
  settings: { spoiler_enabled: true },
  beforeEach() {
    clearPopupMenuOptionsCallback();
  }
});

test("spoiler button", async assert => {
  const popUpMenu = selectKit(".toolbar-popup-menu-options");

  await visit("/");

  assert.ok(exists("#create-topic"), "the create button is visible");

  await click("#create-topic");
  await popUpMenu.expand();
  await popUpMenu.selectRowByValueAwait("insertSpoiler");

  assert.equal(
    find(".d-editor-input").val(),
    `[spoiler]${I18n.t("composer.spoiler_text")}[/spoiler]`,
    "it should contain the right output"
  );

  let textarea = await find(".d-editor-input")[0];
  assert.equal(
    textarea.selectionStart,
    9,
    "it should start highlighting at the right position"
  );
  assert.equal(
    textarea.selectionEnd,
    I18n.t("composer.spoiler_text").length + 9,
    "it should end highlighting at the right position"
  );

  await fillIn(".d-editor-input", "This is hidden");

  textarea.selectionStart = 0;
  textarea.selectionEnd = textarea.value.length;

  await popUpMenu.expand();
  await popUpMenu.selectRowByValueAwait("insertSpoiler");

  assert.equal(
    find(".d-editor-input").val(),
    `[spoiler]This is hidden[/spoiler]`,
    "it should contain the right output"
  );

  assert.equal(
    textarea.selectionStart,
    9,
    "it should start highlighting at the right position"
  );
  assert.equal(
    textarea.selectionEnd,
    23,
    "it should end highlighting at the right position"
  );

  await fillIn(".d-editor-input", "Before this is hidden After");

  textarea.selectionStart = 7;
  textarea.selectionEnd = 21;

  await popUpMenu.expand();
  await popUpMenu.selectRowByValueAwait("insertSpoiler");

  assert.equal(
    find(".d-editor-input").val(),
    `Before [spoiler]this is hidden[/spoiler] After`,
    "it should contain the right output"
  );

  assert.equal(
    textarea.selectionStart,
    16,
    "it should start highlighting at the right position"
  );
  assert.equal(
    textarea.selectionEnd,
    30,
    "it should end highlighting at the right position"
  );

  await fillIn(".d-editor-input", "Before\nthis is hidden\nAfter");

  textarea.selectionStart = 7;
  textarea.selectionEnd = 21;

  await popUpMenu.expand();
  await popUpMenu.selectRowByValueAwait("insertSpoiler");

  assert.equal(
    find(".d-editor-input").val(),
    `Before\n[spoiler]this is hidden[/spoiler]\nAfter`,
    "it should contain the right output"
  );

  assert.equal(
    textarea.selectionStart,
    16,
    "it should start highlighting at the right position"
  );
  assert.equal(
    textarea.selectionEnd,
    30,
    "it should end highlighting at the right position"
  );
});
