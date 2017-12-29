const _ = require('lodash');
const ApiWrapper = require('../util/api-wrapper');

const baseUrl = require('../config').omdbapi.base;
const apiKey = require('../config').omdbapi.key;

class Omdb {
    constructor() {
        this.api = new ApiWrapper(baseUrl);
    }

    prepareQueryParams(params) {
        params.apikey = apiKey;
        const queryParams = [];
        _.forEach(params, (value, key) => {
            if (value) {
                queryParams.push(`${key}=${encodeURIComponent(value)}`);
            }
        });
        return '?' + queryParams.join('&');
    }

    getByTitle(title) {
        const params = this.prepareQueryParams({
            t: title
        });
        return new Promise((resolve, reject) => {
            return this.api.get(`${params}`)
                .then((res) => {
                    const response = JSON.parse(res);
                    if (response.Response === 'False' && response.Error) {
                        return reject(new Error(response.Error));
                    }
                    resolve(response);
                }, (err) => {
                    const body = JSON.parse(err.body);
                    reject(new Error(body.Error));
                });
        });
    }

}

module.exports = Omdb;
