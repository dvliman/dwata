import React, { useContext } from "react";

import { QueryContext } from "utils";
import { useSchema, useQuerySpecification } from "services/store";
import { getColumnSchema } from "services/querySpecification/getters";
import TableHeadItem from "./TableHeadItem";

export default () => {
  const queryContext = useContext(QueryContext);
  const querySpecification = useQuerySpecification(
    (state) => state[queryContext.key]
  );
  const schema = useSchema((state) => state[querySpecification.sourceLabel]);
  const tableColors = querySpecification.tableColors;
  const headList = [];
  let selectedTableNames = [],
    selectedTableColumNames = [],
    _columns = [];
  if ("isEmbedded" in queryContext && queryContext.isEmbedded) {
    selectedTableNames = [
      ...new Set(
        querySpecification.embeddedColumns[queryContext.embeddedDataIndex].map(
          (x) => x.tableName
        )
      ),
    ];
    selectedTableColumNames = querySpecification.embeddedColumns[
      queryContext.embeddedDataIndex
    ].map((x) => x.label);
    _columns =
      querySpecification.embeddedColumns[queryContext.embeddedDataIndex];
  } else {
    selectedTableNames = [
      ...new Set(querySpecification.columns.map((x) => x.tableName)),
    ];
    selectedTableColumNames = querySpecification.columns.map((x) => x.label);
    _columns = querySpecification.columns;
  }

  let i = 0;
  for (const col of _columns) {
    const tableColumnName = col.label;
    if (!selectedTableColumNames.includes(tableColumnName)) {
      continue;
    }
    const head = getColumnSchema(schema.rows, tableColumnName);
    if (head.is_primary_key) {
      headList.push(
        <TableHeadItem
          key={`th-${tableColumnName}`}
          index={i}
          tableColumnName={tableColumnName}
          label={head.name}
          tableColor={tableColors[col.tableName]}
        />
      );
    } else {
      headList.push(
        <TableHeadItem
          key={`th-${tableColumnName}`}
          index={i}
          tableColumnName={tableColumnName}
          label={head.name}
          tableColor={tableColors[col.tableName]}
        />
      );
    }
    i++;
  }

  return <tr className="border-b-4 h-10">{headList}</tr>;
};