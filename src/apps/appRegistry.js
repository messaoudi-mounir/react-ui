import { List, Map } from 'immutable';

// TORQUE AND DRAG APPS
import tndOverview from './torqueAndDrag/overview';
import tndBroomstick from './torqueAndDrag/broomstick';
import tndAxialLoad from './torqueAndDrag/axialLoad';
import tndDownholeTransfer from './torqueAndDrag/downholeTransfer';
import tndFrictionFactor from './torqueAndDrag/frictionFactor';
import tndStress from './torqueAndDrag/stress';
import tndTorque from './torqueAndDrag/torque';

// TRACE APPS
import singleTrace from './trace/singleTrace';
import multiTrace from './trace/multiTrace';
import traceTab from './trace/traceTab';

// SETTINGS APPS
import drillstrings from './settings/drillstrings';
import casing from './settings/casing';

// CONTROL APPS
import wellTimeline from './wellTimeline';

// Apps that can be displayed on dashboard / asset pages, keyed by app type
export const uiApps = Map({
  torqueAndDrag: Map({
    title: 'Torque & Drag',
    subtitle: 'Downhole torque and drag',
    appTypes: Map({
      overview: tndOverview,
      broomstick: tndBroomstick,
      axialLoad: tndAxialLoad,
      downholeTransfer: tndDownholeTransfer,
      frictionFactor: tndFrictionFactor,
      stress: tndStress,
      torque: tndTorque
    })
  }),
  drillingEfficiency: Map({
    title: 'Drilling Efficiency',
    subtitle: 'Downhole drilling efficiency',
    appTypes: Map({
    })
  }),
  trace: Map({
    title: 'Trace',
    subtitle: '',
    appTypes: Map({
      singleTrace,
      multiTrace,
      traceTab
    })
  }),
  settings: Map({
    title: 'Settings',
    subtitle: '',
    appTypes: Map({
      drillstrings,
      casing
    })
  })
});

// Apps that are used as control UIs on asset pages, keyed by asset type
export const controlApps = Map({
  well: List([wellTimeline])
});
