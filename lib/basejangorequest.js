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

                /**
                 * BaseJangoRequest object used as a basis for request to JangoMail.
                 *
                 * @constructs
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
                        Options : "ToOtherRowDelimiter=|,ToOtherColDelimiter=c,"
                    };
                    comb.merge(this, params); // Merges all specified params into object
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
                 * <pre><code>
                 *     { "code" : int,
                 *       "error" : String,
                 *       "jobid" : int
                 *     }
                 * </code><pre>
                 */
                sendToJango : function() {
                    var ret = new comb.Promise();
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
                        this.postArray["Options"] += "ToOtherFieldNames=";
                        var length = fields.length;
                        this.__contactFormat = "";
                        for (var i = 0; i < length; i++) {
                            var field = fields[i];
                            this.postArray["Options"] += field + (i == (length - 1) ? "" : "|");
                            this.__contactFormat += "{" + field + "}" + (i == (length - 1) ? "" : ",");
                        }
                        this.fields = fields;
                    },

                    /**
                     * Sets the list of target email address to send a message to and their field names.  The object
                     * should follow this JSON:
                     * <pre><code>
                     *     {
                     *       "contacts" : [ {"firstName": "John", "lastName": "Smith", "emailAddress": "john.smith@home.com"}],
                     *       "fieldNames" : ["firstName", "lastName", "emailAddress"]
                     *     }
                     * </code></pre>
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