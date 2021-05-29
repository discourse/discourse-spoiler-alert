function blurLazyYT(spoilerElement) {
  spoilerElement.querySelectorAll("div.lazyYT").forEach((element) => {
    let id = element.getAttribute("data-youtube-id");
    let p = document.createElement("p");
    p.textContent = `https://youtube.com/watch?v=${id}`;

    element.replaceWith(p);
  });
}

function blur(spoilerElement) {
  spoilerElement.classList.add("spoiler-blurred");
  spoilerElement
    .querySelectorAll("a")
    .forEach((element) => element.classList.add("no-track-link"));
}

export default function applySpoiler(element) {
  element.setAttribute("data-spoiler-state", "blurred");

  blurLazyYT(element);
  blur(element);

  element.addEventListener("click", (event) => {
    if (element.getAttribute("data-spoiler-state") === "blurred") {
      element.setAttribute("data-spoiler-state", "revealed");
      element.classList.remove("spoiler-blurred");
      event.preventDefault();
    } else {
      element.setAttribute("data-spoiler-state", "blurred");
      element.classList.add("spoiler-blurred");
    }
  });
}
