// Chai 
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app.js');

const dataInfo = require('./dataInfo.js');

chai.should();
chai.use(chaiHttp);

const agent = chai.request.agent(app);

describe('Tasks API', () => {
    describe('Test POST router /api/auth/register', () => {
        it('should register a new user', (done) => {
            agent
                .post('/api/auth/register')
                .send({
                    login: dataInfo[0].login,
                    password: dataInfo[0].password,
                    full_name: dataInfo[0].full_name,
                    email: dataInfo[0].email
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                }
            );
        });

        it('should register a new user', (done) => {
            agent
                .post('/api/auth/register')
                .send({
                    login: dataInfo[1].login,
                    password: dataInfo[1].password,
                    full_name: dataInfo[1].full_name,
                    email: dataInfo[1].email
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                }
            );
        });

        it('should register a new user', (done) => {
            agent
                .post('/api/auth/register')
                .send({
                    login: dataInfo[2].login,
                    password: dataInfo[2].password,
                    full_name: dataInfo[2].full_name,
                    email: dataInfo[2].email
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                }
            );
        });

        it('should register a new user', (done) => {
            agent
                .post('/api/auth/register')
                .send({
                    login: dataInfo[3].login,
                    password: dataInfo[3].password,
                    full_name: dataInfo[3].full_name,
                    email: dataInfo[3].email
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                }
            );
        });

        it('should register a new user', (done) => {
            agent
                .post('/api/auth/register')
                .send({
                    login: dataInfo[4].login,
                    password: dataInfo[4].password,
                    full_name: dataInfo[4].full_name,
                    email: dataInfo[4].email
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                }
            );
        });

        it('should register a new user', (done) => {
            agent
                .post('/api/auth/register')
                .send({
                    login: dataInfo[5].login,
                    password: dataInfo[5].password,
                    full_name: dataInfo[5].full_name,
                    email: dataInfo[5].email
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                }
            );
        });

        it('should register a new user', (done) => {
            agent
                .post('/api/auth/register')
                .send({
                    login: dataInfo[6].login,
                    password: dataInfo[6].password,
                    full_name: dataInfo[6].full_name,
                    email: dataInfo[6].email
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                }
            );
        });

        it('should register a new user', (done) => {
            agent
                .post('/api/auth/register')
                .send({
                    login: dataInfo[7].login,
                    password: dataInfo[7].password,
                    full_name: dataInfo[7].full_name,
                    email: dataInfo[7].email
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                }
            );
        });

        it('should register a new user', (done) => {
            agent
                .post('/api/auth/register')
                .send({
                    login: dataInfo[8].login,
                    password: dataInfo[8].password,
                    full_name: dataInfo[8].full_name,
                    email: dataInfo[8].email
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                }
            );
        });

        it('should register a new user', (done) => {
            agent
                .post('/api/auth/register')
                .send({
                    login: dataInfo[9].login,
                    password: dataInfo[9].password,
                    full_name: dataInfo[9].full_name,
                    email: dataInfo[9].email
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                }
            );
        });
    });
});
