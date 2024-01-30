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
      "order": "sum_new_deaths",
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
      "name": "Total Fatalities by Age Group",
      "srcUrl": "https://data.sfgov.org/resource/kkr3-wq7h.json",
      "dataKey": "sum_new_deaths",
      "select": "sum(new_deaths) AS sum_new_deaths, characteristic_group",
      "where": "characteristic_type = 'Age Group' AND new_deaths > 0",
      "group": "characteristic_group",
      "order": "sum_new_deaths",
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
      "x": 570,
      "y": 10,
      "w": 550,
      "h": 560
    }
  },
  {
    "chartId": 0,
    "details": {
      "name": "Total Fatalities by Gender",
      "srcUrl": "https://data.sfgov.org/resource/kkr3-wq7h.json",
      "dataKey": "sum_new_deaths",
      "select": "sum(new_deaths) AS sum_new_deaths, characteristic_group",
      "where": "characteristic_type = 'Gender' AND new_deaths > 0",
      "group": "characteristic_group",
      "order": "sum_new_deaths",
      "limit": "",
      "labelKey": "characteristic_group",
      "chartType": "pie",
      "method": "GET",
      "dateColumnKey": "",
      "fromDate": DateTime.now().minus({months: 3}).toMillis(),
      "toDate": DateTime.now().toMillis()
    },
    "position": {
      "id": 0,
      "x": 580 + 550,
      "y": 10,
      "w": 550,
      "h": 560
    }
  },
]