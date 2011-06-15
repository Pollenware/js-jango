var SMJE = require("../lib/sendmassjangoEmail.js");
var fieldNames = ["FirstName","LastName","EmailAddress"];
var testContacts = JSON.parse("[ {\"FirstName\": \"Bryan\", \"LastName\": \"Rockwood\", \"EmailAddress\": \"bryan.rockwood@rockhouse.org\"}]");
var contactInfo = {"fieldNames" : fieldNames, "addresses" : testContacts};

var test = new SMJE.SendMassJangoEmail({
            username : "username",
            password : "password",
            server : "api.jangomail.com",
            subject : "Howdy Ho, %%FirstName%%!",
            fromEmail : "node-jango@pollenware.com",
            fromName : "New JangoMail Node Interface",
            messagePlain : "Greetings %%FirstName%% %%LastName%%,\n\nThis is a test of the Node interface to JangoMail.  Your email address is %%EmailAddress%%.  Have a great day!\n\n\n -- BaseJangoRequest (BJR) OUT!",
            contactInfo: contactInfo
        });
console.log(test.postArray);
console.log("---------------------");
test.sendToJango().then(function(res) {
    console.log(res);
});
