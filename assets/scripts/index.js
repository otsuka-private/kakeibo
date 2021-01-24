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

class App {
  constructor() {
    new AppInitialize();
    new FetchData();
    fontActivate();
    new InputCard();
    new DayReport();
    new WeekReport();
    new MonthReport();
    new YearReport();
  }
}

// firing app

new App();

// test below
