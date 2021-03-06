import { List,Map } from 'immutable';

export const CATEGORY = 'settings';
export const NAME = 'fluidChecks';
export const SUBSCRIPTIONS = [];
export const METADATA = {
  title: 'Fluid Checks',
  settingsTitle: 'Fluid Checks',
  subtitle: 'Drilling fluid rheological properties',
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v2.1',
  publishedAt: '2016-07-01T00:00:00',
  isHiddenFromAddApp: true
};
export const SUPPORTED_ASSET_TYPES = ['well'];
export const FLUID_CHECK_DATA_TEMPLATE = Map({viscosity: Map({rpm_readings: List()})});