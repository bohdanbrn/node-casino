'use strict';

const expect = require('expect.js');

describe('models/index', function () {
  it('returns the task model', function () {
    const models = require('../../models');
    expect(models.Task).to.be.ok();
  });

  it('returns the user model', function () {
    const models = require('../../models');
    expect(models.User).to.be.ok();
  });
});
