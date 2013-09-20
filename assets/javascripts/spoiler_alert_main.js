(function() {

  Discourse.addInitializer(function () {

    var applySpoilers = function($post) {
      $('.spoiler', $post).removeClass('spoiler').spoilerAlert();    
    };

    Discourse.PostView.prototype.on("postViewInserted", applySpoilers);
    Discourse.ComposerView.prototype.on("previewRefreshed", applySpoilers);
  });

})();