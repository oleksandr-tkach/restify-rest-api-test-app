'use strict';

const app = require('../app');
const chai = require('chai');
const request = require('supertest');
const nock = require('nock');
const expect = chai.expect;

const Models = require('../models');

const MovieObj = {
    Title: "Blade Runner",
    Year: "1982",
    Rated: "R",
    Released: "25 Jun 1982",
    Runtime: "117 min",
    Genre: "Sci-Fi, Thriller",
    Director: "Ridley Scott",
};

before(() => {
    nock('http://www.omdbapi.com')
        .get(/.*/)
        .times(10)
        .reply(200, MovieObj);
});

describe('movie routes tests', () => {

    beforeEach((done) => {
        Models.Movie.remove({}).exec(() => {
            done();
        });
    });

    describe('GET /movies', () => {
        it('should return an empty array', (done) => {
            request(app).get('/movies')
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.be.empty;
                    done();
                });
        });
    });

    describe('POST /movies', () => {
        it('should create a movie', (done) => {
            request(app).post('/movies').send({
                title: MovieObj.Title
            })
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.not.be.empty;
                    expect(res.body.Title).to.not.be.undefined;
                    expect(res.body.Title).to.be.equal(MovieObj.Title);
                    done();
                });
        });

        it('should not duplicated movie', (done) => {
            request(app).post('/movies')
                .send({
                    title: MovieObj.Title
                }).end(() => {
                request(app).post('/movies')
                    .send({
                        title: MovieObj.Title
                    })
                    .end((err, res) => {
                        expect(res.statusCode).to.equal(400);
                        done();
                    });
            });
        });
    });

});