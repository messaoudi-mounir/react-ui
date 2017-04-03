import {Component, PropTypes} from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

class ChartSeries extends Component {
}

ChartSeries.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string,
  data: ImmutablePropTypes.list.isRequired,
  yField: PropTypes.string,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  title: PropTypes.string,
  color: PropTypes.string,
  dashStyle: PropTypes.string,
  lineSize: PropTypes.string,
  pointPadding: PropTypes.number,
  groupPadding: PropTypes.number,
  borderWidth: PropTypes.number,
  marker: PropTypes.object,
  yAxis: PropTypes.number,
  yAxisOpposite: PropTypes.bool,
  yAxisTitle: PropTypes.object
};

export default ChartSeries;