var comb = require("comb"), BJR = require("./basejangorequest.js");

exports.JangoJobUtil = comb.define(BJR.BaseJangoRequest, {
            instance : {

                /** @lends JangoJobUtil.prototype */

                /**
                 * JangoJobUtil provides a set of methods to manage Jango campaigns.  You set the job id,
                 * make a call to one of the provided methods and *blamo* you have stopped/paused/resumed/resent
                 * a previous campaign.
                 *
                 * @constructs
                 * @augments an object containing parameters to init the sender.
                 */
                constructor : function(params) {
                    params = comb.merge({jobId : -1}, params);
                    this.super(arguments);
                },

                /**
                 * Tells Jango to cancel a job.  <b>NOTE:</b> This will permanently delete
                 * the job from Jango's report list never to be seen again.
                 *
                 * @return {Promise} A promise that will receive a message like:
                 * <pre><code>
                 *     { "code" : int,
                 *       "error" : String,
                 *       "jobid" : int
                 *     }
                 * </code><pre>
                 */
                cancelJob : function() {
                    path : "/api.asmx/DeleteMassEmail",
                    this.sendToJango();
                },

                /**
                 * Tells Jango to pause a job.  Start it again by calling
                 * {@link  JangoJobUtil.resume}.
                 *
                 * @return {Promise} A promise that will receive a message like:
                 * <pre><code>
                 *     { "code" : int,
                 *       "error" : String,
                 *       "jobid" : int
                 *     }
                 * </code><pre>
                 */
                pauseJob : function() {
                    path : "/api.asmx/PauseMassEmail",
                    this.sendToJango();
                },

                /**
                 * Tells Jango to resume a job.
                 *
                 * @return {Promise} A promise that will receive a message like:
                 * <pre><code>
                 *     { "code" : int,
                 *       "error" : String,
                 *       "jobid" : int
                 *     }
                 * </code><pre>
                 */
                resumeJob : function() {
                    path : "/api.asmx/ResumeMassEmail",
                    this.sendToJango();
                },

                /**
                 * Tells Jango to resend a job.  Remember to set the to list and other such
                 * things so it knows where to send the message.
                 *
                 * @return {Promise} A promise that will receive a message like:
                 * <pre><code>
                 *     { "code" : int,
                 *       "error" : String,
                 *       "jobid" : int
                 *     }
                 * </code><pre>
                 */
                resendJob : function() {
                    path : "/api.asmx/SendMassEmailPrevious2",
                    this.sendToJango();
                },

                setters: {

                    /** @lends ResendMassJangoEmail.prototype */

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


