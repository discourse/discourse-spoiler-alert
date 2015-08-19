/**
  Apply our spoilers when the app boots
**/
import { decorateCooked } from 'discourse/lib/plugin-api';

export default {
  name: "apply-spoilers",
  initialize: function(container) {
    decorateCooked(container, function($elem) {
      $('.spoiler', $elem).removeClass('spoiler')
                           .addClass('spoiled')
                           .spoil()
    });
  }
};
