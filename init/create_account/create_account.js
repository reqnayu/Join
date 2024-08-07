import { bindInlineFunctions, getContext } from "../../js/setup.js";
import { STORAGE } from "../../js/storage.js";
import { getInitialsOfName, HSLToHex } from "../../js/utilities.js";
import { validPhone } from "../init/init.js";
bindInlineFunctions(getContext(), ["/Join/js/utilities.js"]);

/**
 * Initializes the account creation process by rendering the color wheel and setting up the user information.
 * @async
 * @function initCreateAccount
 * @returns {Promise<void>}
 */
export async function initCreateAccount() {
	renderColorWheel();
	await STORAGE.init();
	const { name } = STORAGE.currentUser;
	$(".user-img-container h1").innerText = getInitialsOfName(name);
	$("#user-name").innerText = name;
}

/**
 * Completes the setup process by validating phone input, updating user details, and logging the user in.
 * @async
 * @function finishSetup
 * @param {Event} event - The event object from the form submission.
 * @returns {Promise<void>}
 */
export async function finishSetup() {
	event.preventDefault();
	const phoneInput = $("#phone input").value;
	const phoneValidity = phoneInput.length ? validPhone(phoneInput) : true;
	throwErrors({ identifier: "invalid-phone-number", bool: !phoneValidity });

	if (!phoneValidity) return;

	const user = STORAGE.currentUser;
	const userColor = HSLToHex($(".user-img-container").style.getPropertyValue("--user-clr"));

	if (userColor) user.color = userColor;
	if (phoneInput) user.phone = phoneInput;
	if (userColor) user.color = userColor;
	await user.update();
	user.logIn();
}
