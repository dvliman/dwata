import React, { Fragment, useContext } from "react";

import { QueryContext } from "utils";
import { useSchema, useQuerySpecification } from "services/store";
import { getColumnSchema } from "services/querySpecification/getters";
import { Button } from "components/LayoutHelpers";

/**
 * This method renders on the filter controls for a single column.
 * It is used in the top (common) filter editor, as well as in the per column head editor.
 */
export default ({ columnName, singleFilter = false }) => {
  const queryContext = useContext(QueryContext);
  const querySpecification = useQuerySpecification(
    (state) => state[queryContext.key]
  );
  const schema = useSchema((state) => state[querySpecification.sourceLabel]);
  const setFilter = useQuerySpecification((state) => state.setFilter);
  const requestRefetch = useQuerySpecification((state) => state.requestRefetch);

  const { filterBy } = querySpecification;
  const dataType = getColumnSchema(schema.rows, columnName);

  if (!(columnName in filterBy)) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value, dataset } = event.target;
    let fetchImmediately = false;

    const temp = {};
    if (dataType.type === "INTEGER") {
      if (value.indexOf(",") !== -1) {
        // This is a range provided
        if (value.substring(0, value.indexOf(",")).trim() !== "") {
          temp["from"] = parseInt(
            value.substring(0, value.indexOf(",")).trim(),
            10
          );
        }
        if (value.substring(value.indexOf(",") + 1).trim() !== "") {
          temp["to"] = parseInt(value.substring(value.indexOf(",") + 1));
        }
        temp["display"] = value;
      } else {
        temp["equal"] = parseInt(value, 10);
        temp["display"] = value;
      }
    } else if (dataType.type === "VARCHAR") {
      temp["like"] = value;
      temp["display"] = value;
    } else if (dataType.type === "DATE") {
      if (dataset.meta === "from") {
        temp["from"] = value;
      } else if (dataset.meta === "to") {
        temp["to"] = value;
      }
    } else if (dataType.type === "TIMESTAMP") {
      if (dataset.meta === "from") {
        temp["from"] = value;
      } else if (dataset.meta === "to") {
        temp["to"] = value;
      }
    } else if (dataType.type === "BOOLEAN") {
      fetchImmediately = true;
      temp["value"] = null;
      if (value === "true") {
        temp["value"] = true;
      } else if (value === "false") {
        temp["value"] = false;
      }
    }

    setFilter(queryContext.key, name, temp);
    if (fetchImmediately) {
      requestRefetch(queryContext.key);
    }
  };

  const handleSubmit = () => {
    requestRefetch(queryContext.key);
  };

  if (dataType.type === "INTEGER" || dataType.type === "FLOAT") {
    return (
      <Fragment>
        <div className="control">
          <input
            className="input"
            name={columnName}
            onChange={handleChange}
            placeholder="range 12,88 or exact 66"
            value={filterBy[columnName].display}
          />
        </div>
        {singleFilter ? (
          <div className="control">
            <Button attributes={{ onClick: handleSubmit }}>Apply</Button>
          </div>
        ) : null}
      </Fragment>
    );
  } else if (dataType.type === "VARCHAR") {
    return (
      <Fragment>
        <div className="control">
          <input
            className="input"
            name={columnName}
            onChange={handleChange}
            placeholder="text to search"
            value={filterBy[columnName].display}
          />
        </div>
        {singleFilter ? (
          <div className="control">
            <Button attributes={{ onClick: handleSubmit }}>Apply</Button>
          </div>
        ) : null}
      </Fragment>
    );
  } else if (dataType.type === "DATE") {
    return (
      <Fragment>
        <div className="control">
          <input
            className="input"
            name={columnName}
            data-meta="from"
            type="date"
            onChange={handleChange}
            value={filterBy[columnName].display}
          />
        </div>

        <div className="control">
          <input
            className="input"
            name={columnName}
            data-meta="to"
            type="date"
            onChange={handleChange}
            value={filterBy[columnName].display}
          />
        </div>

        {singleFilter ? (
          <div className="control">
            <Button attributes={{ onClick: handleSubmit }}>Apply</Button>
          </div>
        ) : null}
      </Fragment>
    );
  } else if (dataType.type === "TIMESTAMP") {
    return (
      <Fragment>
        <div className="control">
          <input
            className="input"
            name={columnName}
            data-meta="from"
            type="datetime-local"
            onChange={handleChange}
            value={filterBy[columnName].from}
          />
        </div>

        <div className="control">
          <input
            className="input"
            name={columnName}
            data-meta="to"
            type="datetime-local"
            onChange={handleChange}
            value={filterBy[columnName].to}
          />
        </div>

        {singleFilter ? (
          <div className="control">
            <Button attributes={{ onClick: handleSubmit }}>Apply</Button>
          </div>
        ) : null}
      </Fragment>
    );
  } else if (dataType.type === "BOOLEAN") {
    return (
      <div className="control is-narrow">
        <div className="control">
          <label className="radio">
            <input
              type="radio"
              name={columnName}
              value="true"
              checked={filterBy[columnName].value === true}
              onChange={handleChange}
            />
            &nbsp;Yes
          </label>

          <label className="radio">
            <input
              type="radio"
              name={columnName}
              value="false"
              checked={filterBy[columnName].value === false}
              onChange={handleChange}
            />
            &nbsp;No
          </label>
        </div>
      </div>
    );
  }
  return (
    <div className="control">
      <input className="input" type="text" disabled value="Coming soon" />
    </div>
  );
};
