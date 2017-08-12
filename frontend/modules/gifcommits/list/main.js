import React from "react";
import PropTypes from "prop-types";

import InfiniteLoader from "react-virtualized/dist/commonjs/InfiniteLoader";
import List from "react-virtualized/dist/commonjs/List";
import Gifcommit from "../item/main";

const Main = ({ hasNextPage, isNextPageLoading, list, loadNextPage }) => {
  const rowCount = hasNextPage ? list.length + 1 : list.length;

  const loadMoreRows = isNextPageLoading ? () => {} : loadNextPage;

  const isRowLoaded = ({ index }) => !hasNextPage || index < list.length;

  const rowRenderer = ({ index, key, style }) => {
    let content;

    if (!isRowLoaded({ index })) {
      content = "Loading...";
    } else {
      content = <Gifcommit data={list[index]} />;
    }

    return (
      <div key={key} style={style}>
        {content}
      </div>
    );
  };

  rowRenderer.propTypes = {
    index: PropTypes.number,
    key: PropTypes.number,
    style: PropTypes.object
  };

  return (
    <InfiniteLoader
      isRowLoaded={isRowLoaded}
      loadMoreRows={loadMoreRows}
      rowCount={rowCount}
    >
      {({ onRowsRendered, registerChild }) => (
        <List
          ref={registerChild}
          onRowsRendered={onRowsRendered}
          rowRenderer={rowRenderer}
          height={2000}
          width={600}
          rowHeight={600}
          rowCount={rowCount}
          style={{
            margin: "0 auto"
          }}
        />
      )}
    </InfiniteLoader>
  );
};

Main.propTypes = {
  hasNextPage: PropTypes.bool,
  isNextPageLoading: PropTypes.bool,
  list: PropTypes.array,
  loadNextPage: PropTypes.func
};

export default Main;
