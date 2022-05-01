import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { app } from '../app';
import Match from '../database/models/Matches';
import { allMatches, finishedMatches, unfinishedMatches } from './mocks/matches';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testing GET route from matches endpoint', () => {
  let chaiHttpResponse: Response;
  describe('GET /matches without inProgress query parameter', async () => {
    before(async () => {
      sinon.stub(Match, 'findAll').resolves({ allMatches } as unknown as Match[]);
    });

    chaiHttpResponse = await chai.request(app).get('/matches');

    after(() => { (Match.findAll as sinon.SinonStub).restore(); });

    it('Should have status code 200', async () => {
      expect(chaiHttpResponse.status).to.be.equal(200);
    });

    it('Should return the right information about all matches', async () => {
      expect(chaiHttpResponse.body).to.be.deep.equal(allMatches);
      expect(chaiHttpResponse.body.length).to.be.equal(allMatches.length);
    });
  });

  describe('GET /matches with inProgress query parameter equal false', async () => {
    before(async () => {
      sinon.stub(Match, 'findAll').resolves({ finishedMatches } as unknown as Match[]);
    });

    chaiHttpResponse = await chai.request(app).get('/matches?inProgress=false');

    after(() => { (Match.findAll as sinon.SinonStub).restore(); });

    it('Should have status code 200', async () => {
      expect(chaiHttpResponse.status).to.be.equal(200);
    });

    it('Should return the right information about finshed matches', async () => {
      expect(chaiHttpResponse.body).to.be.deep.equal(finishedMatches);
      expect(chaiHttpResponse.body.length).to.deep.equal(finishedMatches.length);
    });
  });

  describe('GET /matches with inProgress query parameter equal true', async () => {
    before(async () => {
      sinon.stub(Match, 'findAll').resolves({ finishedMatches } as unknown as Match[]);
    });

    chaiHttpResponse = await chai.request(app).get('/matches?inProgress=true');

    after(() => { (Match.findAll as sinon.SinonStub).restore(); });

    it('Should have status code 200', async () => {
      expect(chaiHttpResponse.status).to.be.equal(200);
    });

    it('Should return the right information about unfinished matches', async () => {
      expect(chaiHttpResponse.body).to.be.deep.equal(unfinishedMatches);
      expect(chaiHttpResponse.body.length).to.be.equal(unfinishedMatches.length);
    });
  });

  describe('The championship has not started yet', async () => {
    before(async () => {
      sinon.stub(Match, 'findAll').resolves({} as any);
    });

    chaiHttpResponse = await chai.request(app).get('/matches');

    after(() => { (Match.findAll as sinon.SinonStub).restore(); });

    it('Should have status code 404', async () => {
      expect(chaiHttpResponse.status).to.be.equal(404);
    });

    it('Should return an error message', async () => {
      expect(chaiHttpResponse.body).to.be.equal({ message: 'No match found' });
    });
  });
});
