(function() {
  // Don't bother with this code if the new dialect system is present
  if (Discourse.dialect_deprecated) { return; }

  var CONTAINS_BLOCK_REGEX = /\n|<img|!\[[^\]]*\][(\[]/;

  function insertSpoiler(_, spoiler) {
    var element = CONTAINS_BLOCK_REGEX.test(spoiler) ? "div" : "span";
    return "<" + element + " class='spoiler'>" + spoiler + "</" + element + ">";
  }

  function replaceSpoilers(text) {
    text = text || "";
    while (text !== (text = text.replace(/\[spoiler\]((?:(?!\[spoiler\]|\[\/spoiler\])[\S\s])*)\[\/spoiler\]/ig, insertSpoiler)));
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
