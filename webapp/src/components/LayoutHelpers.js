import React, { useCallback, useEffect } from "react";
import { Link } from "react-router-dom";

import { tableColorBlackOnLight } from "utils";

export const Section = ({ size = "", style = {}, children }) => (
  <section className={`section ${size}`} style={style}>
    <div className="container">{children}</div>
  </section>
);

export const Hx = ({ x = "3", children }) => {
  const xSizeClass = {
    1: "text-4xl",
    2: "text-3xl",
    3: "text-2xl",
    4: "text-xl",
    5: "text-lg",
    6: "text-md",
  };
  return React.createElement(
    `h${x}`,
    {
      className: `font-medium text-gray-700 pl-3 ${xSizeClass[x]}`,
    },
    children
  );
};

export const Button = ({
  label,
  size = "md",
  theme = "primary",
  active = false,
  disabled = false,
  padding = "px-2",
  margin = "mx-1",
  rounded = "rounded",
  linkTo = undefined,
  attributes,
  children,
}) => {
  let themeClasses = "",
    sizeClasses = "";
  if (theme === "primary") {
    themeClasses =
      "bg-blue-300 text-gray-800 hover:bg-blue-700 hover:text-white";
  } else if (theme === "success") {
    themeClasses =
      "bg-green-400 text-gray-700 hover:bg-green-700 hover:text-white";
  } else if (theme === "secondary") {
    themeClasses =
      "bg-gray-300" +
      (disabled
        ? " text-gray-500"
        : " text-gray-700 hover:bg-gray-700 hover:text-white");
  } else if (theme === "info") {
    themeClasses =
      (active ? "bg-yellow-400" : "bg-yellow-200") +
      " text-gray-700 hover:bg-yellow-700 hover:text-white";
  } else if (theme === "link") {
    themeClasses = "inline-block underline";
  }

  if (size === "sm") {
    sizeClasses = "text-xs leading-5";
  } else {
    sizeClasses = "text-sm leading-6";
  }

  const classes =
    "inline-block shadow focus:outline-none" +
    (disabled ? " " : " hover:shadow-none ") +
    `${rounded} ${padding} ${margin} ${themeClasses} ${sizeClasses}`;

  if (linkTo !== undefined) {
    return (
      <Link className={classes} {...attributes} disabled={disabled} to={linkTo}>
        {label}
        {children}
      </Link>
    );
  } else {
    return (
      <button className={classes} {...attributes} disabled={disabled}>
        {label}
        {children}
      </button>
    );
  }
};

export const ColumnHead = ({
  label,
  order,
  tableColor,
  attributes,
  children,
}) => {
  let classes =
    "inline-block font-medium text-sm leading-normal text-gray-700 hover:text-gray-900 px-2 shadow rounded cursor-pointer";
  classes = classes + ` ${tableColorBlackOnLight(tableColor)}`;
  if (order) {
    if (order === "asc") {
      classes = classes + " ord-asc";
    } else {
      classes = classes + " ord-desc";
    }
  }

  return (
    <th className="border border-gray-300 px-2 text-left">
      <span className={classes} {...attributes}>
        {label}
      </span>
      {children}
    </th>
  );
};

export const Panel = ({ title, hasSearch, hasTabs, children }) => (
  <div className="bg-white shadow-md border rounded">
    <div className="bg-gray-200">
      <span className="block text-2xl font-semibold px-4 py-2">{title}</span>
    </div>
    {hasSearch ? (
      <div className="panel-block">
        <p className="control has-icons-left">
          <input className="input" type="text" placeholder="Search" />
          <span className="icon is-left">
            <i className="fas fa-search" aria-hidden="true"></i>
          </span>
        </p>
      </div>
    ) : null}
    {hasTabs ? <p className="panel-tabs"></p> : null}
    {children}
  </div>
);

export const Modal = ({
  callerPosition,
  theme = "white",
  maxWidth = "lg",
  toggleModal,
  children,
}) => {
  // Notes is a modal and we handle the Esc key to hide the modal
  const handleKey = useCallback(
    (event) => {
      if (event.keyCode === 27) {
        toggleModal();
      }
    },
    [toggleModal]
  );
  useEffect(() => {
    document.addEventListener("keydown", handleKey, false);

    return () => {
      document.removeEventListener("keydown", handleKey, false);
    };
  }, [handleKey]);

  let classes = `fixed z-10 shadow-lg p-4 rounded-md border max-w-${maxWidth}`;
  if (theme === "light") {
    classes = classes + " bg-gray-100";
  } else if (theme === "white") {
    classes = classes + " bg-white";
  } else if (theme === "info") {
    classes = classes + " bg-yellow-200";
  }
  const style = {
    top: "70px",
  };
  if (!!callerPosition) {
    style.top = callerPosition.top + 36 + "px";
    style.left = callerPosition.left;
  }

  return (
    <div className={classes} style={style}>
      {children}
    </div>
  );
};
