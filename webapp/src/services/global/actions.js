import axios from "axios";

import { capabilityURL, dataItemURL } from "services/urls";
import { getSourceFromPath } from "utils";
import { INITIATE_FETCH_ITEM, COMPLETE_FETCH_ITEM } from "services/dataItem/actionTypes";
import {
  TOGGLE_SIDEBAR, TOGGLE_FILTER_EDITOR, TOGGLE_COLUMN_HEAD_SPECIFICATION, SHOW_NOTES_FOR,
  COMPLETE_FETCH_CAPABILITY
} from './actionTypes';


export const toggleSidebar = () => dispatch => dispatch({
  type: TOGGLE_SIDEBAR,
});


export const toggleFilterEditor = () => dispatch => dispatch({
  type: TOGGLE_FILTER_EDITOR,
});


export const toggleColumnHeadSpecification = columnName => dispatch => dispatch({
  type: TOGGLE_COLUMN_HEAD_SPECIFICATION,
  columnName,
});


export const showNotes = identifier => dispatch => dispatch({
  type: SHOW_NOTES_FOR,
  identifier,
});


export const getCapabilities = () => dispatch => {
  return axios
    .get(capabilityURL)
    .then(res => {
      dispatch({
        type: COMPLETE_FETCH_CAPABILITY,
        payload: res.data,
      });
    })
    .catch(err => {
      console.log("Could not fetch capabilities. Try again later.");
      console.log(err);
    });
};


export const fetchNote = callback => (dispatch, getState) => {
  const state = getState();
  let pk = null, i = 0;
  try {
    const {params} = getSourceFromPath(state.router.location.pathname);
    pk = btoa(`${params.sourceId}/${params.tableName}`);
  } catch (error) {
    return false;
  }
  console.log(i++);
  const {hasNotesCapability, notesCapability} = state.global;
  if (!hasNotesCapability || !notesCapability) {
    return false;
  }
  console.log(i++);
  const {source_id: sourceId, table_name: tableName} = notesCapability;

  dispatch({
    type: INITIATE_FETCH_ITEM,
    sourceId,
    tableName,
    pk,
  });
  console.log(i++);

  return axios
    .get(`${dataItemURL}/${sourceId}/${tableName}/${pk}`)
    .then(res => {
      if (!!callback) {
        callback();
      }

      dispatch({
        type: COMPLETE_FETCH_ITEM,
        payload: res.data,
        sourceId,
        tableName,
        pk,
      });
    })
    .catch(err => {
      console.log("Could not fetch sources. Try again later.");
      console.log(err);
    });
};