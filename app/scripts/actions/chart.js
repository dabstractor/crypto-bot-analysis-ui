import { ActionTypes } from 'constants/index';

export function retrieveChartData(data) {
    return {
        type: ActionTypes.RETRIEVE_CHART_DATA,
        payload: data,
    }
}

export function retrieveChartDataSuccess(data, immediate) {
    return {
        type: ActionTypes.RETRIEVE_CHART_DATA_SUCCESS,
        payload: data,
    }
}

export function retrieveNextChartData(data) {
    return {
        type: ActionTypes.RETRIEVE_NEXT_CHART_DATA,
        payload: data,
    }
}

// export function updateChartQuery(data) {
//  return {
//      type: ActionTypes.UPDATE_CHART_QUERY,
//      payload: data
//  }
// }

export function getResultsInfo(query, immediate = false) {
    console.log('%cquery: ', 'font-size: 24pt; color:red');
    console.log( query );
    console.log('typeof query: ', typeof query);
    if (typeof query == 'bool') {
        immediate = query;
        query = {};
    }

    return {
        type: ActionTypes.RETRIEVE_RESULTS_INFO,
        query: query,
        immediate,
    }
}