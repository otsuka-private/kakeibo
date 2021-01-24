'use strict';

import {
  setToastDataFunctions
} from '../functions/setToastDataFunctions.js';

export class DayReport {
  constructor() {
    this.setReport();
    this.modifyDayRecord();
    this.modifyRecord();
  }

  setReport() {
    const recordDataObject = JSON.parse(localStorage.getItem('record_data'));
    this.setReportToday(recordDataObject);
    this.setReportYesterday(recordDataObject);
  }

  setReportToday(recordDataObject) {
    const today = new Date();
    const todayRecordNumber = Object.keys(recordDataObject[today.getFullYear()][today.getMonth()][today.getDate()]).length;
    let todaySumOut = 0;
    let todaySumIn = 0;

    for (let i = 0; i < todayRecordNumber; i++) {
      const record = recordDataObject[today.getFullYear()][today.getMonth()][today.getDate()][`record_${i}`];
      if (!record || Object.keys(record).length == 0) {
        continue;
      }
      const container = document.getElementById('report__day__today__table');
      const template = document.getElementById('report__day__today__template-table-tbody');
      const clone = template.content.cloneNode(true);
      const tds = clone.querySelectorAll('td');
      const tr = clone.querySelector('tr');
      tr.setAttribute('id', `today_record_${i}`);
      tds[0].textContent = record.category;
      tds[1].textContent = record.things;
      tds[2].textContent = `¥${record.howMuch}`;
      tds[3].textContent = record.howToPay;
      tr.addEventListener('click', () => {
        sessionStorage.is_record_to_modify_todays = true;
      });

      if (record.inOrOut == true) {
        clone.querySelector('tr').classList.add('cyan', 'lighten-3');
        clone.querySelectorAll('td').forEach(element => {
          element.classList.add('border-radius-0');
        });
        todaySumIn = todaySumIn + +record.howMuch;

      } else {
        todaySumOut = todaySumOut + +record.howMuch;
      }
      container.append(clone);
    }

    const todayReportSpanOut = document.getElementById('day-report__span-out');
    const todayReportSpanIn = document.getElementById('day-report__span-in');
    todayReportSpanOut.textContent = todaySumOut;
    todayReportSpanIn.textContent = todaySumIn;
  }

  setReportYesterday(recordDataObject) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayRecordNumber = Object.keys(recordDataObject[yesterday.getFullYear()][yesterday.getMonth()][yesterday.getDate()]).length;
    let yesterdaySumOut = 0;
    let yesterdaySumIn = 0;

    for (let i = 0; i < yesterdayRecordNumber; i++) {
      const record = recordDataObject[yesterday.getFullYear()][yesterday.getMonth()][yesterday.getDate()][`record_${i}`];
      if (!record || Object.keys(record).length == 0) {
        continue;
      }
      const container = document.getElementById('report__day__yesterday__table');
      const template = document.getElementById('report__day__yesterday__template-table-tbody');
      const clone = template.content.cloneNode(true);
      const tds = clone.querySelectorAll('td');
      tds[0].textContent = record.category;
      tds[1].textContent = record.things;
      tds[2].textContent = `¥${record.howMuch}`;
      tds[3].textContent = record.howToPay;
      if (record.inOrOut == true) {
        clone.querySelector('tr').classList.add('cyan', 'lighten-3');
        clone.querySelectorAll('td').forEach(element => {
          element.classList.add('border-radius-0');
        });
        yesterdaySumIn = yesterdaySumIn + +record.howMuch;
      } else {
        yesterdaySumOut = yesterdaySumOut + +record.howMuch;
      }
      container.append(clone);
    }

