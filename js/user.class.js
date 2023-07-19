class User extends Account {
    constructor(userData){
        super(userData);
        this.userData.password = userData.password;
        this.userData.color = userData.color ?? "";
    }

    setPicture = (img) => { // TODO
        this.userData.img = img;
        this.#update();
    }

    setColor = (color) => {
        this.userData.color = color;
        this.#update();
    }

    setPhoneNumber = (phone) => {
        this.userData.phone = phone;
        this.#update();
    }

    changePassword = (newPassword) => { // TODO
        this.userData.password = newPassword;
    }

    initVerification = async () => {
        this.generateVerificationCode();
        // this.#sendMail("verification");
        await REMOTE_setData('verification', {[this.userData.id]: { verifyCode: this.verifyCode, userData: this.userData }});
        goTo(`./verify_account.html?uid=${this.userData.id}`);
    }

    initPasswordReset = () => {
        this.#sendMail("passwordReset");
    }

    #sendMail = async (type) => {
        const mailOptions = {
            recipient: this.userData,
            type,
            langData: await getEmailLanguage(type)
        }
        const mail = new Email(mailOptions);
        log(await mail.send());
    }

    verify = async () => {
        await REMOTE_removeData(`verification/${this.userData.id}`);
        await this.#update();
        goTo(`../init/create_account.html?uid=${this.userData.id}`);
    }

    setCredentials = () => {
        const cred = new PasswordCredential({
            id: this.userData.name,
            password: this.userData.password,
            name: this.userData.email
        });
        navigator.credentials.store(cred);
    }

    logIn = async () => {
        this.loggedIn = 'true';
        this.setCredentials();
        await this.#update();
        goTo(`../index/index.html?uid=${this.userData.id}`);
    }

    rememberMe = () => {
        const rememberLogin = $('#remember-me').checked || false;
        if (rememberLogin == false) return;
        if ("PasswordCredential" in window) this.setCredentials();
    }

    #update = async () => {
        return REMOTE_setData('users', {[this.userData.id]: this.userData});
    }

    generateVerificationCode = () => {
        const charSet = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
          code += charSet[(Math.floor(Math.random() * charSet.length))];
        }
        this.userData.verifyCode = { code, expires: Date.now() + 5 * 1000 * 60 };
    }

    codeExpired = () => this.verifyCode.expires < Date.now(); 
}