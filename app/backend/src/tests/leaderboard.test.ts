import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { app } from '../app';
import Match from '../database/models/Matches';
import { generalLeaderBoard, homeLeaderBoard, awayLeaderBoard } from './mocks/leaderBoard';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testing GET route from leaderboard endpoint', () => {
  let chaiHttpResponse: Response;
  describe('GET /leaderboard', async () => {
    before(async () => {
      sinon.stub(Match, 'findAll').resolves({ generalLeaderBoard } as unknown as Match[]);
    });

    chaiHttpResponse = await chai.request(app).get('/leaderboard');

    after(() => { (Match.findAll as sinon.SinonStub).restore(); } );

    it('Should have status code 200', async () => {
      expect(chaiHttpResponse.status).to.be.equal(200);
    });

    it('Should return the right informartion about team leaderboard', async () => {
      expect(chaiHttpResponse.body).to.be.an('Array');
      expect(chaiHttpResponse.body).to.be.deep.equal(generalLeaderBoard);
    });
  });

  describe('GET /leaderboard/home', async () => {
    before(async () => {
      sinon.stub(Match, 'findAll').resolves({ homeLeaderBoard } as unknown as Match[]);
    });

    chaiHttpResponse = await chai.request(app).get('/leaderboard/home');

    after(() => { (Match.findAll as sinon.SinonStub).restore(); });

    it('Should have status code 200', async () => {
      expect(chaiHttpResponse.status).to.be.equal(200);
    });

    it('Should return the right information about home team leaderboard', async () => {
      expect(chaiHttpResponse.body).to.be.an('array');
      expect(chaiHttpResponse.body).to.be.deep.equal(homeLeaderBoard);
    });
  });

  describe('GET /leaderboard/away', async () => {
    before(async () => {
      sinon.stub(Match, 'findAll').resolves({ awayLeaderBoard } as unknown as Match[]);
    });

    chaiHttpResponse = await chai.request(app).get('/leaderboard/away');

    after(() => { (Match.findAll as sinon.SinonStub).restore(); });

    it('Should have status code 200', async () => {
      expect(chaiHttpResponse.status).to.be.equal(200);
    });

    it('Should return the right information about away team leaderBoard', async () => {
      expect(chaiHttpResponse.body).to.be.an('array');
      expect(chaiHttpResponse.body).to.be.deep.equal(awayLeaderBoard);
    });
  });
});