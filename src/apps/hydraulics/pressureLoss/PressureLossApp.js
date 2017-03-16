import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Input } from 'react-materialize';
import { format as formatDate } from 'date-fns';

import { SUBSCRIPTIONS, ACTIVITY_COLORS, PERIOD_TYPES } from './constants';
import PieChart from '../../../common/PieChart';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './PressureLossApp.css'

class PressureLossApp extends Component {

  render() {
    return (
      this.getData() ?
        <div className="c-ra-rig-activity">
          <div className="row chart-panel">
            <div className="col s12">
              {this.renderCombinedChart()}
            </div>
          </div>
          <div className="row action-panel">
            <div className="col s12">
              <Input
                className="select-period"
                type="select"
                value={this.props.period}
                onChange={e => this.onChangePeriod(e)}>
                {PERIOD_TYPES.map(item =>
                  <option value={item.value} key={item.value}>
                    {item.label}
                  </option>
                )}
              </Input>
              <span className="text-info">
                {this.formatDatePeriod()}
              </span>
            </div>
          </div>
        </div> :
        <LoadingIndicator />
    );
  }

  getData() {
    return subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS);
  }

  formatDatePeriod() {
    const start_date = new Date(this.getData().getIn(['data', 'start_timestamp']) * 1000);
    const end_date = new Date(this.getData().getIn(['data', 'end_timestamp']) * 1000);
    return formatDate(start_date, 'M/D h:mm') + " - " + formatDate(end_date, 'M/D h:mm');
  }

  onChangePeriod(event) {
    const currentValue = event.target.value && parseInt(event.target.value, 10);
    this.props.onSettingChange('period', currentValue);
  }

  getGraphData(shift) {
    return this.getData()
    .getIn(['data', 'activities'])
    .map(h => ({
      "name": h.get('name'),
      "y": shift === 'combined' ? h.get('day') + h.get('night') : h.get(shift),
      "color": ACTIVITY_COLORS[h.get('name')]
    }));
  }

  renderCombinedChart() {
    return <PieChart
      data={this.getGraphData('combined')}
      title='Combined'
      titleAlign='left'
      titleVerticalAlign='bottom'
      showTooltipInPercentage={this.showTooltipInPercentage()}
      unit={this.getDisplayUnit()}
      name='Rig Activity'>
    </PieChart>;
  }

  showTooltipInPercentage() {
    return this.props.displayFormat === 'percent' ? true : false;
  }

  getDisplayUnit() {
    return this.props.displayFormat === 'percent' ? '%' : 'hr';
  }
}

PressureLossApp.propTypes = {
  data: ImmutablePropTypes.map,
  period: PropTypes.number,
  displayFormat: PropTypes.string,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired
};

export default PressureLossApp;
