#js-jango

##Overview

Node implementation of the JangoMail API (see http://api.jangomail.com/).

The library currently allows you to:

*  Send a mass email campaign
*  Pause a campaign
*  Resume a campaign
*  Cancel a campaign
*  Resend a campaign

##Example Usage
```javascript
var SendMassEmail = require("js-jango").SendMassEmail;

var fieldNames = ["FirstName","LastName","EmailAddress"];
var testContacts = [ {FirstName: "Bryan", LastName: "Rockwood", EmailAddress: "bryan.rockwood@pollenware.com"} ];
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

test.sendToJango().then(function(res) {
    // Do crazy stuff with the return response.....
});
```

## Installation

  npm install js-jango

##Usage

* [BaseJangoRequest](http://pollenware.github.com/js-jango/symbols/BaseJangoRequest.html) The base class handles
communication with the Jango API.
* Sub-classes
  *  [SendMassJangoEmail](http://pollenware.github.com/js-jango/symbols/jsJango.SendMassJangoEmail.html) Sets up a campaign.
  *  [JangoJobUtil](http://pollenware.github.com/js-jango/symbols/jsJango.JangoJobUtil.html) Manages an existing campaign.

##License

MIT <https://github.com/Pollenware/moose/raw/master/LICENSE>

##Meta

* Code: `git clone git://github.com/pollenware/js-jango.git`
* JsDoc: <http://pollenware.github.com/js-jango>
* Website:  <http://pollenware.com> - Twitter: <http://twitter.com/pollenware> - 877.465.4045
