import { DateTime } from "luxon";
import { ChartType } from "chart.js";

export const demoCharts = [
  {
    "chartId": 0,
    "details": {
      "name": "Fatalities by Race/Ethnicity (2021-2022)",
      "srcUrl": "https://data.sfgov.org/resource/kkr3-wq7h.json",
      "dataKey": "sum_new_deaths",
      "select": "sum(new_deaths) AS sum_new_deaths, characteristic_group",
      "where": "characteristic_type = 'Race/Ethnicity' AND new_deaths > 0",
      "group": "characteristic_group",
      "order": "",
      "limit": "",
      "labelKey": "characteristic_group",
      "chartType": "polarArea" as ChartType,
      "method": "GET",
      "dateColumnKey": "date_of_death",
      "fromDate": DateTime.fromObject({year: 2021}).startOf("year").toMillis(),
      "toDate": DateTime.fromObject({year: 2022}).endOf("year").toMillis(),
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
      "name": "Fatalities by Age Group (2021-2022)",
      "srcUrl": "https://data.sfgov.org/resource/kkr3-wq7h.json",
      "dataKey": "sum_new_deaths",
      "select": "sum(new_deaths) AS sum_new_deaths, characteristic_group",
      "where": "characteristic_type = 'Age Group' AND new_deaths > 0",
      "group": "characteristic_group",
      "order": "sum_new_deaths",
      "limit": "",
      "labelKey": "characteristic_group",
      "chartType": "bar" as ChartType,
      "method": "GET",
      "dateColumnKey": "date_of_death",
      "fromDate": DateTime.fromObject({year: 2021}).startOf("year").toMillis(),
      "toDate": DateTime.fromObject({year: 2022}).endOf("year").toMillis(),
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
      "name": "Fatalities by Gender (2021-2022)",
      "srcUrl": "https://data.sfgov.org/resource/kkr3-wq7h.json",
      "dataKey": "sum_new_deaths",
      "select": "sum(new_deaths) AS sum_new_deaths, characteristic_group",
      "where": "characteristic_type = 'Gender' AND new_deaths > 0",
      "group": "characteristic_group",
      "order": "sum_new_deaths",
      "limit": "",
      "labelKey": "characteristic_group",
      "chartType": "doughnut" as ChartType,
      "method": "GET",
      "dateColumnKey": "date_of_death",
      "fromDate": DateTime.fromObject({year: 2021}).startOf("year").toMillis(),
      "toDate": DateTime.fromObject({year: 2022}).endOf("year").toMillis(),
    },
    "position": {
      "id": 0,
      "x": 1130,
      "y": 10,
      "w": 550,
      "h": 560
    }
  },
  {
    "chartId": 0,
    "details": {
      "name": "Cases by Vaccination Status (2021-2022)",
      "srcUrl": "https://data.sfgov.org/resource/gqw3-444p.json",
      "dataKey": "sum_new_cases",
      "select": "sum(new_cases) AS sum_new_cases, vaccination_status",
      "where": "",
      "group": "vaccination_status",
      "order": "",
      "limit": "",
      "labelKey": "vaccination_status",
      "chartType": "pie" as ChartType,
      "method": "GET",
      "dateColumnKey": "specimen_collection_date",
      "fromDate": DateTime.fromObject({year: 2021}).startOf("year").toMillis(),
      "toDate": DateTime.fromObject({year: 2022}).endOf("year").toMillis(),
    },
    "position": {
      "id": 0,
      "x": 1690,
      "y": 10,
      "w": 550,
      "h": 560
    }
  },
  {
    "chartId": 0,
    "details": {
      "name": "Fatalities By Month in 2021",
      "srcUrl": "https://data.sfgov.org/resource/kkr3-wq7h.json",
      "dataKey": "sum_new_deaths",
      "select": "date_extract_m(date_of_death) as m, sum(new_deaths) AS sum_new_deaths",
      "where": "",
      "group": "m",
      "order": "m",
      "limit": "",
      "labelKey": "m",
      "chartType": "line" as ChartType,
      "method": "GET",
      "dateColumnKey": "date_of_death",
      "fromDate": DateTime.fromObject({year: 2021}).startOf("year").toMillis(),
      "toDate": DateTime.fromObject({year: 2021}).endOf("year").toMillis(),
    },
    "position": {
      "id": 0,
      "x": 10,
      "y": 580,
      "w": 550,
      "h": 560
    }
  },
  {
    "chartId": 0,
    "details": {
      "name": "Fatalities By Month in 2022",
      "srcUrl": "https://data.sfgov.org/resource/kkr3-wq7h.json",
      "dataKey": "sum_new_deaths",
      "select": "date_extract_m(date_of_death) as m, sum(new_deaths) AS sum_new_deaths",
      "where": "",
      "group": "m",
      "order": "m",
      "limit": "",
      "labelKey": "m",
      "chartType": "line" as ChartType,
      "method": "GET",
      "dateColumnKey": "date_of_death",
      "fromDate": DateTime.fromObject({year: 2022}).startOf("year").toMillis(),
      "toDate": DateTime.fromObject({year: 2022}).endOf("year").toMillis(),
    },
    "position": {
      "id": 0,
      "x": 570,
      "y": 580,
      "w": 550,
      "h": 560
    }
  },
  {
    "chartId": 0,
    "details": {
      "name": "Vaccinations By Month in 2021",
      "srcUrl": "https://data.sfgov.org/resource/rutu-rpar.json",
      "dataKey": "sum_new_primary_series_doses",
      "select": "date_extract_m(date_administered) as m, sum(new_primary_series_doses) AS sum_new_primary_series_doses",
      "where": "",
      "group": "m",
      "order": "m",
      "limit": "",
      "labelKey": "m",
      "chartType": "line" as ChartType,
      "method": "GET",
      "dateColumnKey": "date_administered",
      "fromDate": DateTime.fromObject({year: 2021}).startOf("year").toMillis(),
      "toDate": DateTime.fromObject({year: 2021}).endOf("year").toMillis(),
    },
    "position": {
      "id": 0,
      "x": 1130,
      "y": 580,
      "w": 550,
      "h": 560
    }
  },
  {
    "chartId": 0,
    "details": {
      "name": "Vaccinations By Month in 2022",
      "srcUrl": "https://data.sfgov.org/resource/rutu-rpar.json",
      "dataKey": "sum_new_primary_series_doses",
      "select": "date_extract_m(date_administered) as m, sum(new_primary_series_doses) AS sum_new_primary_series_doses",
      "where": "",
      "group": "m",
      "order": "m",
      "limit": "",
      "labelKey": "m",
      "chartType": "line" as ChartType,
      "method": "GET",
      "dateColumnKey": "date_administered",
      "fromDate": DateTime.fromObject({year: 2022}).startOf("year").toMillis(),
      "toDate": DateTime.fromObject({year: 2022}).endOf("year").toMillis(),
    },
    "position": {
      "id": 0,
      "x": 1690,
      "y": 580,
      "w": 550,
      "h": 560
    }
  },
]