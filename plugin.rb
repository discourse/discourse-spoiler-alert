# name: Spoiler Alert!
# about: Uses the Spoiler Alert plugin to blur text when spoiling it.
# version: 0.3
# authors: Robin Ward, Regis Hanol
# url: https://github.com/discourse/discourse-spoiler-alert

enabled_site_setting :spoiler_enabled

register_asset "javascripts/spoiler.js"
register_asset "javascripts/spoiler_dialect.js", :server_side

register_asset "stylesheets/discourse_spoiler_alert.css"

after_initialize do

  # black out spoilers in emails
  Email::Styles.register_plugin_style do |fragment|
    if SiteSetting.spoiler_enabled
      fragment.css(".spoiler").each do |spoiler|
        spoiler["style"] = "color:\#000;background-color:\#000;"
      end
    end
  end

end
