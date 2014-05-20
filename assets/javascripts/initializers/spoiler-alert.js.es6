/**
  Apply our spoilers when the app boots
**/
export default {
  name: "apply-spoilers",
  initialize: function() {
    var applySpoilers = function($elem) {
      // text
      $('.spoiler:not(:has(img))', $elem).removeClass('spoiler')
                                         .addClass('spoiled')
                                         .spoilText();
      // images
      $('.spoiler:has(img)', $elem).removeClass('spoiler')
                                   .addClass('spoiled')
                                   .wrap("<div style='display: inline-block; overflow: hidden;'></div>")
                                   .spoilImage();
    };

    // Run it once the page loads for good measure.
    Em.run('afterRender', function() {
      applySpoilers();
    });

    var decorate = function(klass, evt) {
      klass.reopen({
        _applySpoilers: function($elem) {
          applySpoilers($elem);
        }.on(evt)
      });
    };

    decorate(Discourse.PostView, 'postViewInserted');
    decorate(Discourse.ComposerView, 'previewRefreshed');
    decorate(Discourse.UserStreamView, 'didInsertElement');
    decorate(Discourse.EmbeddedPostView, 'didInsertElement');
  }
};
