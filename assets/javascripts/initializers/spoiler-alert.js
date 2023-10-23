import { withPluginApi } from "discourse/lib/plugin-api";
import {
  addBlockDecorateCallback,
  addTagDecorateCallback,
} from "discourse/lib/to-markdown";
import applySpoiler from "discourse/plugins/discourse-spoiler-alert/lib/apply-spoiler";

function spoil(element) {
  element.querySelectorAll(".spoiler").forEach((spoiler) => {
    spoiler.classList.remove("spoiler");
    spoiler.classList.add("spoiled");
    applySpoiler(spoiler);
  });
}

export function initializeSpoiler(api) {
  api.decorateCookedElement(spoil, { id: "spoiler-alert" });

  api.addComposerToolbarPopupMenuOption({
    icon: "magic",
    label: "spoiler.title",
    action: (toolbarEvent) => {
      toolbarEvent.applySurround("[spoiler]", "[/spoiler]", "spoiler_text", {
        multiline: false,
        useBlockMode: true,
      });
    },
  });

  addTagDecorateCallback(function () {
    if (this.element.attributes.class === "spoiled") {
      this.prefix = "[spoiler]";
      this.suffix = "[/spoiler]";
    }
  });

  addBlockDecorateCallback(function (text) {
    const { name, attributes } = this.element;

    if (name === "div" && attributes.class === "spoiled") {
      this.prefix = "[spoiler]";
      this.suffix = "[/spoiler]";
      return text.trim();
    }
  });
}

export default {
  name: "spoiler-alert",

  initialize(container) {
    const siteSettings = container.lookup("site-settings:main");

    if (siteSettings.spoiler_enabled) {
      withPluginApi("1.15.0", initializeSpoiler);
    }
  },
};
