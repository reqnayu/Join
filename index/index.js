let ALL_USERS;
let USER;
let BOARDS = {};
let SELECTED_BOARD;
let SELECTED_TASK;
let CONTACTS = {};
let SOCKET;
let notifySound = new Audio('/Join/assets/audio/mixkit-soap-bubble-sound-2925.wav');

const init = async () => {
    checkLogin();
    await getUser();
    await getAllUsers();
    initWebsocket();
    $(`#${currentDirectory().replace('_','-')}`)?.click();
    renderUserData();
    checkNotifications();
}

if (LOCAL_getData('rememberMe') == 'false') {
    window.on("beforeunload", () => LOCAL_setData('loggedIn', false))
}

const checkNotifications = async () => {
    await getUser();
    const notificationCount = Object.values(USER.notifications).length;
    const notificationCounters = $$('.notifications-counter');

    notificationCounters.for(counter => counter.classList.toggle('d-none', !notificationCount));
    document.title = `${(notificationCount)?`(${notificationCount}) ` :""}${LANG[`title-${currentDirectory()}`]}`; 
    if (!notificationCount) return
    notificationCounters.for(counter => counter.innerText = notificationCount);
}

const checkLogin = () => {
    if (LOCAL_getData('loggedIn') == 'false') {
        goTo('login', {search: '', reroute: true});
    }
}

window.addEventListener("popstate", (e) => {
    $(`#${currentDirectory()}`)?.click();
});

const initFunctions = {
    "summary": () => initSummary(),
    "contacts": () => initContacts(),
    "board": () => initBoard(),
    "add-task": () => initAddTask(),
    "help": () => initHelp(),
}

const loadContent = async () => {
    const {id = currentDirectory(), classList} = event?.currentTarget || {};
    if (classList?.contains('active')) return error('already active!');
    const url = (id == 'help')? `/Join/assets/languages/help-${currentLang()}.html` : (id == 'privacy')? `/Join/assets/languages/privacy-${currentLang()}.html` : `/Join/assets/templates/index/${id.replace('_','-')}_template.html`;
    
    const content = $('#content');
    content.classList.add("loading");
    await content.includeTemplate(url);
    content.$(':scope > div').classList.add("o-none");

    if (id in initFunctions) await initFunctions[id]();
    if (currentDirectory() !== id) goTo(id);
    LANG_load();
    content.initMenus();
    content.$(':scope > div').classList.remove("o-none");
    setTimeout(()=>{
        content.classList.remove('loading');
    }, 100);
};


// const openAccountPanel = async () => {
//     $('dialog#account-panel').openModal();
//     $('#account-panel-options button.active')?.click();
//     const modal = $('#account-panel');
//     modal.addEventListener('click', async () => {
//         console.log('Current Directory:', currentDirectory());
//         if (currentDirectory() === 'help') {
//             console.log('Entering help condition');
//             return initHelp(currentDirectory());
//         }
//         if (currentDirectory() === 'privacy') {
//             console.log('Entering privacy condition');
//             return await loadAccountPanelContent();
//         }
//         if (currentDirectory() === 'legal-notice') {
//             console.log('Entering legal-notice condition');
//             return await loadAccountPanelContent(currentDirectory());
//         }
//     });
// };


const openAccountPanel = async () => {
    $('dialog#account-panel').openModal();
    $('#account-panel-options button.active')?.click();
    $('#account-panel-options #notifications-btn')?.click();
};

const loadAccountPanelContent = async () => {
    const btn = event.currentTarget;
    const template = btn.id.slice(0, -4);
    const templatePath = `/Join/assets/templates/account/${template}.html`;
    await $('#account-panel-content').includeTemplate(templatePath);
    if (template == "notifications") loadNotifications();
    $('#account-panel-content').LANG_load();
};

const loadNotifications = async () => {
    if (Object.values(USER.notifications).length == 0) return error('no notifications');
    const container = $('#notifications-content');
    container.innerHTML = ''
    container.renderItems(Object.values(USER.notifications), notificationTemplate);
};