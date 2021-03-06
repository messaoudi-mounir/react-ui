import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Chart from '../../../common/Chart';
import ChartSeries from '../../../common/ChartSeries';

import { SUBSCRIPTIONS ,SUPPORTED_CHART_SERIES } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './TortuosityIndexApp.css';

class TortuosityIndexApp extends Component {
  render() {
    return (
      <div className="c-di-tortuosity">
        {subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS) ?
          <Chart
            xField="measured_depth"
            chartType="line"
            size={this.props.size}
            coordinates={this.props.coordinates}
            widthCols={this.props.widthCols}
            automaticOrientation={this.automaticOrientation}
            horizontal={this.horizontal}
            gridLineWidth="1"
            xAxisWidth={2}
            xAxisColor="#fff"
            yAxisWidth={2}
            yAxisColor="#fff"
            xAxisTitle={{
              text: "Measure Depth",
              style: {
                color: "#fff"
              }
            }}
            yPlotLines={[{
              color: '#FF0000', 
              dashStyle: 'dash', 
              value: this.props.limit || 15, 
              width: 3,
              label: { 
                text: `Safe Limit`, 
                align: 'top',
                verticalAlign: 'middle',
                style: {
                  color: "#FFFFFF"
                },
                x: 20,
                y: 20
              }
            }]}
            yAxisTitle={{
              text: "Dogleg Severity",
              style: {
                color: "#fff"
              }
            }}
            >
            {this.getSeries().map(({renderType, title, field, data}, idx) => (
              <ChartSeries
                type={renderType}
                key={field}
                id={field}
                title={title}
                data={data}
                yField={field}
                dashStyle={"Solid"}
                color={this.getSeriesColor(field)}
                />
            ))}
          </Chart> :
          <LoadingIndicator />}
      </div>
    );
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    return !!(
        (nextProps.data && !nextProps.data.equals(this.props.data)) ||
        (nextProps.coordinates && !nextProps.coordinates.equals(this.props.coordinates)) ||
        (nextProps.graphColors && !nextProps.graphColors.equals(this.props.graphColors)) ||
        (nextProps.limit !== this.props.limit) ||
        (nextProps.orientation !== this.props.orientation)
    );
  }

  getSeries() {
    let data = subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS).getIn(['data', 'stations']);
    data = this.props.convert.convertImmutables(data, 'measured_depth', 'length' ,'ft');
    return Object.keys(SUPPORTED_CHART_SERIES)
      	.map(field => this.getDataSeries(field, data));
  }

  getDataSeries(field, data) {
    return {
      renderType: 'line',
      title: field,
      field,
      data: data
    };
  }

  getSeriesColor(field) {
    if (this.props.graphColors && this.props.graphColors.has(field)) {
      return this.props.graphColors.get(field);
    }
    return SUPPORTED_CHART_SERIES[field].defaultColor;
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

TortuosityIndexApp.propTypes = {
  data: ImmutablePropTypes.map,
  title: PropTypes.string,
  limit: PropTypes.number,
};

export default TortuosityIndexApp;

