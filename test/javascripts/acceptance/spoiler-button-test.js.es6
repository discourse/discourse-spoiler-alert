import { acceptance } from "helpers/qunit-helpers";
import { clearPopupMenuOptionsCallback } from "discourse/controllers/composer";

acceptance('Spoiler Button', {
  loggedIn: true,
  settings: { spoiler_enabled: true },
  beforeEach() {
    clearPopupMenuOptionsCallback();
  }
});

function findTextarea() {
  return find(".d-editor-input")[0];
}

test('spoiler button', assert => {
  const popUpMenu = selectKit('.toolbar-popup-menu-options');

  visit("/");

  andThen(() => {
    assert.ok(exists('#create-topic'), 'the create button is visible');
  });

  click('#create-topic');
  popUpMenu.expand().selectRowByValue('insertSpoiler');

  andThen(() => {
    assert.equal(
      find(".d-editor-input").val(),
      `[spoiler]${I18n.t("composer.spoiler_text")}[/spoiler]`,
      'it should contain the right output'
    );

    const textarea = findTextarea();
    assert.equal(textarea.selectionStart, 9, 'it should start highlighting at the right position');
    assert.equal(textarea.selectionEnd, I18n.t("composer.spoiler_text").length + 9, 'it should end highlighting at the right position');
  });

  fillIn('.d-editor-input', "This is hidden");

  andThen(() => {
    const textarea = findTextarea();
    textarea.selectionStart = 0;
    textarea.selectionEnd = textarea.value.length;
  });

  popUpMenu.expand().selectRowByValue('insertSpoiler');

  andThen(() => {
    assert.equal(
      find(".d-editor-input").val(),
      `[spoiler]This is hidden[/spoiler]`,
      'it should contain the right output'
    );

    const textarea = findTextarea();
    assert.equal(textarea.selectionStart, 9, 'it should start highlighting at the right position');
    assert.equal(textarea.selectionEnd, 23, 'it should end highlighting at the right position');
  });

  fillIn('.d-editor-input', "Before this is hidden After");

  andThen(() => {
    const textarea = findTextarea();
    textarea.selectionStart = 7;
    textarea.selectionEnd = 21;
  });

  popUpMenu.expand().selectRowByValue('insertSpoiler');

  andThen(() => {
    assert.equal(
      find(".d-editor-input").val(),
      `Before [spoiler]this is hidden[/spoiler] After`,
      'it should contain the right output'
    );

    const textarea = findTextarea();
    assert.equal(textarea.selectionStart, 16, 'it should start highlighting at the right position');
    assert.equal(textarea.selectionEnd, 30, 'it should end highlighting at the right position');
  });

  fillIn('.d-editor-input', "Before\nthis is hidden\nAfter");

  andThen(() => {
    const textarea = findTextarea();
    textarea.selectionStart = 7;
    textarea.selectionEnd = 21;
  });

  popUpMenu.expand().selectRowByValue('insertSpoiler');

  andThen(() => {
    assert.equal(
      find(".d-editor-input").val(),
      `Before\n[spoiler]this is hidden[/spoiler]\nAfter`,
      'it should contain the right output'
    );

    const textarea = findTextarea();
    assert.equal(textarea.selectionStart, 16, 'it should start highlighting at the right position');
    assert.equal(textarea.selectionEnd, 30, 'it should end highlighting at the right position');
  });
});
