const log = console.log;

window.$ = function (selector) {
  return this.document.querySelector(selector)
};
window.$$ = function (selector) {
  return this.document.querySelectorAll(selector)
};

const show = (selector) => $(selector).classList.remove("d-none");
const hide = (selector) => $(selector).classList.add("d-none");

const error = (error) => console.error(error);

const toggleActiveBtn = (buttons) => {
  buttons.forEach((button) =>

    button.classList.toggle("active", button == event.currentTarget)
  );
};

const addNavToggleBtns = () => {
  $$("nav").forEach((navbar) =>
    navbar
      .$$("button")
      .forEach((button) =>
        button.addEventListener("click", () =>
          toggleActiveBtn(navbar.$$("button"))
        )
      )
  );
};

const throwErrors = (...params) => {
  params.for(({identifier, bool}) => {
      const errorContainer = $(`#${identifier}`);
      const inputContainer = errorContainer.closest('.inp-wrapper')?.$('.inp-container');

      errorContainer.classList.toggle('active', bool);
      const allErrors = errorContainer.parentElement.$$('.error');
      inputContainer?.classList.toggle('active', bool);
  });
}

const notification = (message) => {
  return new Promise(resolve => {
    const el = document.createElement('dialog');
    el.type = "modal";
    el.classList.value = "dlg-notification";
    $('body').append(el);

    el.innerHTML = popUpNotificationTemplate(message);
    el.LANG_load();
    el.openModal();
    el.addEventListener("close", () => {
      el.remove();
      resolve();
    });
  });
}

const popUpNotificationTemplate = (message) => {
  return /*html*/`
  <div class="notification grid-center">
      <span data-lang="${message}"></span>
  </div>`
}

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
    async (templateContainer) => await templateContainer.includeTemplate()
  );
  return;
}

const getTemplate = async (url) => (await fetch(url)).text();

const parse = (evalString) => Function(`'use strict'; return (${evalString}) ?? false`)();

const searchParams = () => new URLSearchParams(document.location.search);

const submitUpload = async () => {
  const img = $('[type="file"]').files[0];
  if (!img) return;
  if (isInvalidImg(img)) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    const arrayBuffer = e.target.result;
    SOCKET.emit('uploadImg', arrayBuffer);
  }
  reader.readAsArrayBuffer(img)
  $('.loading').classList.add('active');
  
  const imgURL = await getImgUrl();

  renderUploadedImg(imgURL);
}

function isInvalidImg(file) {
  const maxSize = 1024 * 1024;
  const fileTooLarge = file.size > maxSize
  throwErrors({ identifier: 'img-too-large', bool: fileTooLarge });
  if (fileTooLarge) {
    return true;
  }
}

function getImgUrl() {
  return new Promise(resolve => {
    SOCKET.on('imgURL', async (imgURL) => {
          const uid = currentUserId();
          REMOTE_setData(`users/${uid}`, {img: imgURL});
          resolve(imgURL);
      });
  });
}

function renderUploadedImg(imgURL) {
  const imgContainer = $('.user-img');
  imgContainer.src = imgURL;
  imgContainer.onload = () => {
      $('.loading').classList.remove('active');
      $('[type="file"]').value = '';
      $('.account.user-img-container').dataset.img = 'true';
  }
  if (typeof USER !== "undefined") {
      USER.img = imgURL;
      renderUserData();
  }  
}

const removeUpload = async () => {
  if (event.target.tagName == "LABEL" || event.target.tagName == "INPUT") return;
  const container = event.currentTarget;
  if (!($('#color-wheel').classList.contains('d-none'))) return;
  const img = container.$('img');
  if (container.dataset.img === 'false') return;
  
  $('[type="file"]').value = '';
  container.dataset.img = 'false';
  img.src = '';
  SOCKET.emit('deleteImg');
  if (typeof USER !== "undefined") {
    USER.img = "";
    renderUserData();
  }
  REMOTE_setData(`users/${currentUserId()}`, {img: ""});
}

const renderColorWheel = () => {
  let clrBg = [];
  const factor = 12;
  for (let i = 0; i < 361; i+= 360 / factor) {
      clrBg.push(`hsl(${i}, 100%, 50%)`)
  }
  const lightnessBg = bezierGradient({
      colors: ['white', 'transparent', 'black'],
      resolution: 10
  });
  $('#color-wheel').style.backgroundImage = `radial-gradient(${lightnessBg}), conic-gradient(${clrBg.join(', ')})`;
}

