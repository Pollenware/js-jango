var comb = require("comb"), BJR = require("./basejangorequest.js");

exports.JangoJobUtil = comb.define(BJR.BaseJangoRequest, {
            instance : {

                /** @lends jsJango.JangoJobUtil.prototype */

                /**
                 * JangoJobUtil provides a set of methods to manage Jango campaigns.  You set the job id,
                 * make a call to one of the provided methods and *blamo* you have stopped/paused/resumed/resent
                 * a previous campaign.
                 *
                 * @constructs
                 * @augments BaseJangoRequest
                 *
                 * @param {Obejct} params default options to set.
                 * @param {Number} [params.jobId = -1] the jobId to set.
                 * @param {Object} params the default options to set on this Request.
                 * @param {String} [params.username] the user name to login to jango with
                 * @param {String} [params.password] password to login with
                 * @param {Boolean} [param.useSsl=true] set to false to not use SSL when connecting to jango.
                 * @param {String} [param.server="api.jangomail.com"] the jango server to connect to.
                 * @param {Integer} [param.port=443] the port to use when connecting to jango
                 * @param {Object} [param.contactInfo] Sets the list of target email address to send a message to and their field names.
                 *                                     The object should follow this JSON:
                 * <pre class="code">
                 *     {
                 *       "contacts" : [ {
                 *                          "firstName": "John",
                 *                          "lastName": "Smith",
                 *                          "emailAddress": "john.smith@home.com"
                 *                    }],
                 *       "fieldNames" : ["firstName", "lastName", "emailAddress"]
                 *     }
                 * </pre>
                 */
                constructor : function(params) {
                    params = comb.merge({jobId : -1}, params);
                    this.super(arguments);
                },

                /**
                 * Tells Jango to cancel a job.
                 * <br/>
                 * <b>NOTE:</b> This will permanently delete the job from Jango's report list never to be seen again.
                 *
                 * @return {Promise} A promise that will receive a message like:
                 * <pre class="code">
                 *     { "code" : int,
                 *       "error" : String,
                 *       "jobid" : int
                 *     }
                 * <pre>
                 */
                cancelJob : function() {
                    this.path = "/api.asmx/DeleteMassEmail";
                    return this.sendToJango();
                },

                /**
                 * Tells Jango to pause a job.  Start it again by calling
                 * {@link  JangoJobUtil.resume}.
                 *
                 * @return {Promise} A promise that will receive a message like:
                 * <pre class="code">
                 *     { "code" : int,
                 *       "error" : String,
                 *       "jobid" : int
                 *     }
                 * <pre>
                 */
                pauseJob : function() {
                    this.path = "/api.asmx/PauseMassEmail";
                    return this.sendToJango();
                },

                /**
                 * Tells Jango to resume a job.
                 *
                 * @return {Promise} A promise that will receive a message like:
                 * <pre class="code">
                 *     { "code" : int,
                 *       "error" : String,
                 *       "jobid" : int
                 *     }
                 * <pre>
                 */
                resumeJob : function() {
                    this.path = "/api.asmx/ResumeMassEmail";
                    return this.sendToJango();
                },

                /**
                 * Tells Jango to resend a job.  Remember to set the to list and other such
                 * things so it knows where to send the message.
                 *
                 * @return {Promise} A promise that will receive a message like:
                 * <pre class="code">
                 *     { "code" : int,
                 *       "error" : String,
                 *       "jobid" : int
                 *     }
                 * <pre>
                 */
                resendJob : function() {
                    this.path = "/api.asmx/SendMassEmailPrevious2";
                    return this.sendToJango();
                },

                setters: {

                    /** @lends jsJango.JangoJobUtil.prototype */

                    /**
                     * When ever a job is submitted from {@link BaseJangoRequest}, a job number is returned.
                     * That number can then be reused to send another mass email.
                     *
                     * @field
                     */
                    jobId : function(id) {
                        this.postArray.JobID = id;
                    }
                }
            }
        });


