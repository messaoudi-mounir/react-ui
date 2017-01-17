import React, { Component, PropTypes } from 'react';
import { List } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS, SUPPORTED_CHART_SERIES } from './constants';
import Chart from '../../../common/Chart';
import ChartSeries from '../../../common/ChartSeries';
import LoadingIndicator from '../../../common/LoadingIndicator';

import './BroomstickApp.css'

class BroomstickApp extends Component {

  constructor(props) {
    super(props);
    this.state = {series: List()};
  }

  render() {
    return (
      <div className="c-tnd-broomstick">
        {this.getData() ?
          <Chart
            xField="measured_depth"
            size={this.props.size}
            widthCols={this.props.widthCols}>
            {this.getSeries().map(({renderType, title, type, data}, idx) => (
              <ChartSeries
                key={title}
                id={title}
                type={renderType}
                title={title}
                data={data}
                yField="hookload"
                color={this.getSeriesColor(type)} />
            )).toJS()}
          </Chart> :
          <LoadingIndicator />}
      </div>
    );
  }

  getData() {
    return this.props.data && this.props.data.get(SUBSCRIPTIONS[0]);
  }

  getSeries() {
    return this.getPredictedCurveSeries()
      .concat(this.getActualSeries());
  }

  getPredictedCurveSeries() {
    return this.getData().getIn(['data', 'curves'])
      .entrySeq()
      .flatMap(([curveType, curves]) =>
        curves.map(curve => ({
          renderType: 'line',
          title: `${SUPPORTED_CHART_SERIES[curveType].label} ${curve.get('casing_friction_factor')} ${curve.get('openhole_friction_factor')}`,
          type: curveType,
          data: curve.get('points')
        }))
      );
  }

  getActualSeries() {
    return this.getData().getIn(['data', 'actual'])
      .entrySeq()
      .map(([curveType, points]) => ({
        renderType: 'scatter',
        title: SUPPORTED_CHART_SERIES[curveType].label,
        type: curveType,
        data: points
      }));
  }

  getSeriesColor(seriesType) {
    if (this.props.graphColors && this.props.graphColors.has(seriesType)) {
      return this.props.graphColors.get(seriesType);
    } else {
      return SUPPORTED_CHART_SERIES[seriesType].defaultColor;
    }
  }

}

BroomstickApp.propTypes = {
  data: ImmutablePropTypes.map,
  graphColors: ImmutablePropTypes.map,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired
};

export default BroomstickApp;