const toggleColorPicker = () => {
  event.stopPropagation();
  $('#color-wheel').classList.toggle('d-none');
  $('label').classList.toggle('d-none');
  if (event.currentTarget.classList.contains('active') && $('.user-img-container').style.getPropertyValue('--user-clr') == false) {
      $('#color-cursor').classList.add('d-none');
      $('#accept-user-color').classList.remove('active');
  }
  $('#user-color').classList.toggle('active');
}

const pickColor = () => {
  const width = event.currentTarget.offsetWidth;
  const heigth = event.currentTarget.offsetHeight;
  const { offsetX, offsetY } = event;
  const x = offsetX - width / 2;
  const y = offsetY - heigth / 2;

  const hue = Math.round((Math.atan2(y, x) * (180 / Math.PI)) + 450) % 360;
  const lightness = 30 - Math.round(getFraction(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) * 60, width / 2));
  const userColor = `hsl(${hue}, 100%, ${50 + lightness}%)`

  moveColorCursor(offsetX, offsetY, userColor);
  addAcceptColor(userColor);
}

const getFraction = (numerator, denominator, range = 1) => numerator / (denominator / range);

const moveColorCursor = (offsetX, offsetY, userColor) => {
  const colorCursor = $('#color-cursor');
  colorCursor.classList.remove('d-none');
  colorCursor.style.setProperty('--x', offsetX);
  colorCursor.style.setProperty('--y', offsetY);
  colorCursor.style.backgroundColor = userColor;
}

const addAcceptColor = (userColor) => {
  $('#accept-user-color').classList.add('active');
  $('label').classList.remove('border');
  try {$('#accept-user-color').removeEventListener("click", colorPicker, { once: true })}catch(e){};
  $('#accept-user-color').addEventListener("click", colorPicker = () => {
      event.stopPropagation();
      $$('.user-img-container.account').for(button => button.style.setProperty('--user-clr', userColor));
      if (typeof USER !== "undefined") {
          USER.color = userColor;
          USER.update();
          renderUserData();
      };
      $('#user-color').click();
  }, { once: true });
}

const HSLToRGB = (h, s, l) => {
  s /= 100;
  l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(255 * f(0)), Math.round(255 * f(8)),Math.round( 255 * f(4))];
};

function HSLToHex(hsl) {
  if (!hsl) return;
  const h = Number(hsl.match(/(?<=\()\d+/g)[0]);
  const s = Number(hsl.match(/(?<=,[\s]{0,1})\d+/g)[0]);
  const l = Number(hsl.match(/(?<=,[\s]{0,1})\d+/g)[1]);
  const alpha = (hsl.includes('hsla')) ? Math.roundTo(Number(hsl.match(/[\d\.]+(?=\)$)/g)[0]), 2) : 1;
  const hDecimal = l / 100;
  const a = (s * Math.min(hDecimal, 1 - hDecimal)) / 100;
  const hexAlpha = Math.round(255 * alpha).toString(16).toUpperCase();
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = hDecimal - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);

    // Convert to Hex and prefix with "0" if required
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0")
      .toUpperCase();
  };
  return `#${f(0)}${f(8)}${f(4)}${(alpha < 1) ? hexAlpha : ''}`;
}

// const luma = (r, g, b) => Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);

function getCubicBezierPoint(t, p1, p2, p0 = {x: 0, y: 0}, p3 = {x: 1, y: 1}) {
  // Calculate the blending functions
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  const t2 = t * t;
  const t3 = t2 * t;

  // Calculate the x and y coordinates
  const x =
      mt3 * p0.x +
      3 * mt2 * t * p1.x +
      3 * mt * t2 * p2.x +
      t3 * p3.x;
  const y =
      mt3 * p0.y +
      3 * mt2 * t * p1.y +
      3 * mt * t2 * p2.y +
      t3 * p3.y;

  // Round the coordinates to 2 decimal places
  const roundedX = Math.roundTo(x, 2);
  const roundedY = Math.roundTo(y, 2);
  return { x: roundedX, y: roundedY };
}

const getRGBfromString = (colorString) => {
  if (!(typeof colorString == 'string')) return colorString;
  const a = document.createElement('div');
  a.style.color = colorString;
  $('body').append(a);
  const rgb = (getComputedStyle(a).color)
  a.remove();
  return rgb;
}

