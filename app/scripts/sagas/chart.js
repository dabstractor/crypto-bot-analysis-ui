/**
 * @module Sagas/GitHub
 * @desc GitHub
 */

import { all, call, put, takeLatest, race } from 'redux-saga/effects';
import { request } from 'modules/client';

import { ActionTypes } from 'constants/index';

import backtestApi from '../apis/backtestApi';

/**
 * Login
 *
 * @param {Object} action
 *
 */
export function* getData({payload, immediate = false}) {
	console.log('%cpayload: ', 'font-size: 24pt; color:green');
	console.log( payload );
	console.log('immediate: ', immediate);
	console.log('%cimmediate: ', 'font-size: 24pt; color:red');
	console.log( immediate );   
	try {
		const response = yield call(() => backtestApi.query(payload));
		yield put({
			type: ActionTypes.RETRIEVE_CHART_DATA_SUCCESS,
			payload: response,
		});
	}
	catch (err) {
		/* istanbul ignore next */
		yield put({
			type: ActionTypes.RETRIEVE_CHART_DATA_FAILURE,
			payload: err,
		});
	}
}

export function* getNext({payload}) {
	try {
		const response = yield call(backtestApi.getNext);
		console.log('response: ', response);
		yield put({
			type: ActionTypes.RETRIEVE_NEXT_CHART_DATA_SUCCESS,
			payload: response,
		});

	} catch (err) {
		yield put({
			type: ActionTypes.RETRIEVE_NEXT_CHART_DATA_FAILURE,
			payload: err,
		});
	}
}

export function* getInfo({query}) {

	try {
		const response = yield call(() => backtestApi.getInfo(query));
		yield put({
			type: ActionTypes.RETRIEVE_RESULTS_INFO_SUCCESS,
			payload: response,
		});

	} catch (err) {
		yield put({
			type: ActionTypes.RETRIEVE_RESULTS_INFO_FAILURE,
			payload: err,
		})
	}
}

/**
 * GitHub Sagas
 */
export default function* root() {
	yield all([
		takeLatest(ActionTypes.RETRIEVE_CHART_DATA, getData),
		takeLatest(ActionTypes.RETRIEVE_NEXT_CHART_DATA, getNext),
		takeLatest(ActionTypes.RETRIEVE_RESULTS_INFO, getInfo),
	]);
}
