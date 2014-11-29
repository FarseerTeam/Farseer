var mongoose = require("mongoose");
var players = require("./players");
var should = require('should');
var config = require('../config/environment/test');

// var db = mongoose.connection;

// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function callback() {
// 	//db is
// });
mongoose.connection.on('error', function(err){
	console.log("connection already opened");
})
mongoose.connect(config.mongo.uri);
describe("Players", function() {
	//holds a players to use in the each test  
	var currentCustomer = null;
	beforeEach(function(done) {
	
		//add some test data 
		players.model.create({
			name: "John",
			email: "test@test.com"
		}, function(err, doc) {
			currentCustomer = doc;
			done();
		});
	});
	it("retrieves by email", function(done) {
		players.findByEmail(currentCustomer.email, function(doc) {
			doc.email.should.equal(currentCustomer.email);
			done();
		}, function(e) {});
	});
	afterEach(function(done) {
		players.model.remove({}, function() {
			done();
		});
	});
	//tests...  
});