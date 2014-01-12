(function() {

  Discourse.addInitializer(function () {

    var applySpoilers = function($post) {
      // text
      $('.spoiler:not(:has(img))', $post).removeClass('spoiler')
                                         .addClass('spoiled')
                                         .spoilText();
      // images
      $('.spoiler:has(img)', $post).removeClass('spoiler')
                                   .addClass('spoiled')
                                   .wrap("<div style='display: inline-block; overflow: hidden;'></div>")
                                   .spoilImage();
    };

    Em.run.next(function() {
      applySpoilers();

      Discourse.PostView.prototype.on("postViewInserted", applySpoilers);
      Discourse.ComposerView.prototype.on("previewRefreshed", applySpoilers);
    });

  });

})();
