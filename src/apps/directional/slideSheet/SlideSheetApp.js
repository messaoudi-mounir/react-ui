import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './SlideSheetApp.css'

class SlideSheetApp extends Component {
  render() {
    let json = subscriptions.selectors.firstSubData(this.props.data,SUBSCRIPTIONS)
    return (
      <div className="c-di-slidesheet">
        <div className="gaps"></div>
        { json ?
          <table>
            <thead>
              <tr>
                <th>Depth</th>
                <th>Length</th>
                <th>Inc</th>
                <th>Azi</th>
                <th>DLS</th>
              </tr>
            </thead>
            <tbody>
              { json.getIn(["data","intervals"]).map( (t,index)=> {
                return (
                <tr key={index}>
                  <td>{t.get("measured_depth")} <sub> ft</sub></td>
                  <td>{t.get("length")} <sub> ft </sub></td>
                  <td>{t.get("inclination")} <sub>*</sub></td>
                  <td>{t.get("azimuth")} <sub>*</sub></td>
                  <td>{t.get("dls")}</td>        
                </tr>
                )

              })}
            </tbody>
          </table>:
        <LoadingIndicator/> 
        }
      </div>
    )
  }

 
}

SlideSheetApp.propTypes = {
  data: ImmutablePropTypes.map,
  title: PropTypes.string,
};

export default SlideSheetApp;

