import { notificationHelper } from './helpers/notification.js';
import { generateId } from './helpers/functions.js';

const initialize = async () => {
    await listReminders()
};

const sendNotification = async (item, opt) => {

    notificationHelper.create(opt, (res) => {
        console.log(res);
    });
}

const renderListItem = async (item) => {
    return `<li class="list-group-item reminder-list-item">
        <div class="reminder-list-item-info">
            <div><strong>${item.title}</strong></div>
            <div>${item.date} ${item.time}</div>
        </div>

        <div class="actions">
            <i id="${item.id}" class="far fa-edit edit-item"></i>
            <i id="${item.id}" class="fas fa-trash remove-item"></i> 
        </div>
            
    </li>`;
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

const createAlarm = async (name, when) => {
    chrome.alarms.create(name, {
        when: when
    });
}

/* Register reminder into storage */
const registerNewReminder = async (newItem) => {
    chrome.storage.sync.get(['reminders'], async (result) => {
        let reminders = result.reminders;

        if (!reminders) {
            reminders = [];
        }

        reminders.push(newItem);

        console.log(newItem);
         

        const date = new Date(newItem.date + ' ' + newItem.time);
        const convertedDate = date.getTime();

        console.log(date, convertedDate);

        await createAlarm(newItem.id, convertedDate);

        const opt = {
            type: "basic",
            title: "Reminder successfully registered!",
            message: `${newItem.title} will be displayed on ${newItem.date} - ${newItem.time}`,
            iconUrl: "./notification-icon.png"
        };

        chrome.storage.sync.set({ reminders: reminders }, async () => {
            await sendNotification(newItem, opt);
        });
    });
}

const removeAllReminders = async () => {
    chrome.storage.sync.clear();
}

const editReminder = async (itemId) => {
    chrome.storage.sync.get(['reminders'], async (result) => {
        const reminders = result.reminders;

        const item = reminders.find(reminder => reminder.id === itemId);

        reminders.forEach(reminder => {
            if(reminder.id === itemId){
                item.title = document.getElementById('title').value;
                item.date = document.getElementById('date').value;
                item.time = document.getElementById('time').value;
            }
        });

        chrome.storage.sync.set({ reminders: reminders }, () => {});
        
        await resetForm();

        await refreshPopup();
    });
}

const refreshPopup = async () => {
    window.location.reload();
}

const updateFormFields = async (itemId) => {
    chrome.storage.sync.get(['reminders'], async (result) => {
        const reminders = result.reminders;

        const item = reminders.find(reminder => reminder.id === itemId);

        document.getElementById('title').value = item.title;
        document.getElementById('date').value = item.date;
        document.getElementById('time').value = item.time;

        const addReminderBtn = document.getElementById('add-reminder-btn');
        const editReminderBtn = document.getElementById('edit-reminder-btn');

        addReminderBtn.classList.add('d-none');
        editReminderBtn.classList.remove('d-none');
        editReminderBtn.dataset.reminderid = item.id;

    });
}

const resetForm = async () => {
    document.getElementById('title').value = '';
    document.getElementById('date').value = '';
    document.getElementById('time').value = '';

    const addReminderBtn = document.getElementById('add-reminder-btn');
    const editReminderBtn = document.getElementById('edit-reminder-btn');

    addReminderBtn.classList.remove('d-none');
    editReminderBtn.classList.add('d-none');
    editReminderBtn.dataset.reminderid = '';

}

const removeReminder = async (itemId) => {
    chrome.storage.sync.get(['reminders'], async (result) => {
        const reminders = result.reminders;

        const item = reminders.find(reminder => reminder.id === itemId);

        reminders.splice(reminders.indexOf(item), 1);

        chrome.storage.sync.set({ reminders: reminders }, () => {});

        await refreshPopup();
    });
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
    });

    const editReminderBtn = document.getElementById('edit-reminder-btn');

    editReminderBtn.addEventListener('click', async (e) => {
        await editReminder(e.target.dataset.reminderid);
    });

    setTimeout(() => {
        const editItemNodes = document.querySelectorAll('.edit-item');

        editItemNodes.forEach(item => {
            item.addEventListener('click', async (e) => {
                e.preventDefault();
                await updateFormFields(item.id);
            });
        });

        const removeItemNodes = document.querySelectorAll('.remove-item');

        removeItemNodes.forEach(item => {
            item.addEventListener('click', async (e) => {
                e.preventDefault();
                await removeReminder(item.id);
            });
        });

    }, 1000);

});

chrome.alarms.onAlarm.addListener((alarm) => {
    chrome.storage.sync.get(['reminders'], async (result) => {
        const reminders = result.reminders;

        const item = reminders.find(reminder => reminder.id === alarm.name);

        const opt = {
            type: "basic",
            title: item.title,
            message: '',
            iconUrl: "./alarm-icon.png"
        };

        await sendNotification(item, opt);

        chrome.alarms.clear(alarm.name, async () => {
            await removeReminder(item.id);
        })
    });
})