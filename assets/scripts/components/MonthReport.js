'use strict';

import * as chartFunctions from '../charts/original_chart.js';

export class MonthReport {
  constructor() {
    this.setEachMonthContent();
  }

  setEachMonthContent() {
    const recordDataObject = JSON.parse(localStorage.getItem('record_data'));
    const today = new Date();

    const container = document.getElementById('report__month');
    const template = container.querySelector('#report__month__template-wrapper');
    const tabs = document.querySelectorAll('#report__month ul li a');

    const monthDataForYearObject = {};
    let monthDataTemporaryObject = {};
    const yearKeys = Object.keys(recordDataObject);
    yearKeys.sort(function(a, b) {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });
    for (let h = 0; h < yearKeys.length; h++) {
      monthDataForYearObject[yearKeys[h]] = {};
      for (let i = 0; i < 12; i++) {
        monthDataTemporaryObject = {
          in: {
            category: {},
            howToPay: {}
          },
          out: {
            category: {},
            howToPay: {}
          }
        };
        if (i == today.getMonth()) {
          tabs[i].classList.add('active');
        } else {
          tabs[i].classList.remove('active');
        }
        const clone = template.content.cloneNode(true);
        clone.querySelector('div').setAttribute('id', `report__month__container-${i}`);
        const monthRecord = recordDataObject[yearKeys[h]][i];

        let sumIn = 0;
        let sumOut = 0;
        for (let j = 1; j < 32; j++) {
          const recordQuantity = Object.keys(monthRecord[j]).length;
          for (let k = 0; k < recordQuantity; k++) {
            const sumUpEach = function(inOrOut, categoryOrHowtopay) {
              let oldAmount = monthDataTemporaryObject[inOrOut][categoryOrHowtopay][monthRecord[j][`record_${k}`][categoryOrHowtopay]];
              if (!oldAmount) {
                oldAmount = 0;
              }
              const newAmount = +oldAmount + +monthRecord[j][`record_${k}`].howMuch;
              monthDataTemporaryObject[inOrOut][categoryOrHowtopay][monthRecord[j][`record_${k}`][categoryOrHowtopay]] = newAmount;
            };

            if (Object.keys(monthRecord[j][`record_${k}`]).length == 0) {
              continue;
            }
            if (monthRecord[j][`record_${k}`].inOrOut == true) {
              sumIn = sumIn + +monthRecord[j][`record_${k}`].howMuch;
              sumUpEach('in', 'category');
              sumUpEach('in', 'howToPay');
            } else {
              sumOut = sumOut + +monthRecord[j][`record_${k}`].howMuch;
              sumUpEach('out', 'category');
              sumUpEach('out', 'howToPay');
            }
          }
        }

        monthDataForYearObject[yearKeys[h]][i] = monthDataTemporaryObject;

        if (today.getFullYear() != yearKeys[h]) {
          continue;
        }

        clone.querySelector('#report__month__card-general #report__month__card-general__span-in').textContent = sumIn;
        clone.querySelector('#report__month__card-general #report__month__card-general__span-out').textContent = sumOut;

        clone.querySelector('#report__month__card-general').setAttribute('id', `report__month__card-general-${i}`);
        clone.querySelector('#report__month__card-out-category').setAttribute('id', `report__month__card-out-category-${i}`);
        clone.querySelector('#report__month__card-out-howtopay').setAttribute('id', `report__month__card-out-howtopay-${i}`);
        clone.querySelector('#report__month__card-table').setAttribute('id', `report__month__card-table-${i}`);
        clone.querySelector('#report__month__card-in-category').setAttribute('id', `report__month__card-in-category-${i}`);
        clone.querySelector('#report__month__card-in-howtopay').setAttribute('id', `report__month__card-in-howtopay-${i}`);

        let j = i;
        clone.querySelector(`#report__month__card-table-${i}`).querySelector('span').querySelector('span').textContent = ++j;
        container.append(clone);

        // chart-1
        const categoryOutValues = Object.values(monthDataTemporaryObject.out.category);
        const categoryOutKeys = Object.keys(monthDataTemporaryObject.out.category);
        chartFunctions.drawChartDoughnut(`report__month__card-out-category-${i}`, categoryOutValues, categoryOutKeys);

        // // chart-2
        const howtopayOutValues = Object.values(monthDataTemporaryObject.out.howToPay);
        const howtopayOutKeys = Object.keys(monthDataTemporaryObject.out.howToPay);
        chartFunctions.drawChartDoughnut(`report__month__card-out-howtopay-${i}`, howtopayOutValues, howtopayOutKeys);

        // table-out
        const containerTable = document.getElementById(`report__month__card-table-${i}`).querySelector('table');
        const templateTbody = containerTable.querySelector('template');
        for (let i = 0; i < categoryOutKeys.length; i++) {
          const cloneTbody = templateTbody.content.cloneNode(true);
          cloneTbody.querySelectorAll('td')[0].textContent = categoryOutKeys[i];
          cloneTbody.querySelectorAll('td')[1].textContent = `￥${categoryOutValues[i]}`;
          containerTable.append(cloneTbody);
        }

        // chart-3
        const categoryInValues = Object.values(monthDataTemporaryObject.in.category);
        const categoryInKeys = Object.keys(monthDataTemporaryObject.in.category);
        chartFunctions.drawChartDoughnut(`report__month__card-in-category-${i}`, categoryInValues, categoryInKeys);

        // table-in
        for (let i = 0; i < categoryInKeys.length; i++) {
          const cloneTbody = templateTbody.content.cloneNode(true);
          cloneTbody.querySelector('tr').classList.add('cyan', 'lighten-3');
          cloneTbody.querySelectorAll('td')[0].textContent = categoryInKeys[i];
          cloneTbody.querySelectorAll('td')[1].textContent = `￥${categoryInValues[i]}`;
          containerTable.append(cloneTbody);
        }

        // chart-4
        const howtopayInValues = Object.values(monthDataTemporaryObject.in.howToPay);
        const howtopayInKeys = Object.keys(monthDataTemporaryObject.in.howToPay);
        chartFunctions.drawChartDoughnut(`report__month__card-in-howtopay-${i}`, howtopayInValues, howtopayInKeys);

      }
    }
    sessionStorage.month_data_for_year = JSON.stringify(monthDataForYearObject);
  }
}
