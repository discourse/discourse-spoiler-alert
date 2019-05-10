# name: discourse-spoiler-alert
# about: Uses the Spoiler Alert plugin to blur text when spoiling it.
# version: 0.4
# authors: Robin Ward, Regis Hanol
# url: https://github.com/discourse/discourse-spoiler-alert

enabled_site_setting :spoiler_enabled

register_asset "javascripts/spoiler.js"
register_asset "stylesheets/discourse_spoiler_alert.css"

after_initialize do

  on(:reduce_cooked) do |fragment, post|
    fragment.css(".spoiler").each do |el|
      link = fragment.document.create_element("a")
      link["href"] = post.url
      link.content = I18n.t("spoiler_alert.excerpt_spoiler")
      el.inner_html = link.to_html
    end
  end

  on(:pre_notification_alert) do |user, payload|
    payload[:excerpt] = payload[:excerpt].gsub(/\<span class=\"spoiler\"\>.*\<\/span\>/, "[#{I18n.t 'spoiler_alert.excerpt_spoiler'}]")
  end
end
