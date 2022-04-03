// Chai 
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app.js');

const dataInfo = require('../testing/dataInfo.js');

chai.should();
chai.use(chaiHttp);

const agent = chai.request.agent(app);

// Data info new user
const dataInfoNewUser = [
    {
        login: 'NewAdmin',
        password: '123Qwerty',
        full_name: 'NewAdmin Marchenko',
        email: 'NewAdmin@gmail.com',
        role: 'Admin'
    },
    {
        login: 'NewUser',
        password: '123Qwerty',
        full_name: 'NewUser Marchenko',
        email: 'NewUser',
        role: 'User'
    }
];

describe('Tasks API', () => {
    describe('Test Router Post: /api/users/', () => {
        it('should login Admin', (done) => {
            agent
                .post('/api/auth/login')
                .send({
                    login: dataInfo[0].login,
                    email: dataInfo[0].email,
                    password: dataInfo[0].password
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                }
            );
        });

        it('should create a new user', (done) => {
            agent
                .post('/api/users')
                .send({
                    login: dataInfoNewUser[0].login,
                    password: dataInfoNewUser[0].password,
                    full_name: dataInfoNewUser[0].full_name,
                    email: dataInfoNewUser[0].email,
                    role: dataInfoNewUser[0].role
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                }
            );
        });

        it('should create a new user', (done) => {
            agent
                .post('/api/users')
                .send({
                    login: dataInfoNewUser[1].login,
                    password: dataInfoNewUser[1].password,
                    full_name: dataInfoNewUser[1].full_name,
                    email: dataInfoNewUser[1].email,
                    role: dataInfoNewUser[1].role
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                }
            );
        });

        it('should logout Admin', (done) => {
            agent
                .post('/api/auth/logout')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                }
            );
        });
    });
});
