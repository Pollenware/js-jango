var comb = require("comb"), BJR = require("./basejangorequest.js");

exports.SendMassJangoEmail = comb.define(BJR.BaseJangoRequest, {
            instance : {

                /** @lends jsJango.SendMassJangoEmail.prototype */

                path : "/api.asmx/SendMassEmail",

                /**
                 * SendMassJangoEmail does as described.  You pass in the required items,
                 * make a call to sendToJango, and blamo, you have send your first mass
                 * email.
                 *
                 * @constructs
                 * @augments BaseJangoRequest
                 *
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
                 *
                 * @param {String} [params.messagePlain] Sets the plain text message to be sent out in this mass email.
                 * @param {String} [params.messageHtml] Sets the HTML formatted message to be sent out in this mass email.
                 * @param {String} [params.subject] Sets the subject line.
                 * @param {String} [params.fromEmail] Sets the from address.
                 * @param {String} [params.fromName] Sets the from name.
                 */
                constructor : function(params) {
                    params = comb.merge({fromEmail : "", fromName : "", subject : "", messagePlain : "", messageHtml : ""}, params);
                    this.super(arguments);
                },
                setters: {

                    /** @lends jsJango.SendMassJangoEmail.prototype */

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
