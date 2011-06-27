var comb = require("comb"),
        http = require("http"),
        queryString = require("querystring"),
        https = require("https");

exports.BaseJangoRequest = comb.define(null, {

            instance : {
                /** @lends BaseJangoRequest.prototype */
                server : "api.jangomail.com",

                port : 443,

                ssl : true,

                callback : null,

                path : "",

                responseBody : "",

                __contactFormat : "",

                __toInformation : "",

                __time : "",

                __timeOffset : 14400000, // Offset to get to EDT

                /**
                 * BaseJangoRequest object used as a basis for request to JangoMail.
                 *
                 * @constructs
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
                 */
                constructor : function(params) {
                    this.pattern = /SUCCESS\n(\d+)<\/string>$/;
                    this.postArray = {
                        Username : "",
                        Password : "",
                        ToGroups : "",
                        ToGroupFilter  : "",
                        ToOther : "",
                        ToWebDatabase : "",
                        Options : ""
                    };
                    comb.merge(this, params); // Merges all specified params into object
                },

                /**
                 * If set, this will tell Jango to hold off sending the mass email until
                 * the specified time.
                 *
                 * @param {Integer} stamp Epoch time in milliseconds.
                 */
                setSendTime : function(stamp) {
                    var stampDate = new Date(stamp);
                    var adjusted = stampDate.getTime() + stampDate.getTimezoneOffset() * 60000; // Remove local timezone
                    var start = new Date(adjusted - this.__timeOffset); // Set it to EDT
                    var month = start.getMonth() + 1;
                    this.__time = month + "-" + start.getDate() + "-" + start.getFullYear() +
                            " " + start.toLocaleTimeString();
                },

                /**
                 * Clears the send time so any email sent will be immediate.
                 *
                 */
                clearSendTime : function() {
                    this.__time = "";
                },


                __handleResponse : function(promise, serverResponse) {
                    var status = {
                        Status : serverResponse.statusCode,
                        Error :"",
                        JobID : 0
                    };
                    var data = "";
                    var jobIdCheck = this.pattern;
                    serverResponse.setEncoding("UTF-8");
                    serverResponse.on('data', function(chunk) {
                        data += chunk.toString();
                    });
                    serverResponse.on("end", function() {
                        if (status.Status != 200) {
                            status.Error = data;
                        } else {
                            if (jobIdCheck.test(data)) {
                                status.JobID = jobIdCheck.exec(data)[1];
                            } else {
                                status.JobID = -999;
                            }
                        }
                        promise.callback(status);
                    });
                },

                /**
                 * Makes the POST to Jango.
                 *
                 * @return {Promise} A promise that will receive a message like:
                 * <pre class="code">
                 *     { "code" : int,
                 *       "error" : String,
                 *       "jobid" : int
                 *     }
                 * <pre>
                 */
                sendToJango : function() {
                    var ret = new comb.Promise();
                    this.postArray["Options"] = this.__toInformation;
                    if (this.__time.length > 0) {
                        this.postArray["Options"] += ",SendDate=" + this.__time;
                    }
                    var postBody = queryString.stringify(this.postArray);
                    var options = {
                        host: this.server,
                        port: this.port,
                        path: this.path,
                        method: 'POST',
                        headers: {
                            "Content-Length": postBody.length,
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    };
                    var client = this.ssl ? https : http;
                    var req = client.request(options, comb.hitch(this, this.__handleResponse, ret));
                    req.write(postBody);
                    req.end();
                    return ret;
                },

                setters : {

                    /** @lends BaseJangoRequest.prototype */

                    /**
                     * Sets the login to be used to interface with JangoMail.
                     *
                     * @field
                     */
                    username : function(username) {
                        this.postArray.Username = username;
                    },

                    /**
                     * Sets the login password to be used to interface with JangoMail.
                     *
                     * @field
                     */
                    password : function(password) {
                        this.postArray.Password = password;
                    },

                    /**
                     * Sets the list of target email address to send a message to.  The array
                     * should follow something like the following JSON notation:
                     * <pre><code>
                     *     [ {"firstName": "John", "lastName": "Smith", "email": "john.smith@home.com"}]
                     * </code></pre>
                     *
                     * @field
                     *
                     * @throws Error if either the 'To' list is empty or one of the entries doesn't have an address.
                     * @private
                     */
                    __emailList : function(toList) {
                        var listLength = toList.length;
                        if (listLength < 1) {
                            throw "JangoRequestException:  \"To\" list was empty.";
                        }
                        var contacts = [], format = comb.string.format;
                        for (var i = listLength - 1; i >= 0; i--) {
                            contacts.push(format(this.__contactFormat, toList[i]));
                        }
                        this.postArray.ToOther = contacts.join("|");
                    },

                    /**
                     * Should SSL be used?  Set that here.
                     *
                     * @field
                     */
                    useSsl : function(useSsl) {
                        this.ssl = useSsl;
                        this.port = useSsl ? 443 : 80;
                    },

                    /**
                     * A list of field names that correspond to the email list.
                     *
                     * @field
                     * @private
                     */
                    __fieldNames: function(fields) {
                        this.__toInformation = "ToOtherRowDelimiter=|,ToOtherColDelimiter=c,ToOtherFieldNames=";
                        var length = fields.length;
                        this.__contactFormat = "";
                        for (var i = 0; i < length; i++) {
                            var field = fields[i];
                            this.__toInformation += field + (i == (length - 1) ? "" : "|");
                            this.__contactFormat += "{" + field + "}" + (i == (length - 1) ? "" : ",");
                        }
                        this.fields = fields;
                    },

                    /**
                     * Sets the list of target email address to send a message to and their field names.  The object
                     * should follow this JSON:
                     * <pre class="code">
                     *     {
                     *       "contacts" : [ {"firstName": "John", "lastName": "Smith", "emailAddress": "john.smith@home.com"}],
                     *       "fieldNames" : ["firstName", "lastName", "emailAddress"]
                     *     }
                     * </pre>
                     *
                     * @field
                     */
                    contactInfo : function(contacts) {
                        this.__fieldNames = contacts.fieldNames;
                        this.__emailList = contacts.addresses;
                    }
                }
            }
        });