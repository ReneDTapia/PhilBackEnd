const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');

chai.use(chaiHttp);
const { expect } = chai;

describe('Authentication', () => {
    // ... [Las pruebas anteriores que ya te proporcioné]

    it('should fail if passwords do not match', (done) => {
        chai.request(app)
            .post('/api/auth/register')
            .send({
                email: 'valid@email.com',
                username: 'testuser',
                password: 'Password1!',
                confirmPassword: 'DifferentPassword1!'
            })
            .end((err, res) => {
                expect(res.status).to.equal(400);
                expect(res.body.error).to.equal('Passwords do not match.');
                done();
            });
    });

    it('should fail with email already registered', (done) => {
        chai.request(app)
            .post('/api/auth/register')
            .send({
                email: 'alreadyexisting@email.com',
                username: 'newuser',
                password: 'Password1!',
                confirmPassword: 'Password1!'
            })
            .end((err, res) => {
                expect(res.status).to.equal(400);
                expect(res.body.error).to.equal('Email already exists');
                done();
            });
    });

    it('should fail with username already registered', (done) => {
        chai.request(app)
            .post('/api/auth/register')
            .send({
                email: 'new@email.com',
                username: 'existingusername',
                password: 'Password1!',
                confirmPassword: 'Password1!'
            })
            .end((err, res) => {
                expect(res.status).to.equal(400);
                expect(res.body.error).to.equal('Username already exists');
                done();
            });
    });
    
    it('should fail with incorrect email format on registration', (done) => {
    chai.request(app)
        .post('/api/auth/register')
        .send({
            email: 'incorrectformat',
            username: 'testuser',
            password: 'Password1!',
            confirmPassword: 'Password1!'
        })
        .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(res.body.error).to.equal('Invalid email format');
            done();
        });
});


    it('should fail if password does not have an uppercase character', (done) => {
        chai.request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@email.com',
                username: 'testuser',
                password: 'password1!',
                confirmPassword: 'password1!'
            })
            .end((err, res) => {
                expect(res.status).to.equal(400);
                expect(res.body.error).to.contain('one uppercase');
                done();
            });
    });

    it('should fail if password does not have a lowercase character', (done) => {
        chai.request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@email.com',
                username: 'testuser',
                password: 'PASSWORD1!',
                confirmPassword: 'PASSWORD1!'
            })
            .end((err, res) => {
                expect(res.status).to.equal(400);
                expect(res.body.error).to.contain('one lowercase');
                done();
            });
    });

    it('should fail if password does not have a number', (done) => {
        chai.request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@email.com',
                username: 'testuser',
                password: 'Password!',
                confirmPassword: 'Password!'
            })
            .end((err, res) => {
                expect(res.status).to.equal(400);
                expect(res.body.error).to.contain('one number');
                done();
            });
    });

    it('should fail if password does not have a special character', (done) => {
        chai.request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@email.com',
                username: 'testuser',
                password: 'Password1',
                confirmPassword: 'Password1'
            })
            .end((err, res) => {
                expect(res.status).to.equal(400);
                expect(res.body.error).to.contain('one special character');
                done();
            });
    });
    // ... [Puedes continuar agregando más pruebas según lo necesites]
});

