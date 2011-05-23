var comb = require("comb"), BJR = require("./basejangorequest.js");

exports.SendMassJangoEmail = comb.define(BJR.BaseJangoRequest, {
    instance : {
        path : "/api.asmx/SendMassEmail",
        /**
         * SendMassJangoEmail does as described.  You pass in the required items,
         * make a call to sendToJango, and blamo, you have send your first mass
         * email.
         *
         * @constructor
         * @augments BaseJangoRequest
         */
        constructor : function(params) {
            params = comb.merge({fromEmail : "", fromName : "", subject : "", messagePlain : "", messageHtml : ""}, params);
            this.super(arguments);
        },
        setters: {

            /**
             * Sets the plain text message to be sent out in this mass email.
             *
             * @param {String} message A string containing the plain text formatted message.
             */
            messagePlain : function(message) {
                this.postArray["MessagePlain"] = message;
            },

            /**
             * Sets the HTML formatted message to be sent out in this mass email.
             *
             * @param {String} message A string containing the HTML formatted message.
             */
            messageHtml : function(message) {
                this.postArray["MessageHTML"] = message;
            },

            /**
             * Sets the subject line.
             *
             * @param {String} subject Email subject.
             */
            subject : function(subject) {
                this.postArray["Subject"] = subject;
            },

            /**
             * Sets the from address.
             *
             * @param {String} fromAddress From address.
             */
            fromEmail : function(fromAddress) {
                this.postArray["FromEmail"] = fromAddress;
            },

            /**
             * Sets the from name.
             *
             * @param {String} fromName From name.
             */
            fromName : function(fromName) {
                this.postArray["FromName"] = fromName;
            }
        }
    }
});
