import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { Size } from '../../../common/constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import PieChart from '../../../common/PieChart';
import subscriptions from '../../../subscriptions';

import { COLORS, LABELS, PIE_OPTIONS, SUBSCRIPTIONS, DISPLAY_FORMATS } from './constants';

import './PressureLossApp.css';

class PressureLossApp extends Component {

  render() {
    return (
      this.data ?
        <div className="c-hydraulics-pressure-loss">
          <div className="row chart-panel">
            <div className="col s12">
              <PieChart
                data={this.graphData}
                showTooltipInPercentage={this.showTooltipInPercentage()}
                unit={this.displayUnit}
                pieOptions={this.pieOptions}
                size={this.props.size}
                showLegend={true}
                name='Pressure Loss'>
              </PieChart>
            </div>
          </div>
        </div> :
        <LoadingIndicator />
    );
  }

  get data() {
    return subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS);
  }

  get graphData() {
    return this.data
      .getIn(['data', 'percentages'])
      .map(datum => ({
        name: LABELS[datum.get('type')],
        y: this.props.convert.convertValue(datum.get('pressure_loss'), 'pressure', 'psi').fixFloat(1),
        color: COLORS[datum.get('type')]
      }));
  }

  showTooltipInPercentage() {
    return this.props.displayFormat === 'percent';
  }

  get displayUnit() {
    return this.showTooltipInPercentage() ? '%' : ' ' + this.props.convert.getUnitDisplay("pressure");
  }

  /**
   * Get the pie options.
   *
   * The pie options are a combination of static and dynamic data.
   */
  get pieOptions() {
    return Object.assign(PIE_OPTIONS, {
      dataLabels: this.dataLabels,
      showInLegend: this.showInLegend
    });
  }

  /**
   * Get the data labels for larger sizes.
   *
   * Data labels get clipped at smaller sizes so only show them when displayed
   * in a larger mode.
   */
  get dataLabels() {
    if (this.showInLegend) {
      const format = this.showTooltipInPercentage() ? '{percentage:.1f}' : '{y}';
      return {
        enabled: true,
        color: '#fff',
        distance: 10,
        format: format
      };
    } else {
      return { enabled: false };
    }
  }

  /**
   * Decide when to show the legend.
   *
   * At smaller sizes, the legend would completely overlap the pie area.
   */
  get showInLegend() {
    return this.props.size === Size.LARGE || this.props.size === Size.XLARGE;
  }

}

PressureLossApp.propTypes = {
  data: ImmutablePropTypes.map,
  displayFormat: PropTypes.string,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired
};

PressureLossApp.defaultProps = {
  displayFormat: DISPLAY_FORMATS[1].value,
};

export default PressureLossApp;