interface IQSSelect {
  label: string;
  tableName: string;
  columnName: string;
}

export interface IQuerySpecification {
  sourceLabel: string;

  select: Array<IQSSelect>;
  columns: string[];
  embeddedColumns: string[];
  filterBy: any;
  orderBy: any;

  count: number;
  limit: number;
  offset: number;

  isRowSelectable: boolean;
  isReady: boolean;
  isFetching: boolean;
  fetchNeeded: boolean;
}
