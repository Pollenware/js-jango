/**
 * Created by IntelliJ IDEA.
 * User: pollen
 * Date: 5/12/11
 * Time: 10:13 AM
 * To change this template use File | Settings | File Templates.
 */

var RMJE = require("../lib/resendmassjangoemail.js");

var fieldNames = ["FirstName","LastName","EmailAddress"];
var testContacts = JSON.parse("[ {\"FirstName\": \"Bryan\", \"LastName\": \"Rockwood\", \"EmailAddress\": \"bryan.rockwood@rockhouse.org\"}]");
var contactInfo = {"fieldNames" : fieldNames, "addresses" : testContacts};

var test = new RMJE.ResendMassJangoEmail({
    username : "username",
    password : "password",
    server : "api.jangomail.com",
    jobId : 261496805,
    contactInfo: contactInfo
});

console.log(test.postArray);
console.log("---------------------");
test.sendToJango().then(function(res) {
    console.log(res);
});

