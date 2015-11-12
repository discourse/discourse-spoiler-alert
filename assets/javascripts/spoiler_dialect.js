(function() {

  function replaceSpoilers(text) {
    text = text || "";

    while (text != (text = text.replace(/\[spoiler\]((?:(?!\[spoiler\]|\[\/spoiler\])[\S\s])*)\[\/spoiler\]/ig, function (_, spoiler) {
      var element = spoiler.indexOf("\n") >= 0 ? "div" : "span";
      return "<" + element + " class='spoiler'>" + spoiler + "</" + element + ">";
    })));

    return text;
  }

  Discourse.Dialect.addPreProcessor(function(text) {
    if (Discourse.SiteSettings.spoiler_enabled) {
      text = replaceSpoilers(text);
    }
    return text;
  });

  Discourse.Markdown.whiteListTag('span', 'class', 'spoiler');
  Discourse.Markdown.whiteListTag('div', 'class', 'spoiler');
})();
