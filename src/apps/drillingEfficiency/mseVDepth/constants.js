export const CATEGORY = 'drillingEfficiency';
export const NAME = 'mse';
export const SUBSCRIPTIONS = [
  {devKey: 'corva', collection: 'drilling-efficiency.mse'}
];
export const METADATA = {
  title: 'MSE v Depth',
  settingsTitle: 'MSE v Depth',
  subtitle: '',
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v2.1',
  publishedAt: '2016-07-01T00:00:00'
};
export const SUPPORTED_ASSET_TYPES = ['rig'];
export const INITIAL_SIZE = {w: 4, h: 20};
export const SUPPORTED_CHART_SERIES = {
  surface: {label: 'Surface', defaultColor: '#e62000', subType: 'mse'},
  downhole: {label: 'Downhole', defaultColor: '#00d3f4', subType: 'mse'},
  ucs: {label: 'UCS', defaultColor: '#009585', subType: 'ucs'},
  rop_average: {label: 'ROP Average', defaultColor: '#78905f', subType: 'rop_average'}
};