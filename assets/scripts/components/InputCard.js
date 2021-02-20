'use strict';

import {
  setToastDataFunctions
} from '../functions/setToastDataFunctions.js';

export class InputCard {
  constructor() {
    this.initializeInputCardContent();
    this.initializeSettingModal();
  }

  initializeInputCardContent() {
    this.setDefaultDate();
    this.initializeCategoryModal();
    this.initializeHowtopayModal();
    this.addEventListenerToCardAddBtn();
  }

  // initializing input card content below

  setDefaultDate() {
    const today = new Date();
    let date = today.getDate();
    let month = +today.getMonth() + 1;
    let year = today.getFullYear();

    const isDefaultDateYesterday = localStorage.getItem('default_date_yesterday');
    if (isDefaultDateYesterday == 'true') {
      today.setDate(today.getDate() - 1);
      year = today.getFullYear();
      month = today.getMonth() + 1;
      date = today.getDate();
    }

    const datepickerInput = document.getElementById('input-card__input-date');
    datepickerInput.value = `${year}/${month}/${date}`;
    const datepickerLabel = document.getElementById('input-card__input-date-label');
    datepickerLabel.classList.add('active');
  }

  initializeCategoryModal() {
    const userCategoryOptionsArray = localStorage.getItem('user_category_options').split(',');
    const inputCardInputCategory = document.getElementById('input-card__input-category');
    inputCardInputCategory.addEventListener('click', () => {
      sessionStorage.is_modal_for_modify = false;
    });
    const container = document.querySelector('#modal__input-card__radio-buttons-category .modal-content');
    for (let i = 0; i < userCategoryOptionsArray.length; i++) {
      const template = document.getElementById('modal__input-card__radio-buttons-category__template-radio');
      const clone = template.content.cloneNode(true);
      clone.querySelector('span').textContent = userCategoryOptionsArray[i];
      clone.querySelector('input').setAttribute('value', userCategoryOptionsArray[i]);
      clone.querySelector('input').addEventListener('click', (event) => {
        const isModalForModify = sessionStorage.getItem('is_modal_for_modify');
        if (isModalForModify == 'false') {
          const inputCardInputCategory = document.getElementById('input-card__input-category');
          inputCardInputCategory.value = event.target.value;
          inputCardInputCategory.parentElement.nextElementSibling.classList.add('active');
        } else if (isModalForModify == 'true') {
          const modifyModalInputCategory = document.getElementById('modal__report__day__modify-record__input-category');
          modifyModalInputCategory.value = event.target.value;
          modifyModalInputCategory.parentElement.nextElementSibling.classList.add('active');
        }
      });
      container.append(clone);
    }
  }

  initializeHowtopayModal() {
    const userHowtopayOptionsArray = localStorage.getItem('user_howtopay_options').split(',');
    const inputCardInputCategory = document.getElementById('input-card__input-howtopay');
    inputCardInputCategory.addEventListener('click', () => {
      sessionStorage.is_modal_for_modify = false;
    });
    const container = document.querySelector('#modal__input-card__radio-buttons-howtopay .modal-content');
    for (let i = 0; i < userHowtopayOptionsArray.length; i++) {
      const template = document.getElementById('modal__input-card__radio-buttons-howtopay__template-radio');
      const clone = template.content.cloneNode(true);
      clone.querySelector('span').textContent = userHowtopayOptionsArray[i];
      clone.querySelector('input').setAttribute('value', userHowtopayOptionsArray[i]);
      clone.querySelector('input').addEventListener('click', (event) => {
        const isModalForModify = sessionStorage.getItem('is_modal_for_modify');
        if (isModalForModify == 'false') {
          const inputCardInputCategory = document.getElementById('input-card__input-howtopay');
          inputCardInputCategory.value = event.target.value;
          inputCardInputCategory.parentElement.nextElementSibling.classList.add('active');
        } else if (isModalForModify == 'true') {
          const modifyModalInputHowtopay = document.getElementById('modal__report__day__modify-record__input-howtopay');
          modifyModalInputHowtopay.value = event.target.value;
          modifyModalInputHowtopay.parentElement.nextElementSibling.classList.add('active');
        }
      });
      container.append(clone);
    }
  }

