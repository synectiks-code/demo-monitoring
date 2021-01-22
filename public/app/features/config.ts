const uiUrl = 'http://100.64.108.25:3000/';
const catalogSrvUrl = `http://100.64.108.25:5050/api/`;
export const config = {
  LIST_DASHBOARD: catalogSrvUrl + 'listDashboard',
  DELETE_DASHBOARD: uiUrl + 'api/dashboards/deleteDashboard',
  IMPORT_DASHBOARD: uiUrl + 'api/dashboards/db',
  ANALYTICS_LIST_VIEW: catalogSrvUrl + 'listView',
  ADD_DASHBOARD: catalogSrvUrl + 'addView',
};
