'use strict';

// ここから下、僕のカスタマイズ

export function chartInitialize() {
  Chart.defaults.global.elements.point.backgroundColor = 'transparent';
  Chart.defaults.global.elements.line.borderCapStyle = 'round';
}

let colorObject = JSON.parse(localStorage.getItem('color_palette'));
if (!colorObject) {
   colorObject = {
    red: '#ff5252',
    cyan: '#00b8d4',
    teal: '#00bfa5',
    yellow: '#ffff00',
    blueGrey: '#546e7a',
    pink: '#ff4081',
    blue: '#2979ff',
    green: '#00e676',
    amber: '#ffc400',
    brown: '#795548',
    deepOrange: '#ff3d00',
    indigo: '#3d5afe',
    lightGreen: '#76ff03',
    lime: '#eeff41',
    grey: '#616161',
    purple: '#e040fb',
    lightBlue: '#00b0ff',
    orange: '#ff9100',
    deepPurple: '#7c4dff',
  };
  const colorJSON = JSON.stringify(colorObject);
  localStorage.setItem('color_palette', colorJSON);
}
const colorArray = Object.values(colorObject);

let isDoubled = false;
function checkDoubleColorQuantity(dataArray) {
  if (dataArray.length > 19 && isDoubled == false) {
    for (let i = 0; i < 19; i++) {
      const colors = colorArray[i];
      colorArray.push(colors);
    }
    isDoubled = true;
  }
}

const yearLabels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const weekLabels = ['月', '火', '水', '木', '金', '土', '日'];

export function drawChartBar(cardId, dataArray, inOrOut, labelType) {
  const year_doughnut = document.getElementById(cardId).querySelector('canvas');
  let backgroundColor;
  let label;
  let labels = null;
  if (inOrOut == 'in') {
    backgroundColor = '#4dd0e1';
    label = '収入';
  } else {
    backgroundColor = '#ffd54f';
    label = '支出';
  }
  if (labelType == 'year') {
    labels = yearLabels;
  } else if (labelType == 'week') {
    labels = weekLabels
  }
  new Chart(year_doughnut, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label,
        data: dataArray,
        backgroundColor,
        hoverBackgroundColor: '#ff5252',
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}

export function drawChartDoughnut(cardId, dataArray, labelArray) {
  checkDoubleColorQuantity(dataArray);
  const target = document.getElementById(cardId).querySelector('canvas');
  new Chart(target, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: dataArray,
        backgroundColor: colorArray,
      }],

      labels: labelArray,
    },
    // options: options
  });
}

// ここから下、週間のチャート

// ここから下、週間支出のチャート

export function drawChartThisWeekDoughnutOutCategory() {
  const thisWeekObject = JSON.parse(localStorage.getItem('report_week'));
  if (!thisWeekObject) {
    return;
  }
  const keys = Object.keys(thisWeekObject.thisWeek.out.category);
  const keyArray = [];
  for (let i = 0; i < keys.length; i++) {
    keyArray.push(keys[i]);
  }
  const values = Object.values(thisWeekObject.thisWeek.out.category);
  const valueArray = [];
  for (let i = 0; i < values.length; i++) {
    valueArray.push(values[i]);
  }

  checkDoubleColorQuantity(keyArray);

  const weekDoughnutOut = document.getElementById('this-week-doughnut-out-category');
  new Chart(weekDoughnutOut, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: valueArray,
        backgroundColor: colorArray,
      }],
      labels: keyArray,
    },
    // options: options
  });
}

export function drawChartThisWeekDoughnutOutHowtopay() {
  const thisWeekObject = JSON.parse(localStorage.getItem('report_week'));
  if (!thisWeekObject) {
    return;
  }
  const keys = Object.keys(thisWeekObject.thisWeek.out.howtopay);
  const keyArray = [];
  for (let i = 0; i < keys.length; i++) {
    keyArray.push(keys[i]);
  }
  const values = Object.values(thisWeekObject.thisWeek.out.howtopay);
  const valueArray = [];
  for (let i = 0; i < values.length; i++) {
    valueArray.push(values[i]);
  }

  checkDoubleColorQuantity(keyArray);

  const weekDoughnutOut = document.getElementById('this-week-doughnut-out-howtopay');
  new Chart(weekDoughnutOut, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: valueArray,
        backgroundColor: colorArray,
      }],
      labels: keyArray,
    },
    // options: options
  });
}

// ここから下、週間収入のチャート

