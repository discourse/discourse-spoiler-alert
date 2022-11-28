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

  Object.entries(spoilerHiddenAttributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  element.classList.add("spoiler-blurred");
}

function _setSpoilerVisible(element) {
  const spoilerVisibleAttributes = {
    "data-spoiler-state": "revealed",
    "aria-expanded": true,
    "aria-label": I18n.t("spoiler.label.hide"),
  };

  Object.entries(spoilerVisibleAttributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  element.classList.remove("spoiler-blurred");
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
