import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS, SUPPORTED_CHART_SERIES } from './constants';
import Chart from '../../../common/Chart';
import ChartSeries from '../../../common/ChartSeries';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './ConcentrationApp.css';

class ConcentrationApp extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !!(
        (nextProps.data && !nextProps.data.equals(this.props.data)) ||
        (nextProps.coordinates && !nextProps.coordinates.equals(this.props.coordinates)) ||
        (nextProps.graphColors && !nextProps.graphColors.equals(this.props.graphColors)) ||
        (nextProps.orientation !== this.props.orientation)
    );
  }

  render() {
    let title = SUPPORTED_CHART_SERIES['concentration'].label;
    return (
      <div className="c-hydraulics-concentration">
        {this.getData() ?
          <Chart
            xField="measured_depth"
            xAxisWidth="1"
            xAxisColor="white"
            xAxisTitle={{
              text: `Measured Depth (${this.props.convert.getUnitDisplay('length')})`,
              style: {color: '#fff'}
            }}
            size={this.props.size}
            coordinates={this.props.coordinates}
            automaticOrientation={this.automaticOrientation}
            horizontal={this.horizontal}
            widthCols={this.props.widthCols}>
            <ChartSeries
              key={title}
              id={title}
              type="area"
              fillOpacity={0.5}
              lineWidth={2.0}
              title={title}
              data={this.getSeriesData()}
              yField="cuttings_concentration"
              yAxisTitle={{
                text: `Concentration (%)`,
                style: {color: '#fff'}
              }}
              color={this.getSeriesColor('concentration')}
              minValue={0.0}
              maxValue={100.0}
              step={true}
            />
          </Chart> :
          <LoadingIndicator />}
      </div>
    );
  }

  getData() {
    return subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS);
  }

  getSeriesData() {
    let points = this.getData().getIn(['data', 'sections']);
    points = this.props.convert.convertImmutables(points, 'measured_depth', 'length', 'ft');
    points = this.props.convert.convertImmutables(points, 'cuttings_concentration', 'volume', 'gal');
    return points;
  }

  getSeriesColor(seriesType) {
    if (this.props.graphColors && this.props.graphColors.has(seriesType)) {
      return this.props.graphColors.get(seriesType);
    } else {
      return SUPPORTED_CHART_SERIES[seriesType].defaultColor;
    }
  }

  get automaticOrientation() {
    return this.props.orientation && this.props.orientation === 'auto';
  }

  get horizontal() {
    if (this.props.orientation) {
      return this.props.orientation === 'horizontal';
    }
    return true;
  }

}

ConcentrationApp.propTypes = {
  data: ImmutablePropTypes.map,
  graphColors: ImmutablePropTypes.map,
  size: PropTypes.string.isRequired,
  coordinates: PropTypes.object.isRequired,
  widthCols: PropTypes.number.isRequired
};

export default ConcentrationApp;
