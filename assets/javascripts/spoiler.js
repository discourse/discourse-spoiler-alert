(function($) {

  var isIE = /*@cc_on!@*/false || document.documentMode,
      globalIdCounter = 0;

  var blurText = function($spoiler, radius) {
    var textShadow = "black 0 0 " + radius + "px";
    if (isIE) { textShadow = radius <= 0 ? "0 0 0 0 black" : "0 0 " + radius + "px .1px black"; }

    $spoiler.css("background-color", "transparent")
            .css("color", "rgba(0, 0, 0, 0)")
            .css("text-shadow", textShadow);
  };

  var blurImage = function($spoiler, radius) {
    // on the first pass, transform images into SVG
    $("img", $spoiler).each(function(index, image) {
      var transform = function() {
        var w = image.width,
            h = image.height,
            id = ++globalIdCounter;
        var svg = "<svg data-spoiler-id='" + id + "' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='" + w + "' height='" + h + "'>" +
                  "<defs><filter id='blur-" + id + "'><feGaussianBlur id='gaussian-" + id + "' stdDeviation='" + radius + "'></feGaussianBlur></filter></defs>" +
                  "<image xlink:href='" + image.src + "' filter='url(#blur-" + id + ")' width='" + w + "' height='" + h + "'></image>" +
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
      svg.getElementById("gaussian-" + id).setAttribute("stdDeviation", radius);
    });
  };

  var applySpoilers = function($spoiler, options, applyBlur) {
    var maxBlur = options.max,
        partialBlur = options.partial;

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
        applyBlur($spoiler, 0);
      } else {
        $spoiler.data("spoiler-state", "blurred").css("cursor", "pointer");
        applyBlur($spoiler, partialBlur);
      }
    });

  };

  $.fn.spoilText = function(options) {
    var defaults = { max: 10, partial: 5 },
        opts = $.extend(defaults, options || {});

    return this.each(function() {
      applySpoilers($(this), opts, blurText);
    });
  };

  $.fn.spoilImage = function(options) {
    var defaults = { max: 20, partial: 6 },
        opts = $.extend(defaults, options || {});

    return this.each(function() {
      applySpoilers($(this), opts, blurImage);
    });
  };

})(jQuery);
