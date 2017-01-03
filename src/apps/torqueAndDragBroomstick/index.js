import { List, Map } from 'immutable';

import TorqueAndDragBroomstickApp from './TorqueAndDragBroomstickApp';
import TnDChartColorsSettingEditor from './TnDChartColorsSettingEditor';
import * as constants from './constants';

export default {
  AppComponent: TorqueAndDragBroomstickApp,
  settingsEditors: List([
    Map({
      name: 'graphColors',
      title: 'Graph Colors',
      required: false,
      Editor: TnDChartColorsSettingEditor
    })
  ]),
  constants
};