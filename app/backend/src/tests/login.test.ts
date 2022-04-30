import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { app } from '../app';
import User from '../database/models/Users';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testing POST route from login endpoint', () => {
  let chaiHttpResponse: Response;
  describe('The user exists on database', async () => {
    before(async () => {
      sinon.stub(User, 'findOne').resolves({
        id: 1,
        username: 'Admin',
        role: 'admin',
        email: 'admin@admin.com',
        password: 'secret_admin',
      } as User);
    });

    chaiHttpResponse = await chai.request(app).post('/login').send({
      email: 'admin@admin.com',
      password: 'secret_admin',
    });

    after(() => { (User.findOne as sinon.SinonStub).restore(); });

    it('Should return status code 200', () => {
      expect(chaiHttpResponse.status).to.be.equal(200);
    });

    it('Should return the right information about user', () => {
      expect(chaiHttpResponse.body).to.have.own.property('user');
      expect(chaiHttpResponse.body).to.have.own.property('token');
      expect(chaiHttpResponse.body.user).to.be.an('object').deep.equal({
        id: 1,
        username: 'Admin',
        role: 'admin',
        email: 'admin@admin.com',
      });
    });
  });

  describe('Field validation cases', async () => {
    before(async () => {
      sinon.stub(User, 'findOne').resolves({} as User);
    });

    after(() => { (User.findOne as sinon.SinonStub).restore(); });

    it('Should return an error message when email field is missing or empty', async () => {
      chaiHttpResponse = await chai.request(app).post('/login').send({
        password: 'secret_admin',
      });
      expect(chaiHttpResponse.body).to.be.equal({ message: 'Incorrect email or password' });
    });
    
    it('Should have status code 401 when email field is missing or empty', async () => {
      chaiHttpResponse = await chai.request(app).post('/login').send({
        password: 'secret_admin',
      });
      expect(chaiHttpResponse.status).to.be.equal(401);
    });

    it('Should return an error when password field is missing or empty', async () => {
      chaiHttpResponse = await chai.request(app).post('/login').send({
        email: 'admin@admin.com',
      });
      expect(chaiHttpResponse.body).to.be.equal({ message: 'Incorrect email or password' });
    });

    it('Should have status code 401 when password field is missing or empty', async () => {
      chaiHttpResponse = await chai.request(app).post('/login').send({
        email: 'admin@admin.com',
      });
      expect(chaiHttpResponse.status).to.be.equal(401);
    });
  });
});

describe('Testing GET rout from login endpoint', () => {
  let chaiHttpResponse: Response;
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJBZG1pbiIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwiaWF0IjoxNjUxMzQzNTk1LCJleHAiOjE2NTEzNDcxOTV9.UOUn1edxOrwuhLfqAmHicksoEyJfUvY8xcJpcK1Z9RA';

  describe('The endpoint /login/validate receives a valid jsonwebtoken', async () => {
    before(async () => {
      chaiHttpResponse = await chai.request(app).get('/login/validate').set({
        authorization: token,
      });
    });

    it('Should have status code 200', () => {
      expect(chaiHttpResponse.status).to.be.equal(200);
    });

    it('Should return the right role according to the user', () => {
      expect(chaiHttpResponse.body).to.be.equal('admin');
    });
  });

  describe('The endpoint /login/validate receives a invalid  jsonwebtoken', async () => {
    before(async () => {
      chaiHttpResponse = await chai.request(app).get('/login/validate').set({
        authorization: `!${token}`,
      });
    });

    it('Should have status code 400', async () => {
      expect(chaiHttpResponse.status).to.be.equal(400);
    });

    it('Should return an error message', async () => {
      expect(chaiHttpResponse.body).to.be.equal({ message: 'Invalid token' });
    });
  });

  describe('The endpoint /login/validate does not receive any token', async () => {
    before(async () => {
      chaiHttpResponse = await chai.request(app).get('/login/validate');
    });

    it('Should have status code 404', async () => {
      expect(chaiHttpResponse.status).to.be.equal(404);
    });

    it('Should return an error message', async () => {
      expect(chaiHttpResponse.body).to.be.equal({ message: 'Token not found' });
    });
  });
});
