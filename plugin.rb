# frozen_string_literal: true

# name: discourse-spoiler-alert
# about: Uses the Spoiler Alert plugin to blur text when spoiling it.
# version: 1.1.0
# authors: Robin Ward, Regis Hanol
# url: https://github.com/discourse/discourse-spoiler-alert
# transpile_js: true

enabled_site_setting :spoiler_enabled

register_asset "stylesheets/discourse_spoiler_alert.scss"

after_initialize do
  on(:reduce_cooked) do |fragment, post|
    fragment.css(".spoiler").each do |el|
      link = fragment.document.create_element("a")
      link["href"] = post.url
      link.content = I18n.t("spoiler_alert.excerpt_spoiler")
      el.inner_html = link.to_html
    end
  end

  # Remove spoilers from topic excerpts
  on(:reduce_excerpt) do |doc, post|
    doc.css(".spoiler").remove
  end
end
