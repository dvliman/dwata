import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { nextPage, previousPage, gotoPage } from "services/querySpecification/actions";


const PageItem = ({number, currentPage, gotoPage}) => {
  const handleGotoPage = event => {
    event.preventDefault();
    gotoPage(number);
  }
  
  return (
    <li><a className={`pagination-link${number === currentPage ? " is-current" : ""}`} aria-label={`Goto page ${number}`} onClick={handleGotoPage}>{number}</a></li>
  );
}


const PageSlots = ({count, limit, offset, gotoPage}) => {
  const slots = 9;  // Includes all page numbers to be shown and ellipses
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(count / limit);
  const slotComponents = [];
  if (totalPages < slots) {
    return (
      <ul className="pagination-list">
        <li><span className="pagination-ellipsis">{limit}/page</span></li>
        {[...Array(totalPages).keys()].map(x => (
          <PageItem key={`pg-sl-${x + 1}`} number={x + 1} currentPage={currentPage} gotoPage={gotoPage} />
        ))}
      </ul>
    );
  } else {
    return (
      <ul className="pagination-list">
        <li><span className="pagination-ellipsis">{limit}/page</span></li>
        {[...Array(4).keys()].map(x => (
          <PageItem key={`pg-sl-${x + 1}`} number={x + 1} currentPage={currentPage} gotoPage={gotoPage} />
        ))}
        <li><span className="pagination-ellipsis">&hellip;</span></li>
        {[...Array(4).keys()].reverse().map(x => (
          <PageItem key={`pg-sl-${totalPages - x}`} number={totalPages - x} currentPage={currentPage} gotoPage={gotoPage} />
        ))}
      </ul>
    );
  }
}


const Paginator = ({isReady, count, limit, offset, handleNext, handlePrevious, gotoPage}) => {
  if (!isReady) {
    return null;
  }

  return (
    <div id="paginator">
      <nav className="pagination" role="navigation" aria-label="pagination">
        {offset < limit ? (
          <a className="pagination-previous" disabled>Previous</a>
        ) : (
          <a className="pagination-previous" onClick={handlePrevious}>Previous</a>
        )}
        {offset + limit >= count ? (
          <a className="pagination-next" disabled>Next page</a>
        ) : (
          <a className="pagination-next" onClick={handleNext}>Next page</a>
        )}
        <PageSlots count={count} limit={limit} offset={offset} gotoPage={gotoPage} />
      </nav>
    </div>
  );
}


const mapStateToProps = (state, props) => {
  let {sourceId, tableName} = props.match.params;
  sourceId = parseInt(sourceId);
  const _browserCacheKey = `${sourceId}/${tableName}`;
  let isReady = false;
  if (state.querySpecification.isReady && state.querySpecification._cacheKey === _browserCacheKey) {
    isReady = true;
  }

  if (isReady) {
    return {
      isReady,
      sourceId,
      tableName,
      count: state.querySpecification.count,
      limit: state.querySpecification.limit,
      offset: state.querySpecification.offset,
    };
  } else {
    return {
      isReady,
    };
  }
}


export default withRouter(connect(
  mapStateToProps,
  {
    handleNext: event => {
      event.preventDefault();
      return nextPage();
    },

    handlePrevious: event => {
      event.preventDefault();
      return previousPage();
    },

    gotoPage,
  }
)(Paginator));