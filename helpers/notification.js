import { generateId } from './functions.js';

export const notificationHelper = {
    create: (opt, cb) => {
        chrome.notifications.create(generateId(), opt, cb);
    },
    
} 