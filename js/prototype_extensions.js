NodeList.prototype.for = function(cb) {
    for (let i = 0; i < this.length; i++){
        cb(this[i], i);
    }
}

Array.prototype.for = function(cb) {
    for (let i = 0; i < this.length; i++){
        cb(this[i], i);
    }
}

HTMLElement.prototype.includeTemplate = async function(url = this.getAttribute('include-template') || '') {
    if (!url) return;
    const template = await (await fetch(url)).text();
    this.innerHTML = template;
    LANG_load();
}

HTMLElement.prototype.$ = function (sel) {
    return this.querySelector(sel);
}

HTMLElement.prototype.$$ = function (sel) {
    return this.querySelectorAll(sel);
}

HTMLDialogElement.prototype.openModal = function () {
    this.showModal();
    this.addEventListener('mousedown', closeHandler = () => {
        if (this.$('div').contains(event.target)) return;
        this.$('.notification')?.classList.remove('anim-notification')
        this.closeModal();
    });
    if (this.classList.contains('dlg-notification')) {
        this.showNotification();
    }
    initMenus();
}

HTMLDialogElement.prototype.closeModal = function () {
    this.close();
    this.removeEventListener('mousedown', closeHandler);
}

HTMLDialogElement.prototype.showNotification = function () {
    this.$('.notification').classList.add('anim-notification');
    this.$('.notification').addEventListener('animationcancel', abortHandler = () => {
        event.currentTarget.removeEventListener('animationend', completionHandler)
    }, { once: true });
    this.$('.notification').addEventListener('animationend', completionHandler = ()=>{
        event.currentTarget.removeEventListener('animationcancel', abortHandler)
        event.currentTarget.classList.remove('anim-notification');
        this.closeModal();
    }, { once: true })
    
}

HTMLElement.prototype.toggleDropDown = function () {
    if (!this.closest('.drp-wrapper')) return;
    this.closest('.drp-wrapper').toggleActive();
    document.addEventListener('click', closeHandler = () => {
        if (this.closest('.drp-wrapper').contains(event.target)) return;
        this.closest('.drp-wrapper').toggleActive();
        document.removeEventListener('click', closeHandler);
    })
}

HTMLElement.prototype.toggleActive = function () {
    this.classList.toggle('active');
}

HTMLElement.prototype.updatePosition = function (x = 0, y = 0) {
    if (!this.style.getPropertyValue('--x')) return
    this.style.setProperty('--x', `${x}`);
    this.style.setProperty('--y', `${y}`);
}

HTMLElement.prototype.setTransitionSpeed = function (x = '', y = '') {
    const transitionSpeed = (x && y) ? `${ parseInt(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) / 2)}ms` : '';
    this.style.transitionDuration = transitionSpeed;
}

Math.roundTo = function (nbr, decimals) {
    return Math.round(nbr * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

HTMLElement.prototype.renderItems = function (items, templateFunction) {
    this.innerHTML = '';
    items.for(item => {
        this.innerHTML += templateFunction(item);
    })
}

$('div').renderItems(array, )