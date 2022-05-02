import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { app } from '../app';
import Match from '../database/models/Matches';
import { allMatches, finishedMatches, unfinishedMatches } from './mocks/matches';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJBZG1pbiIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwiaWF0IjoxNjUxNDM4MDYwLCJleHAiOjE2NTE0NDE2NjB9.rCcNCGWb-eoBz4kYrBq0WROmxtuZL6L0foHKixqLFvg';

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

describe('Testing POST route from matches endpoint', () => {
  let chaiHttpResponse: Response;
  describe('Creating a valid match with 2 different teams', async () => {
    before(async () => {
      sinon.stub(Match, 'create').resolves({
          id: 49,
          homeTeam: 16,
          awayTeam: 5,
          homeTeamGoals: 4,
          awayTeamGoals: 0,
          inProgress: true,
        } as unknown as Match);
    });

    chaiHttpResponse = await chai.request(app).post('/matches').send({
      homeTeam: 16,
      awayTeam: 5,
      homeTeamGoals: 4,
      awayTeamGoals: 0,
      inProgress: true,
    }).set({ authorization: TOKEN });

    after(() => { (Match.create as sinon.SinonStub).restore(); });

    it('Should hava status code 201', async () => {
      expect(chaiHttpResponse.status).to.be.equal(201);
    });

    it('Should return an object with id from database', async () => {
      expect(chaiHttpResponse.body).to.be.an('object').to.have.own.property('id');
      expect(chaiHttpResponse.body).to.deep.equal({
        	id: 49,
	        homeTeam: 16,
	        awayTeam: 5,
	        homeTeamGoals: 4,
	        awayTeamGoals: 0,
	        inProgress: true,
      });
    });
  });

  describe('Creating an invalid match with 1 team ', async () => {
    before(async () => {
      sinon.stub(Match, 'create').resolves({
        message: 'It is not possible to create a match with two equal teams',
      } as unknown as Match);
    });

    chaiHttpResponse = await chai.request(app).post('/matches').send({
      homeTeam: 16,
      awayTeam: 16,
      homeTeamGoals: 4,
      awayTeamGoals: 0,
      inProgress: true,
    }).set({ authorization: TOKEN });

    after(() => { (Match.create as sinon.SinonStub).restore(); });

    it('Should have status code 401', async () => {
      expect(chaiHttpResponse.status).to.be.equal(401);
    });

    it('Should return an error message', async () => {
      expect(chaiHttpResponse.body).to.be.equal({
        message: 'It is not possible to create a match with two equal teams',
      });
    });
  });

  describe('Create a match with a team that are not in database', async () => {
    before(async () => {
      sinon.stub(Match, 'create').resolves({
        message: 'There is no team with such id!',
      } as unknown as Match);
    });

    chaiHttpResponse = await chai.request(app).post('/matches').send({
      homeTeam: 30,
      awayTeam: 35,
      homeTeamGoals: 4,
      awayTeamGoals: 0,
      inProgress: true,
    }).set({ authorization: TOKEN });

    after(() => { (Match.create as sinon.SinonStub).restore(); });

    it('Should have status code 404', async () => {
      expect(chaiHttpResponse.status).to.be.equal(404);
    });

    it('Should return an error message', async () => {
      expect(chaiHttpResponse.body).to.be.equal({ message: 'There is no team with such id!' });
    });
  });
});

describe('Testing PATCH route from /matches endpoint', () => {
  let chaiHttpResponse: Response;
  describe('Finishing a match', async () => {
    before(async () => {
      sinon.stub(Match, 'update').resolves({ id: 1, dbResponse: 1 } as any);
    });

    chaiHttpResponse = await chai.request(app).patch('/matches/1/finish');

    after(() => { (Match.update as sinon.SinonStub).restore(); });

    it('Should have status code 200', async () => {
      expect(chaiHttpResponse.status).to.be.equal(200);
    });

    it('Should return the right information', async () => {
      expect(chaiHttpResponse.body).to.be.equal({ id: 1, dbResponse: 1 });
    });
  });

  describe('Updating score match', async () => {
    before(async () => {
      sinon.stub(Match, 'update').resolves([1] as any);
    });

    chaiHttpResponse = await chai.request(app).patch('/matches/48').send({
      homeTeamGoals: 2,
      awayTeamGoals: 2,
    });

    after(() => { (Match.update as sinon.SinonStub).restore(); });

    it('Should have status code 200', async () => {
      expect(chaiHttpResponse.status).to.be.equal(200);
    });

    it('Should return an array', async () => {
      expect(chaiHttpResponse.body).to.be.an('array');
      expect(chaiHttpResponse.body.lenght).to.be.equal(1);
    });
  });
});
