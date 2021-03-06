import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { find } from 'lodash';
import numeral from 'numeral';
import { distanceInWordsToNow } from 'date-fns';
import Immutable from 'immutable';

import { SUBSCRIPTIONS, SUPPORTED_CHART_SERIES } from './constants';
import { SUPPORTED_TRACES } from '../constants';

import Chart from '../../../common/Chart';
import ChartSeries from '../../../common/ChartSeries';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './MultiTraceApp.css';

const [ latestSubscription, summarySubscription ] = SUBSCRIPTIONS;

class MultiTraceApp extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    if (Immutable.Iterable.isIterable(this.props.data)) {
      return !this.props.data.equals(nextProps.data);
    }
    return false;
  }

  getSummaryData() {
    let summary = this.getTraceSummary(this.props);
    summary = summary.map(s => s.update('timestamp', t => new Date(t * 1000)));
    summary = summary.sortBy(s => s.get('timestamp'));
    summary = summary.map(itm => itm.merge(itm.get('data')).delete('data'));
    summary = summary.sortBy(s => s.get('timestamp'));
    return summary;
  }

  render() {
    return (
      <div className="c-trace-multi">
        {this.getLatestTraceRecord() ?
          this.renderLatestTraces() :
          <LoadingIndicator />}
        {this.getTraceSummary(this.props) ?
          this.renderTraceSummaryGraph() :
          <LoadingIndicator />}
        {this.getTraceSummary(this.props) && this.renderTraceSummaryGraphRanges()}
      </div>
    );
  }

  renderLatestTraces() {
    return this.getTraceKeys().map((trace) => {

      // Formatting the units to display properly.
      let traceSpec = this.getTraceSpec(trace);
      let unitDisplay = traceSpec.unit;
      if (traceSpec.hasOwnProperty("unitType") && unitDisplay.includes("{u}")) {
        traceSpec.unit = unitDisplay.replace('{u}', this.props.convert.getUnitDisplay(traceSpec.unitType));
      }

      return (<div className="c-trace-multi__latest"
           key={`latest-${trace}`}
           onClick={() => this.props.isTraceChangeSupported && this.props.onTraceChangeRequested(trace)}>
        <div className="c-trace-multi__latest__trace">
          <div className="c-trace-multi__latest__trace-name">
            {traceSpec.label}
          </div>
          <div className="c-trace-multi__latest__trace-unit">
            {traceSpec.unit}
          </div>
        </div>
        <div className="c-trace-multi__latest__value">
          {this.props[trace] && numeral(this.getLatestTraceValue(trace, traceSpec)).format('0.0a')}
        </div>
        <div className="c-trace-multi__latest__color-indicator">
          <div className="c-trace-multi__latest__color-indicator-inner"
               style={{borderRightColor: this.getSeriesColor(trace)}}></div>
          <div className="c-trace-multi__latest__color-indicator-outer"></div>
        </div>
      </div>);
    });
  }

  renderTraceSummaryGraph() {
    let summary = this.getSummaryData();
    return <div className="c-trace-multi__graph">
      <Chart
        multiAxis
        xField="timestamp"
        automaticOrientation={false}
        size={this.props.size}
        widthCols={this.props.widthCols}
        noSpacing={this.props.noSpacing}
        xAxisLabelFormatter={(...a) => this.formatDate(...a)}>
        {this.getActiveTraceKeys().map(trace => {
          const spec = this.getTraceSpec(trace);

          // Performing unit conversion.
          if (spec.hasOwnProperty('unitType')) {
            summary = this.props.convert.convertImmutables(summary, this.props[trace], spec.unitType, spec.cunit);
          }

          return <ChartSeries
            dashStyle='Solid'
            lineWidth={1}
            key={trace}
            id={trace}
            yAxis={trace}
            title={spec.label}
            minValue={spec.min}
            maxValue={spec.max}
            data={summary}
            yField={this.props[trace]}
            color={this.getSeriesColor(trace)} />;
        })}
      </Chart>
    </div>;
  }

  renderTraceSummaryGraphRanges() {
    return <div className="c-trace-multi__ranges">
      {this.getActiveTraceKeys().map(trace => (
        <div className="c-trace-multi__range"
             style={{borderBottomColor: this.getSeriesColor(trace)}}
             key={`range-${trace}`}>
          <span className="c-trace-multi__range-min">{this.getTraceSpec(trace).min}</span>
          <span className="c-trace-multi__range-max">{this.getTraceSpec(trace).max}</span>
          <div className="c-trace-multi__range-label">{this.getTraceSpec(trace).label}</div>
        </div>
      ))}
    </div>;
  }

  formatDate(d, isFirst, isLast) {
    return isFirst || isLast ?
      distanceInWordsToNow(new Date(d)) + ' ago' :
      '';
  }

  getTraceSpec(trace) {
    return find(SUPPORTED_TRACES, {trace: this.props[trace]}) || {};
  }

  getLatestTraceRecord() {
    return subscriptions.selectors.getSubData(this.props.data, latestSubscription);
  }

  getLatestTraceValue(trace, spec) {
    const traceKey = this.props[trace];
    let value = this.getLatestTraceRecord().getIn(['data', traceKey]);
    if (spec.hasOwnProperty("unitType")) {
      value = this.props.convert.convertValue(value, spec.unitType, spec.cunit);
    }
    return value;
  }

  getTraceSummary(props) {
    return subscriptions.selectors.getSubData(props.data, summarySubscription, false);
  }

  getSeriesColor(trace) {
    if (this.props.graphColors && this.props.graphColors.has(trace)) {
      return this.props.graphColors.get(trace);
    } else {
      return SUPPORTED_CHART_SERIES[trace].defaultColor;
    }
  }

  getTraceKeys() {
    return ['trace1', 'trace2', 'trace3'];
  }

  getActiveTraceKeys() {
    return this.getTraceKeys()
      .filter(k => this.props[k]);
  }

}

MultiTraceApp.propTypes = {
  data: ImmutablePropTypes.map,
  trace1: PropTypes.string,
  trace2: PropTypes.string,
  trace3: PropTypes.string,
  graphColors: ImmutablePropTypes.map,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired,
  noSpacing: PropTypes.bool,
  isTraceChangeSupported: PropTypes.bool,
  onTraceChangeRequested: PropTypes.func
};

export default MultiTraceApp;
