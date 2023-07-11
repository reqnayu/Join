const log = console.log;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const show = (selector) => $(selector).classList.remove("d-none");
const hide = (selector) => $(selector).classList.add("d-none");

const toggleActiveBtn = (buttons) => {
  buttons.forEach((button) =>

    button.classList.toggle("active", button == event.currentTarget)
  );
};

const addNavToggleBtns = () => {
  $$("nav").forEach((navbar) =>
    navbar
      .querySelectorAll("button")
      .forEach((button) =>
        button.addEventListener("click", () =>
          toggleActiveBtn(navbar.querySelectorAll("button"))
        )
      )
  );
};

const debounce = (cb, delay = 1000) => {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb(...args);
    }, delay);
  };
};

function throttle (cb, delay = 1000) {
  let shouldWait = false;

  return (...args) => {
      if (shouldWait) return;

      cb(...args);
      shouldWait = true;

      setTimeout(() => {
          shouldWait = false;
      }, delay);
  }
}

const includeTemplates = async () => {
  $$('[include-template]').forEach(
    async (templateContainer) => await includeTemplate(templateContainer)
  );
  return;
}

const includeTemplate = async (templateContainer) => {
  const url = templateContainer.getAttribute('include-template');
  const template = await getTemplate(url);
  templateContainer.innerHTML = template;
  return;
}

const getTemplate = async (url) => (await fetch(url)).text();

const goTo = (page) => {
  location.href = page;
}

const parse = (evalString) => Function(`'use strict'; return (${evalString}) ?? false`)();

const getFraction = (numerator, denominator, range = 1) => numerator / (denominator / range);