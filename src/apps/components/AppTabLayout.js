import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Map } from 'immutable';

import AppContainer from './AppContainer';
import common from '../../common';
import subscriptions from '../../subscriptions';
import * as appRegistry from '../appRegistry';

import './AppTabLayout.css';

/**
 * Render an app set in a "tab layout" - a tab bar with a tab for each app, with
 * one app visible at a time.
 */
class AppTabLayout extends Component {

  constructor(props) {
    super(props);
    this.state = {selectedAppIdx: 0};
  }

  render() {
    return (
      <div className="c-app-tab-layout">
        <div className="c-app-tab-layout__tab-bar">
          <h4>Sections</h4>
          <ul>
            {this.props.apps.map((app, idx) =>
              <li key={idx}
                  className={idx === this.state.selectedAppIdx ? 'c-app-tab-layout__tab--selected' : ''}
                  onClick={() => this.selectApp(idx)}>
                {this.renderAppTabContent(app)}
              </li>)}
          </ul>
        </div>
        <div className="c-app-tab-layout__app">
          {this.renderSelectedApp()}
        </div>
      </div>
    );
  }

  selectApp(selectedAppIdx) {
    this.setState({selectedAppIdx});
  }

  renderAppTabContent(app) {
    const category = app.get('category');
    const name = app.get('name');
    const appType = appRegistry.uiApps.getIn([category, 'appTypes', name]);
    return appType.constants.METADATA.title;
  }

  renderSelectedApp() {
    if (this.props.apps.isEmpty()) {
      return;
    }
    const app = this.props.apps.get(this.state.selectedAppIdx);
    const category = app.get('category');
    const name = app.get('name');
    const id = app.get('id');
    const size = common.constants.Size.XLARGE;
    const settings = app.get('settings');
    const appType = appRegistry.uiApps.getIn([category, 'appTypes', name]);
    const appData = this.props.appData.get(id);
    return <AppContainer id={id}
                         appType={appType}
                         asset={this.props.appAssets.get(id)}
                         lastDataUpdate={subscriptions.selectors.lastDataUpdate(appData)}
                         isNative={this.props.isNative}
                         isActionsDisabled={true}
                         size={size}
                         appSettings={settings}
                         pageParams={this.getPageParams()}
                         commonSettingsEditors={this.props.commonSettingsEditors}
                         location={this.props.location}
                         onAppSubscribe={(...args) => this.props.onAppSubscribe(...args)}
                         onAppUnsubscribe={(...args) => this.props.onAppUnsubscribe(...args)}
                         onAppRemove={() => this.props.onAppRemove(id)}
                         onAppSettingsUpdate={(settings) => this.props.onAppSettingsUpdate(id, settings)}>
      <appType.AppComponent
        data={appData}
        {...this.getPageParams().toJS()}
        {...settings.toObject()}
        size={size}
        widthCols={12} />
    </AppContainer>
  }

  getPageParams() {
    return this.props.pageParams || Map();
  }

}

AppTabLayout.propTypes = {
  apps: ImmutablePropTypes.seq.isRequired,
  appData: ImmutablePropTypes.map.isRequired,
  appAssets: ImmutablePropTypes.map.isRequired,
  commonSettingsEditors: ImmutablePropTypes.list,
  pageParams: ImmutablePropTypes.map,
  onAppSubscribe: PropTypes.func.isRequired,
  onAppUnsubscribe: PropTypes.func.isRequired,
  onAppSettingsUpdate: PropTypes.func.isRequired,
  location: PropTypes.object,
  isNative: PropTypes.bool.isRequired
};

export default AppTabLayout;
