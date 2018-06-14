import PropTypes from 'prop-types';
import React from 'react';

import { connect } from 'react-redux';
import cx from 'classnames';
import { bound } from 'class-bind';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {Checkbox, TextField} from '@material-ui/core';
// import Checkbox from '@material-ui/core/Checkbox';
// import TextField from '@material-ui/core/TextField'
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';

import roundTo from 'round-to';

import config from 'config';

import {
    Select,
    MenuItem,
    Input,
    InputLabel,
    FormHelperText,
    FormControl,
    FormControlHelperText,
    CircularProgress,
} from '@material-ui/core'

import Logo from 'components/Logo';
import { login, retrieveChartData, retrieveNextChartData, getResultsInfo } from 'actions/index';
// import {
//  XYPlot,
//  XAxis,
//  YAxis,
//  HorizontalGridLines,
//  VerticalGridLines,
//  MarkSeries,
//  LineSeries
// } from 'react-vis';
// import "react-vis/dist/style.css";

import {
    ScatterChart,
    CartesianGrid,
    XAxis,
    YAxis,
    ZAxis,
    Tooltip,
    Scatter,
    Legend,
} from 'recharts';

import { chartState } from '../reducers/chart';

console.log('PropTypes: ', PropTypes); export class Home extends React.PureComponent {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        user: PropTypes.object.isRequired,
        chart: PropTypes.object.isRequired,
    };

    state = {
        showStratData: false,
        showRoundtrips: false,
        selectedStratData: {},
        queryDriver: '',
        ranges: {},
    }

    componentDidMount() {
        this.props.dispatch(retrieveChartData(this.props.chart.queryParams));
        this.props.dispatch(getResultsInfo());
    }

    @bound getMoreData() {
        this.props.dispatch(retrieveNextChartData());
    }

    getXValue(el) {
        // return el.params.thresholds.high - el.params.thresholds.low;
        // return el.params.thresholds.persistence;
        // return el.params.thresholds.high;
        // return el.params.thresholds.low;
        // return el.params.interval;
        // return el.params.signal;
        return el.params.candleSize;
        // return el.params.short;
        // return el.params.medium;
        // return el.params.long;
        // return el.roundtrips.length;
        // return el.metrics.trades / ( (el.metrics.endTime - el.metrics.startTime) / (60000*1440) ); 
        // return (el.metrics.endTime - el.metrics.startTime) / (60000*1440);
        // return el.params.historySize;
        // return el.params.candleSize / el.roundtrips.length;
    }

    getYValue(el) {

        // return el.metrics.profitPerTrade - el.metrics.marketPerTrade;
        let {relativeProfit, market, startTime, endTime} = el.metrics;
        return this.getTimeAdjustedProfit({
            ...el.metrics,
            relativeProfit, market
            // relativeProfit: el.metrics.profitPerTrade,
            // market: el.metrics.marketPerTrade,
        } );
        // return el.metrics.relativeProfit - el.metrics.market;
        // return el.roundtrips.length;
    }

    getTimeAdjustedProfit({relativeProfit, market, startTime, endTime, time = 1440}) {
        return (relativeProfit - market) /
            (
                (endTime - startTime) / (60000 * time) // 1000 * 60 * 60 * 24
            )
        ;
    }

    @bound getGraphData(data) {
        // console.log('this.props.chart: ', this.props.chart);
        if (this.state.showRoundtrips) {
            let dataPoints = this.getRoundTripsAsGraphPoints(data);
            // console.log('%cdataPoints:', 'font-size: 24pt; color: orange;');
            // console.log('dataPoints: ', dataPoints);
            return data.map(this.convertRawData);
        } else {
            return data.map(this.convertRawData);
        }

    }

    @bound convertRawData(el, i) {
        return {
            x: this.getXValue(el),
            y: this.getYValue(el),
            z: 1000,
            otherData: el,
        }
    }

    getRoundTripsAsGraphPoints(data) {
        let newData = [];
        let query = this.state.queryParams;

        for (let i = 0; i < data.length; i++) {
            let { startTime, endTime } = data[i].metrics;

            if (query['metrics.startTime'] || query['metrics.endTime']) {
            }
        }
        return newData;
    }

    @bound takeAverageByY(data) {
        let newData = [];
        while (data.length) {


            let el = data.pop();
            let group = [el];

            for (let i = 0; i < data.length; i++) {
                if (data[i].x === el.x) {
                    // newData.push(data.splice(i, 1));
                    group.push(data.splice(i, 1)[0]);
                    i--;
                }
            }


            if (group.length > 1) {
                let reduced = group.reduce((a, b) => {
                    if (typeof a == 'number') {
                        return a + b.y;
                    } else {
                        return a.y + b.y;
                    }
                });
                let averageValue =  reduced / group.length;
                newData.push(Object.assign({}, el, { y: averageValue }));
            } else {
                newData.push(el);
            }

        }


        return newData.sort((a,b) => a.x > b.x ? 1 : -1);
    }

    @bound updateDisplayData(data, e) {
        this.setState({
            ...this.state,
            selectedStratData: data.otherData,
            showStratData: true,
        });
    }

    @bound toggleRoundTrips() {
        this.setState({
            ...this.state,
            showRoundtrips: !this.state.showRoundtrips
        });
    }

    @bound updateQueryProp(prop, value) {
        let queryProps = {};
        queryProps[prop] = value;

        console.log('this.props.chart.queryParams[prop]: ', this.props.chart.queryParams[prop]);
        console.log('value: ', value);
        if (this.props.chart.queryParams[prop] !== value) {
            console.log('should be updating');
            this.props.dispatch(retrieveChartData({
                ...this.props.chart.queryParams,
                ...queryProps
            }));
        }

        let newState = {
            ...this.state,
            showStratData: false,
        };

        if (!this.state.queryDriver) newState.queryDriver = prop;

        this.setState(newState);
    }

    @bound resetQueryPropsIfNeeded(prop) {
        let query = this.props.chart.queryParams.query;
        let resetProps = ['asset', 'currency', 'strategy', 'metrics.trades'];
        if (this.state.queryDriver === prop && resetProps.includes(prop)) {
            console.log('%cincludes!!', 'font-size: 24pt; color:red');
            resetProps.map(item => {
                console.log(prop);
                if (prop != item && typeof query[prop] != 'undefined') {
                    delete query[item];
                }
            });
        }
        return query;
    }

    @bound updateQuery(prop, value) {

        let query = this.resetQueryPropsIfNeeded(prop);

        if (typeof value == null || value == '') {
            delete query[prop];
            if (this.state.queryDriver == prop) delete this.state.queryDriver;
        } else {
            if (this.state.queryDriver == prop) query = {};
            query = {...query};
            query[prop] = value;
        }

        this.props.dispatch(getResultsInfo(query));
        this.updateQueryProp('query', query);
    }

    @bound setQuery(query) {
        this.updateQueryProp('query', query);
        if (!query || Object.keys(query).length == 0) {
            this.setState({...this.state, query: {}});
        }
    }

    @bound resetQuery() {
        this.setQuery({});
        this.setState({
            ...this.state,
            ranges: {},
            queryDriver: '',
        });
        this.props.dispatch(getResultsInfo());
    }

    // @bound getRealPropName(prop) {
    //  console.log('prop: ', prop);
    //  let query = this.props.chart.queryParams.query;
    //  let realName = prop;
    //  if (typeof query[prop] == 'undefined') {
    //      Object.keys(query).map(val => {
    //          if(val.endsWith('.' + prop)) {
    //              realName = val;
    //          }
    //      });
    //  }
    //  console.log('realName: ', realName);
    //  return realName;
    // }

    @bound getRangeValue(infoProp, queryProp) {
        let range = {};
        // console.log('%cthis.getRealPropName(prop): ', 'font-size: 24pt; color:red');
        // console.log( this.getRealPropName(prop) );
        // let value = query[this.getRealPropName(prop)] || {};
        let query = this.props.chart.queryParams.query || {};
        let info = this.props.chart.info;
        let queryValue = query[queryProp] || {};
        let infoValue = info[infoProp] || {};

        if (typeof queryValue != 'undefined') {
            if (queryValue.$lt) range.min = queryValue.$lt;
            if (queryValue.$gt) range.max = queryValue.$gt;
        }

        if (typeof range.min == 'undefined') range.min = infoValue.min;
        if (typeof range.max == 'undefined') range.max = infoValue.max;
        console.log('range: ', range);
        return range;
    }

    @bound updateRangeValue(infoName, queryName, value) {
        console.log('prop: ', infoName);
        console.log('value: ', value);
        let newQuery = {};
        let newRange = {};
        newRange[infoName] = value;

        if (value.min) newQuery.$gt = value.min;
        if (value.max) newQuery.$lt = value.max;

        this.updateQuery(queryName, newQuery);

        this.setState({
            ranges: {
                ...this.state.ranges,
                ...newRange,
            }
        })
    }

    @bound getParamsDisplay(params) {
        return (
            <div style={{marginLeft: 10}}>
                {Object.keys(params).map(key =>
                    this.getParamDisplay(key, params[key])
                )}
            </div>
        );
    }

    @bound getParamDisplay(key, value) {
        return (
            <div key={key}>
                <span>{key}:
                    { typeof value != 'object' ? value : this.getParamsDisplay(value) }
                </span>
            </div>
        );
    }

    @bound getItemDisplay(item) {
        return (
            <div style={{minWidth: '280px'}}>
                {!this.state.showStratData ? '' :
                    <div>
                        <div>
                            <span>{item.asset}</span> / <span>{item.currency}</span>
                        </div>
                        <div>
                            <span>Profit: {roundTo(item.metrics.relativeProfit, 2)}%</span>
                        </div>
                        <div>
                            <span>Market Gain: {roundTo(item.metrics.market, 2)}%</span>
                        </div>
                        <div>
                            <span>Profit vs Market:&nbsp;
                                {roundTo(item.metrics.relativeProfit - item.metrics.market, 2)}%
                            </span>
                        </div>
                        <div>
                            <span>Daily Profit vs Market:&nbsp;
                                <b style={{textShadow: '1px 1px 1px #000'}}> 
                                    {
                                        roundTo(this.getTimeAdjustedProfit({
                                            relativeProfit: item.metrics.relativeProfit,
                                            market: item.metrics.market,
                                            startTime: item.metrics.startTime,
                                            endTime: item.metrics.endTime,
                                        }), 4)
                                    }%
                                </b>
                            </span>
                        </div>
                        <div>
                            # of Trades: {item.metrics.trades}
                        </div>
                        <div>
                            Profit per trade: {item.metrics.profitPerTrade}%
                        </div>
                        <div>
                            Days active: {Math.ceil((item.metrics.endTime - item.metrics.startTime) / 1000 / 60 / 60 / 24)}
                        </div>
                        <div>
                            <span>Strategy: {item.strategy}</span>
                        </div>
                        <div>
                            <span>Params:</span>
                            <div syle={{border: '1px solid #888'}}>
                                {this.getParamsDisplay(item.params)}
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
                    // {JSON.stringify(item, null, 4)}
    getLoaded() {
        return (
            <div style={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
            }}>
                <div style={{
                    margin: 'auto',
                    position: 'relative',
                }}>
                    <CircularProgress
                        color="#FFF"
                        size={200}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: -13,
                            marginLeft: "-25%",
                        }}
                    >Getting Loaded</div>
                </div>
            </div>
        );
    }

    @bound getForm() {
        const { resultsLeft, moreResultsLoading, info, queryParams } = this.props.chart;
        let { query } = queryParams;
        // console.log('%cquery: ', 'font-size: 24pt; color:purple');
        // console.log( query );

        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                minHeight: 50,
                background: 'rgba(255,255,255, 0.2)',
                display: 'flex',
                flex: '0 0 100%',
                justifyContent: 'flex-start',
                flexDirection: 'row-reverse'
            }}>

                <div style={{alignSelf: 'flex-end'}}>
                    <Button
                        variant="raised"
                        onClick={this.getMoreData}
                        disabled={!resultsLeft || moreResultsLoading}
                    >
                        { resultsLeft ?
                            moreResultsLoading ? 
                                <CircularProgress size={16}/> :
                                <span>More...</span> :
                            <span>No mas</span>
                        }
                    </Button>
                </div>

                <div>
                    <div>
                        <TextField
                            id="fieldsToReturn"
                            label=""
                            placeholder="batch size"
                            defaultValue={queryParams.limit}
                            onChange={e => this.updateQueryProp('limit', e.target.value)}
                            margin="normal"
                        />
                    </div>
                    <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox 
                                onClick={() => this.setState({ ...this.state, showRoundtrips: !this.state.showRoundtrips })}
                            />
                          }
                          label="Show roundtrips"
                        />
                    </FormGroup>
                </div>

                <div style={{alignSelf: 'flex-end'}}>
                    <Button
                        variant="raised"
                        onClick={this.resetQuery}
                    > Reset
                    </Button>
                </div>

                <div style={{
                    display: 'flex',
                    flexFlow: 'column'
                }}>
                    <FormControl>
                        <InputLabel htmlFor="strategies-helper">Strategies</InputLabel>
                        <Select
                            value={ info.strategies.length == 1 ? info.strategies[0] : (query.strategy || '') }
                            onChange={e => this.updateQuery('strategy', e.target.value)}
                            input={ <Input name="strategies" id="strategies-helper" /> }
                        >
                            <MenuItem value=''>
                              <em>None</em>
                            </MenuItem>
                            { info.strategies.map((el,i) => <MenuItem value={el} key={i}>{el}</MenuItem>) }
                        </Select>
                    </FormControl>

