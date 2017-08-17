import React from "react";
import PropTypes from "prop-types";

import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import List from "react-virtualized/dist/commonjs/List";
import InfiniteLoader from "react-virtualized/dist/commonjs/InfiniteLoader";
import WindowScroller from "react-virtualized/dist/commonjs/WindowScroller";
import {
  CellMeasurer,
  CellMeasurerCache
} from "react-virtualized/dist/commonjs/CellMeasurer";

import Gifcommit from "../item/main";

const cache = new CellMeasurerCache({
  defaultHeight: 600,
  fixedWidth: true
});

const Main = ({ hasNextPage, isNextPageLoading, list, loadNextPage }) => {
  const rowCount = hasNextPage ? list.length + 1 : list.length;

  const loadMoreRows = isNextPageLoading ? () => {} : loadNextPage;

  const isRowLoaded = ({ index }) => !hasNextPage || index < list.length;

  const rowRenderer = ({ index, key, parent, style }) => {
    return (
      <CellMeasurer
        cache={cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        {({ measure }) => (
          <div key={key} style={style}>
            {!isRowLoaded({ index })
              ? "Loading..."
              : <Gifcommit data={list[index]} index={index} onLoad={measure} />}
          </div>
        )}
      </CellMeasurer>
    );
  };

  rowRenderer.propTypes = {
    index: PropTypes.number,
    key: PropTypes.number,
    style: PropTypes.object,
    parent: PropTypes.node
  };

  return (
    <InfiniteLoader
      isRowLoaded={isRowLoaded}
      loadMoreRows={loadMoreRows}
      rowCount={rowCount}
    >
      {({ onRowsRendered, registerChild }) => (
        <WindowScroller>
          {({ height, scrollTop }) => (
            <AutoSizer disableHeight>
              {({ width }) => (
                <List
                  ref={registerChild}
                  onRowsRendered={onRowsRendered}
                  rowRenderer={rowRenderer}
                  autoHeight
                  height={height}
                  width={width}
                  deferredMeasurementCache={cache}
                  rowHeight={cache.rowHeight}
                  rowCount={rowCount}
                  scrollTop={scrollTop}
                  style={{
                    margin: "0 auto"
                  }}
                />
              )}
            </AutoSizer>
          )}
        </WindowScroller>
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
