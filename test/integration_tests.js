import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../server.js';
import db from '../models/index.js';

chai.use(chaiHttp);
let should = chai.should();

let userId;

after(async () => {
    try {
        if (userId) {
            await db.Users.destroy({ where: { id: userId } });
        }
    } catch (error) {
        throw new Error(error);
    }
});

describe('GET /healthz', () => {

    it('Healthz call', async () => {
        const response = await chai
            .request(app)
            .get('/healthz')
        expect(response).to.have.status(200);
    });
});

describe('/POST user', () => {
    it('it should create a user account', (done) => {
        let user = {
            first_name: "Jane",
            last_name: "Doe",
            password: "skdjfhskdfjhg",
            username: "test1.test@example.com"
        };

        chai.request(app)
            .post('/v1/user')
            .send(user)
            .end((err, res) => {
                console.log("User account created with: " + res.body.username)
                expect(res).to.have.status(201);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('id');
                expect(res.body).to.have.property('first_name').eql('Jane');
                expect(res.body).to.have.property('last_name').eql('Doe');
                expect(res.body).to.have.property('username').eql('test1.test@example.com');
                expect(res.body).to.have.property('account_created');
                expect(res.body).to.have.property('account_updated');

                userId = res.body.id;

                db.Users.update({ isUserVerified: true }, { where: { id: userId } });

                done();
            });
    });

    it('it should fetch the user after authenticating the user account', (done) => {

        chai.request(app)
            .get('/v1/user/self').auth("test1.test@example.com", 'skdjfhskdfjhg')
            .end((err, res) => {
                console.log("User fetched succesfully: " + res.body.first_name)
                res.should.have.status(200);
                expect(res.body).to.have.property('id');
                expect(res.body).to.have.property('first_name').eql('Jane');
                expect(res.body).to.have.property('last_name').eql('Doe');
                expect(res.body).to.have.property('username').eql('test1.test@example.com');
                expect(res.body).to.have.property('account_created');
                expect(res.body).to.have.property('account_updated');
                done();
            });
    });

    it('it should UPDATE a user ', (done) => {
        let modifiedUser = {
            first_name: "Test",
            last_name: "User",
            password: "123456"
        };

        chai.request(app)
            .put('/v1/user/self').auth("test1.test@example.com", 'skdjfhskdfjhg')
            .send(modifiedUser)
            .end((err, res) => {
                res.should.have.status(204);
                done();
            });
    });
    it('it should fetch the user after authenticating the user account', (done) => {
        chai.request(app)
            .get('/v1/user/self').auth("test1.test@example.com", '123456')
            .end((err, res) => {
                console.log("User fetched succesfully: " + res.body.first_name)
                res.should.have.status(200);
                expect(res.body).to.have.property('id');
                expect(res.body).to.have.property('first_name').eql('Test');
                expect(res.body).to.have.property('last_name').eql('User');
                expect(res.body).to.have.property('username').eql('test1.test@example.com');
                expect(res.body).to.have.property('account_created');
                expect(res.body).to.have.property('account_updated');
                done();
            });
    });
});
