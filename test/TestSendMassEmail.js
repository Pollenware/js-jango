var SMJE = require("../lib/sendmassjangoEmail.js"),
        vows = require('vows'),
        assert = require('assert');

var fieldNames = ["FirstName","LastName","EmailAddress"];
var testContacts = JSON.parse("[ {\"FirstName\": \"Bryan\", \"LastName\": \"Rockwood\", \"EmailAddress\": \"bryan.rockwood@rockhouse.org\"}]");
var contactInfo = {"fieldNames" : fieldNames, "addresses" : testContacts};
var initData = {
    username : "username",
    password : "password",
    server : "api.jangomail.com",
    subject : "Howdy Ho, %%FirstName%%!",
    fromEmail : "node-jango@pollenware.com",
    fromName : "New JangoMail Node Interface",
    messagePlain : "Greetings %%FirstName%% %%LastName%%,\n\nThis is a test of the Node interface to JangoMail." +
            "Your email address is %%EmailAddress%%.  Have a great day!\n\n\n -- BaseJangoRequest (BJR) OUT!",
    contactInfo: contactInfo
};
var test = new SMJE.SendMassJangoEmail(initData);

vows.describe("Send mass JangoMail initialization ").addBatch({
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
            }, 'when examining the subject' : {
                topic: function() {
                    return test.postArray['Subject'].length;
                },
                "the lengths match": function(topic) {
                    assert.equal(topic, initData.subject.length)
                }
            }, 'when examining the from email address' : {
                topic: function() {
                    return test.postArray['FromEmail'].length;
                },
                "the lengths match": function(topic) {
                    assert.equal(topic, initData.fromEmail.length)
                }
            }, 'when examining the from name' : {
                topic: function() {
                    return test.postArray['FromName'].length;
                },
                "the lengths match": function(topic) {
                    assert.equal(topic, initData.fromName.length)
                }
            }, 'when examining the plain message length' : {
                topic: function() {
                    return test.postArray['MessagePlain'].length;
                },
                "the lengths match": function(topic) {
                    assert.equal(topic, initData.messagePlain.length)
                }
            }
        }).run({reporter : require("vows/reporters/spec")});


/* console.log("---------------------");
test.sendToJango().then(function(res) {
    console.log(res);
}); */