export function drawChartThisWeekDoughnutInCategory() {
  const thisWeekObject = JSON.parse(localStorage.getItem('report_week'));
  if (!thisWeekObject) {
    return;
  }
  const keys = Object.keys(thisWeekObject.thisWeek.in.category);
  const keyArray = [];
  for (let i = 0; i < keys.length; i++) {
    keyArray.push(keys[i]);
  }
  const values = Object.values(thisWeekObject.thisWeek.in.category);
  const valueArray = [];
  for (let i = 0; i < values.length; i++) {
    valueArray.push(values[i]);
  }

    checkDoubleColorQuantity(keyArray);

  const weekDoughnutOut = document.getElementById('this-week-doughnut-in-category');
  new Chart(weekDoughnutOut, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: valueArray,
        backgroundColor: colorArray,
      }],
      labels: keyArray,
    },
    // options: options
  });
}

export function drawChartThisWeekDoughnutInHowtopay() {
  const thisWeekObject = JSON.parse(localStorage.getItem('report_week'));
  if (!thisWeekObject) {
    return;
  }
  const keys = Object.keys(thisWeekObject.thisWeek.in.howtopay);
  const keyArray = [];
  for (let i = 0; i < keys.length; i++) {
    keyArray.push(keys[i]);
  }
  const values = Object.values(thisWeekObject.thisWeek.in.howtopay);
  const valueArray = [];
  for (let i = 0; i < values.length; i++) {
    valueArray.push(values[i]);
  }

    checkDoubleColorQuantity(keyArray);

  const weekDoughnutOut = document.getElementById('this-week-doughnut-in-howtopay');
  new Chart(weekDoughnutOut, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: valueArray,
        backgroundColor: colorArray,
      }],
      labels: keyArray,
    },
    // options: options
  });
}


export function drawChartLastWeekDoughnutOutCategory() {
  const lastWeekObject = JSON.parse(localStorage.getItem('report_week'));
  if (!lastWeekObject) {
    return;
  }
  const keys = Object.keys(lastWeekObject.lastWeek.out.category);
  const keyArray = [];
  for (let i = 0; i < keys.length; i++) {
    keyArray.push(keys[i]);
  }
  const values = Object.values(lastWeekObject.lastWeek.out.category);
  const valueArray = [];
  for (let i = 0; i < values.length; i++) {
    valueArray.push(values[i]);
  }

    checkDoubleColorQuantity(keyArray);

  const weekDoughnutOut = document.getElementById('last-week-doughnut-out-category');
  new Chart(weekDoughnutOut, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: valueArray,
        backgroundColor: colorArray,
      }],
      labels: keyArray,
    },
    // options: options
  });
}

export function drawChartLastWeekDoughnutOutHowtopay() {
  const lastWeekObject = JSON.parse(localStorage.getItem('report_week'));
  if (!lastWeekObject) {
    return;
  }
  const keys = Object.keys(lastWeekObject.lastWeek.out.howtopay);
  const keyArray = [];
  for (let i = 0; i < keys.length; i++) {
    keyArray.push(keys[i]);
  }
  const values = Object.values(lastWeekObject.lastWeek.out.howtopay);
  const valueArray = [];
  for (let i = 0; i < values.length; i++) {
    valueArray.push(values[i]);
  }

    checkDoubleColorQuantity(keyArray);

  const weekDoughnutOut = document.getElementById('last-week-doughnut-out-howtopay');
  new Chart(weekDoughnutOut, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: valueArray,
        backgroundColor: colorArray,
      }],
      labels: keyArray,
    },
    // options: options
  });
}

export function drawChartLastWeekDoughnutInCategory() {
  const lastWeekObject = JSON.parse(localStorage.getItem('report_week'));
  const keys = Object.keys(lastWeekObject.lastWeek.in.category);
  const keyArray = [];
  for (let i = 0; i < keys.length; i++) {
    keyArray.push(keys[i]);
  }
  const values = Object.values(lastWeekObject.lastWeek.in.category);
  const valueArray = [];
  for (let i = 0; i < values.length; i++) {
    valueArray.push(values[i]);
  }

    checkDoubleColorQuantity(keyArray);

  const weekDoughnutOut = document.getElementById('last-week-doughnut-in-category');
  new Chart(weekDoughnutOut, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: valueArray,
        backgroundColor: colorArray,
      }],
      labels: keyArray,
    },
    // options: options
  });
}

export function drawChartLastWeekDoughnutInHowtopay() {
  const lastWeekObject = JSON.parse(localStorage.getItem('report_week'));
  const keys = Object.keys(lastWeekObject.lastWeek.in.howtopay);
  const keyArray = [];
  for (let i = 0; i < keys.length; i++) {
    keyArray.push(keys[i]);
  }
  const values = Object.values(lastWeekObject.lastWeek.in.howtopay);
  const valueArray = [];
  for (let i = 0; i < values.length; i++) {
    valueArray.push(values[i]);
  }

    checkDoubleColorQuantity(keyArray);

  const weekDoughnutOut = document.getElementById('last-week-doughnut-in-howtopay');
  new Chart(weekDoughnutOut, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: valueArray,
        backgroundColor: colorArray,
      }],
      labels: keyArray,
    },
    // options: options
  });
}
