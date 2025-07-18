import React from 'react';
import {
  CheckCircleIcon,
  OutlinedArrowAltCircleDownIcon,
  OutlinedArrowAltCircleUpIcon,
  OutlinedQuestionCircleIcon,
  TimesIcon,
} from '@patternfly/react-icons';
import { sortable } from '@patternfly/react-table';
import { Tooltip } from '@patternfly/react-core';

export const statusHelper = {
  UP: (
    <Tooltip content="Service is running">
      <OutlinedArrowAltCircleUpIcon className="ins-c-inventory__detail--up" />
    </Tooltip>
  ),
  DOWN: (
    <Tooltip content="Service has stopped">
      <OutlinedArrowAltCircleDownIcon className="ins-c-inventory__detail--down" />
    </Tooltip>
  ),
};

export const enabledHelper = {
  true: (
    <Tooltip content="Source enabled">
      <CheckCircleIcon className="ins-c-inventory__detail--enabled" />
    </Tooltip>
  ),
  false: (
    <Tooltip content="Source disabled">
      <TimesIcon className="ins-c-inventory__detail--disabled" />
    </Tooltip>
  ),
};

export const diskMapper = (devices = []) => ({
  cells: [
    {
      title: 'Device',
      transforms: [sortable],
    },
    {
      title: 'Label',
      transforms: [sortable],
    },
    {
      title: 'Mount point',
      transforms: [sortable],
    },
    {
      title: 'Type',
      transforms: [sortable],
    },
  ],
  rows: devices.map(({ device, label, mountpoint, options, mounttype }) => {
    const calculatedOptions = (options && options.options) || options;
    return {
      isOpen: false,
      child: (
        <div>
          {calculatedOptions &&
            Object.entries(calculatedOptions.value || calculatedOptions)
              .map(([oneKey, option]) => `${oneKey}=${option.value || option}`)
              .join(',  ')}
        </div>
      ),
      cells: [
        (device && device.value) || device,
        label,
        (mountpoint && mountpoint.value) || mountpoint,
        (mounttype && mounttype.value) || mounttype,
      ],
    };
  }),
  expandable: true,
});

export const productsMapper = (products = []) => ({
  cells: [
    {
      title: 'Name',
      transforms: [sortable],
    },
    'Status',
  ],
  rows: products.map((product) => [
    product.name,
    {
      title: statusHelper[product.status] || (
        <Tooltip content="Unknown service status">
          <OutlinedQuestionCircleIcon className="ins-c-inventory__detail--unknown" />
        </Tooltip>
      ),
    },
  ]),
});

export const interfaceMapper = (data = []) => ({
  cells: [
    {
      title: 'MAC address',
      transforms: [sortable],
    },
    {
      title: 'MTU',
      transforms: [sortable],
    },
    {
      title: 'Name',
      transforms: [sortable],
    },
    'State',
    {
      title: 'Type',
      transforms: [sortable],
    },
  ],
  rows: data.map((item) => [
    item.mac_address,
    item.mtu,
    item.name,
    {
      title: statusHelper[item.state] || (
        <Tooltip content="Unknown service status">
          <OutlinedQuestionCircleIcon className="ins-c-inventory__detail--unknown" />
        </Tooltip>
      ),
    },
    item.type,
  ]),
});

export const repositoriesMapper = (
  { enabled, disabled } = { enabled: [], disabled: [] },
) => ({
  cells: [
    {
      title: 'Name',
      transforms: [sortable],
    },
    {
      title: 'Enabled',
      transforms: [sortable],
    },
    {
      title: 'GPG check',
      transforms: [sortable],
    },
  ],
  rows: [...enabled, ...disabled].map((repository) => [
    {
      title: repository.name,
      sortValue: repository.name,
    },
    {
      title: enabledHelper[Boolean(repository.enabled)],
      sortValue: `${repository.enabled}`,
    },
    {
      title: enabledHelper[Boolean(repository.gpgcheck)],
      sortValue: `${repository.gpgcheck}`,
    },
  ]),
  filters: [
    { type: 'text' },
    {
      type: 'checkbox',
      options: [
        { label: 'Is enabled', value: 'true' },
        { label: 'Not enabled', value: 'false' },
      ],
    },
    {
      type: 'checkbox',
      options: [
        { label: 'Is enabled', value: 'true' },
        { label: 'Not enabled', value: 'false' },
      ],
    },
  ],
});

export const generalMapper = (data = [], title = '') => ({
  cells: [
    {
      title,
      transforms: [sortable],
    },
  ],
  rows: data.map((item) => [item]),
  filters: [{ type: 'text' }],
});

export const workloadsDataMapper = ({
  data = [],
  fieldKeys = [],
  columnTitles,
} = {}) => {
  const toTitleCase = (str) =>
    str
      .replace(/_/g, ' ')
      .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1));

  const isSingleColumn = fieldKeys.length === 0;

  const getCells = () => {
    if (
      columnTitles !== undefined &&
      columnTitles.length === fieldKeys.length
    ) {
      return columnTitles.map((title) => ({ title }));
    }

    if (isSingleColumn) {
      return [{ title: 'Value' }];
    }

    return fieldKeys.map((key) => ({ title: toTitleCase(key) }));
  };

  const formatValue = (value) => {
    if (Array.isArray(value)) return value.join(', ');
    if (value === undefined || value === null) return '';
    return value;
  };

  const getRows = () => {
    if (isSingleColumn) {
      return data.map((item) => [item.version]);
    }
    return data.map((item) => fieldKeys.map((key) => formatValue(item[key])));
  };

  return {
    cells: getCells(),
    rows: getRows(),
    filters: [{ type: 'text' }],
  };
};
