var EJU = require("../lib/jangojobutil.js"),
        vows = require('vows'),
        assert = require('assert');

var fieldNames = ["FirstName","LastName","EmailAddress"];
var testContacts = JSON.parse("[ {\"FirstName\": \"Bryan\", \"LastName\": \"Rockwood\", \"EmailAddress\": \"bryan.rockwood@rockhouse.org\"}]");
var contactInfo = {"fieldNames" : fieldNames, "addresses" : testContacts};

var connectInfo = {
    username : "username",
    password: "password",
    server: "api.jangomail.com",
    jobId : 262567769,
    contactInfo: contactInfo
};

var test = new EJU.JangoJobUtil(connectInfo);

vows.describe("Resend mass JangoMail initialization ").addBatch({
            'when examining the username field' : {
                topic: function() {
                    return test.postArray['Username'];
                },
                "we get a value of 'username' back": function(topic) {
                    assert.equal(topic, "username")
                }
            }, 'when examining the password field' : {
                topic: function() {
                    return test.postArray['Password'];
                },
                "we get a value of 'password' back": function(topic) {
                    assert.equal(topic, "password")
                }
            }, 'when examining the jobId field' : {
                topic: function() {
                    return test.postArray['JobID'];
                },
                "we get a value of 261496805 back": function(topic) {
                    assert.equal(topic, 261496805)
                }
            }
        }).run({reporter : require("vows/reporters/spec")});

test.resendJob().then(function(res) {
    console.log(res);
});

