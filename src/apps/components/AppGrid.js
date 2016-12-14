import React, { Component, PropTypes } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import Modal from 'react-modal';
import moment from 'moment';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Button, Glyphicon } from 'react-bootstrap';

import AppContainer from './AppContainer';
import AddAppDialog from './AddAppDialog';
import { Size, GRID_BREAKPOINTS, GRID_COLUMN_SIZES, GRID_ROW_HEIGHT } from '../constants';
import appRegistry from '../appRegistry';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './AppGrid.css';

const GridLayout = WidthProvider(Responsive);

const addAppModalStyles = {
  content: {
    top: '50px',
    left: '0',
    right: '0',
    bottom: '0',
    borderRadius: 0,
    backgroundColor: 'rgb(51, 51, 51)',
    color: 'white',
    border: '0',
    padding: '20px'
  }
};

class AppGrid extends Component {

  constructor(props) {
    super(props);
    this.state = {addAppDialogOpen: false};
  }

  render() {
    const commonAppProps = {
      time: this.props.wellDrillTime || moment('2016-08-31'),
      wellId: this.props.wellId // For well pages, id is given
    };
    return (
      <div className="c-app-grid">
        <GridLayout breakpoints={GRID_BREAKPOINTS}
                    cols={GRID_COLUMN_SIZES}
                    rowHeight={GRID_ROW_HEIGHT}
                    onResizeStop={(...args) => this.onResizeStop(...args)}
                    onDragStop={(...args) => this.onDragStop(...args)}>
          {this.renderGridApps(commonAppProps)}
        </GridLayout>
        {this.renderMaximizedApp(commonAppProps)}
        <Button onClick={() => this.openAddAppDialog()} className="c-app-grid__add-app">
          <Glyphicon glyph="plus" /> Add App
        </Button>
        <Modal
          isOpen={this.state.addAppDialogOpen}
          onRequestClose={() => this.closeAddAppDialog()}
          style={addAppModalStyles}
          contentLabel="Add App to Dashboard">
          <AddAppDialog
            appTypes={appRegistry}
            onAppAdd={type => this.addApp(type)}
            onClose={() => this.closeAddAppDialog()} />
        </Modal>
      </div>
    );
  }

  renderGridApps(commonAppProps) {
    const maximizedId = this.getMaximizedAppId();
    return this.props.apps
      .filter(app => app.get('id') !== maximizedId)
      .map(app => {
        const id = app.get('id');
        const coordinates = app.get('coordinates');
        return <div key={id} data-grid={coordinates.toJS()}>
          {this.renderApp(app, commonAppProps)}
        </div>
      });
  }

  renderMaximizedApp(commonAppProps) {
    const id = this.getMaximizedAppId();
    if (id) {
      const app = this.props.apps.find(a => a.get('id') === id);
      return this.renderApp(app, commonAppProps, true);
    } else {
      return null;
    }
  }

  renderApp(app, commonAppProps, maximized = false) {
    const category = app.get('category');
    const name = app.get('name');
    const id = app.get('id');
    const coordinates = app.get('coordinates');
    const settings = app.get('settings');
    const appType = appRegistry.getIn([category, 'appTypes', name]);
    return <AppContainer id={id}
                         appType={appType}
                         maximized={maximized}
                         appSettings={settings}
                         commonSettingsEditors={this.props.commonSettingsEditors}
                         location={this.props.location}
                         onAppRemove={() => this.props.onAppRemove(id)}
                         onAppSettingsUpdate={(settings) => this.props.onAppSettingsUpdate(id, settings)}>
      <appType.AppComponent
        {...commonAppProps}
        {...settings.toJS()}
        size={this.getAppSize(coordinates, maximized)} />
    </AppContainer>
  }

  getAppSize(gridConfig, maximized) {
    if (maximized) {
      return Size.XLARGE;
    } else if (gridConfig.get('w') >= 5) {
      return Size.LARGE;
    } else if (gridConfig.get('w') >= 3) {
      return Size.MEDIUM;
    } else {
      return Size.SMALL;
    }
  }

  getMaximizedAppId() {
    const id = this.props.location.query.maximize;
    return id && parseInt(id, 10);
  }

  onResizeStop(layout, oldItem, {i, x, y, w, h}) {
    this.props.onAppMove(parseInt(i, 10), {x, y, w, h});
  }

  onDragStop(layout, oldItem, {i, x, y, w, h}) {
    this.props.onAppMove(parseInt(i, 10), {x, y, w, h});
  }

  openAddAppDialog() {
    this.setState(() => ({addAppDialogOpen: true}));
  }

  closeAddAppDialog() {
    this.setState(() => ({addAppDialogOpen: false}));
  }

  addApp(appType) {
    this.closeAddAppDialog();
    this.props.onAppAdd(appType);
  }

}

AppGrid.propTypes = {
  apps: ImmutablePropTypes.seq.isRequired,
  commonSettingsEditors: PropTypes.array,
  wellId: PropTypes.number,
  wellDrillTime: PropTypes.object,
  onAppMove: PropTypes.func.isRequired,
  onAppSettingsUpdate: PropTypes.func.isRequired,
  onAppAdd: PropTypes.func.isRequired,
  onAppRemove: PropTypes.func.isRequired,
  location: PropTypes.object,
};

export default AppGrid;
