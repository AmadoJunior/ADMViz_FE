import { DateTime } from "luxon"

export const demoCharts = [
  {
    "chartId": 0,
    "details": {
      "name": "Total Fatalities by Race/Ethnicity",
      "srcUrl": "https://data.sfgov.org/resource/kkr3-wq7h.json",
      "dataKey": "sum_new_deaths",
      "select": "sum(new_deaths) AS sum_new_deaths, characteristic_group",
      "where": "characteristic_type = 'Race/Ethnicity' AND new_deaths > 0",
      "group": "characteristic_group",
      "order": "",
      "limit": "",
      "labelKey": "characteristic_group",
      "chartType": "bar",
      "method": "GET",
      "dateColumnKey": "",
      "fromDate": DateTime.now().minus({months: 3}).toMillis(),
      "toDate": DateTime.now().toMillis()
    },
    "position": {
      "id": 0,
      "x": 10,
      "y": 10,
      "w": 550,
      "h": 560
    }
  },
  {
    "chartId": 0,
    "details": {
      "name": "Total Crash Fatalities",
      "srcUrl": "https://data.fortworthtexas.gov/resource/tyfc-ena2.json",
      "dataKey": "total",
      "select": "date_extract_m(crash_date) as m, COUNT(*) as total",
      "where": "death_cnt > 0",
      "group": "m",
      "order": "m",
      "limit": "",
      "labelKey": "m",
      "chartType": "line",
      "method": "GET",
      "dateColumnKey": "crash_date",
      "fromDate": DateTime.now().minus({months: 3}).toMillis(),
      "toDate": DateTime.now().toMillis()
    },
    "position": {
      "id": 0,
      "x": 10,
      "y": 10,
      "w": 550,
      "h": 560
    }
  },
]