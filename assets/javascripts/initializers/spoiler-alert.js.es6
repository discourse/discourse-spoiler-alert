import { withPluginApi } from "discourse/lib/plugin-api";
import { Tag } from "discourse/lib/to-markdown";
import ComposerController from "discourse/controllers/composer";
import applySpoiler from "discourse/plugins/discourse-spoiler-alert/lib/apply-spoiler";

function spoil(element) {
  element.querySelectorAll(".spoiler").forEach((spoiler) => {
    spoiler.classList.remove("spoiler");
    spoiler.classList.add("spoiled");
    applySpoiler(spoiler);
  });
}

function initializeSpoiler(api) {
  api.decorateCookedElement(spoil, { id: "spoiler-alert" });

  api.addToolbarPopupMenuOptionsCallback(() => {
    return {
      action: "insertSpoiler",
      icon: "magic",
      label: "spoiler.title",
    };
  });

  ComposerController.reopen({
    actions: {
      insertSpoiler() {
        this.get("toolbarEvent").applySurround(
          "[spoiler]",
          "[/spoiler]",
          "spoiler_text",
          { multiline: false, useBlockMode: true }
        );
      },
    },
  });

  if (Tag) {
    Tag.prototype.decorate = function (text) {
      const attr = this.element.attributes;
      if (attr.class === "spoiled") {
        this.prefix = "[spoiler]";
        this.suffix = "[/spoiler]";
      }

      if (this.prefix || this.suffix) {
        text = [this.prefix, text, this.suffix].join("");
      }

      if (this.inline) {
        text = " " + text + " ";
      }

      return text;
    };

    Tag.block = function (name, prefix, suffix) {
      return class extends Tag {
        constructor() {
          super(name, prefix, suffix);
          this.gap = "\n\n";
        }

        decorate(text) {
          const attr = this.element.attributes;
          const parent = this.element.parent;

          if (this.name === "p" && parent && parent.name === "li") {
            // fix for google docs
            this.gap = "";
          }

          if (this.name === "div" && attr.class === "spoiled") {
            this.prefix = "[spoiler]";
            this.suffix = "[/spoiler]";
            text = text.trim();
          }

          return `${this.gap}${this.prefix}${text}${this.suffix}${this.gap}`;
        }
      };
    };
  }
}

export default {
  name: "apply-spoilers",

  initialize(container) {
    const siteSettings = container.lookup("site-settings:main");
    if (siteSettings.spoiler_enabled) {
      withPluginApi("0.5", initializeSpoiler);
    }
  },
};
