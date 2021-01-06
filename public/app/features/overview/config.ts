//const ALERT_URL = 'alert.service.com';
//const SEARCH_URL = 'search.service.com';

const searchSrvUrl = `http://100.64.108.25:8092`;
const alertSrvUrl = `http://100.64.108.25:5055`;
const ticketSrvUrl = `http://100.64.108.25:7100/api`;
// const searchSrvUrl = `http://localhost:8092`;
// const alertSrvUrl = `http://localhost:5055`;
// const ticketSrvUrl = `http://localhost:7100/api`;

export const config = {
  basePath: '/plugins/xformation-alertmanager-ui-plugin/page',
  GET_ALL_ALERT_FROM_ELASTIC: `${alertSrvUrl}/api/listAllAlertFromElastic`,
  GET_ALL_ALERT_FROM_DB: `${alertSrvUrl}/api/listAlert`,
  UPDATE_ALERT: `${alertSrvUrl}/api/updateAlert`,
  DELETE_ALERT: `${alertSrvUrl}/api/deleteAlert`,
  TOP_ALERT_TODAY: `${alertSrvUrl}/api/topAlertToday`,
  GET_ALERT_VOLUME_DATA: `${alertSrvUrl}/api/getAlertVolumeData`,
  GET_ALERT_VOLUME_BY_STATUS: `${alertSrvUrl}/api/getAlertVolumeByStatus`,
  // GET_AVG_RESP_TIME_DATA: `${alertSrvUrl}/api/getAvgResponseTime`,
  GET_AVG_RESP_TIME_DATA: `${alertSrvUrl}/api/getAvgResponseTimeGraphDataFromDb`,
  // GET_AVG_WAIT_TIME_DATA: `${alertSrvUrl}/api/getWaitTimeGraphData`,
  GET_AVG_WAIT_TIME_DATA: `${alertSrvUrl}/api/getWaitTimeGraphDataFromDb`,
  TOTAL_ALERTS: `${searchSrvUrl}/search/totalRecords`,
  GET_TICKETS_BY_GUID_URL: `${ticketSrvUrl}/alertTicketsByGuid`,
  GET_TEAM_MATRICS_DATA_URL: `${ticketSrvUrl}/getTeamMatricsData`,
  GET_ALERT_ACTIVITIES: `${alertSrvUrl}/api/getDataFromAlertActivity`,

  PARENT_NAME: 'xformation-alertmanager-ui-plugin',

  SEVERITY_ERROR: 'error',
  SEVERITY_SUCCESS: 'success',
  SERVER_ERROR_MESSAGE: 'Operation failed. Please check service logs for details',
  UPDATE_ALERT_SUCCESS_MESSAGE: 'Alert updated successfully',
};
