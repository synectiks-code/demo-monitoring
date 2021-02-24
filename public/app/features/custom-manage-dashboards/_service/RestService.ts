export const RestService = {
  getData,
  add,
  getDashboardList,
  deleteObject,
};

function add(url: any, data: any) {
  const requestOptions = getRequestOptions(
    'POST',
    { 'Content-Type': 'application/json;charset=UTF-8' },
    JSON.stringify(data)
  );
  return fetch(url, requestOptions).then(response => response.json());
}

function getData(url: any, extraHeaders: any, data: any) {
  const requestOptions = getRequestOptions('GET', extraHeaders, data);
  return fetch(url, requestOptions).then(response => response.json());
}

function getRequestOptions(type: any, extraHeaders: any, body?: any): any {
  let requestOptions: any = {};
  requestOptions = {
    method: type,
    headers: {
      ...extraHeaders,
    },
  };
  if (body) {
    requestOptions['body'] = body;
  }
  return requestOptions;
}

function deleteObject(url: any) {
  return fetch(url, {
    method: 'DELETE',
    redirect: 'follow',
  }).then(response => response.text());
}

function getDashboardList(url: any) {
  const requestOptions = getRequestOptions('GET', {}, null);
  return fetch(url, requestOptions).then(response => response.json());
}
