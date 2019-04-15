require 'rails_helper'

RSpec.describe PostAlerter do
  it 'can hide spoilers from notifications' do
    user = Fabricate(:user)
    reply = Fabricate(:post, topic: Fabricate(:topic), reply_to_post_number: 1, raw: 'This here is a <span class="spoiler">secret code</span>')

    events = DiscourseEvent.track_events do
      PostAlerter.new.create_notification(user, Notification.types[:replied], reply)
    end

    payload = {
     notification_type: Notification.types[:replied],
     post_number: reply.post_number,
     topic_title: reply.topic.title,
     topic_id: reply.topic.id,
     excerpt: "This here is a [#{I18n.t 'spoiler_alert.excerpt_spoiler'}]",
     username: reply.username,
     post_url: reply.url
    }

    expect(events).to include(event_name: :pre_notification_alert, params: [user, payload])
  end
end
