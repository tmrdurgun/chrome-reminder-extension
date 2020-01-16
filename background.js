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

        const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];

        chrome.notifications.create(uint32.toString(16), opt, () => {});

        chrome.alarms.clear(alarm.name, async () => {});
    });
})