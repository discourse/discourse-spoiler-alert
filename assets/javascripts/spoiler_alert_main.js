(function() {

  Discourse.addInitializer(function () {

    var applySpoilers = function($post) {
      $('.spoiler:has(img)', $post).removeClass('spoiler').spoilerAlert({max: 20, partial: 6}).wrap("<div style='display: inline-block; overflow: hidden;'></div>");
      $('.spoiler:not(:has(img))', $post).removeClass('spoiler').spoilerAlert({max: 4, partial: 2});
    };

    Discourse.PostView.prototype.on("postViewInserted", applySpoilers);
    Discourse.ComposerView.prototype.on("previewRefreshed", applySpoilers);
  });

})();
