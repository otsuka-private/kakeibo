'use strict';

import * as chartFunctions from '../charts/original_chart.js';

export class YearReport {
  constructor() {
    this.setEachYearContainer();
    this.setYearTabs();
  }
  //
  setEachYearContainer() {
    const recordDataObject = JSON.parse(localStorage.getItem('record_data'));
    const container = document.getElementById('report__year');
    const template = container.querySelector('#report__year__template-container');
    const yearKeys = Object.keys(recordDataObject);
    yearKeys.sort(function(a, b) {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });

    for (let i = 0; i < yearKeys.length; i++) {
      const monthDataForYearObject = JSON.parse(sessionStorage.getItem('month_data_for_year'))[yearKeys[i]];
      const yearDataTemporaryObject = {
        in: {
          category: {},
          howToPay: {}
        },
        out: {
          category: {},
          howToPay: {}
        }
      };
      const yearNumber = yearKeys[i]
      const clone = template.content.cloneNode(true);
      clone.querySelector('div').setAttribute('id', `report__year__container-${yearNumber}`);
      clone.querySelector('#report__year__card-general').setAttribute('id', `report__year__card-general-${yearNumber}`);
      clone.querySelector('#report__year__card-bar-out').setAttribute('id', `report__year__card-bar-out-${yearNumber}`);
      clone.querySelector('#report__year__card-out-category').setAttribute('id', `report__year__card-out-category-${yearNumber}`);
      clone.querySelector('#report__year__card-out-howtopay').setAttribute('id', `report__year__card-out-howtopay-${yearNumber}`);
      clone.querySelector('#report__year__card-table').setAttribute('id', `report__year__card-table-${yearNumber}`);
      clone.querySelector('#report__year__card-bar-in').setAttribute('id', `report__year__card-bar-in-${yearNumber}`);
      clone.querySelector('#report__year__card-in-category').setAttribute('id', `report__year__card-in-category-${yearNumber}`);
      clone.querySelector('#report__year__card-in-howtopay').setAttribute('id', `report__year__card-in-howtopay-${yearNumber}`);
      clone.querySelector(`#report__year__card-table-${yearNumber}`).querySelector('span').querySelector('span').textContent = +yearNumber;

      container.append(clone);

      let sumOut = 0;
      let sumIn = 0;
      for (let j = 0; j < 12; j++) {
        const valuesOut = Object.values(monthDataForYearObject[j].out.category);
        valuesOut.forEach(element => {
          sumOut = sumOut + +element;
        });
        const valuesIn = Object.values(monthDataForYearObject[j].in.category);
        valuesIn.forEach(element => {
          sumIn = sumIn + +element;
        });

        let sumInMonthly = 0;
        let sumOutMonthly = 0;
        const sumUpEach = function(inOrOut, categoryOrHowtopay) {
          const keys = Object.keys(monthDataForYearObject[j][inOrOut][categoryOrHowtopay]);
          for (let k = 0; k < keys.length; k++) {
            let oldAmount = yearDataTemporaryObject[inOrOut][categoryOrHowtopay][keys[k]];
            if (!oldAmount) {
              oldAmount = 0;
            }
            if (inOrOut == 'in') {
              sumInMonthly = sumInMonthly + +monthDataForYearObject[j][inOrOut][categoryOrHowtopay][keys[k]];
            } else {
              sumOutMonthly = sumOutMonthly + +monthDataForYearObject[j][inOrOut][categoryOrHowtopay][keys[k]];
            }
            const newAmount = +oldAmount + +monthDataForYearObject[j][inOrOut][categoryOrHowtopay][keys[k]];
            yearDataTemporaryObject[inOrOut][categoryOrHowtopay][keys[k]] = newAmount;
          }
        }
        sumUpEach('in', 'category');
        yearDataTemporaryObject.in[j] = sumInMonthly;
        sumUpEach('in', 'howToPay');
        sumUpEach('out', 'category');
        yearDataTemporaryObject.out[j] = sumOutMonthly;
        sumUpEach('out', 'howToPay');
      }

      document.querySelector(`#report__year__card-general-${yearNumber} #report__year__card-general__span-out`).textContent = sumOut;
      document.querySelector(`#report__year__card-general-${yearNumber} #report__year__card-general__span-in`).textContent = sumIn;

      // bar-1
      const eachMonthOutValues = [];
      for (let j = 0; j < 12; j++) {
        eachMonthOutValues.push(yearDataTemporaryObject.out[j]);
      }
      chartFunctions.drawChartBar(`report__year__card-bar-out-${yearNumber}`, eachMonthOutValues, 'out', 'year');

      // chart-1
      const categoryOutValues = Object.values(yearDataTemporaryObject.out.category);
      const categoryOutKeys = Object.keys(yearDataTemporaryObject.out.category);
      chartFunctions.drawChartDoughnut(`report__year__card-out-category-${yearNumber}`, categoryOutValues, categoryOutKeys);

      // chart-2
      const howtopayOutValues = Object.values(yearDataTemporaryObject.out.howToPay);
      const howtopayOutKeys = Object.keys(yearDataTemporaryObject.out.howToPay);
      chartFunctions.drawChartDoughnut(`report__year__card-out-howtopay-${yearNumber}`, howtopayOutValues, howtopayOutKeys);

      // table-out
      const containerTable = document.getElementById(`report__year__card-table-${yearNumber}`).querySelector('table');
      const templateTbody = containerTable.querySelector('template');
      for (let i = 0; i < categoryOutKeys.length; i++) {
        const cloneTbody = templateTbody.content.cloneNode(true);
        cloneTbody.querySelectorAll('td')[0].textContent = categoryOutKeys[i];
        cloneTbody.querySelectorAll('td')[1].textContent = `￥${categoryOutValues[i]}`;
        containerTable.append(cloneTbody);
      }

      // bar-2
      const eachMonthInValues = [];
      for (let j = 0; j < 12; j++) {
        eachMonthInValues.push(yearDataTemporaryObject.in[j]);
      }
      chartFunctions.drawChartBar(`report__year__card-bar-in-${yearNumber}`, eachMonthInValues, 'in', 'year');

      // chart-3
      const categoryInValues = Object.values(yearDataTemporaryObject.in.category);
      const categoryInKeys = Object.keys(yearDataTemporaryObject.in.category);
      chartFunctions.drawChartDoughnut(`report__year__card-in-category-${yearNumber}`, categoryInValues, categoryInKeys);

      // table-in
      for (let i = 0; i < categoryInKeys.length; i++) {
        const cloneTbody = templateTbody.content.cloneNode(true);
        cloneTbody.querySelector('tr').classList.add('cyan', 'lighten-3');
        cloneTbody.querySelectorAll('td')[0].textContent = categoryInKeys[i];
        cloneTbody.querySelectorAll('td')[1].textContent = `￥${categoryInValues[i]}`;
        containerTable.append(cloneTbody);
      }

      // chart-4
      const howtopayInValues = Object.values(yearDataTemporaryObject.in.howToPay);
      const howtopayInKeys = Object.keys(yearDataTemporaryObject.in.howToPay);
      chartFunctions.drawChartDoughnut(`report__year__card-in-howtopay-${yearNumber}`, howtopayInValues, howtopayInKeys);
    }
  }

  setYearTabs() {
    const container = document.getElementById('report__year').querySelector('.tabs');
    const template = container.querySelector('template');
    const recordDataObject = JSON.parse(localStorage.getItem('record_data'));
    const yearKeys = Object.keys(recordDataObject);
    for (let i = 0; i < yearKeys.length; i++) {
      const clone = template.content.cloneNode(true);
      clone.querySelector('li a').setAttribute('href', `#report__year__container-${yearKeys[i]}`);
      clone.querySelector('li a').textContent = yearKeys[i];
      if (yearKeys[i] == new Date().getFullYear()) {
        clone.querySelector('li a').classList.add('active');
      } else {
        clone.querySelector('li a').classList.remove('active');
      }
      container.append(clone);
    }
  }


}
