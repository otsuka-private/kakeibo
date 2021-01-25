'use strict';

export function drawEasyPieCharts() {

  const monthLimitProgressChart = document.getElementById('report__day__today__chart-limit-progress');
  const colorPalette = {
    good: '#00bfa5',
    ok: '#ff8f00',
    over: '#ff1744',
  }

  let barColor;

  new EasyPieChart(monthLimitProgressChart, {
    barColor: colorPalette.ok,
    scaleColor: false,
    lineWidth: 20,
    size: 260,
  });
}
