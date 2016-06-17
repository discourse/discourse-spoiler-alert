(function($) {

  var isIE = /*@cc_on!@*/false || document.documentMode,
      globalIdCounter = 0,
      DEFAULTS = {
        max: { text: 10, link: 10, image: 20 },
        partial: { text: 5, link: 5, image: 6},
        none: { text: 0, link: 0, image: 0}
      };

  // handle lazyYT onebox
  function blurLazyYT($spoiler) {
    $("div.lazyYT", $spoiler).each(function() {
      $(this).replaceWith("<p>https://youtube.com/watch?v=" + $(this).data('youtube-id') + "</p>");
    });
  };

  function blurText($spoiler, radius) {
    // spoiler text is gray so as to maintain plugin compatibility with both light and dark theme sites.
    var textShadow = "gray 0 0 " + radius + "px";
    if (isIE) { textShadow = radius <= 0 ? "0 0 0 0 gray" : "0 0 " + radius + "px .1px gray"; }

    $spoiler.css("background-color", "transparent")
            .css("color", "rgba(0,0,0,0)")
            .css("text-shadow", textShadow);
  };

  function blurLink($spoiler, radius) {
    $("a", $spoiler).each(function(index, link) {
      var value = radius > 0 ? "blur(" + radius + "px)" : "";
      if (isIE) {
        $(link).css("-ms-filter", "progid:DXImageTransform.Microsoft.Blur(pixelradius="+radius+")");
      } else {
        $(link).css("filter", value)
               .css("-webkit-filter", value);
      }
    });
  };

  function blurImage($spoiler, radius) {
    // on the first pass, transform images into SVG
    $("img", $spoiler).each(function(index, image) {
      var isEmoji = $(this).hasClass('emoji');
      var transform = function() {
        var w = isEmoji ? 20 : image.width,
            h = isEmoji ? 20 : image.height,
            id = ++globalIdCounter;
        var svg = "<svg data-spoiler-id='" + id + "' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='" + w + "' height='" + h + "'>" +
                  "<defs><filter id='blur-" + id + "'><feGaussianBlur id='gaussian-" + id + "' stdDeviation='" + radius + "'></feGaussianBlur></filter></defs>" +
                  "<image xlink:href='" + image.src + "' filter='url(#blur-" + id + ")' style='filter: url(#blur-" + id + ")' width='" + w + "' height='" + h + "'></image>" +
                  "</svg>";
        $(image).replaceWith(svg);
      };
      // do we need to wait for the image to load?
      if (image.naturalWidth === 0 || image.naturalHeight === 0) {
        image.onload = transform;
      } else {
        transform();
      }
    });

    // change the blur radius
    $("svg", $spoiler).each(function(index, svg) {
      var id = svg.getAttribute("data-spoiler-id");
      var element = svg.getElementById("gaussian-" + id);
      if (element) { element.setAttribute("stdDeviation", radius); }
    });
  };

  var applyBlur = function($spoiler, option) {
    blurLazyYT($spoiler);
    blurText($spoiler, option.text);
    blurLink($spoiler, option.link);
    blurImage($spoiler, option.image);
  };

  var applySpoilers = function($spoiler, options) {
    var maxBlur = options.max,
        partialBlur = options.partial,
        noBlur = options.none;

    $spoiler.data("spoiler-state", "blurred");

    applyBlur($spoiler, maxBlur);

    $spoiler.on("mouseover", function() {
      $spoiler.css("cursor", "pointer");
      if ($spoiler.data("spoiler-state") === "blurred") { applyBlur($spoiler, partialBlur); }
    }).on("mouseout", function() {
      if ($spoiler.data("spoiler-state") === "blurred") { applyBlur($spoiler, maxBlur); }
    }).on("click", function(e) {
      if ($spoiler.data("spoiler-state") === "blurred") {
        $spoiler.data("spoiler-state", "revealed").css("cursor", "auto");
        applyBlur($spoiler, noBlur);
      } else {
        $spoiler.data("spoiler-state", "blurred").css("cursor", "pointer");
        applyBlur($spoiler, partialBlur);
      }
      e.preventDefault();
    });

  };

  $.fn.spoil = function(options) {
    var opts = $.extend(DEFAULTS, options || {});
    return this.each(function () {
      applySpoilers($(this), opts);
    });
  };

})(jQuery);
