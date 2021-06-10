import React from "react";

export const transformData = (columns, row) =>
  row.reduce(
    (acc, cur, i) => ({
      ...acc,
      [columns[i]]: cur,
    }),
    {}
  );

export const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text

/**
 * We use QueryContext to create a new React Context inside which we place a data browser,
 *  like Grid, Kanban or anything else. This allows us to have multiple data data browsers
 *  in the same page (embedding).
 */
export const QueryContext = React.createContext({});
QueryContext.displayName = "QueryContext";

export const tableColorWhiteOnMedium = (color) => {
  if (color === "orange") {
    return "bg-orange-400";
  } else if (color === "teal") {
    return "bg-teal-400";
  } else if (color === "pink") {
    return "bg-pink-400";
  } else if (color === "purple") {
    return "bg-purple-400";
  } else if (color === "indigo") {
    return "bg-indigo-400";
  } else if (color === "blue") {
    return "bg-blue-400";
  } else if (color === "red") {
    return "bg-red-400";
  } else if (color === "yellow") {
    return "bg-yellow-400";
  }
};

export const tableColorBlackOnLight = (color) => {
  if (color === "orange") {
    return "bg-orange-200";
  } else if (color === "teal") {
    return "bg-teal-200";
  } else if (color === "pink") {
    return "bg-pink-200";
  } else if (color === "purple") {
    return "bg-purple-200";
  } else if (color === "indigo") {
    return "bg-indigo-200";
  } else if (color === "blue") {
    return "bg-blue-200";
  } else if (color === "red") {
    return "bg-red-200";
  } else if (color === "yellow") {
    return "bg-yellow-200";
  }
};