  addEventListenerToCardAddBtn() {
    const addButton = document.getElementById('input-card__button-add');
    addButton.addEventListener('click', () => {
      let isSwitchChecked = false;
      const switchBtnInput = document.querySelector('.switch input');
      if (switchBtnInput.checked) {
        isSwitchChecked = true;
      }

      const dateValue = document.getElementById('input-card__input-date').value;
      const howMuchValue = document.getElementById('input-card__input--how-much').value;
      const thingsValue = document.getElementById('input-card__input-things').value.trim();
      const categoryValue = document.getElementById('input-card__input-category').value.trim();
      const howToPayValue = document.getElementById('input-card__input-howtopay').value.trim();

      const isInputContentValid = this.validateInputContent(howMuchValue, thingsValue, categoryValue, howToPayValue);
      if (!isInputContentValid) {
        return;
      }

      const todayRecordObject = {
        inOrOut: isSwitchChecked,
        date: dateValue,
        howMuch: howMuchValue,
        things: thingsValue,
        category: categoryValue,
        howToPay: howToPayValue,
      };

      const recordDataObject = JSON.parse(localStorage.getItem('record_data'));
      const yearNumber = dateValue.split('/')[0];
      const monthNumber = +dateValue.split('/')[1] - 1;
      const dateNumber = +dateValue.split('/')[2];
      if (!recordDataObject[yearNumber]) {
        recordDataObject[yearNumber] = {};
        for (let i = 0; i < 12; i++) {
          recordDataObject[yearNumber][i] = {};
          for (let j = 1; j < 32; j++) {
            recordDataObject[yearNumber][i][j] = {};
          }
        }
      }
      const dayRecordNumber = Object.keys(recordDataObject[yearNumber][monthNumber][dateNumber]).length;
      recordDataObject[yearNumber][monthNumber][dateNumber][`record_${dayRecordNumber}`] = todayRecordObject;
      const recordDataJSON = JSON.stringify(recordDataObject);
      localStorage.setItem('record_data', recordDataJSON);

      setToastDataFunctions('true', 'データを追加しました！', 'toast-success toast-pop');
    });
  }

  // initializing input card content above

  // initializing setting modal content below

  initializeSettingModal() {
    this.printUserCategoryOptions();
    this.printUserHowtopayOptions();
    this.checkDefaultDateCheckbox();
    this.addEventListenerToModalAddOptionsButton();
    this.addEventListenerToModalAddButton();
  }

  printUserCategoryOptions() {
    const userCategoryOptions = localStorage.getItem('user_category_options');
    const userCategoryOptionsArray = userCategoryOptions.split(',');

    for (let i = 0; i < userCategoryOptionsArray.length; i++) {
      const container = document.getElementById('modal__input-card__setting__form-category');
      const template = document.getElementById('modal__input-card__setting__template-checkbox-category');
      const clone = template.content.cloneNode(true);
      clone.querySelector('span').textContent = userCategoryOptionsArray[i];
      container.append(clone);
    }
  }

  printUserHowtopayOptions() {
    const userHowtopayOptions = localStorage.getItem('user_howtopay_options');
    const userHowtopayOptionsArray = userHowtopayOptions.split(',');

    for (let i = 0; i < userHowtopayOptionsArray.length; i++) {
      const container = document.getElementById('modal__input-card__setting__form-howtopay');
      const template = document.getElementById('modal__input-card__setting__template-checkbox-howtopay');
      const clone = template.content.cloneNode(true);
      clone.querySelector('span').textContent = userHowtopayOptionsArray[i];
      container.append(clone);
    }
  }

  checkDefaultDateCheckbox() {
    const defaultDateCheckbox = document.getElementById('modal__input-card__setting__checkbox-default-date-yesterday');
      const isDefaultDateYesterday = localStorage.getItem('default_date_yesterday');
      if (isDefaultDateYesterday == 'true') {
        defaultDateCheckbox.setAttribute('checked', 'checked');
      }
  }

