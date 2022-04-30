import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { app } from '../app';
import Team from '../database/models/Teams';
import ITeam from '../interfaces/team';
import { allTeams } from './mocks/teams';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testing GET route from teams endpoint', () => {
  let chaiHttpResponse: Response;
  describe('GET /teams, there are teams on database', async () => {
    before(async () => {
      sinon.stub(Team, 'findAll').resolves({ allTeams } as unknown as Team[]);
    });

    chaiHttpResponse = await chai.request(app).get('/teams');

    after(() => { (Team.findAll as sinon.SinonStub).restore(); });

    it('Should hava status code 200', async () => {
      expect(chaiHttpResponse.status).to.be.equal(200);
    });

    it('Should return the right information about teams', async () => {
      expect(chaiHttpResponse.body).to.be.an('array');
      expect(chaiHttpResponse.body).to.be.deep.equal(allTeams);
      expect(chaiHttpResponse.body.length).to.be.equal(allTeams.length);
    });
  });

  describe('GET /teams, there are no teams on database', async () => {
    before(async () => {
      sinon.stub(Team, 'findAll').resolves({} as unknown as Team[]);
    });

    chaiHttpResponse = await chai.request(app).get('/teams');

    after(() => { (Team.findAll as sinon.SinonStub).restore(); });

    it('Should have status code 404', async () => {
      expect(chaiHttpResponse.status).to.be.equal(404);
    });

    it('Should return an error message', async () => {
      expect(chaiHttpResponse.body).to.be.equal({ message: 'Any Team found in database' });
    });
  });
});