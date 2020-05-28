import { INITIATE_FETCH_ITEM, COMPLETE_FETCH_ITEM, LOAD_ITEM_FROM_CACHE } from "./actionTypes";
import { act } from "react-dom/test-utils";


const initialItemState = {
  data: {},
  querySQL: null,

  isFetching: false,
  isReady: false,
};

const initialState = {
};


export default (state = initialState, action) => {
  const _cacheKey = `${action.sourceId}/${action.tableName}/${action.pk}`;
  console.log(action.type, _cacheKey);

  switch (action.type) {
    case INITIATE_FETCH_ITEM:
      if (_cacheKey in Object.keys(state)) {
        return {
          ...state
        };
      }
      return {
        ...state,
        [_cacheKey]: {
          ...initialItemState,
          isFetching: true,
        }
      };

    case COMPLETE_FETCH_ITEM: {
      return {
        ...state,
        [_cacheKey]: {
          ...state[_cacheKey],
          data: action.payload.item,
          querySQL: action.payload.query_sql,
          isFetching: false,
          isReady: true,
        }
      }
    }

    default:
      return {
        ...state,
      };
  }
}