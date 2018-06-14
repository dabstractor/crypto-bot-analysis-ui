import { bound } from 'class-bind';
import debounce from 'debounce';

let getDebounceFunction = debounce(function(payload, resolve, realCall) {
    console.log('this: ', this);
    realCall(payload).then(results => resolve(results));
}, 1000);


class BacktestResults {
    lastPayload = {};

    skipped = 0;

    @bound query(payload, immediate = false) {
        let {query, projection, skip} = payload

        if (payload) this.lastPayload = { ...payload };

        this.skipped = 0;

        return this.makeCall(payload, !immediate).then(results => {
            return results;
        });
    }

    @bound getNext(skip) {
        if (typeof skip == 'number') this.skipped = skip;
        return this.makeCall({
            ...this.lastPayload,
            skip: this.skipped,
        }, false);
    }

    @bound makeCall(payload, shouldDebounce = true) {
        console.log('shouldDebounce: ', shouldDebounce);
        if (!shouldDebounce) return this.makeRealCall(payload);
        return new Promise((resolve, reject) => {
            console.log('debouncing');
            getDebounceFunction(payload, resolve, this.makeRealCall);
        });
    }


    @bound makeRealCall(payload) {
        console.log('%cFETCHING', 'font-size: 34pt; color:green');
        return fetch(`http://localhost:8000/results`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            method: 'POST'
        }).then(async response => {
            let results = await response.json();
            this.skipped += results.length;
            return results;
        });
    }

    @bound getInfo(query) {
        console.log('%cquery: ', 'font-size: 24pt; color:pink');
        console.log( query );
        return fetch(`http://localhost:8000/info`, {
            method: 'POST',
            body: JSON.stringify({ query: query }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(async response => {
            return await response.json();
        });
    }

    // isNewQuery(params) {
    //     return  params.query != this.lastQuery ||
       //      params.projection != this.lastProjection ||
       //      params.skip != this.skipped;
    // }
}

export default new BacktestResults();