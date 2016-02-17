import { withPluginApi, decorateCooked } from 'discourse/lib/plugin-api';

function spoil($elem) {
  $('.spoiler', $elem).removeClass('spoiler').addClass('spoiled').spoil();
}

export default {
  name: "apply-spoilers",
  initialize(container) {
    const siteSettings = container.lookup('site-settings:main');
    if (siteSettings.spoiler_enabled) {
      withPluginApi('0.1', api => api.decorateCooked(spoil), { noApi: () => decorateCooked(container, spoil) });
    }
  }
};
