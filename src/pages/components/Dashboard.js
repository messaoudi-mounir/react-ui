import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { List, Map } from 'immutable';

import apps from '../../apps';
import DashboardAppAssetSettingEditor from './DashboardAppAssetSettingEditor';
import DashboardTabBar from './DashboardTabBar';
import Convert from '../../common/Convert';

import { currentDashboard, dashboardAppAssets, isNative } from '../selectors';
import {
  moveApp,
  updateAppSettings,
  addApp,
  removeApp,
} from '../actions';
import assets from '../../assets';
import subscriptions from '../../subscriptions';

const DASHBOARD_COMMON_SETTINGS_EDITORS = List([
  Map({
    name: 'assetId',
    title: 'Active Asset',
    required: true,
    Editor: DashboardAppAssetSettingEditor
  })
]);

const DASHBOARD_ENV = Map({
  type: "general",
});

class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.convert = new Convert();
  }

  componentDidMount() {
    this.loadAppAssets(this.props.currentDashboard);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.currentDashboard && this.props.currentDashboard && newProps.currentDashboard.get('id') !== this.props.currentDashboard.get('id')) {
      this.loadAppAssets(newProps.currentDashboard);

      // This key will be applied to the child app grid which guarantees that it refreshes is the dashboard changes.
      let currState = this.state || {};
      currState.gridKey = new Date().getTime();
      this.setState(currState);
    }
  }

  loadAppAssets(dashboard) {
    dashboard && dashboard.get('apps').forEach(app => {
      if (app.hasIn(['settings', 'assetId'])) {
        this.props.loadAsset(app.getIn(['settings', 'assetId']));
      }
    });
  }

  render() {
    const AppLayout = this.props.currentDashboard && apps.layouts[this.props.currentDashboard.get('layout', 'grid')];
    return (
      <div className="c-dashboard" >
        {!this.props.isNative && <DashboardTabBar currentDashboard={this.props.currentDashboard} />}
        {this.props.currentDashboard &&
          <AppLayout apps={this.props.currentDashboard.get('apps').valueSeq()}
                     appData={this.props.appData}
                     key={this.state ? this.state.gridKey : null}
                     appAssets={this.props.dashboardAppAssets}
                     commonSettingsEditors={DASHBOARD_COMMON_SETTINGS_EDITORS}
                     convert={this.convert}
                     environment={DASHBOARD_ENV}
                     onAppSubscribe={(...a) => this.props.subscribeApp(...a)}
                     onAppUnsubscribe={(...a) => this.props.unsubscribeApp(...a)}
                     onAppMove={(...a) => this.onAppMove(...a)}
                     onAppSettingsUpdate={(...a) => this.onAppSettingsUpdate(...a)}
                     onAppAdd={(...a) => this.onAppAdd(...a)}
                     onAppRemove={(...a) => this.onAppRemove(...a)}
                     onAssetModified={asset => this.props.reloadAsset(asset.get('id'))}
                     location={this.props.location}
                     isNative={this.props.isNative} />}
      </div>
    );
  }

  onAppMove(id, newCoordinates) {
    this.props.moveApp(this.props.currentDashboard, id, newCoordinates);
  }

  onAppSettingsUpdate(id, newSettings) {
    if (newSettings.has('assetId')) {
      this.props.loadAsset(newSettings.get('assetId'));
    }
    this.props.updateAppSettings(this.props.currentDashboard, id, newSettings);
  }

  onAppAdd(appType, appSettings) {
    if (appSettings.has('assetId')) {
      this.props.loadAsset(appSettings.get('assetId'));
    }
    this.props.addApp(this.props.currentDashboard, appType, appSettings);
  }

  onAppRemove(id) {
    this.props.removeApp(this.props.currentDashboard, id);
  }

}

export default connect(
  createStructuredSelector({
    currentDashboard,
    dashboardAppAssets,
    appData: subscriptions.selectors.appData,
    isNative
  }),
  {
    moveApp,
    updateAppSettings,
    addApp,
    removeApp,
    loadAsset: assets.actions.loadAsset,
    reloadAsset: assets.actions.reloadAsset,
    subscribeApp: subscriptions.actions.subscribeApp,
    unsubscribeApp: subscriptions.actions.unsubscribeApp
  }
)(Dashboard);
