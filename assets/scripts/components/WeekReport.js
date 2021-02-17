import * as chartFunction from '../charts/original_chart.js';

export class WeekReport {
  constructor() {
    this.calcWeekData();
    this.drawChart();
  }

  calcWeekData() {
    const recordDataObject = JSON.parse(localStorage.getItem('record_data'));
    const weekDataTemporaryObject = {};

    // this week
    const date = new Date();
    let day = new Date().getDay();
    if (day == 0) {
      day = 7;
    }
    const thisWeekDataTemporaryObject = {
      in: {
        category: {},
        howToPay: {},
      },
      out: {
        category: {},
        howToPay: {},
      },
    };

    thisWeekDataTemporaryObject[date.getDay()] = recordDataObject[date.getFullYear()][date.getMonth()][date.getDate()];
    for (let i = 1; i < day; i++) {
      date.setDate(date.getDate() - 1);
      thisWeekDataTemporaryObject[date.getDay()] = recordDataObject[date.getFullYear()][date.getMonth()][date.getDate()];
    }

    let sumIn = 0;
    let sumOut = 0;
    for (let i = 0; i <= day; i++) {
      let sumInDaily = 0;
      let sumOutDaily = 0;
      if (thisWeekDataTemporaryObject[i] == undefined) {
        continue;
      }
      const keys = Object.keys(thisWeekDataTemporaryObject[i]);
      if (keys.length == 0) {
        thisWeekDataTemporaryObject[i].in = 0;
        thisWeekDataTemporaryObject[i].out = 0;
        continue;
      }
      for (let j = 0; j < keys.length; j++) {
        const sumUpEach = function(inOrOut, categoryOrHowtopay) {
          let oldAmount = thisWeekDataTemporaryObject[inOrOut][categoryOrHowtopay][thisWeekDataTemporaryObject[i][`record_${j}`][categoryOrHowtopay]];
          if (!oldAmount) {
            oldAmount = 0;
          }
          const newAmount = +oldAmount + +thisWeekDataTemporaryObject[i][`record_${j}`].howMuch;
          thisWeekDataTemporaryObject[inOrOut][categoryOrHowtopay][thisWeekDataTemporaryObject[i][`record_${j}`][categoryOrHowtopay]] = newAmount;
        };
        const hasKey = Object.keys(thisWeekDataTemporaryObject[i][`record_${j}`]);
        if (hasKey.length == 0) {
          continue;
        }
        if (thisWeekDataTemporaryObject[i][`record_${j}`].inOrOut == true) {
          sumIn = sumIn + +thisWeekDataTemporaryObject[i][`record_${j}`].howMuch;
          sumInDaily = sumInDaily + +thisWeekDataTemporaryObject[i][`record_${j}`].howMuch;
          sumUpEach('in', 'category');
          sumUpEach('in', 'howToPay');
        } else {
          sumOut = sumOut + +thisWeekDataTemporaryObject[i][`record_${j}`].howMuch;
          sumOutDaily = sumOutDaily + +thisWeekDataTemporaryObject[i][`record_${j}`].howMuch;
          sumUpEach('out', 'category');
          sumUpEach('out', 'howToPay');
        }
      }
      thisWeekDataTemporaryObject[i].in = sumInDaily;
      thisWeekDataTemporaryObject[i].out = sumOutDaily;
    }
    document.getElementById('report__week__this-week__card-general__span-out').textContent = sumOut;
    document.getElementById('report__week__this-week__card-general__span-in').textContent = sumIn;
    weekDataTemporaryObject.thisWeek = thisWeekDataTemporaryObject;

    // last week
    const dateLastWeek = new Date();
    dateLastWeek.setDate(dateLastWeek.getDate() - +day);
    const lastWeekDataTemporaryObject = {
      in: {
        category: {},
        howToPay: {}
      },
      out: {
        category: {},
        howToPay: {}
      }
    };
    lastWeekDataTemporaryObject[dateLastWeek.getDay()] = recordDataObject[dateLastWeek.getFullYear()][dateLastWeek.getMonth()][dateLastWeek.getDate()];
    for (let i = 1; i < 7; i++) {
      dateLastWeek.setDate(dateLastWeek.getDate() - 1);
      lastWeekDataTemporaryObject[dateLastWeek.getDay()] = recordDataObject[dateLastWeek.getFullYear()][dateLastWeek.getMonth()][dateLastWeek.getDate()];
    }

    sumIn = 0;
    sumOut = 0;
    for (let i = 0; i < 7; i++) {
      let sumInDaily = 0;
      let sumOutDaily = 0;
      const keys = Object.keys(lastWeekDataTemporaryObject[i]);
      if (keys.length == 0) {
        lastWeekDataTemporaryObject[i].in = 0;
        lastWeekDataTemporaryObject[i].out = 0;
        continue;
      }
      for (let j = 0; j < keys.length; j++) {
        const sumUpEach = function(inOrOut, categoryOrHowtopay) {
          let oldAmount = lastWeekDataTemporaryObject[inOrOut][categoryOrHowtopay][lastWeekDataTemporaryObject[i][`record_${j}`][categoryOrHowtopay]];
          if (!oldAmount) {
            oldAmount = 0;
          }
          const newAmount = +oldAmount + +lastWeekDataTemporaryObject[i][`record_${j}`].howMuch;
          lastWeekDataTemporaryObject[inOrOut][categoryOrHowtopay][lastWeekDataTemporaryObject[i][`record_${j}`][categoryOrHowtopay]] = newAmount;
        };
        const keys = Object.keys(lastWeekDataTemporaryObject[i][`record_${j}`]);
        if (keys.length == 0) {
          continue;
        }
        if (lastWeekDataTemporaryObject[i][`record_${j}`].inOrOut == true) {
          sumIn = sumIn + +lastWeekDataTemporaryObject[i][`record_${j}`].howMuch;
          sumInDaily = sumInDaily + +lastWeekDataTemporaryObject[i][`record_${j}`].howMuch;
          sumUpEach('in', 'category');
          sumUpEach('in', 'howToPay');
        } else {
          sumOut = sumOut + +lastWeekDataTemporaryObject[i][`record_${j}`].howMuch;
          sumOutDaily = sumOutDaily + +lastWeekDataTemporaryObject[i][`record_${j}`].howMuch;
          sumUpEach('out', 'category');
          sumUpEach('out', 'howToPay');
        }
      }
      lastWeekDataTemporaryObject[i].in = sumInDaily;
      lastWeekDataTemporaryObject[i].out = sumOutDaily;
    }
    document.getElementById('report__week__last-week__card-general__span-out').textContent = sumOut;
    document.getElementById('report__week__last-week__card-general__span-in').textContent = sumIn;
    weekDataTemporaryObject.lastWeek = lastWeekDataTemporaryObject;
    this.weekDataTemporaryObject = weekDataTemporaryObject;
  }

