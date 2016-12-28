import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import moment from 'moment';
import { Map } from 'immutable';
import { isEqual } from 'lodash';
import { stringify as queryString } from 'query-string';

import AssetTabBar from './AssetTabBar';
import wellTimeline from '../../apps/wellTimeline';
import AppGrid from '../../apps/components/AppGrid';

import {
  isNative,
  assetPageTabs,
  appData,
  currentAssetPageTab,
  currentPageParams,
  currentWellTimeline
} from '../selectors';
import {
  subscribeApp,
  unsubscribeApp,
  moveApp,
  updateAppSettings,
  addApp,
  removeApp,
  loadWellTimeline,
  setPageParams
} from '../actions';

import './AssetPage.css';

class AssetPage extends Component {

  componentDidMount() {
    const drillTimeParam = this.props.location.query.drillTime;
    this.props.loadWellTimeline(
      parseInt(this.props.params.assetId, 10),
      drillTimeParam ? moment(drillTimeParam) : null
    );
  }

  componentWillReceiveProps(newProps) {
    if (!this.props.location || !isEqual(newProps.location.query, this.props.location.query)) {
      this.props.setPageParams(
        parseInt(newProps.params.assetId, 10),
        newProps.location.query
      );
    }
  }

  render() {
    const assetId = parseInt(this.props.params.assetId, 10);
    return (
      <div className="c-asset-page" >
        {this.props.currentAssetPageTab &&
          <AppGrid apps={this.props.currentAssetPageTab.get('apps').valueSeq()}
                   appData={this.props.appData}
                   onAppSubscribe={(...a) => this.props.subscribeApp(...a)}
                   onAppUnsubscribe={(...a) => this.props.unsubscribeApp(...a)}
                   onAppMove={(...a) => this.onAppMove(...a)}
                   onAppSettingsUpdate={(...a) => this.onAppSettingsUpdate(...a)}
                   onAppAdd={(...a) => this.onAppAdd(...a)}
                   onAppRemove={(...a) => this.onAppRemove(...a)}
                   assetId={assetId}
                   pageParams={this.props.currentPageParams}
                   location={this.props.location} />}
        {!this.props.isNative &&
          <AssetTabBar assetId={assetId}
                       assetPageTabs={this.props.assetPageTabs}
                       currentAssetPageTab={this.props.currentAssetPageTab}
                       pageParams={this.props.currentPageParams} />}
        {this.props.currentWellTimeline &&
          <wellTimeline.AppComponent
            timeline={this.props.currentWellTimeline}
            onUpdateParams={(...args) => this.onPageParamsUpdate(...args)} />}
      </div>
    );
  }

  onAppMove(id, newCoordinates) {
    this.props.moveApp(this.props.currentAssetPageTab, id, newCoordinates);
  }

  onAppSettingsUpdate(id, newSettings) {
    this.props.updateAppSettings(this.props.currentAssetPageTab, id, newSettings);
  }

  onAppAdd(appType) {
    this.props.addApp(this.props.currentAssetPageTab, appType, Map());
  }

  onAppRemove(id) {
    this.props.removeApp(this.props.currentAssetPageTab, id);
  }

  onPageParamsUpdate(newParams) {
    const allNewParams = Object.assign(
      {},
      this.props.pageParams && this.props.pageParams.toJS(),
      newParams
    );
    this.props.router.push(`${this.props.location.pathname}?${queryString(allNewParams)}`);
  }


}

export default connect(
  createStructuredSelector({
    isNative,
    assetPageTabs,
    appData,
    currentAssetPageTab,
    currentPageParams,
    currentWellTimeline
  }),
  {
    subscribeApp,
    unsubscribeApp,
    moveApp,
    updateAppSettings,
    addApp,
    removeApp,
    loadWellTimeline,
    setPageParams
  }
)(AssetPage);
