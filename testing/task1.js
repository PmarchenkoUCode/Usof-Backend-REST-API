// Login user with the dataInfo[0] = Admin

// Chai 
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app.js');

const dataInfo = require('../testing/dataInfo.js');

chai.should();
chai.use(chaiHttp);

const agent = chai.request.agent(app);

describe('Tasks API - Admin', () => {
    describe('Test POST router /api/auth/login', () => {
        it('should login user', (done) => {
            agent
                .post('/api/auth/login')
                .set('content-type', 'application/x-www-form-urlencoded')
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

        it('should get all users', (done) => {
            agent
                .get('/api/users')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                }
            );
        });
    });
});