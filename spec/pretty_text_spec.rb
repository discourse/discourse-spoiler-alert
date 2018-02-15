require 'rails_helper'

describe PrettyText do

  def n(html)
    html.strip
  end

  it 'can spoil blocks' do
    md = PrettyText.cook("[spoiler]\nmy tests fail\n[/spoiler]")
    html = "<div class=\"spoiler\">\n<p>my tests fail</p>\n</div>"

    expect(md).to eq(html)
  end

  it 'can spoil inline' do
    md = PrettyText.cook('I like watching [spoiler]my tests fail[/spoiler]')
    html = '<p>I like watching <span class="spoiler">my tests fail</span></p>'

    expect(md).to eq(html)
  end
end
