import { ColumnManagementModalColumn } from '@patternfly/react-component-groups';
import inventoryColumns from './inventory/columnDefinitions';
import { System } from '../hooks/useSystemsQuery';
import { Resolve } from '../../../types/utility-types';

type RenderableColumn = {
  readonly renderCell: (system: System) => React.ReactNode;
};

type SortableColumn = {
  readonly sortBy?: string;
};

export type Column = Resolve<
  ColumnManagementModalColumn & RenderableColumn & SortableColumn
>;

/**
 * Default Systems View columns, merged in order from each integrated app.
 *
 * To add an app: import its `./<appId>/columnDefinitions` default export and append
 * with `...thatAppsColumns` (or insert where the column order should appear).
 */
const allColumns = [...inventoryColumns];

export type SortBy = Extract<
  (typeof allColumns)[number],
  { sortBy: string }
>['sortBy'];

export default allColumns;
