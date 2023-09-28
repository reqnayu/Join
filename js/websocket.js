const initWebsocket = () => {
    SOCKET = io("wss://join-websocket.onrender.com", {
        query: {
            uid: USER.id
        }
    });

    SOCKET.io.on('error', e => {
        SOCKET.close();
        setTimeout(initWebsocket, 1 * 60 * 1000);
    });
    
    SOCKET.io.on('reconnect', e => {
        log('reconnected!')
    })

    SOCKET.on('notification', async () => {
        console.log(`Your received a new Notification!`);
        notifySound.play();
        await getUser();
        checkNotifications();
    });

    SOCKET.on('account-in-use', () => {
        goTo('login', {reroute: true});
    })
}

const sendMessage = (recipients) => {
    const ids = (Array.isArray(recipients)) ? recipients : [recipients];
    // if (!CONTACTS[contactId]) return error(`user '${contactId}' not in contacts!`);
    if (!recipients.every(id => CONTACTS.hasOwnProperty(id))) return error(`user not in contacts!`);
    SOCKET.emit('notification', {to: recipients});
}