const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { suite } = require('mocha');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  suite('POST request to /api/issues/{project}', function() {
    // #1
    test('Create an issue with every field: POST request to /api/issues/{project}', function(done) {
      chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'Text',
          created_by: 'Functional Test',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          console.log(res.body);
          assert.equal(res.body.result, 'successfully added');
          done();
        });
    });
    
    // #2
    test('Create an issue with only required fields: POST request to /api/issues/{project}', function(done) {
      chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'Text',
          created_by: 'Functional Test'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          console.log(res.body);
          assert.equal(res.body.result, 'successfully added');
          done();
        });
    });

    // #3
    test('Create an issue with missing required fields: POST request to /api/issues/{project}', function(done) {
      chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'Text'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          console.log(res.body);
          assert.equal(res.body.error, 'required field(s) missing');
          done();
        });
    });
  })

  suite('GET request to /api/issues/{project}', function() {
    // #4
    test('View issues on a project: GET request to /api/issues/{project}', function(done) {
      chai.request(server)
        .get('/api/issues/test')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          console.log(res.body);
          assert.isArray(res.body);
          done();
        });
    });

    // #5
    test('View issues on a project with one filter: GET request to /api/issues/{project}', function(done) {
      chai.request(server)
        .get('/api/issues/test?open=true')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          console.log(res.body);
          assert.isArray(res.body);
          done();
        });
    });

    // #6
    test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function(done) {
      chai.request(server)
        .get('/api/issues/test?open=true&created_by=Functional Test')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          console.log(res.body);
          assert.isArray(res.body);
          done();
        });
    });
  })

  suite('PUT request to /api/issues/{project}', function() {
    // #7
    test('Update one field on an issue: PUT request to /api/issues/{project}', function(done) {
      chai.request(server)
        .get('/api/issues/test')
        .end(function(err, res) {
          const issue = res.body[0];
          chai.request(server)
            .put('/api/issues/test')
            .send({
              _id: issue._id,
              issue_title: 'Updated Title'
            })
            .end(function(err, res) {
              assert.equal(res.status, 200);
              console.log(res.body);
              assert.equal(res.body.result, 'successfully updated');
              done();
            });
        });
    });

    // #8
    test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function(done) {
      chai.request(server)
        .get('/api/issues/test')
        .end(function(err, res) {
          const issue = res.body[0];
          chai.request(server)
            .put('/api/issues/test')
            .send({
              _id: issue._id,
              issue_title: 'Updated Title',
              issue_text: 'Updated Text',
              created_by: 'Updated Functional Test'
            })
            .end(function(err, res) {
              assert.equal(res.status, 200);
              console.log(res.body);
              assert.equal(res.body.result, 'successfully updated');
              done();
            });
        });
    });

    // #9
    test('Update an issue with missing _id: PUT request to /api/issues/{project}', function(done) {
      chai.request(server)
        .put('/api/issues/test')
        .send({
          issue_title: 'Updated Title',
          issue_text: 'Updated Text',
          created_by: 'Updated Functional Test'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          console.log(res.body);
          assert.equal(res.body.error, 'missing _id');
          done();
        });
    });

    // #10
    test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function(done) {
      chai.request(server)
        .get('/api/issues/test')
        .end(function(err, res) {
          const issue = res.body[0];
          chai.request(server)
            .put('/api/issues/test')
            .send({
              _id: issue._id,
            })
            .end(function(err, res) {
              assert.equal(res.status, 200);
              console.log(res.body);
              assert.equal(res.body.error, 'no update field(s) sent');
              done();
            });
        });
    })

    // #11
    test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function(done) {
      chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: 'invalid_id',
          issue_title: 'Updated Title',
          issue_text: 'Updated Text',
          created_by: 'Updated Functional Test'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          console.log(res.body);
          assert.equal(res.body.error, 'could not update');
          done();
        });
    });
  });

  suite('DELETE request to /api/issues/{project}', function() {
    // #12
    test('Delete an issue: DELETE request to /api/issues/{project}', function(done) {
      chai.request(server)
        .get('/api/issues/test')
        .end(function(err, res) {
          const issue = res.body[0];
          chai.request(server)
            .delete('/api/issues/test')
            .send({
              _id: issue._id
            })
            .end(function(err, res) {
              assert.equal(res.status, 200);
              console.log(res.body);
              assert.equal(res.body.result, 'successfully deleted');
              done();
            });
        });
    });

    // #13
    test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function(done) {
      chai.request(server)
        .delete('/api/issues/test')
        .send({
          _id: 'invalid_id'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          console.log(res.body);
          assert.equal(res.body.error, 'could not delete');
          done();
        });
    });

    // #14
    test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function(done) {
      chai.request(server)
        .delete('/api/issues/test')
        .send({})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          console.log(res.body);
          assert.equal(res.body.error, 'missing _id');
          done();
        });
    });
  });
});
