import { registerOption } from 'pretty-text/pretty-text';

registerOption((siteSettings, opts) => {
  opts.features['spoiler-alert'] = !!siteSettings.spoiler_enabled;
});

const CONTAINS_BLOCK_REGEX = /\n|<img|!\[[^\]]*\][(\[]/;

function insertSpoiler(_, spoiler) {
  const element = CONTAINS_BLOCK_REGEX.test(spoiler) ? "div" : "span";
  return `<${element} class='spoiler'>${spoiler}</${element}>`;
}

function replaceSpoilers(text) {
  text = text || "";
  while (text !== (text = text.replace(/\[spoiler\]((?:(?!\[spoiler\]|\[\/spoiler\])[\S\s])*)\[\/spoiler\]/ig, insertSpoiler)));
  return text;
}

export function setup(helper) {
  helper.whiteList([ 'span.spoiler', 'div.spoiler' ]);
  helper.addPreProcessor(replaceSpoilers);
}