  addEventListenerToModalAddOptionsButton() {
    const addCategoryButton = document.getElementById('modal__input-card__setting__button-add-category');
    const addHowtopayButton = document.getElementById('modal__input-card__setting__button-add-howtopay');

    addCategoryButton.addEventListener('click', () => {
      const template = document.getElementById('modal__input-card__setting__form-category__template-input');
      const clone = template.content.cloneNode(true);
      const container = document.getElementById('modal__input-card__setting__form-category');
      container.append(clone);
      const inputField = document.getElementById('modal__input-card__setting__form-category__template-input__input-field');
      const input = inputField.querySelector('input');

      addCategoryButton.textContent = '決定';
      addCategoryButton.classList.add('pulse');

      if (input.value.trim()) {
        const inputValue = document.getElementById('modal__input-card__setting__form-category__template-input__input-field-__input').value.trim();
        const container = document.querySelector('#modal__input-card__setting__form-category__template-input__input-field');
        const template = document.getElementById('modal__input-card__setting__template-checkbox-category');
        const clone = template.content.cloneNode(true);
        clone.querySelector('span').textContent = inputValue;
        container.before(clone);

        inputField.remove();
      }
    });

    addHowtopayButton.addEventListener('click', () => {
      const template = document.getElementById('input-card__setting-modal__template-input-howtopay');
      const clone = template.content.cloneNode(true);
      const container = document.getElementById('modal__input-card__setting__form-howtopay');
      container.append(clone);
      const inputField = document.getElementById('input-card__setting-modal__div-input-howtopay');
      const input = inputField.querySelector('input');

      addHowtopayButton.textContent = '決定';
      addHowtopayButton.classList.add('pulse');

      if (input.value.trim()) {
        const inputValue = document.getElementById('input-card__setting-modal__input-add-howtopay').value.trim();
        const container = document.getElementById('input-card__setting-modal__div-input-howtopay');
        const template = document.getElementById('modal__input-card__setting__template-checkbox-howtopay');
        const clone = template.content.cloneNode(true);
        clone.querySelector('span').textContent = inputValue;
        container.before(clone);

        inputField.remove();
      }
    });
  }

  addEventListenerToModalAddButton() {
    const addButton = document.getElementById('input-card__setting-modal__button-decide');
    addButton.addEventListener('click', () => {
      const checkboxCategoryOptions = document.getElementById('modal__input-card__setting__form-category').querySelectorAll('label input');
      const checkedCategoryOptionsArray = [];
      for (let i = 0; i < checkboxCategoryOptions.length; i++) {
        if (checkboxCategoryOptions[i].checked) {
          const checkedOptionsName = checkboxCategoryOptions[i].nextElementSibling.textContent;
          checkedCategoryOptionsArray.push(checkedOptionsName);
        }
      }

      const checkboxHowtopayOptions = document.getElementById('modal__input-card__setting__form-howtopay').querySelectorAll('label input');
      const checkedHowtopayOptionsArray = [];
      for (let i = 0; i < checkboxHowtopayOptions.length; i++) {
        if (checkboxHowtopayOptions[i].checked) {
          const checkedOptionsName = checkboxHowtopayOptions[i].nextElementSibling.textContent;
          checkedHowtopayOptionsArray.push(checkedOptionsName);
        }
      }

      const defaultDateCheckbox = document.getElementById('modal__input-card__setting__checkbox-default-date-yesterday');
      const isDefaultDateYesterday = localStorage.getItem('default_date_yesterday');
      if (isDefaultDateYesterday == 'true') {
        defaultDateCheckbox.setAttribute('checked', checked);
      } else {
        defaultDateCheckbox.setAttribute('checked', '');
      }

      if (defaultDateCheckbox.checked) {
        localStorage.setItem('default_date_yesterday', true);
      } else {
        localStorage.setItem('default_date_yesterday', false);
      }

      localStorage.setItem('user_category_options', checkedCategoryOptionsArray);
      localStorage.setItem('user_howtopay_options', checkedHowtopayOptionsArray);

      setToastDataFunctions(true, 'カテゴリーと支払い手段の選択肢が更新されました！', 'toast-success toast-pop');
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
