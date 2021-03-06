import { createSelector } from 'reselect';
import { identity } from 'lodash';
import { NAME } from './constants';
import { List, Map } from 'immutable';

const stateSelector = state => state[NAME];

export const appData = createSelector(
  stateSelector,
  state => state.get('appData')
);


export function firstSubData(data, [firstSub], latestItemOnly=true) {
  let subData = getSubData(data, firstSub);

  if (latestItemOnly && List.isList(subData)) {
    subData = subData.last();
  }

  return subData;
}

export function getSubData(data, {provider, collection, event = ''}, latestItemOnly=true) {
  let subData = data && data.getIn([provider, collection, event]);

  if (latestItemOnly && List.isList(subData)) {
    subData = subData.last();
  }

  return subData;
}

/**
 * For each subscription, returning the first data error we find.
 * @param data
 * @param subscriptions
 * @returns {any|T|*}
 */
export function getSubErrors(data, subscriptions) {
  for (let i = 0; i < subscriptions.length; i++) {
    let subData = getSubData(data, subscriptions[i]);
    if (subData) {
      let error = subData.getIn(['data', 'error']);
      if (error) {
        return error;
      }
    }
  }
}

/**
 * For each subscription, returning an empty data return.
 * @param data
 * @param subscriptions
 * @returns {any|T|*}
 */
export function isSubDataEmpty(data, subscriptions) {
  for (let i = 0; i < subscriptions.length; i++) {
    let subData = getSubData(data, subscriptions[i]);
    if (subData === '[]') {
      return true;
    }
    return false;
  }
}

/**
 * Given all the data stored for an app, find the timestamp of the latest data
 * appData will be a nested Map in the shape of
 * {appKey1: {collectionId1: {event1: data, event2: data}, collectionId2: {event3: data}}, appKey2: {...}}
 *
 * We look at the "timestamp" attribute in data records where it exists.
 */
export function lastDataUpdate(appData) {
  if (!appData) {
    return null;
  }

  return appData
    .valueSeq()
    .map(collection => collection.valueSeq())
    .last()
    .flatten(1)
    .map((d) => {
      if (Map.isMap(d)) {
        return d.get('timestamp');
      } else if (List.isList(d)) {
        if (d.first().get('timestamp') > d.last().get('timestamp')) {
          return d.first().get('timestamp');
        } else {
          return d.last().get('timestamp');
        }
      }
      return null;
    })
    .flatten()
    .filter(identity)
    .max();
}