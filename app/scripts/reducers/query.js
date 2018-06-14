export default {
    limit: 400,
    query: {
        // profit: {
        //  $gt: 1,// $lt: 1.1
        // },
        // asset: 'XVG',

        // $and: [
            // { $where: `this.roundtrips.length > 0` },
            // { $where: `this.roundtrips.length < 500` },
            // { $where: `this.metrics.relativeProfit - this.metrics.market > 0`, }
        // ],
        // 'params.candleSize': { $lt: 125 },
        // roundtrips: { $ne: [] },
        // 'metrics.trades': { $gt: 1, $lt: 500 },
        // 'metrics.market': { $gt: 0 },

        // 'metrics.startTime': {
        //  $lt: new Date("Feb 25 2018").getTime(),
        // },
        // 'metrics.endTime': {
        //  $gt: new Date("Feb 26 2018").getTime(),
        // },

        // persistence: { $lt: 45 },
        // 'params.thresholds.persistence': { $lt: 45 },
        // profit: { $gt: 1 },
        // profit: { $gt: 0, $lt: 20 },
        // strategy: { $ne: 'StohRSI'}, //'MACD',
        // strategy: 'MACD',
        // strategy: 'TSI',
        // strategy: 'StochRSI',
        // strategy: 'TMA',
        // strategy: 'UO',
        // profit: { $lt: 30 },
        // 'params.candleSize': { $lt: 20 },
    },
    sort: {
        // endTime: 1,
        // roundtrips: 1
    },
    projection: {
        _id: 0,
        roundtrips: 0,
    },
}
