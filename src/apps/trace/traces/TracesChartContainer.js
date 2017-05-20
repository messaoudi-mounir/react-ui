import React, { Component, PropTypes } from 'react';
import { List, Range } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Row } from 'react-materialize';

import TracesChartColumn from './TracesChartColumn';
import Convert from '../../../common/Convert';
import TracesSettingsDialog from './TracesSettingsDialog';

import './TracesChartContainer.css';

class TracesChartContainer extends Component {

  constructor(props) {
    super(props);
    this.openSettingsDialog = this.openSettingsDialog.bind(this);
  }

  render() {
    let columnCount = this.props.traceColumnCount !== undefined ? this.props.traceColumnCount : 4;
    let columns = Array.apply(null, {length: columnCount}).map(Number.call, Number);
    return <Row s={12} className="c-traces__container">
      {columns.map((group) => (
        <TracesChartColumn
          key={group}
          data={this.props.data}
          latestData={this.props.latestData}
          traceGraphs={this.getTraceGraphGroup(group)}
          traceRowCount={this.props.traceRowCount}
          supportedTraces={this.props.supportedTraces}
          convert={this.props.convert}
          columnNumber={group}
          totalColumns={columnCount}
          editTraceGraph={(traceEditIndex) => this.openSettingsDialog(traceEditIndex)}
          widthCols={this.props.widthCols} />
      ))}
      <TracesSettingsDialog
        ref={(input) => this.traceSettingsDialog = input}
        supportedTraces={this.props.supportedTraces}
        traceGraphs={this.props.traceGraphs}
        convert={this.props.convert}
        onSettingChange={this.props.onSettingChange} />
    </Row>;
  }

  getTraceGraphGroup(number) {
    let rowCount = this.props.traceRowCount !== undefined ? this.props.traceRowCount : 3;
    return Range(0, this.props.traceGraphs.size, rowCount)
      .map(chunkStart => this.props.traceGraphs.slice(chunkStart, chunkStart + rowCount))
      .get(number, List());
  }

  openSettingsDialog(traceEditIndex) {
    this.traceSettingsDialog.openDialog(traceEditIndex);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.traceGraphs.equals(nextProps.traceGraphs)
      || this.props.latestData.equals(nextProps.latestValue)
      || this.props.data.equals(nextProps.data)
      || this.props.traceRowCount !== nextProps.traceRowCount
      || this.props.traceColumnCount !== nextProps.traceColumnCount;
  }
}

TracesChartContainer.propTypes = {
  convert: React.PropTypes.instanceOf(Convert).isRequired,
  supportedTraces: PropTypes.array.isRequired,
  traceGraphs: ImmutablePropTypes.list.isRequired,
  data: ImmutablePropTypes.list.isRequired,
  latestData: ImmutablePropTypes.map.isRequired,
  widthCols: PropTypes.number.isRequired,
  onSettingChange: PropTypes.func.isRequired,
  traceColumnCount: PropTypes.number,
  traceRowCount: PropTypes.number,
};

export default TracesChartContainer;
