import { ColumnManagementModalColumn } from '@patternfly/react-component-groups';
import inventoryColumns from './inventory/columnDefinitions';
import { System } from '../hooks/useSystemsQuery';

/**
 * Default Systems View columns, merged in order from each integrated app.
 *
 * To add an app: import its `./<appId>/columnDefinitions` default export and append
 * with `...thatAppsColumns` (or insert where the column order should appear).
 */
type RenderableColumn = {
  readonly renderCell: (system: System) => React.ReactNode;
};

type SortableColumn = {
  readonly sortBy?: string;
};

export type Column = ColumnManagementModalColumn &
  RenderableColumn &
  SortableColumn;

const allColumns = [...inventoryColumns];

export type SortBy = Extract<
  (typeof allColumns)[number],
  { sortBy: string }
>['sortBy'];

export default allColumns;
