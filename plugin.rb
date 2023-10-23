# frozen_string_literal: true

# name: discourse-spoiler-alert
# about: Uses the Spoiler Alert plugin to blur text when spoiling it.
# version: 1.1.0
# authors: Robin Ward, Regis Hanol
# url: https://github.com/discourse/discourse-spoiler-alert
# transpile_js: true

after_initialize do
  AdminDashboardData.add_problem_check do
    I18n.t(
      "The discourse-spoiler-alert plugin has been integrated into discourse core. Please remove the plugin from your app.yml and rebuild your container.",
    )
  end
end
