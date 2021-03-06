import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classSet from 'react-classset';
import Modal from 'react-modal';
import { Icon } from 'react-materialize';
import { List } from 'immutable';
import { format as formatDate } from 'date-fns';
import ImmutablePropTypes from 'react-immutable-proptypes';

import AppSettingsDialog from './AppSettingsDialog';
import common from '../../common';
import * as nativeMessages from '../../nativeMessages';

import './AppContainer.css';

class AppContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {settingsDialogOpen: false};
  }

  componentDidMount() {
    if (this.props.asset) {
      this.subscribe(this.props);
    }
  }

  componentWillUnmount() {
    this.unsubscribe(this.props);
  }

  componentWillReceiveProps(newProps) {
    if (this.isSubscriptionChanged(newProps)) {
      if (this.props.asset) {
        this.unsubscribe(this.props);
      }
      if (newProps.asset) {
        this.subscribe(newProps);
      }
    }
  }

  subscribe(props) {
    props.onAppSubscribe(
      props.id,
      this.getSubscriptionKeys(props),
      props.asset.get('id'),
      this.getSubscriptionParams(props)
    );
  }

  unsubscribe(props) {
    props.onAppUnsubscribe(props.id, this.getSubscriptionKeys(props));
  }

  isSubscriptionChanged(newProps) {
    return newProps.id !== this.props.id ||
           !newProps.asset ||
           !newProps.asset.equals(this.props.asset) ||
           !this.getSubscriptionParams(newProps).equals(this.getSubscriptionParams(this.props));
  }

  getSubscriptionParams(props) {
    const paramsFromSettings = props.appType.settings
      .filter(s => s.get('includeInSubscriptionParams'))
      .map(s => [s.get('name'), props.appSettings.get(s.get('name')) || s.get('default')]);
    return props.pageParams.merge(paramsFromSettings);
  }

  getAppAssetName() {
    let assetId = this.props.appSettings.get("assetId");
    let asset = this.props.availableAssets.find(a => a.get("id") === assetId);
    if(asset){
      return asset.get("name", "");
    }
    else {
      return "Rig";
    }
  }

  render() {
    const classes = {
      'c-app-container': true,
      'c-app-container--maximized': this.props.maximized,
      'c-app-container--full-size': this.props.appType.constants.METADATA.fullSize,
      'c-app-container--with-title': !this.props.isTitlesDisabled && this.props.appType.constants.METADATA.title,
      'c-app-container--with-subtitle': !this.props.isTitlesDisabled  && this.props.appType.constants.METADATA.subtitle,
      'c-app-container--movable': !this.props.isNative
    };
    let assetDashboardSlug = this.props.assetDashboards && this.props.assetDashboards.count() > 0 ? this.props.assetDashboards.first().get('slug') : '';
    return (
      <div className={classSet(classes)}>
        {!this.props.isTitlesDisabled && 
          <h4 className="c-app-container__title">{this.props.appType.constants.METADATA.title}</h4>}
        {!this.props.isTitlesDisabled && this.props.appType.constants.METADATA.subtitle &&
          <h5 className="c-app-container__subtitle">{this.props.appType.constants.METADATA.subtitle}</h5>}
        {!this.props.appType.constants.METADATA.multiRig && this.props.availableAssets && !this.props.appType.constants.METADATA.disableDisplayAssetName && this.props.layoutEnvironment && this.props.layoutEnvironment.get("type") === "general" && this.props.asset &&
          <Link to={`/assets/${this.props.asset.get("id")}/${assetDashboardSlug}`} className="c-app-container-asset-name">
             {this.getAppAssetName()}
           </Link>    
          }
        <div className="c-app-container__content">
          {this.props.errorData || this.props.isEmptyData ? this.renderErrorOrEmpty() : this.props.children}
        </div>
        {this.isLastDataUpdateVisible() &&
          <div className="c-app-container__last-update">
            Last Update: {this.formatLastDataUpdate()}
          </div>}
        {!this.props.isActionsDisabled &&
          <div className="c-app-container__actions">
            {this.props.maximized ?
              <Link className="c-app-container__action"
                    to={{pathname: this.props.location.pathname, query: {maximize: undefined}}}
                    title="Restore"
                    onClick={() => nativeMessages.notifyAppRestored()}>
                <Icon>close</Icon>
              </Link> :
              <Link className="c-app-container__action c-app-container__action--maximize"
                    to={{pathname: this.props.location.pathname, query: {maximize: this.props.id}}}
                    title="Full screen"
                    onClick={() => nativeMessages.notifyAppMaximized()}>
                <Icon>launch</Icon>
              </Link>}
            {(!this.props.isNative) &&
              <button className="c-app-container__action c-app-container__action--settings"
                      title="Settings"
                      onClick={() => this.openSettingsDialog()}>
                <Icon>settings</Icon>
              </button>}
          </div>}
        <Modal
          isOpen={this.state.settingsDialogOpen}
          onRequestClose={() => this.closeSettingsDialog()}
          className='c-app-settings-dialog'
          overlayClassName='c-app-settings-dialog__overlay'
          contentLabel="App Settings">
          <AppSettingsDialog
            appType={this.props.appType}
            settingsEditors={this.getSettingsEditors()}
            currentSettings={this.props.appSettings}
            onDone={newSettings => this.onSettingsSave(newSettings)}
            onAppRemove={this.props.onAppRemove} />
        </Modal>
      </div>
    );
  }

  renderErrorOrEmpty() {
    if(this.props.errorData) {
      return this.renderError();
    }
    else {
      return this.renderEmpty();
    }
  }

  // Render the Error Message
  renderError() {
    let message = this.props.errorData.get('message');
    let error_code = this.props.errorData.get('code');
    return (
      <div className="c-app-container__error" title={message}>
        <div className="c-app-container__error-grid">
          <div className="c-app-container__error-inner">
            <Icon style={this.props.size === common.constants.Size.SMALL ? "font-size: 2rem;" : ""}>error_outline</Icon>
            <h1>{message}</h1>
            {this.renderErrorLink(error_code)}
          </div>
        </div>
      </div>
    );
  }

  renderErrorLink(error_code) {
    let text = "", url = "";
    switch(error_code) {
      case "config_missing_error":
        text = "Add well config";
        url = "/assets/" + this.props.asset.get('id') + "/settings";
        break;
      default:
        text = "";
        break;
    }

    if (text !== "" && url !== "") {
      return <a href={url}>{text}</a>;
    }
  }

  // Render Empty Data
  renderEmpty() {
    return (
      <div className="c-app-container__error">
        <div className="c-app-container__error-grid">
          <div className="c-app-container__error-inner">
            <div className="c-app-container__error_no-data">
              <Icon style={this.props.size === common.constants.Size.SMALL ? "font-size: 2rem;" : ""}>info_outline</Icon>
            </div>
            <h1>No results found...</h1>
          </div>
        </div>
      </div>
    );
  }

  // Let the component implementation display the date and others info(if necessary)
  isLastDataUpdateVisible() {
    return this.props.lastDataUpdate && !this.props.hasAppFooter;
  }

  formatLastDataUpdate() {
    const date = new Date(this.props.lastDataUpdate * 1000);
    return formatDate(date, 'M/D/YYYY h:mm a');
  }

  getSettingsEditors() {
    let common = this.props.commonSettingsEditors || List();
    if (this.props.appType.constants.METADATA.multiRig) {
      common = common.filter(x => x.get('name') !== 'assetId');
    }
    const forAppType = this.props.appType.settings || List();
    return common.concat(forAppType);
  }

  openSettingsDialog() {
    this.setState({settingsDialogOpen: true});
  }

  closeSettingsDialog() {
    this.setState({settingsDialogOpen: false});
  }
  
  onSettingsSave(newSettings) {
    this.closeSettingsDialog();
    this.props.onAppSettingsUpdate(newSettings);
  }

  getSubscriptionKeys(props) {
    return props.appType.constants.SUBSCRIPTIONS;
  }

}

AppContainer.propTypes = {
  id: PropTypes.number.isRequired,
  errorData: ImmutablePropTypes.map,
  isEmptyData: PropTypes.bool,
  asset: ImmutablePropTypes.map,
  appType: PropTypes.object.isRequired,
  //lastDataUpdate: PropTypes.number,
  location: PropTypes.object.isRequired,
  isNative: PropTypes.bool.isRequired,
  isActionsDisabled: PropTypes.bool,
  isTitlesDisabled: PropTypes.bool,
  size: PropTypes.string.isRequired,
  coordinates: PropTypes.object.isRequired,
  maximized: PropTypes.bool,
  appSettings: ImmutablePropTypes.map.isRequired,
  pageParams: ImmutablePropTypes.map.isRequired,
  commonSettingsEditors: ImmutablePropTypes.list,
  layoutEnvironment: ImmutablePropTypes.map,
  availableAssets: ImmutablePropTypes.list,
  onAppSubscribe: PropTypes.func.isRequired,
  onAppUnsubscribe: PropTypes.func.isRequired,
  onAppRemove: PropTypes.func.isRequired,
  onAppSettingsUpdate: PropTypes.func.isRequired
};

export default AppContainer;
