(function($) {
  var isIE = /*@cc_on!@*/ false || document.documentMode,
    isFirefox = typeof InstallTrigger !== "undefined",
    DEFAULTS = {
      max: { text: 10, link: 10, image: 20 },
      partial: { text: 5, link: 5, image: 6 },
      none: { text: 0, link: 0, image: 0 }
    };

  // handle lazyYT onebox
  function blurLazyYT($spoiler) {
    $("div.lazyYT", $spoiler).each(function() {
      $(this).replaceWith(
        "<p>https://youtube.com/watch?v=" + $(this).data("youtube-id") + "</p>"
      );
    });
  }

  function blurText($spoiler, radius) {
    // spoiler text is gray so as to maintain plugin compatibility with both light and dark theme sites.
    var textShadow = "gray 0 0 " + radius + "px",
      userSelect = "-webkit-user-select";

    if (isIE) {
      textShadow =
        radius <= 0 ? "0 0 0 0 gray" : "0 0 " + radius + "px .1px gray";
      userSelect = "-ms-user-select";
    }
    if (isFirefox) {
      userSelect = "-moz-user-select";
    }

    $spoiler
      .css("background-color", "transparent")
      .css("color", "rgba(0,0,0,0)")
      .css("text-shadow", textShadow)
      .css(userSelect, "none");
  }

  function blurSelector($sel, radius) {
    var value = radius > 0 ? "blur(" + radius + "px)" : "";
    if (isIE) {
      $sel.css(
        "-ms-filter",
        "progid:DXImageTransform.Microsoft.Blur(pixelradius=" + radius + ")"
      );
    } else {
      $sel.css("filter", value).css("-webkit-filter", value);
    }
  }

  function blurLinkAndPre($spoiler, radius) {
    $("a", $spoiler).addClass("no-track-link");

    $("a,pre", $spoiler).each(function(index, linkOrPre) {
      blurSelector($(linkOrPre), radius);
    });
  }

  function blurImageIE($spoiler, radius) {
    var $images = $("img", $spoiler);
    if (isIE) {
      $images.css("opacity", radius === 0 ? "1.0" : "0.0");
    } else {
      blurSelector($images, radius);
    }
  }

  var applyBlur = function($spoiler, option) {
    blurLazyYT($spoiler);
    blurText($spoiler, option.text);
    blurLinkAndPre($spoiler, option.link);
    blurImageIE($spoiler, option.image);
  };

  var applySpoilers = function($spoiler, options) {
    var maxBlur = options.max,
      partialBlur = options.partial,
      noBlur = options.none;

    $spoiler.data("spoiler-state", "blurred");

    applyBlur($spoiler, maxBlur);

    $spoiler
      .on("mouseover", function() {
        $spoiler.css("cursor", "pointer");
        if ($spoiler.data("spoiler-state") === "blurred") {
          applyBlur($spoiler, partialBlur);
        }
      })
      .on("mouseout", function() {
        if ($spoiler.data("spoiler-state") === "blurred") {
          applyBlur($spoiler, maxBlur);
        }
      })
      .on("click", function(e) {
        if ($spoiler.data("spoiler-state") === "blurred") {
          $spoiler.data("spoiler-state", "revealed").css("cursor", "auto");
          applyBlur($spoiler, noBlur);
          e.preventDefault();
        } else {
          if (e.target && e.target.tagName !== "A") {
            $spoiler.data("spoiler-state", "blurred").css("cursor", "pointer");
            applyBlur($spoiler, partialBlur);
            e.preventDefault();
          }
        }
      });
  };

  $.fn.spoil = function(options) {
    var opts = $.extend(DEFAULTS, options || {});
    return this.each(function() {
      applySpoilers($(this), opts);
    });
  };
})(jQuery);