{/*                 <FormControl>
                        <InputLabel htmlFor="currency-helper">Currency</InputLabel>
                        <Select
                            value={query.currency || ''}
                            onChange={e => this.updateQuery('currency', e.target.value)}
                            input={ <Input name="currency" id="currency-helper" /> }
                        >
                            <MenuItem value=''>
                              <em>None</em>
                            </MenuItem>
                            { info.currencies.map((el,i) => <MenuItem value={el} key={i}>{el}</MenuItem>) }
                        </Select>
                    </FormControl>
*/}

                </div>

                <div style={{
                    display: 'flex',
                    flexFlow: 'column',
                    minWidth: '100px'   
                }}>
                    <FormControl>
                        <InputLabel htmlFor="coin-helper">Coin</InputLabel>
                        <Select
                            value={ info.assets.length == 1 ? info.assets[0] : (query.asset || '') }
                            onChange={e => this.updateQuery('asset', e.target.value)}
                            input={ <Input name="coin" id="coin-helper" /> }
                        >
                            <MenuItem value=''>
                              <em>None</em>
                            </MenuItem>
                            { info.assets.map((el,i) => <MenuItem value={el} key={i}>{el}</MenuItem>) }
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel htmlFor="currency-helper">Currency</InputLabel>
                        <Select
                            value={ info.currencies.length == 1 ? info.currencies[0] : (query.currency || '') }
                            onChange={e => this.updateQuery('currency', e.target.value)}
                            input={ <Input name="currency" id="currency-helper" /> }
                        >
                            <MenuItem value=''>
                              <em>None</em>
                            </MenuItem>
                            { info.currencies.map((el,i) => <MenuItem value={el} key={i}>{el}</MenuItem>) }
                        </Select>
                    </FormControl>

                </div>
                <div style={{minWidth: '300px'}}>
                    {!info.trades ? '' :
                        <div>
                            <form style={{display: 'block', width: '100%'}} >
                            {info.trades.max}
                                <InputRange 
                                    minValue={ info.trades.min }
                                    maxValue={ info.trades.max }
                                    value={ this.state.ranges.trades || {min: info.trades.min, max: info.trades.max} }
                                    onChange={value => {
                                        console.log('%cvalue: ', 'font-size: 24pt; color:red');
                                        console.log( value );
                                        // if (value.min >= info.trades.min && value.max <= info.trades.max)
                                        // this.setState({
                                        //  ranges: {
                                        //      ...this.state.ranges,
                                        //      trades: {
                                        //          ...value
                                        //      },
                                        //  }
                                        // })
                                        this.updateRangeValue('trades', 'metrics.trades', value);
                                    }
                                    }
                                />

                                    {/*maxValue={ info.trades.max }
                                    minValue={ info.trades.min }
                                    value={ this.state.ranges.trades }
                                    value={  this.getRangeValue('trades', info)
                                    onChange={ value => { value => this.updateRangeValue('trades', value) } }
                                */ }
                            </form>
                        </div>
                    }
                </div>
            </div>
        );
    }
    render() {
        const { user } = this.props;
        const { results, loading } = this.props.chart;

        let foreground = '#E0E0E0';
        return (
            <div key="Home" className="app__home app__route">
            { this.getForm() }
                

{/*             <div className="app__container">
                    <div className="app__home__wrapper">
                        <div className="app__home__header">
                            <Logo />
                        </div>
                        <h1>{config.description}</h1>
                        <a
                            href="#login"
                            onClick={this.handleClickLogin}
                            className={cx('btn btn-lg btn-primary btn-icon', {
                                'btn-loading': user.status === 'running',
                            })}
                        >
                            <i className="i-sign-in" />
                            <span>Start</span>
                        </a>
                    </div>
                </div>*/}
                {loading ? this.getLoaded() :
                    <div style={{
                        display: 'flex',
                        flex: '1',
                        flexWrap: 'no-wrap',
                        justifyContent: 'space-evenly',
                        marginTop: '15%',
                    }}>
                            <div>
                                { this.getItemDisplay(this.state.selectedStratData) }
                            </div>
                            { !results.length ?
                                <span style={{fontSize: 48}}>[NO RASULTS]</span> :

                                <ScatterChart width={800} height={500}
                                    margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="x" name="Candle size" unit="min" type="number" />
                                    <YAxis dataKey="y" name="Profit over market per day" unit="%" type="number" />
                                    {/*<ZAxis dataKey="z" range={[64, 144]} name="score" unit="km" />*/}

                                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                    <Legend />
                                    <Scatter
                                        name="Backtests"
                                        data={this.getGraphData(results)}
                                        fill="#EOEOEO"
                                        onMouseOver={ this.updateDisplayData }
                                    />
                                    {/*<Scatter name="XVG" data={this.getGraphData(results).filter(result => result.asset === 'XVG')} fill="#EOEOEO" />*/}
                                    {/*<Scatter name="B school" data={data02} fill="#82ca9d" />*/}
                                </ScatterChart>
                            }

                                {/*<XYPlot width={800} height={500}>
                                    <HorizontalGridLines 
                                        color={foreground}
                                    />
                                    <VerticalGridLines
                                        color={foreground}
                                    />
                                    <MarkSeries
                                        data={ this.getGraphData(results) }
                                        color={foreground}
                                        onValueMouseOver={ this.updateDisplayData }
                                    />
                                    <XAxis />
                                    <YAxis />
                                </XYPlot>*/}
                    </div>
                    
                }
            </div>
        );
    }
}


/* istanbul ignore next */
function mapStateToProps(state) {
    let {user, chart, resultsLeft} = state;
    return { user, chart, resultsLeft };
}

export default connect(mapStateToProps)(Home);
