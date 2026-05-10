import React from 'react';
import { DataViewTh } from '@patternfly/react-data-view';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { OnSort, SortDirection } from '../SystemsView';
import { getSystemsViewColumnMinWidthStyle } from '../utils/columnMinWidths';
import { STICKY_ACTIONS_HEADER_PROPS } from '../utils/stickyActionsColumn';
import { STICKY_NAME_HEADER_PROPS } from '../utils/stickyNameColumn';
import initialColumns, {
  type SortBy,
  type Column,
} from '../columns/allColumnDefinitions';

const FALLBACK_SORT: { sortBy: SortBy; direction: SortDirection } = {
  sortBy: 'display_name',
  direction: 'asc',
};

interface UseColumnParams {
  sortBy: SortBy;
  onSort: OnSort;
  direction: SortDirection;
  isInventoryViewsEnabled: boolean;
}

export const useColumns = ({
  sortBy,
  onSort,
  direction,
  isInventoryViewsEnabled,
}: UseColumnParams) => {
  const [columns, setColumns] = useState<Column[]>(() =>
    initialColumns.map((col) => ({ ...col })),
  );

  const fromSortByToIndex = useCallback(
    (sortBy?: SortBy) =>
      columns
        .filter((col) => col.isShown)
        .findIndex((col) => col.sortBy === sortBy),
    [columns],
  );

  const tableHeaderNodes: DataViewTh[] = useMemo(
    () => [
      ...columns
        .filter((col) => col.isShown)
        .map((col, index) => {
          return {
            cell: col.title,
            props: {
              ...(col.key === 'name'
                ? isInventoryViewsEnabled
                  ? STICKY_NAME_HEADER_PROPS
                  : {}
                : isInventoryViewsEnabled
                  ? (getSystemsViewColumnMinWidthStyle(col.key) ?? {})
                  : {}),
              ...(col.sortBy && {
                sort: {
                  sortBy: { index: fromSortByToIndex(sortBy), direction },
                  onSort: (
                    _event:
                      | React.MouseEvent
                      | React.KeyboardEvent
                      | MouseEvent
                      | undefined,
                    _columnIndex: number,
                    newDirection: SortDirection,
                  ) => {
                    onSort(undefined, col.sortBy!, newDirection);
                  },
                  columnIndex: index,
                },
              }),
            },
          };
        }),
      {
        cell: '',
        props: isInventoryViewsEnabled
          ? STICKY_ACTIONS_HEADER_PROPS
          : { screenReaderText: 'Actions' },
      },
    ],
    [
      columns,
      fromSortByToIndex,
      sortBy,
      direction,
      onSort,
      isInventoryViewsEnabled,
    ],
  );

  useEffect(() => {
    if (sortBy) {
      const isSortColumnVisible = columns.some(
        (col) => col.sortBy === sortBy && col.isShown,
      );

      if (!isSortColumnVisible) {
        onSort(undefined, FALLBACK_SORT.sortBy!, FALLBACK_SORT.direction);
      }
    }
  });

  return {
    columns,
    setColumns,
    tableHeaderNodes,
  };
};
