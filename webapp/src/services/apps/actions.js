import axios from "axios";

import { appURL, dataItemURL, dataURL } from "services/urls";
import { getSourceFromPath } from "utils";
import { INITIATE_FETCH_ITEM, COMPLETE_FETCH_ITEM } from "services/dataItem/actionTypes";
import { fetchData } from "services/browser/actions";
import { COMPLETE_FETCH_APP } from './actionTypes';


export const getApps = () => dispatch => {
  return axios
    .get(appURL)
    .then(res => {
      dispatch({
        type: COMPLETE_FETCH_APP,
        payload: res.data,
      });
    })
    .catch(err => {
      console.log("Could not fetch apps. Try again later.");
      console.log(err);
    });
};


export const fetchNote = () => (dispatch, getState) => {
  const state = getState();
  let path = null;
  try {
    const {params} = getSourceFromPath(state.router.location.pathname);
    path = btoa(`${params.sourceId}/${params.tableName}`);
  } catch (error) {
    return false;
  }
  const {isNoteAppEnabled, noteAppConfig} = state.apps;
  if (!isNoteAppEnabled || !noteAppConfig) {
    return false;
  }
  const {source_id: sourceId, table_name: tableName} = noteAppConfig;

  dispatch({
    type: INITIATE_FETCH_ITEM,
    sourceId,
    tableName,
    pk: path,
  });

  return axios
    .get(`${dataItemURL}/${sourceId}/${tableName}?path=${path}`)
    .then(res => {
      dispatch({
        type: COMPLETE_FETCH_ITEM,
        payload: res.data,
        sourceId,
        tableName,
        pk: path,
      });
    })
    .catch(err => {
      console.log("Could not fetch notes. Try again later.", err.response.status);
      if (err.response.status === 404) {
        dispatch({
          type: COMPLETE_FETCH_ITEM,
          payload: null,
          sourceId,
          tableName,
          pk: path,
          errorStatus: err.response.status,
        });
      }
    });
};


export const saveNote = (payload, pk, callback) => (dispatch, getState) => {
  const state = getState();
  let path = null;
  try {
    const {params} = getSourceFromPath(state.router.location.pathname);
    path = btoa(`${params.sourceId}/${params.tableName}`);
  } catch (error) {
    return false;
  }
  const {isNoteAppEnabled, noteAppConfig} = state.apps;
  if (!isNoteAppEnabled || !noteAppConfig) {
    return false;
  }
  const {source_id: sourceId, table_name: tableName} = noteAppConfig;
  const url = pk !== null ? `${dataItemURL}/${sourceId}/${tableName}/${pk}` : `${dataItemURL}/${sourceId}/${tableName}`;

  return axios({
    method: pk !== null ? "put" : "post",
    url,
    data: {
      path,
      ...payload,
    }
  })
    .then(res => {
      if (!!callback) {
        callback(res);
      }
    })
    .catch(err => {
      console.log("Could not fetch notes. Try again later.");
      console.log(err);
    });
};


export const pinRecords = () => (dispatch, getState) => {
  const state = getState();
  let path = null;
  try {
    const {params} = getSourceFromPath(state.router.location.pathname);
    path = btoa(`${params.sourceId}/${params.tableName}`);
  } catch (error) {
    return false;
  }
  const {selectedRowList} = state.browser;
  const {isRecordPinAppEnabled, recordPinAppConfig} = state.apps;
  if (!isRecordPinAppEnabled || !recordPinAppConfig) {
    return false;
  }
  const {source_id: sourceId, table_name: tableName} = recordPinAppConfig;

  for (const rowId of selectedRowList) {
    axios
    .post(`${dataItemURL}/${sourceId}/${tableName}`, {
      path,
      record_id: rowId,
    });
  }
}


export const fetchPins = () => (dispatch, getState) => {
  const state = getState();
  let path = null;
  try {
    const {params} = getSourceFromPath(state.router.location.pathname);
    path = btoa(`${params.sourceId}/${params.tableName}`);
  } catch (error) {
    return false;
  }
  const {isRecordPinAppEnabled, recordPinAppConfig} = state.apps;
  if (!isRecordPinAppEnabled || !recordPinAppConfig) {
    return false;
  }
  const {source_id: sourceId, table_name: tableName} = recordPinAppConfig;

  axios
    .post(`${dataURL}/${sourceId}/${tableName}`, {
      columns: ["id", "path", "record_id"],
      filterBy: {
        path: {
          equal: path,
        }
      }
    });
};