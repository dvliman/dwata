import React, { useState, useEffect, Fragment } from "react";

import { useSource } from "services/store";
import TableList from "components/TableList";

const SourceItem = ({ source, sourceType }) => {
  const [state, setState] = useState({
    isOpen: true,
  });

  if (source.properties["is_system_db"]) {
    return null;
  }
  const handleClickSource = () => {
    setState((state) => ({
      ...state,
      isOpen: !state.isOpen,
    }));
  };

  return (
    <Fragment>
      <div className="relative">
        <div
          className="block p-2 pl-3 border-b cursor-default"
          onClick={handleClickSource}
        >
          {sourceType === "database" ? (
            <span className="text-lg text-gray-600 text-center mr-3">
              <i className="fas fa-database" />
            </span>
          ) : null}
          <span className="font-semibold tracking-wide">{source.label}</span>
          &nbsp;
          <span className="inline-block bg-green-200 text-sm px-2 rounded">
            {source.provider}
          </span>
        </div>
      </div>

      {state.isOpen ? (
        <TableList sourceLabel={source.label} sourceType={sourceType} />
      ) : null}
    </Fragment>
  );
};

const Source = () => {
  const isReady = useSource((state) => state.isReady);
  const sourceRows = useSource((state) => state.rows);
  const fetchSource = useSource((state) => state.fetchSource);
  useEffect(() => {
    fetchSource();
  }, [fetchSource]);

  if (!isReady) {
    return null;
  }

  return (
    <Fragment>
      <div className="block p-2 pl-3 border-b">
        <span className="text-lg text-yellow-200 text-center mr-3">
          <i className="fas fa-star" />
        </span>
        <span className="font-semibold text-gray-500">Starred</span>
      </div>
      <div className="block p-2 pl-3 border-b">
        <span className="text-lg text-orange-200 text-center mr-3">
          <i className="fas fa-folder" />
        </span>
        <span className="font-semibold text-gray-500">Orders</span>
      </div>
      <div className="block p-2 pl-3 border-b">
        <span className="text-lg text-gray-200 text-center mr-3">
          <i className="fas fa-folder" />
        </span>
        <span className="font-semibold text-gray-500">Customers</span>
      </div>

      {sourceRows
        .filter((x) => x.type === "database")
        .map((source, i) => (
          <SourceItem
            key={`sr-${source.label}`}
            index={i}
            source={source}
            sourceType="database"
          />
        ))}
    </Fragment>
  );
};

export default Source;
