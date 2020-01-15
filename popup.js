// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

const addReminder = () => {
    const title = document.getElementById('title').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    console.log(title, date, time);
}

document.addEventListener('DOMContentLoaded', () => {
    const addReminderBtn = document.getElementById('add-reminder-btn');

    addReminderBtn.addEventListener('click', () => {
        addReminder();
    })

});