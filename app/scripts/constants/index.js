import keyMirror from 'fbjs/lib/keyMirror';

/**
 * @namespace Constants
 * @desc App constants
 */

/**
 * @constant {Object} ActionTypes
 * @memberof Constants
 */
export const ActionTypes = keyMirror({
	USER_LOGIN_REQUEST: undefined,
	USER_LOGIN_SUCCESS: undefined,
	USER_LOGIN_FAILURE: undefined,
	USER_LOGOUT_REQUEST: undefined,
	USER_LOGOUT_SUCCESS: undefined,
	USER_LOGOUT_FAILURE: undefined,
	GITHUB_GET_REPOS_REQUEST: undefined,
	GITHUB_GET_REPOS_SUCCESS: undefined,
	GITHUB_GET_REPOS_FAILURE: undefined,
	SHOW_ALERT: undefined,
	HIDE_ALERT: undefined,
	RETRIEVE_CHART_DATA: undefined,
	RETRIEVE_CHART_DATA_SUCCESS: undefined,
	RETRIEVE_CHART_DATA_FAILURE: undefined,
	RETRIEVE_NEXT_CHART_DATA: undefined,
	RETRIEVE_NEXT_CHART_DATA_SUCCESS: undefined,
	RETRIEVE_NEXT_CHART_DATA_FAILURE: undefined,
	UPDATE_CHART_QUERY: undefined,
	RETRIEVE_RESULTS_INFO: undefined,
	RETRIEVE_RESULTS_INFO_SUCCESS: undefined,
	RETRIEVE_RESULTS_INFO_FAILURE: undefined,
});

/**
 * @constant {Object} XHR
 * @memberof Constants
 */
export const XHR = keyMirror({
	SUCCESS: undefined,
	FAIL: undefined,
});
