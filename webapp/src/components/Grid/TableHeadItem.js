import { useContext, useState } from "react";

import { QueryContext } from "utils";
import { useSchema, useQuerySpecification, useUIState } from "services/store";
import { getColumnSchema } from "services/querySpecification/getters";
import FilterItem from "components/QueryEditor/FilterItem";
import { tableColorBlackOnLight } from "utils";

const ColumnHeadSpecification = ({ tableColumnName }) => {
  const queryContext = useContext(QueryContext);
  const toggleOrderBy = useQuerySpecification((state) => state.toggleOrderBy);

  const handleClick = () => {
    toggleOrderBy(queryContext.key, tableColumnName);
  };

  return (
    <div className="absolute z-10 mt-1 p-2 bg-white border rounded shadow-md">
      <button className="mx-2" onClick={handleClick}>
        <i className="fas fa-sort" />
      </button>

      <FilterItem columnName={tableColumnName} singleFilter />
    </div>
  );
};

const TableHeadItem = ({ tableColumnName, label, columnName, index }) => {
  const queryContext = useContext(QueryContext);
  const querySpecification = useQuerySpecification(
    (state) => state[queryContext.key]
  );
  const uiState = useUIState((state) => state.data[queryContext.key]);
  const schema = useSchema((state) => state[querySpecification.sourceLabel]);
  const toggleColumnHeadSpecification = useUIState(
    (state) => state.toggleColumnHeadSpecification
  );
  const initiateFilter = useQuerySpecification((state) => state.initiateFilter);
  const { activeColumnHeadSpecification, tableColors } = uiState;
  const tableColor = tableColors[tableColumnName.split(".")[0]];
  const [hover, setHover] = useState(false);

  const handleClick = () => {
    // This sets this column head's options widget to be ON or OFF
    toggleColumnHeadSpecification(queryContext.key, tableColumnName);
    const dataType = getColumnSchema(schema.rows, tableColumnName);
    initiateFilter(queryContext.key, tableColumnName, dataType);
  };

  const handleMouseEnter = () => {
    setHover(true);
  };

  const handleMouseLeave = () => {
    setHover(false);
  };

  let classes =
    "inline-block font-medium text-sm leading-normal text-gray-700 hover:text-gray-900 px-2 rounded cursor-pointer";

  if (hover) {
    classes = classes + ` shadow ${tableColorBlackOnLight(tableColor)}`;
  }

  if (querySpecification.orderBy[tableColumnName]) {
    if (querySpecification.orderBy[tableColumnName] === "asc") {
      classes = classes + " ord-asc";
    } else {
      classes = classes + " ord-desc";
    }
  }

  return (
    <th
      className="border border-gray-300 px-2 text-left"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <span className={classes}>{label}</span>
      {activeColumnHeadSpecification === tableColumnName ? (
        <ColumnHeadSpecification tableColumnName={tableColumnName} />
      ) : null}
    </th>
  );
};

export default TableHeadItem;
