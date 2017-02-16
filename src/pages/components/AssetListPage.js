import React, { Component } from 'react';
import { Row, Col, Table, Input, Icon } from 'react-materialize';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router';
import { format as formatDate } from 'date-fns';

import AssetListTabBar from './AssetListTabBar';
import assets from '../../assets';

import './AssetListPage.css';

class AssetListPage extends Component {

  componentDidMount() {
    this.props.listAssets(this.props.params.assetType);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.params.assetType !== this.props.params.assetType) {
      this.props.listAssets(newProps.params.assetType);
    }
  }

  render() {
    return <div className="c-asset-list-page">
      <AssetListTabBar />
      <Row>
        <Col s={2} />
        <Col s={8}>
          <Input s={12}
                 label={`Search for ${this.props.params.assetType}...`}
                 value={this.props.location.query.search || ''}
                 onInput={e => this.onSearchChange(e.target.value)}
                 onChange={e => this.onSearchChange(e.target.value)}>
            <Icon>search</Icon>
          </Input>
        </Col>
        <Col s={2} />
      </Row>
      <Row>
        <Col s={2} />
        <Col s={8}>
          {this.props.assetList.get('assets').isEmpty() ?
            <div className="c-asset-list-page__no-assets">No matching assets</div> :
            <Table className="c-asset-list-page__table">
              <thead>
                <tr>
                  <th>
                    <Link to={this.makeSortLink('name')} className="c-asset-list-page__sort-link">
                      Name
                      {this.renderSortIcon('name')}
                    </Link>
                  </th>
                  {this.props.assetList.get('parentTypes').entrySeq().map(([typeCode, assetType]) => (
                    <th key={typeCode}>
                      <Link to={this.makeSortLink(typeCode)} className="c-asset-list-page__sort-link">
                        {assetType.get('labelSingular')}
                        {this.renderSortIcon(typeCode)}
                      </Link>
                    </th>
                  ))}
                  <th>
                    <Link to={this.makeSortLink('status')} className="c-asset-list-page__sort-link">
                      Status
                      {this.renderSortIcon('status')}
                    </Link>
                  </th>
                  <th>
                    <Link to={this.makeSortLink('date')} className="c-asset-list-page__sort-link">
                      Date
                      {this.renderSortIcon('date')}
                    </Link>
                  </th>
                </tr>
              </thead>
              <tbody>
                {this.props.assetList.get('assets').map(asset => (
                  <tr key={asset.get('id')}>
                    <td>
                      {this.isAssetTypeLinkable() ?
                        <Link to={`/assets/${asset.get('id')}/overview`}
                              className="c-asset-list-page__asset-link">
                          {asset.get('name')}
                        </Link> :
                        asset.get('name')}
                    </td>
                    {this.props.assetList.get('parentTypes').keySeq().map(typeCode => (
                      <td key={asset.get('id') + typeCode}>
                        {asset.getIn(['parents', typeCode, 'name'])}
                      </td>
                    ))}
                    <td><assets.components.AssetStatus asset={asset} /></td>
                    <td>{this.formatDate(asset.get('date'))}</td>
                  </tr>
                ))}
              </tbody>
          </Table>}
        </Col>
        <Col s={2} />
      </Row>
    </div>;
  }

  makeSortLink(sortField) {
    const {sortField: currentField, sortOrder: currentOrder} = this.props.location.query;
    const isThisField = sortField === currentField || (sortField === 'name' && !currentField);
    const isAscending = currentOrder === 'asc' || !currentOrder;
    const sortOrder = (isThisField && isAscending ? 'desc' : 'asc');
    return {
      pathname: `/assets/${this.props.params.assetType}`,
      query: {...this.props.location.query, sortField, sortOrder}
    }
  }

  renderSortIcon(sortField) {
    const {sortField: currentField, sortOrder: currentOrder} = this.props.location.query;
    if (sortField === currentField || (sortField === 'name' && !currentField)) {
      return <Icon className="c-asset-list-page__sort-icon">{currentOrder === 'desc' ? 'keyboard_arrow_down' : 'keyboard_arrow_up'}</Icon>
    } else {
      return null;
    }
  }

  isAssetTypeLinkable() {
    return assets.constants.ASSET_TYPES.getIn([this.props.params.assetType, 'hasAssetPage']);
  }

  formatDate(date) {
    if (date) {
      return formatDate(date, 'MM/DD/YYYY');
    } else {
      return '';
    }
  }

  onSearchChange(search) {
    this.props.router.push({
      pathname: `/assets/${this.props.params.assetType}`,
      query: {...this.props.location.query, search}
    });
  }

}

export default connect(
  createStructuredSelector({
    assetList: assets.selectors.assetList
  }),
  {
    listAssets: assets.actions.listAssets
  }
)(AssetListPage);