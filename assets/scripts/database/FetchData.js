'use strict';

export class FetchData {
  constructor() {
    this.setDefaultValue();
    this.showToast();
  }

  setDefaultValue() {
    const today = new Date();

    const userCategoryOptions = localStorage.getItem('user_category_options');
    if (!userCategoryOptions) {
      localStorage.setItem('user_category_options', ['以下、デフォルト', '自由に変更してください', '食費', '交通費', '光熱費']);
    }
    const userHowtopayOptions = localStorage.getItem('user_howtopay_options');
    if (!userHowtopayOptions) {
      localStorage.setItem('user_howtopay_options', ['以下、デフォルト', '自由に変更してください', '現金', 'クレジットカード', 'Paypay']);
    }

    const toast = localStorage.getItem('toast_to_show');
    if (!toast) {
      const welcomeToastObject = {
        bool: true,
        message: 'ようこそ、家計簿アプリへ！',
        className: 'toast-success toast-pop',
      };
      const welcomeToastJSON = JSON.stringify(welcomeToastObject);
      localStorage.setItem('toast_to_show', welcomeToastJSON);
    }

    const recordData = JSON.parse(localStorage.getItem('record_data'));
    if (!recordData) {
      const defaultRecordDataObject = {};
      defaultRecordDataObject[today.getFullYear()] = {};
      defaultRecordDataObject[today.getFullYear() - 1] = {};
      for (let i = 0; i < 12; i++) {
        defaultRecordDataObject[today.getFullYear()][i] = {};
        defaultRecordDataObject[today.getFullYear() - 1][i] = {};
        for (let j = 1; j < 32; j++) {
          defaultRecordDataObject[today.getFullYear()][i][j] = {};
          defaultRecordDataObject[today.getFullYear() - 1][i][j] = {};
        }
      }
      const defaultRecordDataJSON = JSON.stringify(defaultRecordDataObject);
      localStorage.setItem('record_data', defaultRecordDataJSON);
    }

    sessionStorage.setItem('is_modal_for_modify', false);
  }

  showToast() {
    const toastJSON = localStorage.getItem('toast_to_show');
    const toastObject = JSON.parse(toastJSON);
    if (toastObject.bool == 'true') {
      M.toast({
        html: toastObject.message,
        displayLength: 5000,
        classes: toastObject.className,
      });
      localStorage.setItem('toast_to_show', false);
    }
  }
}
