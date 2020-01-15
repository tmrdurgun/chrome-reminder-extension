// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

import { notificationHelper } from './helpers/notification.js';

const addReminder = () => {
    const title = document.getElementById('title').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    console.log(title, date, time);

    const opt = {
        type: "basic",
        title: "Reminder successfully registered!",
        message: `${title} will be displayed on ${date} - ${time}`,
        iconUrl: "./notification-icon.png"
    };

    notificationHelper.create(opt, (res) => {
        console.log(res);
    });
    
}

document.addEventListener('DOMContentLoaded', () => {
    const addReminderBtn = document.getElementById('add-reminder-btn');

    addReminderBtn.addEventListener('click', () => {
        addReminder();
    })

});