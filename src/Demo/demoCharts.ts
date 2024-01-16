import { DateTime } from "luxon"

export const demoCharts = [
  {
    "chartId": 0,
    "details": {
      "name": "Total Fatalities",
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
  // {
  //   "chartId": 1,
  //   "details": {
  //     "name": "Requests Per Day",
  //     "srcUrl": "https://data.fortworthtexas.gov/resource/${crashDatasetID}.json",
  //     "dataKey": "numberOfRequests",
  //     "labelKey": "day",
  //     "chartType": "bar",
  //     "method": "GET",
  //     "apiKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGNlYjcyOGMyMGRhNzA2MjBiNDFiNmMiLCJpYXQiOjE3MDQzODc0NTYsImV4cCI6MTcwNDQ3Mzg1Nn0.V2JHfaS2tkhHRt2VIdA3Nl10Y5kfAOB5lNzfZGIZIz8",
  //     "fromDate": DateTime.now().minus({month: 1}).toMillis(),
  //     "toDate": DateTime.now().toMillis()
  //   },
  //   "position": {
  //     "id": 0,
  //     "x": 570,
  //     "y": 10,
  //     "w": 800,
  //     "h": 560
  //   }
  // },
  // {
  //   "chartId": 2,
  //   "details": {
  //     "name": "Requests Per Hour",
  //     "srcUrl": "https://admbuilt.com/api/analytics/getRequestsPerHour",
  //     "dataKey": "numberOfRequests",
  //     "labelKey": "hour",
  //     "chartType": "line",
  //     "method": "GET",
  //     "apiKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGNlYjcyOGMyMGRhNzA2MjBiNDFiNmMiLCJpYXQiOjE3MDQzODc0NTYsImV4cCI6MTcwNDQ3Mzg1Nn0.V2JHfaS2tkhHRt2VIdA3Nl10Y5kfAOB5lNzfZGIZIz8",
  //     "fromDate": DateTime.now().minus({hours: 24}).toMillis(),
  //     "toDate": DateTime.now().toMillis()
  //   },
  //   "position": {
  //     "id": 0,
  //     "x": 1380,
  //     "y": 10,
  //     "w": 800,
  //     "h": 560
  //   }
  // },
  // {
  //   "chartId": 3,
  //   "details": {
  //     "name": "Response Time Per IP",
  //     "srcUrl": "https://admbuilt.com/api/analytics/getStatsPerIP",
  //     "dataKey": "numberOfRequests",
  //     "labelKey": "ip",
  //     "chartType": "line",
  //     "method": "GET",
  //     "apiKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGNlYjcyOGMyMGRhNzA2MjBiNDFiNmMiLCJpYXQiOjE3MDQzODc0NTYsImV4cCI6MTcwNDQ3Mzg1Nn0.V2JHfaS2tkhHRt2VIdA3Nl10Y5kfAOB5lNzfZGIZIz8",
  //     "fromDate": DateTime.now().minus({hours: 24}).toMillis(),
  //     "toDate": DateTime.now().toMillis()
  //   },
  //   "position": {
  //     "id": 0,
  //     "x": 10,
  //     "y": 580,
  //     "w": 800,
  //     "h": 560
  //   }
  // },
  // {
  //   "chartId": 4,
  //   "details": {
  //     "name": "Response Time Per Route",
  //     "srcUrl": "https://admbuilt.com/api/analytics/getStatsPerRoute",
  //     "dataKey": "numberOfRequests",
  //     "labelKey": "url",
  //     "chartType": "bar",
  //     "method": "GET",
  //     "apiKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGNlYjcyOGMyMGRhNzA2MjBiNDFiNmMiLCJpYXQiOjE3MDQzODc0NTYsImV4cCI6MTcwNDQ3Mzg1Nn0.V2JHfaS2tkhHRt2VIdA3Nl10Y5kfAOB5lNzfZGIZIz8",
  //     "fromDate": DateTime.now().minus({hours: 24}).toMillis(),
  //     "toDate": DateTime.now().toMillis()
  //   },
  //   "position": {
  //     "id": 0,
  //     "x": 820,
  //     "y": 580,
  //     "w": 800,
  //     "h": 560
  //   }
  // },
  // {
  //   "chartId": 5,
  //   "details": {
  //     "name": "Response Time Per Status",
  //     "srcUrl": "https://admbuilt.com/api/analytics/getStatsPerStatus",
  //     "dataKey": "numberOfRequests",
  //     "labelKey": "statusCode",
  //     "chartType": "doughnut",
  //     "method": "GET",
  //     "apiKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGNlYjcyOGMyMGRhNzA2MjBiNDFiNmMiLCJpYXQiOjE3MDQzODc0NTYsImV4cCI6MTcwNDQ3Mzg1Nn0.V2JHfaS2tkhHRt2VIdA3Nl10Y5kfAOB5lNzfZGIZIz8",
  //     "fromDate": DateTime.now().minus({hours: 24}).toMillis(),
  //     "toDate": DateTime.now().toMillis()
  //   },
  //   "position": {
  //     "id": 0,
  //     "x": 1630,
  //     "y": 580,
  //     "w": 550,
  //     "h": 560
  //   }
  // },
]