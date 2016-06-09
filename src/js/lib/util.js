import * as types from 'constants/ActionTypes';
import { browserHistory } from 'react-router';
import Cookies from 'js-cookie';
import RESTController from 'lib/RESTController';

const COOKIE_PATH = 'NUTBOARD_CURRENT_USER';

export function getAuditLogs(data) {
  return dispatch => {
    let pubUrl = '/audit';
    dispatch(startAuditLoader());
    return RESTController.get(pubUrl, data)
      .then(handleErrors)
      .then(extractJSON)
      .then(formatResults)
      .then(obj => {
        return dispatch(onLoadAuditLogs(obj));
      }).catch(err => {
        return dispatch(onServerError(err));
      });
  }
}

export function onLoadAuditLogs(response) {
  return {
    type: types.ON_LOAD_AUDIT_LOGS,
    logs: response.data
  }
}

export function routeTo(path) {
  return browserHistory.push(path);
} 

export function storeCurrentUser(response) {
  Cookies.set(COOKIE_PATH, response);
  return response;
}

export function getCurrentUser() {
  const currentUser = Cookies.get(COOKIE_PATH);
  if (currentUser) {
    return JSON.parse(currentUser);
  }
  return {};
}

export function extractJSON(response) {
  return response.json();
}

export function formatResults(json) {
  let data = json.data || {};
  return { data }
}

export function startLoader() {
  return {
    type: types.IS_LOADING
  }
}

export function startAuditLoader() {
  return {
    type: types.IS_FETCHING_AUDIT_LOGS
  }
}

export function onServerError(err) {
  console.log(err);
  return {
    type: types.SERVER_ERROR,
    err
  }
}

export function handleErrors(response) {
  if (!response.ok) {
    if (response.status === 401) {
      return routeTo('/login');
    }
    throw Error(response.statusText);
  }
  return response;
}