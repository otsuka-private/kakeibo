'use strict';

import {
  AppInitialize
} from './general_initialization/AppInitialize.js';
import {
  FetchData
} from './database/FetchData.js';
import {
  InputCard
} from './components/InputCard.js';
import {
  DayReport
} from './components/DayReport.js';
import {
  WeekReport
} from './components/WeekReport.js'
import {
  MonthReport
} from './components/MonthReport.js'
import {
  YearReport
} from './components/YearReport.js'
import {
  fontActivate
} from './functions/fontActivate.js';
import {
  drawEasyPieCharts
} from './charts/original_easypiechart.js';

class App {
  constructor() {
    new AppInitialize();
    new FetchData();
    fontActivate();
    new InputCard();
    new DayReport();
    new MonthReport();
    new YearReport();
    new WeekReport();
    // drawEasyPieCharts();
  }
}

// firing app

new App();

// test below
