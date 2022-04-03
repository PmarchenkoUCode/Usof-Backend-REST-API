// Chai 
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app.js');

chai.should();
chai.use(chaiHttp);

describe('Tasks API', () => {
    describe('Test Router GET: /api/users/:user_id', () => {
        it('should get one user', (done) => {
            chai.request(app)
                .get('/api/users/1')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                }
            );
        });

        it('should get one user', (done) => {
            chai.request(app)
                .get('/api/users/2')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                }
            );
        });

        it('should get one user', (done) => {
            chai.request(app)
                .get('/api/users/3')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                }
            );
        });

        it('should get one user', (done) => {
            chai.request(app)
                .get('/api/users/4')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                }
            );
        });

        it('should get one user', (done) => {
            chai.request(app)
                .get('/api/users/5')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                }
            );
        });

        it('should get one user', (done) => {
            chai.request(app)
                .get('/api/users/6')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                }
            );
        });

        it('should get one user', (done) => {
            chai.request(app)
                .get('/api/users/7')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                }
            );
        });

        it('should get one user', (done) => {
            chai.request(app)
                .get('/api/users/8')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                }
            );
        });

        it('should get one user', (done) => {
            chai.request(app)
                .get('/api/users/9')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                }
            );
        });

        it('should get one user', (done) => {
            chai.request(app)
                .get('/api/users/10')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                }
            );
        });
    });
});
