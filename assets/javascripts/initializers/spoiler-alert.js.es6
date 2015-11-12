import { decorateCooked } from 'discourse/lib/plugin-api';

export default {
  name: "apply-spoilers",
  initialize(container) {
    if (Discourse.SiteSettings.spoiler_enabled) {
      decorateCooked(container, $elem => {
        $('.spoiler', $elem).removeClass('spoiler')
                            .addClass('spoiled')
                            .spoil();
      });
    }
  }
};
