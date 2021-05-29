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

export default function applySpoiler(element) {
  element.setAttribute("data-spoiler-state", "blurred");
  element.classList.add("spoiler-blurred");

  element.addEventListener("click", (event) => {
    if (element.getAttribute("data-spoiler-state") === "blurred") {
      element.setAttribute("data-spoiler-state", "revealed");
      element.classList.remove("spoiler-blurred");
      event.preventDefault();
    } else if (!isInteractive(event)) {
      element.setAttribute("data-spoiler-state", "blurred");
      element.classList.add("spoiler-blurred");
    }
  });
}
