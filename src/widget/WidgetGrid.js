import React, { Component } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import moment from 'moment';
import { List } from 'immutable';

import WidgetContainer from './WidgetContainer';
import torqueAndDragBroomstick from './torqueAndDragBroomstick';
import { Size } from './constants';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './WidgetGrid.css';

const GridLayout = WidthProvider(Responsive);

class WidgetGrid extends Component {

  constructor(props) {
    super(props);
    // This data will later come from an API
    this.state = {
      widgets: List([{
        id: '1',
        title: 'Broomstick',
        gridConfig: {x: 0, y: 0, w: 3, h: 14},
        WidgetComponent: torqueAndDragBroomstick.Widget
      }, {
        id: '2',
        gridConfig: {x: 3, y: 0, w: 2, h: 4}
      }, {
        id: '3',
        gridConfig: {x: 3, y: 4, w: 2, h: 4}
      }, {
        id: '4',
        gridConfig: {x: 3, y: 8, w: 2, h: 4} 
      }, {
        id: '5',
        gridConfig: {x: 5, y: 0, w: 3, h: 5}
      }, {
        id: '6',
        gridConfig: {x: 5, y: 5, w: 1, h: 7}
      }, {
        id: '7',
        gridConfig: {x: 6, y: 5, w: 2, h: 7} 
      }])
    };
  }

  render() {
    const widgetProps = {wellId: 1016, time: moment('2016-08-31')};
    return (
      <div className="c-widget-grid">
        <GridLayout breakpoints={{large: 1024, medium: 512, small: 0}}
                    cols={{large: 8, medium: 4, small: 1}}
                    rowHeight={30}
                    onResizeStop={(...args) => this.onResizeStop(...args)}>
          {this.renderGridWidgets(widgetProps)}
        </GridLayout>
        {this.renderMaximizedWidget(widgetProps)}
      </div>
    );
  }

  renderGridWidgets(widgetProps) {
    const maximizedId = this.getMaximizedWidgetId();
    return this.state.widgets
      .filter(widget => widget.id !== maximizedId)
      .map(({id, title, gridConfig, WidgetComponent}) => {
        return <div key={id} data-grid={gridConfig}>
          <WidgetContainer id={id} title={title}>
            {WidgetComponent &&
              <WidgetComponent {...widgetProps}
                               size={this.getWidgetSize(gridConfig)} />}
          </WidgetContainer>
        </div>
      });
  }

  renderMaximizedWidget(widgetProps) {
    const id = this.getMaximizedWidgetId();
    if (id) {
      const {WidgetComponent, title} = this.state.widgets.find(w => w.id === id);
      return <div className="MaximizedWidget">
        <WidgetContainer id={id} title={title} maximized={true}>
          {WidgetComponent && <WidgetComponent {...widgetProps} size={Size.XLARGE} />}
        </WidgetContainer>;
      </div>
    } else {
      return null;
    }
  }

  getWidgetSize(gridConfig) {
    if (gridConfig.w >= 5) {
      return Size.LARGE;
    } else if (gridConfig.w >= 3) {
      return Size.MEDIUM;
    } else {
      return Size.SMALL;
    }
  }

  getMaximizedWidgetId() {
    return this.props.location.query.maximize;
  }

  onResizeStop(layout, oldItem, {i, w, h}) {
    this.setState(state => {
      const widgetIndex = state.widgets.findIndex(w => w.id === i);
      const widget = state.widgets.get(widgetIndex);
      const gridConfig = {...widget.gridConfig, w, h};
      return {
        widgets: state.widgets.set(widgetIndex, {...widget, gridConfig})
      }
    });
  }

}

export default WidgetGrid;
