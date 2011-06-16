var comb = require("comb"), BJR = require("./basejangorequest.js");

exports.SendMassJangoEmail = comb.define(BJR.BaseJangoRequest, {
    instance : {

        /** @lends SendMassJangoEmail.prototype */

        path : "/api.asmx/SendMassEmail",

        /**
         * SendMassJangoEmail does as described.  You pass in the required items,
         * make a call to sendToJango, and blamo, you have send your first mass
         * email.
         *
         * @constructs
         * @augments BaseJangoRequest
         */
        constructor : function(params) {
            params = comb.merge({fromEmail : "", fromName : "", subject : "", messagePlain : "", messageHtml : ""}, params);
            this.super(arguments);
        },
        setters: {

            /** @lends SendMassJangoEmail.prototype */

            /**
             * Sets the plain text message to be sent out in this mass email.
             *
             * @field
             */
            messagePlain : function(message) {
                this.postArray["MessagePlain"] = message;
            },

            /**
             * Sets the HTML formatted message to be sent out in this mass email.
             *
             * @field
             */
            messageHtml : function(message) {
                this.postArray["MessageHTML"] = message;
            },

            /**
             * Sets the subject line.
             *
             * @field
             */
            subject : function(subject) {
                this.postArray["Subject"] = subject;
            },

            /**
             * Sets the from address.
             *
             * @field
             */
            fromEmail : function(fromAddress) {
                this.postArray["FromEmail"] = fromAddress;
            },

            /**
             * Sets the from name.
             *
             * @field
             */
            fromName : function(fromName) {
                this.postArray["FromName"] = fromName;
            }
        }
    }
});
