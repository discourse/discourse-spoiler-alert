(function ($) {
  // handle lazyYT onebox
  function blurLazyYT($spoiler) {
    $("div.lazyYT", $spoiler).each(function () {
      $(this).replaceWith(
        "<p>https://youtube.com/watch?v=" + $(this).data("youtube-id") + "</p>"
      );
    });
  }

  function blur($spoiler) {
    $spoiler.addClass("spoiler-blurred");
    $("a", $spoiler).addClass("no-track-link");
  }

  var applyBlur = function ($spoiler) {
    blurLazyYT($spoiler);
    blur($spoiler);
  };

  var applySpoilers = function ($spoiler) {
    $spoiler.data("spoiler-state", "blurred");

    applyBlur($spoiler);

    $spoiler.on("click", function (e) {
      if ($spoiler.data("spoiler-state") === "blurred") {
        $spoiler.data("spoiler-state", "revealed");
        $spoiler.removeClass("spoiler-blurred");
        e.preventDefault();
      } else {
        $spoiler.data("spoiler-state", "blurred");
        $spoiler.addClass("spoiler-blurred");
      }
    });
  };

  $.fn.spoil = function () {
    return this.each(function () {
      applySpoilers($(this));
    });
  };
})(jQuery);
