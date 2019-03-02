var assert = require('assert');
var should = require('should');
var ngResource;

describe('the module', function () {

    it('should be requireable', function () {
        ngResource = require('./lib/angular-resource');
    });
    it('should be a function', function () {
        ngResource.should.be.a.Function;
    });

});
