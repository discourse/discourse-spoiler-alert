# name: Spoiler Alert!
# about: Uses the Spoiler Alert plugin to blur text when spoiling it.
# version: 0.2
# authors: Robin Ward, Regis Hanol
# url: https://github.com/discourse/discourse-spoiler-alert

register_asset "javascripts/spoiler.js"
register_asset "stylesheets/discourse_spoiler_alert.css"

after_initialize do

  # black out spoilers in emails
  Email::Styles.register_plugin_style do |fragment|
    fragment.css(".spoiler").each do |spoiler|
      spoiler["style"] = "color:\#000;background-color:\#000;"
    end
  end

end
