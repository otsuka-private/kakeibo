import { chartInitialize } from '../charts/original_chart.js';

export class AppInitialize {
  constructor() {
    this.materializeInitialize();
    chartInitialize();
  }

  materializeInitialize() {
    $(document).ready(function() {
      $('.modal').modal();
      $('.datepicker').datepicker({
        'autoClose': true,
        'format': 'yyyy/mm/dd',
        'firstDay': 1,
        'i18n': {
          'months': ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          'monthsShort': ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
          'weekdaysAbbrev': ['日', '月', '火', '水', '木', '金', '土']
        }
      });
      $('select').formSelect();
      $('input.input--charactor-counter').characterCounter();
      $('.dropdown-trigger').dropdown({
        'coverTrigger': false,
      });
      $('.collapsible').collapsible();
      $('.tabs').tabs();
    });
  }
}
