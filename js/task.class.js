import { BaseClass } from "./base.class.js";
import { STORAGE } from "./storage.js";
import { cloneDeep } from "./utilities.js";

export class Task extends BaseClass {
	/** @type {string} */
	id;
	/** @type {"to-do"|"awaiting-feedback"|"in-progress"|"done"} */
	type;
	/** @type {string} */
	title;
	/** @type {string} */
	description;
	/** @type {string} */
	category;
	/** @type {Array<string>} */
	assignedTo;
	/** @type {string} */
	dueDate;
	/** @type {"urgent"|"medium"|"low"} */
	priority;
	/** @type {Array<{name: string, done: boolean}>} */
	subTasks;
	/** @type {string} */
	boardId;
	constructor({
		id = Date.now().toString(),
		type = "to-do",
		title,
		description,
		category = "default",
		assignedTo = [],
		dueDate,
		priority,
		subTasks = [],
		boardId
	}) {
		super();
		this.id = id;
		this.type = type;
		this.title = title;
		this.description = description;
		this.category = category;
		this.assignedTo = assignedTo;
		this.dueDate = dueDate;
		this.priority = priority;
		this.subTasks = subTasks;
		this.boardId = boardId;
	}

	changePriority(priority) {
		if (!(priority == "urgent" || priority == "medium" || priority == "low")) {
			console.error(`priority '${priority}' does not exist!`);
		}
		this.priority = priority;
		return this.update();
	}

	addSubtask(names) {
		if (typeof names === "string") names = [names];
		for (const name of names) {
			this.subTasks.push({
				name: name,
				done: false
			});
		}
		return this.update();
	}

	finishSubtask(name) {}

	async assignTo(userIds) {
		const collaborators = BOARDS[this.boardId].collaborators;
		if (typeof userIds === "string") userIds = [userIds];
		for (const userId of userIds) {
			if (!collaborators.includes(userId) && userId !== USER.id)
				return error("user not in collaborators!");
			if (this.assignedTo.includes(userId)) return error("user already assigned!");
			this.assignedTo.push(userId);
		}
		return this.update();
	}

	async update() {
		const url = `boards/${this.boardId}/tasks/${this.id}`;
		const newTask = await STORAGE.set(url, cloneDeep(this));
		Object.assign(this, newTask);
	}
}