const getRGBA = (color) => {
  if (!color.includes("rgb")) {
    const rgb = getRGBfromString(color);
    if (rgb) color = rgb;
  };
  const r = Number(color.match(/(?<=\()\d+(?=,)/g)[0]);
  const g = Number(color.match(/(?<=,\s{0,1})\d+(?=,)/g)[0]);
  const b = (color.includes("rgba")) ? Number(color.match(/(?<=,\s{0,1})\d+(?=,)/g)[1]) : Number(color.match(/(?<=,\s{0,1})\d+(?=\))/g)[0]);
  const a = (color.includes("rgba")) ? Number(color.match(/(?<=,\s{0,1})[\d\.]+(?=\))/g)[0]) : 1;
  return {r, g, b, a}; 
}

const averageColor = (c1, c2, factor = 0.5) => {
  let { r: r1, b: b1, g: g1, a: a1} = getRGBA(c1); 
  let { r: r2, b: b2, g: g2, a: a2} = getRGBA(c2);

  if (a1 == 0) {
    r1 = r2;
    g1 = g2;
    b1 = b2;
  } else if (a2 == 0) {
    r2 = r1;
    g2 = g1;
    b2 = b1;
  }
  const r = Math.round(getRange(r1, r2, factor));
  const g = Math.round(getRange(g1, g2, factor));
  const b = Math.round(getRange(b1, b2, factor));
  const a = Math.roundTo(getRange(a1, a2, factor), 2);
  return `rgba(${r}, ${g}, ${b}, ${a})`
} 

const getRange = (min, max, factor) => min + (factor * max - factor * min)

const bezierGradient = ({colors: [...colors], resolution = 10}) => {
  let bg = [getRGBfromString(colors[0])];
  colors.slice(0, -1).for(
    (c1, i) => {
      const c2 = colors[i+1];
      for (let j = 1; j <= resolution; j++) {
        const t = j / resolution;
        let p1 = { x: 0.5, y: 0 };
        let p2 = { x: 0.5, y: 1 };
        if (i == 0) {
          p1 = { x: .25, y: .75 };
          p2 = { x:1, y: 1 };
        } else if (i == colors.length - 1) {
          p1 = { x: 0, y: 0 };
          p2 = { x:.75, y: .25 };
        }
        let { x, y } = getCubicBezierPoint(t, p1, p2);
        const colorStop = Math.round((x * 100) / (colors.length - 1) + (100 / (colors.length - 1)) * i);
        bg.push(`${averageColor(c1, c2, y)} ${colorStop}%`)
      }
    }
  )
  return bg.join(', ');
}

const isLetterOrNumber = (input) => input.length == 1 && /([a-z]|[A-Z]|[0-9])/.test(input);

const confirmation = (type, cb) => {
  const dataLang = (type.includes(',')) ? type.slice(0, type.indexOf(',')) : type;
  if (!LANG[`confirmation-${dataLang}`]) return error('message unknown!');
  const confirmationContainer = document.createElement('dialog');
  confirmationContainer.type = "modal";

  confirmationContainer.innerHTML = confirmationTemplate(type);
  confirmationContainer.LANG_load();

  confirmationContainer.$('.btn-primary').on('click', () => {
    cb();
    confirmationContainer.closeModal();
    confirmationContainer.remove()
  }, {once: true});

  $('body').append(confirmationContainer);
  confirmationContainer.openModal();
}

const confirmationTemplate = (type) => {
  return /*html*/`
  <div class="confirmation-dialog column gap-25">
    <span data-lang="confirmation-${type}"></span>
    <div class="btn-container gap-15">
      <div class="btn btn-secondary txt-small txt-700" data-lang="btn-cancel" onclick="this.closest('dialog').closeModal()"></div>
      <div class="btn btn-primary txt-small txt-700" data-lang="confirm-${type}"></div>
    </div>
  </div>
`;
}

const dateFormat = (dateString) => {
  if (typeof dateString !== "string") return false;
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) return false;

  const [day, month, year] = dateString.split('/');
  const date = new Date(year, month - 1, day);
  if (invalidDate(dateString, date)) return false
  const now = Date.now();

  if (date < now && date.getDate() !== date.getDate()) return false;
  return date;
}

const invalidDate = (input, output) => {
  const [, mI, yI] = input.split('/');
  const mO = output.getMonth() + 1;
  const yO = output.getFullYear();

  return !(Number(mI) == mO && Number(yI) == yO);
}

async function hashInputValue(inputValue) {
  const encoder = new TextEncoder();
  const data = encoder.encode(inputValue);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}