import update from 'immutability-helper';
import { REHYDRATE } from 'redux-persist/lib/constants';
import { createReducer } from 'modules/helpers';

import { ActionTypes } from 'constants/index';

import queryParams from './query';


export const chartState = {
    results: [],
    cursor: null,
    loading: false,
    moreResultsLoading: false,
    resultsLeft: true,
    firstLoad: true,
    queryParams,
    info: {
        assets: [],
        currencies: [],
        strategies: [],
        trades: null,
        time: null,
        profit: null,
    },
};

export default {
    chart: createReducer(chartState, {
        [ActionTypes.RETRIEVE_CHART_DATA](state, { payload }) {
            let moreResultsLoading = !state.firstLoad;
            state.firstLoad = false;
            console.log('payload going out: ', payload);
            return {
                ...state,
                queryParams: { ...payload },
                loading: true,
                moreResultsLoading: true
            }
        },
        [ActionTypes.RETRIEVE_CHART_DATA_SUCCESS](state, { payload }) {
            return {
                ...state,
                results: payload,
                loading: false,
                resultsLeft: payload.length > 0,
                moreResultsLoading: false,
            }
        },
        [ActionTypes.RETRIEVE_CHART_DATA_FAILURE](state, { payload }) {
            return {
                ...state,
                moreResultsLoading: false,
            }
        },
        // [ActionTypes.UPDATE_CHART_QUERY_DATA](state, { payload }) {
        //  console.log('state: ', state);
        //  return {
        //      ...state,
        //      ...payload,
        //      resultsLeft: true,
        //  }
        // },
        [ActionTypes.RETRIEVE_NEXT_CHART_DATA](state, { payload }) {
            return {
                ...state,
                moreResultsLoading: true,
            }
        },
        [ActionTypes.RETRIEVE_NEXT_CHART_DATA_SUCCESS](state, { payload }) {
            return {
                ...state,
                results: [
                    ...state.results,
                    ...payload
                ],
                resultsLeft: payload.length > 0,
                loading: false,
                moreResultsLoading: false,
            }
        },
        [ActionTypes.RETRIEVE_NEXT_CHART_DATA_FAILURE](state, { payload }) {
            return {
                ...state,
                moreResultsLoading: false,
                loading: false
            }
        },
        [ActionTypes.RETRIEVE_RESULTS_INFO_SUCCESS](state, { payload }) {
            return {
                ...state,
                info: {
                    ...state.info,
                    ...payload,
                },
             }
        },
        [ActionTypes.RETRIEVE_RESULTS_INFO_FAILURE](state, { payload }) {
            console.error(payload);
            return state;
        }
    })

}