import create from "zustand";
import _ from "lodash";

import { IQuerySpecification } from "services/querySpecification/types";

interface IUIStateItem {
  activeColumnHeadSpecification?: string;
  tableColors: { [key: string]: string };
}

const colors: string[] = [
  "orange",
  "teal",
  "pink",
  "purple",
  "indigo",
  "blue",
  "red",
  "yellow",
];

function selectColor(
  tableColumnName: string,
  existingColors?: { [key: string]: string }
): { [key: string]: string } {
  // Table names can be in dot notation syntax (<database>.<table>),
  //  we extract the actual name of table
  const tableName: string =
    tableColumnName.indexOf(".") === -1
      ? tableColumnName
      : tableColumnName.split(".")[0];

  const _colors = !!existingColors ? { ...existingColors } : {};

  if (Object.keys(_colors).includes(tableName)) {
    // We have already assigned a color to this table
    return _colors;
  }

  let rc = colors[_.random(0, colors.length - 1)];
  while (
    colors.length > Object.keys(_colors).length &&
    Object.values(_colors).includes(rc)
  ) {
    rc = colors[_.random(0, colors.length - 1)];
  }
  return {
    ...existingColors,
    [tableName]: rc,
  };
}

const toggleColumnHeadSpecification = (
  inner: IUIStateItem,
  columnName: string
) => ({
  ...inner,

  activeColumnHeadSpecification:
    inner.activeColumnHeadSpecification === null ||
    inner.activeColumnHeadSpecification !== columnName
      ? columnName
      : undefined,
});

interface IUIState {
  data: { [key: string]: IUIStateItem };
}

function loadFromLocalStorage(): IUIState {
  const temp = window.localStorage.getItem("uiState");
  if (!!temp) {
    return JSON.parse(temp);
  }
  return {
    data: {},
  };
}

function saveToLocalStorage(key: string, payload: IUIState): void {
  if (key === "main") {
    window.localStorage.setItem("uiState", JSON.stringify(payload));
  }
}

const useUIState = create<IUIState>((set) => ({
  ...loadFromLocalStorage(),

  toggleColumnHeadSpecification: (key: string, columnName: string) =>
    set((state) => ({
      data: {
        ...state.data,
        [key]: toggleColumnHeadSpecification(state.data[key], columnName),
      },
    })),
}));

export function initiateUIState(
  key: string,
  payload: IQuerySpecification
): void {
  const initialState: IUIStateItem = {
    tableColors: {},
  };

  const _temp = {
    ...initialState,

    tableColors: selectColor(payload.select[0].tableName),
  };
  saveToLocalStorage(key, {
    data: {
      ...useUIState.getState().data,
      [key]: _temp,
    },
  });

  useUIState.setState((state) => {
    return {
      data: {
        ...state.data,
        [key]: _temp,
      },
    };
  });
}

export default useUIState;
