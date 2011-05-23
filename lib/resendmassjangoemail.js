var comb = require("comb"), BJR = require("./basejangorequest.js");

exports.ResendMassJangoEmail = comb.define(BJR.BaseJangoRequest, {
    instance : {
        path : "/api.asmx/SendMassEmailPrevious2",
        /**
         * ResendMassJangoEmail does as described.  You pass in the required items,
         * make a call to sendToJango, and blamo, you have resend a previous mass
         * email.
         *
         * @constructor
         * @augments BaseJangoRequest
         */
        constructor : function(params) {
            params = comb.merge({jobId : -1}, params);
            this.super(arguments);
        },
        setters: {
            /**
             * When ever a job is submitted from {@link BaseJangoRequest}, a job number is returned.
             * That number can then be reused to send another mass email.
             *
             * @param {int} id A valid ID from a previous job.
             */
            jobId : function(id) {
                this.postArray.JobID = id;
            }
        }
    }
});


