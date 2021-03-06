import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { find } from 'lodash';
import numeral from 'numeral';
import { distanceInWordsToNow } from 'date-fns';

import { SUBSCRIPTIONS, SUPPORTED_CHART_SERIES } from './constants';
import { SUPPORTED_TRACES } from '../constants';

import Chart from '../../../common/Chart';
import ChartSeries from '../../../common/ChartSeries';
import LoadingIndicator from '../../../common/LoadingIndicator';
import { Size } from '../../../common/constants';
import subscriptions from '../../../subscriptions';

import './SingleTraceApp.css';

const [ latestSubscription, summarySubscription ] = SUBSCRIPTIONS;

class SingleTraceApp extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.getTraceSummary(this.props) !== this.getTraceSummary(nextProps) ||
      nextProps.trace !== this.props.trace ||
      nextProps.data !== this.props.data ||
      (nextProps.coordinates && !nextProps.coordinates.equals(this.props.coordinates)) ||
      (nextProps.graphColors && !nextProps.graphColors.equals(this.props.graphColors)) ||
      (nextProps.orientation !== this.props.orientation)
    );
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
      <div className="c-trace-single">
        <h4>{this.getTrace().label}</h4>
        {this.hasLatestTrace() ?
          this.renderLatestTrace() :
          <div className="c-trace-single__loading"><LoadingIndicator /></div>}
        {this.renderTraceSummaryGraphArea()}
      </div>
    ); 
  }

  renderLatestTrace() {
    // Formatting the units to display properly.
    let traceSpec = this.getTrace();
    let unitDisplay = traceSpec.unit;
    if (traceSpec.hasOwnProperty("unitType") && unitDisplay.includes("{u}")) {
      traceSpec.unit = unitDisplay.replace('{u}', this.props.convert.getUnitDisplay(traceSpec.unitType));
    }

    return (
      <div className="c-trace-single__latest">
        <span className="c-trace-single__latest__value">
          {this.getLatestTrace(traceSpec)}
        </span>
        <span className="c-trace-single__latest__unit">
          {traceSpec.unit}
        </span>
      </div>
    );
  }

  renderTraceSummaryGraphArea() {
    let small = this.props.coordinates.pixelHeight && (this.props.coordinates.pixelHeight || 0) <= 200 && this.props.size === Size.SMALL;
    if(!small) {
      return this.getTraceSummary(this.props) ? this.renderTraceSummaryGraph() : <LoadingIndicator />;
    }
  }

  renderTraceSummaryGraph() {

    let summary = this.getSummaryData();
    let traceSpec = this.getTrace();

    // Performing unit conversion.
    if (traceSpec.hasOwnProperty('unitType')) {
      summary = this.props.convert.convertImmutables(summary, this.props.trace, traceSpec.unitType, traceSpec.cunit);
    }

    return <div className={"c-trace-single__graph " + (!this.horizontal && "c-trace-single__graph-vertical") }>
      <Chart
        xField="timestamp"
        size={this.props.size}
        yAxisOpposite={true}
        coordinates={this.props.coordinates}
        widthCols={this.props.widthCols}
        xAxisLabelFormatter={(...a) => this.formatDate(...a)}
        automaticOrientation={this.automaticOrientation}
        horizontal={this.horizontal}
        >
        <ChartSeries
          dashStyle='Solid'
          lineWidth={1}
          key={this.props.trace}
          id={this.props.trace}
          title={this.getTrace().label}
          data={summary}
          yField={this.props.trace}
          color={this.getSeriesColor()} />
      </Chart>
    </div>;
  }

  formatDate(d, isFirst, isLast) {
    return isFirst || isLast ?
      distanceInWordsToNow(new Date(d)) + ' ago' :
      '';
  }

  getTrace() {
    return find(SUPPORTED_TRACES, {trace: this.props.trace}) || {};
  }

  hasLatestTrace() {
    return !!subscriptions.selectors.getSubData(this.props.data, latestSubscription);
  }

  getLatestTrace(spec) {
    let trace = subscriptions.selectors.getSubData(this.props.data, latestSubscription);
    if (trace) {
      trace = trace.getIn(['data', this.props.trace]);
      if (spec.hasOwnProperty("unitType")) {
        trace = this.props.convert.convertValue(trace, spec.unitType, spec.cunit);
      }
      return numeral(trace).format('0,0.0');
    }
    return null;
  }

  getTraceSummary(props) {
    return subscriptions.selectors.getSubData(props.data, summarySubscription, false);
  }

  getSeriesColor() {
    if (this.props.graphColors && this.props.graphColors.has('trace')) {
      return this.props.graphColors.get('trace');
    } else {
      return SUPPORTED_CHART_SERIES['trace'].defaultColor;
    }
  }

  get automaticOrientation() {
    return this.props.orientation && this.props.orientation === 'auto';
  }

  get horizontal() {
    if (this.props.orientation) {
      // A weird corner case where coordinates can be undefined creates a scenario
      // where an auto oriented app should also be considered horizontal.
      return this.props.orientation === 'horizontal' || this.props.orientation === 'auto';
    }
    return true;
  }

}

SingleTraceApp.propTypes = {
  data: ImmutablePropTypes.map,
  trace: PropTypes.string.isRequired,
  graphColors: ImmutablePropTypes.map,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired,
  coordinates: ImmutablePropTypes.map,
};

export default SingleTraceApp;
