import I18n from "I18n";

const INTERACTIVE_SELECTOR = [
  "a",
  "area",
  "audio",
  "button",
  "details",
  "embed",
  "iframe",
  "img.animated",
  "input",
  "map",
  "object",
  "option",
  "portal",
  "select",
  "textarea",
  "track",
  "video",
  ".lightbox",
].join(", ");

function isInteractive(event) {
  return event.defaultPrevented || event.target.closest(INTERACTIVE_SELECTOR);
}

function _setSpoilerHidden(element) {
  const spoilerHiddenAttributes = {
    role: "button",
    tabindex: "0",
    "data-spoiler-state": "blurred",
    "aria-expanded": false,
    "aria-label": I18n.t("spoiler.label.show"),
  };

  // Set default attributes & classes on spoiler
  Object.entries(spoilerHiddenAttributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  element.classList.add("spoiler-blurred");

  // Set aria-hidden for all children of the spoiler
  Array.from(element.children).forEach((e) => {
    e.setAttribute("aria-hidden", true);
  });
}

function _setSpoilerVisible(element) {
  const spoilerVisibleAttributes = {
    "data-spoiler-state": "revealed",
    "aria-expanded": true,
    "aria-label": I18n.t("spoiler.label.hide"),
    "aria-live": "polite",
  };

  // Set attributes & classes for when spoiler is visible
  Object.entries(spoilerVisibleAttributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  element.classList.remove("spoiler-blurred");

  // Remove aria-hidden for all children of the spoiler when visible
  Array.from(element.children).forEach((e) => {
    e.removeAttribute("aria-hidden");
  });
}

function toggleSpoiler(event, element) {
  if (element.getAttribute("data-spoiler-state") === "blurred") {
    _setSpoilerVisible(element);
    event.preventDefault();
  } else if (!isInteractive(event)) {
    _setSpoilerHidden(element);
  }
}

export default function applySpoiler(element) {
  _setSpoilerHidden(element);

  element.addEventListener("click", (event) => {
    toggleSpoiler(event, element);
  });

  element.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      toggleSpoiler(event, element);
    }
  });
}