  drawChart() {
    let day = new Date().getDay();
    if (day == 0) {
      day = 7;
    }
    const weekDataTemporaryObject = this.weekDataTemporaryObject;
    const drawDoughnut = function(inOrOut, categoryOrHowtopay, whichWeek) {
      let categoryOrHowtopayHTMLId = categoryOrHowtopay;
      if (categoryOrHowtopay == 'howToPay') {
        categoryOrHowtopayHTMLId = 'howtopay';
      }
      const labelArray = Object.keys(weekDataTemporaryObject[`${whichWeek}Week`][inOrOut][categoryOrHowtopay]);
      const dataArray = Object.values(weekDataTemporaryObject[`${whichWeek}Week`][inOrOut][categoryOrHowtopay]);
      chartFunction.drawChartDoughnut(`report__week__${whichWeek}-week__card-${categoryOrHowtopayHTMLId}-${inOrOut}`, dataArray,labelArray);
    }

    // this week
    const thisWeekOutValues = [];
    const thisWeekInValues = [];
    for (let i = 1; i <= day; i++) {
      thisWeekOutValues.push(weekDataTemporaryObject.thisWeek[i].out);
      thisWeekInValues.push(weekDataTemporaryObject.thisWeek[i].in);
      if (i == 6) {
        const todayDate = new Date().getDay;
        if (todayDate == 0) {
          thisWeekOutValues.push(weekDataTemporaryObject.thisWeek[0].out);
          thisWeekInValues.push(weekDataTemporaryObject.thisWeek[0].in);
          break;
        }
      }
    }
    chartFunction.drawChartBar('report__week__this-week__card-bar-out', thisWeekOutValues, 'out', 'week');
    chartFunction.drawChartBar('report__week__this-week__card-bar-in', thisWeekInValues, 'in', 'week');

    drawDoughnut('out', 'category', 'this');
    drawDoughnut('out', 'howToPay', 'this');
    drawDoughnut('in', 'category', 'this');
    drawDoughnut('in', 'howToPay', 'this');

    // last week
    const lastWeekKeys = Object.keys(weekDataTemporaryObject.lastWeek);
    const lastWeekOutValues = [];
    const lastWeekInValues = [];
    for (let i = 0; i < 7; i++) {
      if (i == 0) {
        continue;
      }
      if (isNaN(lastWeekKeys[i])) {
        continue;
      }
      lastWeekOutValues.push(weekDataTemporaryObject.lastWeek[i].out);
      lastWeekInValues.push(weekDataTemporaryObject.lastWeek[i].in);
      if (i == 6) {
        lastWeekOutValues.push(weekDataTemporaryObject.lastWeek[0].out);
        lastWeekInValues.push(weekDataTemporaryObject.lastWeek[0].in);
      }
    }
    chartFunction.drawChartBar('report__week__last-week__card-bar-out', lastWeekOutValues, 'out', 'week');
    chartFunction.drawChartBar('report__week__last-week__card-bar-in', lastWeekInValues, 'in', 'week');

    drawDoughnut('out', 'category', 'last');
    drawDoughnut('out', 'howToPay', 'last');
    drawDoughnut('in', 'category', 'last');
    drawDoughnut('in', 'howToPay', 'last');
  }

}
