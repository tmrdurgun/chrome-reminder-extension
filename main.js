import { notificationHelper } from './helpers/notification.js';
import { generateId } from './helpers/functions.js';

const initialize = async () => {
    await listReminders()
};

const sendNotification = async (item) => {
    const opt = {
        type: "basic",
        title: "Reminder successfully registered!",
        message: `${item.title} will be displayed on ${item.date} - ${item.time}`,
        iconUrl: "./notification-icon.png"
    };

    notificationHelper.create(opt, (res) => {
        console.log(res);
    });
}

const renderListItem = async (item) => {
    return `<li class="list-group-item">${item.title}</li>`;
}

const listReminders = async () => {

    chrome.storage.sync.get(['reminders'], async (result) => {
        const reminderList = document.getElementById('reminder-list');

        reminderList.innerHTML = '';

        if (result.reminders) {
            for (const reminder of result.reminders) {
                reminderList.innerHTML += await renderListItem(reminder);
            }
        }
    })
}

/* Register reminder into storage */
const registerNewReminder = async (newItem) => {
    chrome.storage.sync.get(['reminders'], (result) => {
        let reminders = result.reminders;

        if (!reminders) {
            reminders = [];
        }

        reminders.push(newItem);

        chrome.storage.sync.set({ reminders: reminders }, async () => {
            await sendNotification(newItem);
        });
    });
}

const removeAllReminders = async () => {
    chrome.storage.sync.clear();
}

const removeReminder = async (id) => {

}

const addReminder = async () => {
    const title = document.getElementById('title').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    const reminderItem = {
        id: generateId(),
        title: title,
        date: date,
        time: time
    };

    await registerNewReminder(reminderItem);
}

document.addEventListener('DOMContentLoaded', async () => {
    await initialize();

    const addReminderBtn = document.getElementById('add-reminder-btn');

    addReminderBtn.addEventListener('click', async () => {
        await addReminder();
    })
});