    const yesterdayReportSpanOut = document.getElementById('report__day__yesterday__span-out');
    const yesterdayReportSpanIn = document.getElementById('report__day__yesterday__span-in');
    yesterdayReportSpanOut.textContent = yesterdaySumOut;
    yesterdayReportSpanIn.textContent = yesterdaySumIn;
  }

  modifyDayRecord() {
    const recordDataObject = JSON.parse(localStorage.getItem('record_data'));
    const today = new Date();
    const modifyModal = document.getElementById('modal__report__day__modify-record');
    const tbody = document.querySelectorAll('#report__day__today__table tbody');
    let currentlySelectedRecordId;
    tbody.forEach(element => {
      const tr = element.querySelector('tr');
      tr.addEventListener('click', (event) => {
        sessionStorage.is_modal_for_modify = true;
        const id = event.target.closest('tr').id.slice(13);
        const today = new Date();
        const targetRecord = recordDataObject[today.getFullYear()][today.getMonth()][today.getDate()][`record_${id}`];
        currentlySelectedRecordId = id;

        modifyModal.querySelector('#modal__report__day__modify-record__input-howmuch').value = targetRecord.howMuch;
        modifyModal.querySelector('#modal__report__day__modify-record__input-things').value = targetRecord.things;
        if (targetRecord.inOrOut == true) {
          modifyModal.querySelector('#modal__report__day__modify-record__switch').setAttribute('checked', 'checked');
        }
        modifyModal.querySelector('#modal__report__day__modify-record__input-category').value = targetRecord.category;
        modifyModal.querySelector('#modal__report__day__modify-record__input-howtopay').value = targetRecord.howToPay;

        const labels = modifyModal.querySelectorAll('label');
        labels.forEach(element => {
          element.classList.add('active');
        });
      });
    });

    const cancelButton = document.getElementById('modal__report__day__modify-record__button-cancel');
    cancelButton.addEventListener('click', () => {
      sessionStorage.is_modal_for_modify = false;
    });

    const modifyButton = document.getElementById('modal__report__day__modify-record__button-modify');
    modifyButton.addEventListener('click', () => {
      let isSwitchChecked = false;
      const switchBtnInput = modifyModal.querySelector('.switch input');
      if (switchBtnInput.checked) {
        isSwitchChecked = true;
      }

      const howMuchValue = document.getElementById('modal__report__day__modify-record__input-howmuch').value;
      const thingsValue = document.getElementById('modal__report__day__modify-record__input-things').value.trim();
      const categoryValue = document.getElementById('modal__report__day__modify-record__input-category').value.trim();
      const howToPayValue = document.getElementById('modal__report__day__modify-record__input-howtopay').value.trim();

      const isInputContentValid = this.validateInputContent(howMuchValue, thingsValue, categoryValue, howToPayValue);
      if (!isInputContentValid) {
        return;
      }

      if (sessionStorage.getItem('is_record_to_modify_todays') == 'true') {
        recordDataObject[today.getFullYear()][today.getMonth()][today.getDate()][`record_${currentlySelectedRecordId}`].inOrOut = isSwitchChecked;
        recordDataObject[today.getFullYear()][today.getMonth()][today.getDate()][`record_${currentlySelectedRecordId}`].howMuch = howMuchValue;
        recordDataObject[today.getFullYear()][today.getMonth()][today.getDate()][`record_${currentlySelectedRecordId}`].things = thingsValue;
        recordDataObject[today.getFullYear()][today.getMonth()][today.getDate()][`record_${currentlySelectedRecordId}`].category = categoryValue;
        recordDataObject[today.getFullYear()][today.getMonth()][today.getDate()][`record_${currentlySelectedRecordId}`].howToPay = howToPayValue;
      } else if (sessionStorage.getItem('is_record_to_modify_todays') == 'false') {
        const targetDate = sessionStorage.getItem('record_to_modify_date_info').split(',');
        const currentlySelectedRecordId = sessionStorage.getItem('currently_selected_record_id');
        recordDataObject[+targetDate[0]][+targetDate[1] - 1][+targetDate[2]][`record_${currentlySelectedRecordId}`].inOrOut = isSwitchChecked;
        recordDataObject[+targetDate[0]][+targetDate[1] - 1][+targetDate[2]][`record_${currentlySelectedRecordId}`].howMuch = howMuchValue;
        recordDataObject[+targetDate[0]][+targetDate[1] - 1][+targetDate[2]][`record_${currentlySelectedRecordId}`].things = thingsValue;
        recordDataObject[+targetDate[0]][+targetDate[1] - 1][+targetDate[2]][`record_${currentlySelectedRecordId}`].category = categoryValue;
        recordDataObject[+targetDate[0]][+targetDate[1] - 1][+targetDate[2]][`record_${currentlySelectedRecordId}`].howToPay = howToPayValue;
      }

      const recordDataJSON = JSON.stringify(recordDataObject);
      localStorage.record_data = recordDataJSON;

      setToastDataFunctions('true', '１件のデータを修正しました', 'toast-success toast-pop');
    });


    const deleteButton = document.getElementById('modal__report__day__modify-record__button-delete');
    deleteButton.addEventListener('click', () => {
      if (sessionStorage.getItem('is_record_to_modify_todays') == 'true') {
        recordDataObject[today.getFullYear()][today.getMonth()][today.getDate()][`record_${currentlySelectedRecordId}`] = {};
      } else if (sessionStorage.getItem('is_record_to_modify_todays') == 'false') {
        const targetDate = sessionStorage.getItem('record_to_modify_date_info').split(',');
        const currentlySelectedRecordId = sessionStorage.getItem('currently_selected_record_id');
        recordDataObject[+targetDate[0]][+targetDate[1] - 1][+targetDate[2]][`record_${currentlySelectedRecordId}`] = {};
      }
      const recordDataJSON = JSON.stringify(recordDataObject);
      localStorage.record_data = recordDataJSON;
      setToastDataFunctions('true', '１件のデータを削除しました', 'toast-success toast-pop');
    });
  }

  modifyRecord() {
    const recordDataObject = JSON.parse(localStorage.getItem('record_data'));
    const modal = document.getElementById('modal__modify-record');
    const datepicker = modal.querySelector('#modal__modify-record__datepicker__datepicker__input');
    const setDateButton = document.getElementById('modal__modify-record__button-set-date');
    setDateButton.addEventListener('click', () => {
      if (!datepicker.value.trim()) {
        M.toast({
          html: '日付が選択されていません',
          displayLength: 3000,
          classes: 'toast-problem'
        });
        return;
      }
      const selectedDateTitle = modal.querySelector('#selected-date');
      selectedDateTitle.textContent = datepicker.value;
      const dateInfoArray = datepicker.value.split('/');
      const selectedDateRecords = recordDataObject[dateInfoArray[0]][+dateInfoArray[1]-1][+dateInfoArray[2]];
      const keys = Object.keys(selectedDateRecords);
      for (let i = 0; i < keys.length; i++) {
        const record = selectedDateRecords[`record_${i}`];
        if (!record || Object.keys(record).length == 0) {
          continue;
        }
        const container = modal.querySelector('#modal__modify-record__table');
        const template = modal.querySelector('template');
        const clone = template.content.cloneNode(true);
        const tds = clone.querySelectorAll('td');
        const tr = clone.querySelector('tr');
        tr.setAttribute('id', `modal__modify-record__table__record_${i}`);
        tds[0].textContent = record.category;
        tds[1].textContent = record.things;
        tds[2].textContent = `¥${record.howMuch}`;
        tds[3].textContent = record.howToPay;
        if (record.inOrOut == true) {
          clone.querySelector('tr').classList.add('cyan', 'lighten-3');
          clone.querySelectorAll('td').forEach(element => {
            element.classList.add('border-radius-0');
          });
        }
        container.append(clone);
      }
      const trs = modal.querySelectorAll('#modal__modify-record__table tbody tr');
      trs.forEach(element => {
        element.addEventListener('click', event => {
          sessionStorage.is_modal_for_modify = true;
          sessionStorage.record_to_modify_date_info = dateInfoArray;
          sessionStorage.is_record_to_modify_todays = false;
          const currentlySelectedRecordId = event.target.closest('tr').id.slice(36);
          sessionStorage.currently_selected_record_id = currentlySelectedRecordId;
          const targetRecord = selectedDateRecords[`record_${currentlySelectedRecordId}`];
          const modifyModal = document.getElementById('modal__report__day__modify-record');
          modifyModal.querySelector('#modal__report__day__modify-record__input-howmuch').value = targetRecord.howMuch;
          modifyModal.querySelector('#modal__report__day__modify-record__input-things').value = targetRecord.things;
          if (targetRecord.inOrOut == true) {
            modifyModal.querySelector('#modal__report__day__modify-record__switch').setAttribute('checked', 'checked');
          }
          modifyModal.querySelector('#modal__report__day__modify-record__input-category').value = targetRecord.category;
          modifyModal.querySelector('#modal__report__day__modify-record__input-howtopay').value = targetRecord.howToPay;
          const labels = modifyModal.querySelectorAll('label');
          labels.forEach(element => {
            element.classList.add('active');
          });
        });
      });
    });

    const cancelButton = document.getElementById('modal__modify-record__button-cancel');
    cancelButton.addEventListener('click', () => {
      sessionStorage.removeItem('is_record_to_modify_todays');
    });
  }

  validateInputContent(howMuchValue, thingsValue, categoryValue, howToPayValue) {
    if (!howMuchValue) {
      M.toast({
        html: '金額が入力されていません',
        displayLength: 3000,
        classes: 'toast-problem'
      });
      return;
    } else if (howMuchValue == 0) {
      M.toast({
        html: '金額が０円になっています',
        displayLength: 3000,
        classes: 'toast-problem'
      });
      return;
    } else if (thingsValue.length > 15) {
      M.toast({
        html: '用途は１５字以内で書いてください',
        displayLength: 3000,
        classes: 'toast-problem'
      });
      return;
    } else if (!thingsValue) {
      M.toast({
        html: '用途が入力されていません',
        displayLength: 3000,
        classes: 'toast-problem'
      });
      return;
    } else if (!categoryValue) {
      M.toast({
        html: 'カテゴリーが選択されていません',
        displayLength: 3000,
        classes: 'toast-problem'
      });
      return;
    } else if (!howToPayValue) {
      M.toast({
        html: '支払い方法が選択されていません',
        displayLength: 3000,
        classes: 'toast-problem'
      });
      return;
    } else {
      return true;
    }
  }
}
