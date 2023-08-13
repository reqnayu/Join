const fullscreenTaskTemplate = ({boardId, category, color, title, description, priority, dueDate, assignedTo, subTasks}) => {
    return /*html*/`
        <div>
            <button onclick="this.closest('dialog').closeModal()" class="close-btn grid-center">
                <img class="close" src="/Join/assets/img/icons/close_blue.svg" alt="Close">
            </button>
            <div class="fullscreen-task-wrapper column gap-25">
                <div class="task-category txt-normal" style="--clr: ${color}">${category}</div>
                <h2>${title}</h2>
                <div>${description}</div>
                <div class="row gap-25">
                    <span class="fullscreen-task-label">Due date: </span>
                    <span>${dueDate}</span>
                </div>
                <div class="row gap-25">
                    <span class="fullscreen-task-label">Priority: </span>
                    <span class="priority row gap-10" style="--prio_icon: url(/Join/assets/img/icons/prio_${priority}.svg)">${priority.replace(/^\w/, letter => letter.toUpperCase())}</span>
                </div>
                <div class="fullscreen-task-assignedto column gap-8">
                    <span class="fullscreen-task-label">Assigned To: </span>
                    <div>${fullscreenTaskAssignedTo(assignedTo)}</div>
                </div>
                <div class="column gap-8">
                    <span class="fullscreen-task-label">Subtasks: </span>
                    <div class="column gap-5">${fullscreenTaskSubTasks(subTasks)}</div>
                </div>
                <div class="btn-container txt-small">
                    <button>Delete</button>
                    <!-- <div class="line"></div> -->
                    <button>Edit</button>
                </div>
            </div>
        </div>
    `
};

const fullscreenTaskAssignedTo = (assignedTo) => {
    let template = '';
    ALL_USERS
    .filter(({id}) => assignedTo.includes(id))
    .for(
        ({name, color}) => template += /*html*/`
            <div class="assigned-to-contact row gap-15">
                <div class="user-img-container grid-center" style="--user-clr: ${color}; --outline-thickness: 0px;">
                    <span>${name.slice(0, 2).toUpperCase()}</span>
                </div>
                <div class="row gap-8">
                    <span>${name}</span>${(name == USER.name) ? '<span data-lang="assigned-you-parentheses"></span>' : ''}
                </div>
            </div>
        `
    );
    return template;
};

const fullscreenTaskSubTasks = (subTasks) => {
    let template = '';
    subTasks.for(
        ({name, done}) => template += /*html*/`
            <div class="edit-task-subtask row gap-20">
                <div class="edit-task-subtask-checkbox" data-done="'${done}'"></div>
                <span class="txt-small">${name}</span>
            </div>
        `
    );
    return template;
};