var comb = require("comb"), http = require("http"), queryString = require("querystring");
https = require("https");

exports.BaseJangoRequest = comb.define(null, {

    instance : {
        server : "api.jangomail.com",

        port : 443,

        ssl : true,

        callback : null,

        path : "",

        responseBody : "",

        __contactFormat : "",

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
                code : serverResponse.statusCode,
                error :"",
                jobid : 0
            };
            var data = "";
            var jobIdCheck = this.pattern;
            serverResponse.setEncoding("UTF-8");
            serverResponse.on('data', function(chunk) {
                data += chunk.toString();
            });
            serverResponse.on("end", function() {
                if(status.code != 200) {
                    status.error = data;
                } else {
                    if(jobIdCheck.test(data)) {
                        status.jobid = jobIdCheck.exec(data)[1];
                    } else {
                        status.jobid = -999;
                    }
                }
                promise.callback(status);
            });
        },

        /**
         * Makes the POST to Jango.
         *
         * @param {function} callback A function that will be called when the POST is complete.
         * @return {Object} The callback function will receive an object with a JSON of:
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

            /**
             * Sets the login to be used to interface with JangoMail.
             *
             * @param {String} username A valid username.
             */
            username : function(username) {
                this.postArray.Username = username;
            },

            /**
             * Sets the login password to be used to interface with JangoMail.
             *
             * @param {String} password A valid password for the username.
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
             * @param {Array} toList An array of 'To' email addresses.
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
             * @param {boolean} useSsl True or false, you decide.
             */
            useSsl : function(useSsl) {
                this.ssl = useSsl;
                this.port = useSsl ? 443 : 80;
            },

            /**
             * A list of field names that correspond to the email list.
             *
             * @param {String[]} fields An array of strings.
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
             * @param {Object} contacts An object containing field names and 'To' email addresses.
             */
            contactInfo : function(contacts) {
                this.__fieldNames = contacts.fieldNames;
                this.__emailList = contacts.addresses;
            }
        }
    }
});