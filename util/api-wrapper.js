const _ = require('lodash');
const urljoin = require('url-join');
const request = require('request');

class ApiWrapper {
    constructor(baseURL, route = '') {
        this.base = urljoin(baseURL, route);
        this.headers = {};
    }

    get(uri, headers = {}) {
        return this.request('get', uri, headers);
    }

    post(uri, headers = {}, form = {}) {
        return this.request('post', uri, headers, form);
    }

    put(uri, headers = {}, form = {}) {
        return this.request('put', uri, headers, form);
    }

    delete(uri, headers = {}) {
        return this.request('delete', uri, headers);
    }

    request(method, uri, headers, form) {
        return new Promise((resolve, reject) => {
            let details = {
                url: urljoin(this.base, uri),
                headers: _.merge(this.headers, headers)
            };
            if (!_.isEmpty(form) && (method === 'post' || method === 'put')) {
                details.form = form;
            }
            return request[method](details, (error, response, body) => {
                if (error) {
                    return reject(error);
                }
                if (response.statusCode !== 200) {
                    return reject({
                        statusCode: response.statusCode,
                        body: body
                    });
                }
                resolve(body);
            });
        });
    }
}

module.exports = ApiWrapper;