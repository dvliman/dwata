import { matchPath } from "react-router-dom";


export const transformData = (columns, row) => row.reduce((acc, cur, i) => ({
  ...acc,
  [columns[i]]: cur,
}), {});


export const slugify = text => text.toString().toLowerCase()
  .replace(/\s+/g, '-')           // Replace spaces with -
  .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
  .replace(/\-\-+/g, '-')         // Replace multiple - with single -
  .replace(/^-+/, '')             // Trim - from start of text
  .replace(/-+$/, '');            // Trim - from end of text


export const matchBrowserPath = pathname => matchPath(pathname, {
    path: "/browse/:sourceId/:tableName",
    exact: true,
    strict: false,
  });