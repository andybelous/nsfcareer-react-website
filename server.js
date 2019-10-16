// ======================================
//         INITIALIZING DEPENDENCIES
// ======================================
const express = require('express');
app = express(),
    bodyParser = require("body-parser"),
    AWS = require('aws-sdk'),
    cors = require('cors'),
    AmazonCognitoIdentity = require('amazon-cognito-identity-js'),
    utility = require('./utilities/utility'),
    VerifyToken = require('./verify_user'),
    cookieParser = require('cookie-parser'),
    archiver = require("archiver"),
    fs = require("fs"),
    path = require("path"),
    uploadFile = require("./upload.js"),
    global.fetch = require('node-fetch'),
    config_env = require("./config/configuration_keys"),
    ms = require("ms"),
    multer = require('multer'),
    XLSX = require('xlsx'),
    request = require('request'),
    moment = require('moment');

// ================================================
//            SERVER CONFIGURATION
// ================================================


global.navigator = () => null;


// ======================================
//         	GLOBAL VARIABLES
// ======================================
const successMessage = "success";
const failureMessage = "failure";
const apiPrefix = "/"
console.log("DOMAIN IS ", process.env.DOMAIN);
// ======================================
//       CONFIGURING AWS SDK & EXPESS
// ======================================

// Avatar Configuration
var config = require("./config/configuration_keys");
//AWS.config.loadFromPath('./config/configuration_keys.json');
const BUCKET_NAME = config_env.usersbucket;

// AWS Credentials loaded
var myconfig = AWS.config.update({
    accessKeyId: config_env.awsAccessKeyId, secretAccessKey: config_env.awsSecretAccessKey, region: config_env.region
});
// Cognito Configurationo
var cognito = {
    userPoolId: config_env.userPoolId,
    region: config_env.region,
    apiVersion: config_env.apiVersion,
    ClientId: config_env.ClientId
}
console.log(cognito);


// Multer Configuration


var storage = multer.memoryStorage()
var upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        //var ext = path.extname(file.originalname);
        console.log("This is filename ------> \n",file.originalname);

        let jpgFile = new RegExp(".jpg").test(file.originalname);
        let jpegFile = new RegExp(".jpeg").test(file.originalname);
        let pngFile = new RegExp(".png").test(file.originalname);

        if (!jpgFile && !jpegFile && !pngFile) {
            // res.send({message : "FAILURE"});
            req.body["file_error"] = "Only jpeg,jpg are allowed"
        }
        callback(null, true)
    }
    // limits:{
    //     fileSize: 1024 * 1024
    // }
});

var uploadSensorData = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        //var ext = path.extname(file.originalname);
        console.log("This is filename ------> \n",file.originalname);

        let csv = new RegExp(".csv").test(file.originalname);
        let csv_upper = new RegExp(".CSV").test(file.originalname);
        let excel = new RegExp(".xlsx").test(file.originalname);
        let excelx = new RegExp(".xls").test(file.originalname);
        if (!csv && !csv_upper && !excel && !excelx) {
            // res.send({message : "FAILURE"});
            req.body["file_error"] = "Only .csv , .xlsx file is allowed"
        }
        callback(null, true)
    }
    // limits:{
    //     fileSize: 1024 * 1024
    // }
});

var uploadModelRealData = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        //var ext = path.extname(file.originalname);
        console.log("This is filename ------> \n",file.originalname);

        let csv = new RegExp(".csv").test(file.originalname);
        let csv_upper = new RegExp(".CSV").test(file.originalname);
        let excel = new RegExp(".xlsx").test(file.originalname);
        let excelx = new RegExp(".xls").test(file.originalname);
        if (!csv && !csv_upper && !excel && !excelx) {
            // res.send({message : "FAILURE"});
            req.body["file_error"] = "Only .csv , .xlsx file is allowed"
        }
        callback(null, true)
    }
    // limits:{
    //     fileSize: 1024 * 1024
    // }
});

// AWS S3 & Other Controllers Configuration
const awsWorker = require('./controllers/aws.controller.js');


var s3 = new AWS.S3();

// Cognito client who initializes the AWS Credentials to invoke
// commands on behalf of the developer
var COGNITO_CLIENT = new AWS.CognitoIdentityServiceProvider({
    apiVersion: cognito.apiVersion,
    region: cognito.region
});

// DynamoDB Object created to do SCAN , PUT , UPDATE operations
const docClient = new AWS.DynamoDB.DocumentClient({
    convertEmptyValues: true
});

// Express configured for POST Request handling of multiple types
// xxx-url encoded (form type)  & json type
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
// app.use(cors(
//     {
//         origin: [process.env.DOMAIN],
//         credentials: true
//     }
// ));

app.use(express.static(path.join(__dirname, 'client', 'build')));

function setConnectionTimeout(time) {
    var delay = typeof time === 'string'
        ? ms(time)
        : Number(time || 5000);

    return function (req, res, next) {
        res.connection.setTimeout(delay);
        next();
    }
}

// ============================================
//     FUNCTIONS OR IMPLEMENTATIONS
// ============================================



let users = [];
let paginationToken = "";

// Function list all users
// user_attributes only takes required or user attributes defined
// in cognito not custom attributes
function listAllUsers(user_attributes, cb) {

    let params = {
        "AttributesToGet": user_attributes, // Pass an array to it
        "UserPoolId": cognito.userPoolId,
    };

    if (paginationToken) {
        params["PaginationToken"] = paginationToken
    }


    COGNITO_CLIENT.listUsers(params, function (err, data) {
        if (err) {
            cb(err, ""); // an error occurred
        } else {
            if (data.PaginationToken == undefined) {
                users.push(data.Users);
                paginationToken = "";
                cb("", utility.concatArrays(users)); // successful response
                users = [];
            } else {
                paginationToken = data.PaginationToken;
                users.push(data.Users);
                listAllUsers(user_attributes, cb);
            }
        }
    });
}


// Enable the user in cognito
function enableUser(user_name, cb) {
    var params = {

        UserPoolId: cognito.userPoolId,
        /* required */
        Username: user_name /* required */
    };
    COGNITO_CLIENT.adminEnableUser(params, function (err, data) {
        if (err) cb(err, "") // an error occurred
        else {
            cb("", data);
        } // successful response
    });
}

// Disable the users in cognito
function disableUser(user_name, cb) {
    var params = {
        UserPoolId: cognito.userPoolId,
        /* required */
        Username: user_name /* required */
    };
    COGNITO_CLIENT.adminDisableUser(params, function (err, data) {
        if (err) cb(err, "") // an error occurred
        else {
            cb("", data);
        } // successful response
    });

}

// Get List of groups of which user is member
// Like Admin,Associate etc
function getListGroupForUser(user_name, cb) {
    var params = {
        UserPoolId: cognito.userPoolId,
        /* required */
        Username: user_name,
        /* required */
    };
    COGNITO_CLIENT.adminListGroupsForUser(params, function (err, data) {
        if (err) {
            cb(err.code, "");
        } // an error occurred
        else {
            cb("", data.Groups);
        } // successful response
    });
}

function getFileSignedUrl(key, cb) {

    var params = {
        Bucket: BUCKET_NAME,
        Key: key
    };
    s3.getSignedUrl('getObject', params, function (err, url) {
        if (err) {
            cb(err, "");
        } else {
            cb("", url);
        }
    });
}


// Get user details & all his attributes
function getUser(user_name, cb) {

    var params = {
        UserPoolId: cognito.userPoolId,
        /* required */
        Username: user_name /* required */
    };
    COGNITO_CLIENT.adminGetUser(params, function (err, data) {
        if (err) {
            cb(err.code, "");
        } // an error occurred
        else {
            cb("", data);
        } // successful response
    });
}


function createUserDbEntry(event, callback) {
    var dbInsert = {};
    // adding key with name user_cognito_id
    // deleting the key from parameter from "user_name"
    event["user_cognito_id"] = event.user_name;
    delete event.user_name;
    dbInsert = {
        TableName: "users",
        Item: event
    }


    docClient.put(dbInsert, function (dbErr, dbData) {
        if (dbErr) {
            callback(dbErr, null);
            console.log(dbErr);
        }
        else {
            console.log(dbData);
            callback(null, event);
        }
    });
}


function getUploadedImageFileList(user_name, cb) {
    const s3Params = {
        Bucket: BUCKET_NAME,
        Delimiter: '/',
        Prefix: user_name + '/profile/image/'
        // Key: req.query.key + ''
    };

    s3.listObjectsV2(s3Params, (err, data) => {
        if (err) {
            //   console.log(err);
            cb(err, "");
        }
        console.log(data);
        cb("", data.Contents);
    });

}

function getUploadedModelFileList(user_name, cb) {
    const s3Params = {
        Bucket: BUCKET_NAME,
        Delimiter: '/',
        Prefix: user_name + '/profile/model/'
        // Key: req.query.key + ''
    };

    s3.listObjectsV2(s3Params, (err, data) => {
        if (err) {
            //   console.log(err);
            cb(err, "");
        }
        console.log(data);
        cb("", data.Contents);
    });

}

function getSimulationFile(user_name, cb) {
    const s3Params = {
        Bucket: BUCKET_NAME,
        Delimiter: '/',
        Prefix: user_name + '/profile/simulation/'
        // Key: req.query.key + ''
    };

    s3.listObjectsV2(s3Params, (err, data) => {
        if (err) {
            //   console.log(err);
            cb(err, "");
        }
        console.log(data);
        cb("", data.Contents);
    });

}

function getUploadedInpFileList(user_name, cb) {
    const s3Params = {
        Bucket: BUCKET_NAME,
        Delimiter: '/',
        Prefix: user_name + '/profile/rbf/'
        // Key: req.query.key + ''
    };

    s3.listObjectsV2(s3Params, (err, data) => {
        if (err) {
            //   console.log(err);
            cb(err, "");
        }

        cb("", data.Contents);
    });

}

// Function to authenticate user credentials
function login(user_name, password, user_type, cb) {

    const poolData = {
        UserPoolId: cognito.userPoolId, // Your user pool id here
        ClientId: cognito.ClientId // Your client id here
    };

    var pool_region = cognito.region;
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: user_name,
        Password: password,
    });

    var userData = {
        Username: user_name,
        Pool: userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            // Data received on successfull authentication
            // console.log('access token + ' + result.getAccessToken().getJwtToken());
            // console.log('id token + ' + result.getIdToken().getJwtToken());
            // console.log('refresh token + ' + result.getRefreshToken().getToken());

            cb("", result);
        },
        onFailure: function (err) {
            // console.log(err);
            console.log(err);
            cb(err.message, "");
        }
    });
}

function loginFirstTime(user, cb) {
    const poolData = {
        UserPoolId: cognito.userPoolId, // Your user pool id here
        ClientId: cognito.ClientId // Your client id here
    };

    // var pool_region = 'ap-south-1';
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: user.user_name,
        Password: user.password,
    });

    var userData = {
        Username: user.user_name,
        Pool: userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            // console.log('access token + ' + result.getAccessToken().getJwtToken());
            // console.log('id token + ' + result.getIdToken().getJwtToken());
            // console.log('refresh token + ' + result.getRefreshToken().getToken());
            cb("", result);
        },
        onFailure: function (err) {

            cb(err.message, "");
        },
        newPasswordRequired: function (userAttributes, requiredAttributes) {

            // User was signed up by an admin and must provide new
            // password and required attributes, if any, to complete
            // authentication.

            // the api doesn't accept this field back
            delete userAttributes.email_verified;

            // Custom attributes can be also set if we want
            // userAttributes.custom_blood_group = "O+";

            // unsure about this field, but I don't send this back
            delete userAttributes.phone_number_verified;

            // Get these details and call
            cognitoUser.completeNewPasswordChallenge(user.new_password, userAttributes, this);
        }

    });
}


// Function to get Verification Status of the User
function getVerificationStatus(user_name, cb) {
    var db_table = {
        TableName: 'users',
        Key: {
            "user_name": user_name
        }
    };
    docClient.get(db_table, function (err, data) {
        if (err) {

            cb(err, "");

        } else {

            cb("", data);
        }
    });
}


function addUserDetailsToDb(user_details, cb) {
    var dbInsert = {
        TableName: "users",
        Item: user_details
    };
    docClient.put(dbInsert, function (err, data) {
        if (err) {

            cb(err, "");

        } else {

            cb("", data);
        }
    });
}



function getUserDbData(user_name, cb) {
    var db_table = {
        TableName: 'users',
        Key: {
            "user_cognito_id": user_name
        }
    };
    docClient.get(db_table, function (err, data) {
        if (err) {

            cb(err, "");

        } else {

            cb("", data);
        }
    });
}





// Function to create User by Admin
function adminCreateUser(User, cb) {
    var params = {
        UserPoolId: cognito.userPoolId, /* required */
        Username: User.user_name, /* required */
        DesiredDeliveryMediums: [
            "EMAIL",
        ],
        UserAttributes: [
            {
                Name: 'phone_number', /* required */
                Value: User.phone_number
            },
            {
                Name: 'name', /* required */
                Value: User.name
            },
            {
                Name: 'email', /* required */
                Value: User.email
            },
            {
                Name: 'phone_number_verified',
                Value: 'true'
            },
            {
                Name: 'email_verified',
                Value: 'true'
            }
        ]
    };
    COGNITO_CLIENT.adminCreateUser(params, function (err, data) {
        if (err) {
            cb(err, "");
        } // an error occurred
        else {
            cb("", data);
        }             // successful response
    });
}


function addUserToGroup(event, callback) {


    var params = {
        UserPoolId: cognito.userPoolId,
        /* required */
        Username: event.userName,
        GroupName: event.user_type
    }
    COGNITO_CLIENT.adminAddUserToGroup(params, function (error, data_admin_group) {
        if (error) {
            console.log("==================\n", error)
            callback(error, null);
        } // an error occurred
        else {
            callback(null, data_admin_group)
        }
    });
}
function parseDate(date, arg, timezone) {
	// var result = 0, arr = arg.split(':')

    arg = arg.replace(".",":");
    var t = arg.split(":");
    var milliseconds ;
    var time_type ;
    milliseconds = t[3].split(" ")[0];
    // x stores parsed time format
    var x = "";
    if(t[3].indexOf('P') > -1){
        x = `${t[0]}:${t[1]}:${t[2]} ${t[3].split(" ")[1]}`
    }
    return moment.utc(date  + " , " +   x , 'MM/DD/YYYY , hh:mm:ss a', true).milliseconds(Number(milliseconds)).valueOf();
}


function convertXLSXDataToJSON(buf,cb){
    // york_data.xlsx

    var wb = XLSX.read(buf, {type:'buffer'});
    var sheet_name_list = wb.SheetNames;
    sheet_name_list.forEach(function(y) {
        var worksheet = wb.Sheets[y];
        var headers = {};
        var data = [];
        for(z in worksheet) {
            if(z[0] === '!') continue;
            //parse out the column, row, and value
            var col = z.substring(0,1);
            var row = parseInt(z.substring(1));
            var value = worksheet[z].v;

            //store header names
            if(row == 1) {

                if(value == "Athlete"){
                    value = "player_id"
                }
                 headers[col] = value
                                .split(" ")
                                .join("_")
                                .replace(/[{()}]/g, '')
                                .toLowerCase();
                continue;
            }

            if(!data[row]) data[row]={};

            data[row][headers[col]] = value;



        }
        //drop those first two rows which are empty
        data.shift();
        data.shift();
        var data_array = data.filter(function(el) {
            return el.false_positive == false;
        });
        console.log("The impact data found is ", data_array.length);
        for(var i = 0 ; i < data_array.length ; i++){
            var d = data_array[i];
            // TODO : Parse Date here
            data_array[i]["timestamp"] = Number(parseDate(d.date, d.time, d.time_zone)).toString();
        }
        cb(data_array);
    });

}

function convertDataToJSON(buf,cb){
    // york_data.xlsx

    var wb = XLSX.read(buf, {type:'buffer'});
    var sheet_name_list = wb.SheetNames;
    sheet_name_list.forEach(function(y) {
        var worksheet = wb.Sheets[y];
        var headers = {};
        var data = [];
        for(z in worksheet) {
            if(z[0] === '!') continue;
            //parse out the column, row, and value
            var col = z.substring(0,1);
            var row = parseInt(z.substring(1));
            var value = worksheet[z].v;

            //store header names
            if(row == 1) {

                if(value == "Athlete"){
                    value = "player_id"
                }
                 headers[col] = value
                                .split(" ")
                                .join("_")
                                .replace(/[{()}]/g, '')
                                .toLowerCase();
                continue;
            }

            if(!data[row]) data[row]={};

            data[row][headers[col]] = value;



        }
       
		//drop those first two rows which are empty
        data.shift();
        data.shift();
	   
        cb(data);
    });

}

function storeSensorData(sensor_data_array){
    return new Promise((resolve, reject) =>{
        var counter = 0 ;
        if(sensor_data_array.length == 0 ){
            resolve(true);
        }
        for(var i = 0 ; i < sensor_data_array.length ; i++){
            // TODO STORE SENSOR DATA
            let param = {
                TableName: "sensor_data",
                Item: sensor_data_array[i]
            };
            docClient.put(param, function (err, data) {
                counter++;
                if (err) {
                    console.log(err);
                    reject(err)
                }
                if(counter == sensor_data_array.length){
                    resolve(true);
                }
            })
        }
    })
}



// Function to fetch all the items of the table 'numbers' from DynamoDB
const fetchNumbers = () => {
    return new Promise(function (resolve, reject) {
        var params = {
            TableName: 'numbers'
        };
        //   var items
        var items = [];
        docClient.scan(params).eachPage((err, data, done) => {
            if (err) {
                reject(err);
            }
            if (data == null) {
                resolve(utility.concatArrays(items));
            } else {
                items.push(data.Items);
            }
            done();
        });
    })
}

const putNumbers = (numbersData) => {
    return new Promise(function (resolve, reject) {
        let param = {
            TableName: "numbers",
            Item: numbersData
        };
        docClient.put(param, function (err, data) {
            if (err) {
                console.log("ERROR IN TABLE_UPDATE=======\n", err);
                reject(err)
            }
            else {
                resolve(data)
            }
        })
    })
}

function getINPFile(user_id) {
    return new Promise((resolve, reject) => {
        // 1. Get Uploaded model list from user
        // 2. Generate SignedURL of the image
        // 3. Pass the signedURL to download the zip file
        // 4. Generate the INF File
        // 5. Store the INF File in /radio_basis_function/inf file
        getUploadedInpFileList(user_id, (err, list) => {
            if (err) {
                reject(err);
            }
            else {
                // Fetches the latest Model
                var latestModel = list.reduce(function (oldest, latest_model) {
                    return oldest.LastModified > latest_model.LastModified ? oldest : latest_model;
                }, {});

                // Getting the model key
                var model_key;
                if (list.length != 0) {
                    model_key = latestModel.Key;
                }
                else {
                    model_key = user_id + "/profile/rbf/";
                }
                // Generate SignedURL of the image
                getFileSignedUrl(model_key, (err, url) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(url);
                    }
                })
            }
        })

    })
}

// ============================================
//     				ROUTES
// ============================================

// app.get(`${apiPrefix}`, (req, res) => {
//     res.send("NSFCareeIO");
// })

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname,'client', 'build', 'index.html'));
});


app.post(`${apiPrefix}getNumbers`, (req, res) => {
    console.log("API CAlled");

    fetchNumbers().then((numbers) => {
        res.send({
            message: successMessage,
            data: numbers
        })
    }).catch((err) => {
        console.log("Error while fetching numbers", err)
        res.send({
            message: failureMessage,
            data: [],
            error: err
        })
    })
});

app.post(`${apiPrefix}putNumbers`, (req, res) => {
    console.log("API CAlled put", req.body);

    putNumbers(req.body).then((data) => {
        res.send({
            message: successMessage
        })
    }).catch((err) => {

        res.send({
            message: failureMessage,
            error: err
        })
    })
});
app.post(`${apiPrefix}signUp`, (req, res) => {



    // First we add an attirbute of `name` as cognito requires it from first_name and last_name
    req.body["name"] = req.body.first_name + req.body.last_name;
    req.body["email"] = req.body.user_name;
    req.body["is_selfie_image_uploaded"] = false;
    req.body["is_selfie_model_uploaded"] = false;
    req.body["is_selfie_inp_uploaded"] = false;
    req.body.phone_number = req.body.country_code.split(" ")[0] + req.body.phone_number ;
    req.body.country_code = req.body.country_code.split(" ")[0] ;
    console.log("-----------------------------\n",req.body,"----------------------------------------\n");
    adminCreateUser(req.body, function (err, data) {
        if (err) {
            console.log("COGNITO CREATE USER ERROR =========\n", err);

            res.send({
                message: "failure",
                error: err.message
            });
        }
        else {

            var UserData = data.User;
            //Now check type of User and give permission accordingly
            // res.send(data);
            // user_type
            // userName
            var tempData = {};
            tempData["user_name"] = UserData.Username;
            tempData["userName"] = UserData.Username;

            tempData["user_type"] = req.body.user_type;
            tempData["phone_number"] = req.body.phone_number;

            if (req.body.user_type == "Admin") {

                // Admin User
                var mergedObject = { ...req.body, ...tempData };
                delete mergedObject.userName;
                delete mergedObject.name;
                createUserDbEntry(mergedObject, function (dberr, dbdata) {
                    if (err) {
                        console.log("DB ERRRRRR =============================== \n", err);

                        res.send({
                            message: "faiure",
                            error: dberr.code
                        });
                    }
                    else {
                        // Add user to corresponding group...
                        // event.user_type
                        // event.user_name
                        console.log(tempData);

                        addUserToGroup(tempData, function (groupAddErr, groupData) {
                            if (groupAddErr) {

                                res.send({
                                    message: "faiure",
                                    error: groupAddErr.message
                                })
                            }
                            else {
                                // On success
                                res.send({
                                    message: 'success'
                                });
                            }
                        });
                    }
                })
            }
            else {

                // Merging objects
                var mergedObject = { ...req.body, ...tempData };

                delete mergedObject.userName;
                delete mergedObject.name;
                createUserDbEntry(mergedObject, function (dberr, dbdata) {
                    if (err) {
                        console.log("DB ERRRRRR =============================== \n", err);

                        res.send({
                            message: "faiure",
                            error: dberr.code
                        });
                    }
                    else {
                        // Add user to corresponding group...
                        // event.user_type
                        // event.user_name
                        console.log(tempData);

                        addUserToGroup(tempData, function (groupAddErr, groupData) {
                            if (groupAddErr) {

                                res.send({
                                    message: "faiure",
                                    error: groupAddErr.message
                                })
                            }
                            else {
                                res.send({
                                    message: "success"
                                })

                            }
                        });
                    }
                })
            }



        }
    })
});

app.post(`${apiPrefix}logIn`, (req, res) => {
    console.log("Log In API Called!",req.body);
    // Getting user data of that user
    getUser(req.body.user_name, function (err, data) {
        if (err) {
            console.log(err);

            res.send({
                message: "failure",
                error: err
            });
        } else {

            console.log(data);

            // Now getting the list of Groups of user
            getListGroupForUser(data.Username, function (error, groupData) {
                if (error) {

                    res.send({
                        message: "failure",
                        error: error
                    });
                } else {
                    // Now checking is user is ADMIN or not

                    if (data.UserStatus == "FORCE_CHANGE_PASSWORD") {
                        // Sends the user to first login page
                        // respond with status of FORCE_CHANGE_PASSWORD
                        res.send({
                            message: "success",
                            status: "FORCE_CHANGE_PASSWORD"
                        })
                    } else {

                        // Now checking is user is ADMIN or not
                        var userType = "StandardUser";
                        groupData.forEach(element => {
                            if (element.GroupName == "Admin") {
                                userType = "Admin";
                            }
                        });
                        // Here call the login function then
                        login(req.body.user_name, req.body.password, userType, function (err, result) {

                            if (err) {
                                res.cookie("token", "");
                                res.send({
                                    message: "failure",
                                    error: err
                                })
                            }
                            else {


                                res.cookie("token", result.getIdToken().getJwtToken());

                                res.send({
                                    message: "success",
                                    user_type: userType
                                });
                            }
                        })
                    }
                }
            })
        }
    })
})

app.post(`${apiPrefix}isAuthenticated`, VerifyToken, (req,res) =>{
    if(req.user_cognito_id){
        res.send({
            message : "success",
            user_cognito_id : req.user_cognito_id
        })
    }
})

// Login first time with temporary password
app.post(`${apiPrefix}logInFirstTime`, (req, res) => {
    loginFirstTime(req.body, function (err, result) {
        if (err) {
            res.send({
                message: "failure",
                error: err
            })
        }
        else {

            getUser(req.body.user_name, function (err, data) {
                if (err) {
                    console.log(err);

                    res.send({
                        message: "failed",
                        error: err
                    });
                } else {
                    getListGroupForUser(data.Username, function (err, groupData) {
                        if (err) {
                            res.send({
                                message: "failure",
                                error: err
                            })
                        }
                        else {

                            // Now checking if user is ADMIN or not
                            var userType = "StandardUser";
                            groupData.forEach(element => {
                                if (element.GroupName == "Admin") {
                                    userType = "Admin";
                                }
                            });
                            res.cookie("token", result.getIdToken().getJwtToken());
                            res.send({
                                message: "success",
                                user_type: userType
                            })

                        }
                    });

                }
            }
            );

        }
    })

})

app.post(`${apiPrefix}enableUser`, (req, res) => {
    enableUser(req.body.user_name, function (err, data) {
        if (err) {
            res.send({
                message: "failure",
                error: err
            })
        }
        else {
            res.send({
                message: "success"
            })
        }
    })
})

app.post(`${apiPrefix}disableUser`, (req, res) => {
    disableUser(req.body.user_name, function (err, data) {
        if (err) {
            res.send({
                message: "failure",
                error: err
            })
        }
        else {
            res.send({
                message: "success"
            })
        }
    })
})

app.post(`${apiPrefix}getUserDetails`, VerifyToken, (req, res) => {
    getUserDbData(req.user_cognito_id, function (err, data) {
        if (err) {
            res.send({
                message: "failure",
                error: err
            })
        }
        else {
            userData = data.Item;
            getUploadedImageFileList(req.user_cognito_id, function (err, list) {
                if (err) {
                    console.log(err);

                }
                else {
                    // Fetches the latest profile pic
                    var latestProfilePic = list.reduce(function (oldest, profile_pic) {
                        return oldest.LastModified > profile_pic.LastModified ? oldest : profile_pic;
                    }, {});
                    // Now get the signed URL link  from S3
                    // if no S3 link is found then send empty data link
                    // KEY : req.user_cognito_id + "/profile/" + req.user_cognito_id ;
                    // No file is uploaded
                    var key
                    if (list.length != 0) {
                        key = latestProfilePic.Key;
                    }
                    else {
                        key = req.user_cognito_id + "/profile/image/" + req.user_cognito_id;
                    }

                    getFileSignedUrl(key, function (err, url) {
                        if (err) {
                            console.log(err);
                            userData["profile_picture_url"] = "";
                            userData["avatar_url"] = "";
                            res.send({
                                message: "success",
                                data: userData
                            })
                        }
                        else {
                            if (list.length == 0) {
                                userData["profile_picture_url"] = "";
                            }
                            else {
                                userData["profile_picture_url"] = url;
                            }

                            // Getting Avatar URL
                            getUploadedModelFileList(req.user_cognito_id, function (err, list) {

                                userData["avatar_url"] = "";
                                if (err) {
                                    console.log(err);
                                    res.send({
                                        message: "failure",
                                        data: userData
                                    })

                                }
                                else {


                                    // Fetches the latest profile pic
                                    var latestModel = list.reduce(function (oldest, latest_model) {
                                        return oldest.LastModified > latest_model.LastModified ? oldest : latest_model;
                                    }, {});
                                    // Now get the signed URL link  from S3
                                    // if no S3 link is found then send empty data link
                                    // KEY : req.user_cognito_id + "/profile/" + req.user_cognito_id ;
                                    // No file is uploaded
                                    var model_key
                                    if (list.length != 0) {
                                        model_key = latestModel.Key;
                                    }
                                    else {
                                        model_key = req.user_cognito_id + "/profile/model/" + req.user_cognito_id;
                                    }



                                    getFileSignedUrl(model_key, function (err, url) {
                                        if (err) {
                                            console.log(err);
                                            userData["avatar_url"] = "";
                                            res.send({
                                                message: "failure",
                                                data: userData
                                            })
                                        }
                                        else {
                                            if (list.length == 0) {
                                                userData["avatar_url"] = "";
                                            }
                                            else {
                                                userData["avatar_url"] = url;
                                            }
                                            // fetch inf url also here
                                            getINPFile(req.user_cognito_id).then((url) => {
                                                userData["inp_file_url"] = url;

                                                getSimulationFile(req.user_cognito_id,function(err,list){
                                                    userData["simulation_file_url"] = "";
                                                    if (err) {
                                                        console.log(err);
                                                        res.send({
                                                            message: "failure",
                                                            data: userData
                                                        })

                                                    }
                                                    else {


                                                        // Fetches the latest profile pic
                                                        var latestModel = list.reduce(function (oldest, latest_model) {
                                                            return oldest.LastModified > latest_model.LastModified ? oldest : latest_model;
                                                        }, {});
                                                        // Now get the signed URL link  from S3
                                                        // if no S3 link is found then send empty data link
                                                        // KEY : req.user_cognito_id + "/profile/" + req.user_cognito_id ;
                                                        // No file is uploaded
                                                        var model_key
                                                        if (list.length != 0) {
                                                            model_key = latestModel.Key;
                                                        }
                                                        else {
                                                            model_key = req.user_cognito_id + "/profile/simulation/" + req.user_cognito_id;
                                                        }
                                                        getFileSignedUrl(model_key, function (err, url) {
                                                            if (err) {
                                                                console.log(err);
                                                                userData["simulation_file_url"] = "";
                                                                res.send({
                                                                    message: "failure",
                                                                    data: userData
                                                                })
                                                            }
                                                            else {
                                                                if (list.length == 0) {
                                                                    userData["simulation_file_url"] = "";
                                                                }
                                                                else {
                                                                    userData["simulation_file_url"] = url;
                                                                }
                                                                res.send({
                                                                    message: "success",
                                                                    data: userData
                                                                })

                                                            }})
                                                    }
                                                })
                                            })
                                                .catch((err) => {
                                                    res.send({
                                                        message: "failure"
                                                    })
                                                })
                                        }

                                    })

                                }

                            })
                        }
                    });


                }
            })
        }
    })
});

app.post(`${apiPrefix}getInpFileLink`, (req, res) => {
    getINPFile(req.body.user_cognito_id).then((url) => {
        res.send({
            message: "success",
            inp_file_link: url
        })
    }).catch((err) => {
        res.send({
            message: "failure"
        })
    })
})
app.post(`${apiPrefix}getSimulationFileLink`, (req, res) => {
    getSimulationFile(req.body.user_cognito_id, function (err, list) {
        if (err) {
            res.send({
                message: "failure",
            })
        }
        else {
            // Fetches the latest profile pic
            var latestModel = list.reduce(function (oldest, latest_model) {
                return oldest.LastModified > latest_model.LastModified ? oldest : latest_model;
            }, {});
            var model_key = "";

            if (list.length != 0) {
                model_key = latestModel.Key;
            }
            else {
                model_key = req.user_cognito_id + "/profile/simulation/" + req.user_cognito_id;
            }

            getFileSignedUrl(model_key, function (err, model_link) {
                if (err) {
                    console.log(err);
                    res.send({
                        message: "failure",
                        simulation_file_url: ""
                    })
                }
                else {
                    res.send({
                        message: "success",
                        simulation_file_url: model_link
                    })
                }
            })
        }
    })

});

app.post(`${apiPrefix}getModelFileLink`, (req, res) => {
    getUploadedModelFileList(req.body.user_cognito_id, function (err, list) {

        if (err) {
            console.log(err);
            res.send({
                message: "failure",
            })
        }
        else {


            // Fetches the latest profile pic
            var latestModel = list.reduce(function (oldest, latest_model) {
                return oldest.LastModified > latest_model.LastModified ? oldest : latest_model;
            }, {});
            var model_key = "";

            if (list.length != 0) {
                model_key = latestModel.Key;
            }
            else {
                model_key = req.user_cognito_id + "/profile/model/" + req.user_cognito_id;
            }

            getFileSignedUrl(model_key, function (err, model_link) {
                if (err) {
                    console.log(err);
                    res.send({
                        message: "failure",
                        avatar_url: "",
                    })
                }
                else {
                    res.send({
                        message: "success",
                        avatar_url: model_link
                    })
                }

            })

        }

    })
})

app.post(`${apiPrefix}getProfilePicLink`, VerifyToken, (req, res) => {

    getUploadedImageFileList(req.body.user_cognito_id, function (err, list) {
        if (err) {
            console.log(err);
            res.send({
                message: 'failure',
                error: err
            })
        }
        else {

            // Now get the signed URL link  from S3
            // if no S3 link is found then send empty data link
            // KEY : req.user_cognito_id + "/profile/" + req.user_cognito_id ;
            // No file is uploaded

            var latestProfilePic = list.reduce(function (oldest, profile_pic) {
                return oldest.LastModified > profile_pic.LastModified ? oldest : profile_pic;
            }, {});

            var key
            if (list.length != 0) {
                key = latestProfilePic.Key;
            }
            else {
                key = req.user_cognito_id + "/profile/image/" + req.user_cognito_id;
            }

            getFileSignedUrl(key, function (err, url) {
                if (err) {
                    console.log(err);

                    res.send({
                        message: "success",
                        profile_picture_url: ""
                    })

                }
                else {
                    var link = "";
                    if (list.length == 0) {
                        link = "";
                    }
                    else {
                        link = url;
                    }
                    var profile_link = url;
                    var model_link = "";
                    // Getting Avatar URL
                    getUploadedModelFileList(req.user_cognito_id, function (err, list) {

                        if (err) {
                            console.log(err);
                            res.send({
                                message: "failure",
                                data: userData
                            })

                        }
                        else {


                            // Fetches the latest profile pic
                            var latestModel = list.reduce(function (oldest, latest_model) {
                                return oldest.LastModified > latest_model.LastModified ? oldest : latest_model;
                            }, {});
                            // Now get the signed URL link  from S3
                            // if no S3 link is found then send empty data link
                            // KEY : req.user_cognito_id + "/profile/" + req.user_cognito_id ;
                            // No file is uploaded

                            if (list.length != 0) {
                                model_key = latestModel.Key;
                            }
                            else {
                                model_key = req.user_cognito_id + "/profile/model/" + req.user_cognito_id;
                            }

                            getFileSignedUrl(model_key, function (err, model_link) {
                                if (err) {
                                    console.log(err);
                                    res.send({
                                        message: "failure",
                                        profile_picture_url: profile_link,
                                    })
                                }
                                else {
                                    if (list.length == 0) {
                                        model_link = "";
                                    }
                                    else {
                                        model_link = url;
                                    }
                                    res.send({
                                        message: "success",
                                        profile_picture_url: profile_link,
                                        avatar_url: model_link
                                    })
                                }

                            })

                        }

                    })

                }

            })
        }
    });



})


app.post(`${apiPrefix}listUsers`, (req, res) => {
    var attributes = ["name", "phone_number", "email"];
    listAllUsers(attributes, function (err, data) {
        if (err) {
            res.send({
                message: "failure",
                error: err
            })
        }
        else {
            let users = utility.concatArrays(data);

            let count = 0;
            var tempArray = [];
            for (let i = 0; i < users.length; i++) {

                setTimeout(() => {
                    getUser(users[i].Username, function (err, userData) {
                        if (err) {
                            console.log(err);

                            res.send({
                                message: "failed",
                                error: err
                            });
                        } else {
                            getUserDbData(users[i].Username, function (err, userDbData) {

                                getListGroupForUser(users[i].Username, function (err, groupData) {

                                    if (err) {
                                        console.log("List group for user ", err);
                                    }

                                    count++;

                                    // Now checking is user is ADMIN or not
                                    var flag = false;
                                    groupData.forEach(element => {
                                        if (element.GroupName == "Admin") {
                                            flag = true;
                                        }
                                    });
                                    // var temp = {};
                                    userDbData = userDbData.Item;
                                    userDbData["Enabled"] = userData.Enabled;

                                    if (flag) {
                                        userDbData.user_type = "Admin"
                                    }
                                    else {
                                        userDbData.user_type = "Standard"
                                    }
                                    tempArray.push(userDbData);
                                    if (count == users.length) {
                                        // console.log(data);

                                        res.send(
                                            {
                                                message: "success",
                                                data: tempArray
                                            });
                                    }

                                });

                            })


                        }
                    });

                }, 20 * i);

            }
        }
    })
})

// API To upload profile pic to S310m
app.post(`${apiPrefix}uploadProfilePic`, VerifyToken, setConnectionTimeout('10m'), upload.single("profile_pic"), awsWorker.doUpload);

app.post(`${apiPrefix}verifyUser`, VerifyToken, (req, res) => {
    // Fetch user group data and check if he is Admin or not
    getListGroupForUser(req.user_cognito_id, function (err, groupData) {
        if (err) {

            res.send({
                message: "failure",
                error: err
            });
        } else {
            // Now checking is user is ADMIN or not
            var flag = false;
            groupData.forEach(element => {
                if (element.GroupName == "Admin") {
                    flag = true;
                }
            });
            res.send({
                message: "success",
                isAdmin: flag
            })
        }
    });
})

// Create Avatar 3D
app.post(`${apiPrefix}createAvatar`, (req, res) => {
    console.log("API CAlled createAvatar", req.body);

    // Delete user previous Avatar Directory
    deleteDirectory(path.join(
        __dirname,
        "./avatars/" + req.body.user
    ), function () {
        //console.log('Directory deleted');
    }
    );

    const spawn = require("child_process").spawn;
    const pythonProcess = spawn("python", [
        "./config/AvatarTest.py",
        req.body.image,
        config.avatar3dClientId,
        config.avatar3dclientSecret,
        req.body.user
    ]);

    pythonProcess.stdout.on("data", async data => {
        console.log(data.toString());
        try {
            //archive zip
            var output = fs.createWriteStream(data.toString() + ".zip");
            var archive = archiver("zip");

            output.on("close", async function () {
                console.log(archive.pointer() + " total bytes");
                console.log(
                    "archiver has been finalized and the output file descriptor has closed."
                );
                console.log("zip file uploading");
                let filePath = path.join(
                    __dirname,
                    "./" + data.toString() + ".zip"
                );
                let zipBuffer = fs.readFileSync(filePath);
                returnedData = await uploadFile("zip", zipBuffer, data.toString(), {
                    ext: "zip",
                    mime: "application/zip"
                });

                let rData = {};
                rData.plyPath = returnedData.Location;
                return res.status(200).send(rData);
            });
            archive.on("error", function (err) {
                console.log(err);
                res.status(400).send(err);
                throw err;
            });
            archive.pipe(output);
            archive.directory(path.join(__dirname, "/./" + data.toString() + "/"), false);
            archive.finalize();

        } catch (error) {
            console.log(error);
            return res.status(400).send(error);
        }
    });

    pythonProcess.stderr.on("data", async data => {
        console.log(`error:${data}`);
    });
    pythonProcess.on("close", async data => {
        console.log(`child process close with ${data}`);
    });
});

// Delete Directory
var deleteDirectory = function (path, callback) {
    fs.readdir(path, function (err, files) {
        if (err) {
            // Pass the error on to callback
            callback(err, []);
            return;
        }
        var wait = files.length,
            count = 0,
            folderDone = function (err) {
                count++;
                // If we cleaned out all the files, continue
                if (count >= wait || err) {
                    fs.rmdir(path, callback);
                }
            };
        // Empty directory to bail early
        if (!wait) {
            folderDone();
            return;
        }

        // Remove one or more trailing slash to keep from doubling up
        path = path.replace(/\/+$/, "");
        files.forEach(function (file) {
            var curPath = path + "/" + file;
            fs.lstat(curPath, function (err, stats) {
                if (err) {
                    callback(err, []);
                    return;
                }
                if (stats.isDirectory()) {
                    deleteDirectory(curPath, folderDone);
                } else {
                    fs.unlink(curPath, folderDone);
                }
            });
        });
    });
};
// Uploading the Sensor Data (CSV) file
app.post(`${apiPrefix}uploadSensorDataAndCompute`, VerifyToken, setConnectionTimeout('10m'), uploadSensorData.single('sensor_csv_file'), (req, res) => {
    // Upload this data in Profile Bucket of USER
    console.log("API Called to upload to upload Sensor Data")
    var file_name = Date.now();

    var uploadParams = {
        Bucket: config.usersbucket,
        Key: '', // pass key
        Body: null, // pass file body
    };

    // File Extensions
    var file_extension = req.file.originalname.split(".");
    file_extension = file_extension[file_extension.length - 1];

    // Setting Attributes for file upload on S3
    uploadParams.Key = req.user_cognito_id + "/sensor_data/" + file_name + "." + file_extension;
    uploadParams.Body = req.file.buffer;

    if (req.body.file_error) {
        console.log(req.body.file_error);
        res.status(500).send({
            message: "failure",
            status: "Invalid File type"
        });
    }
    else{
        // Uploading it on S3
        s3.upload(uploadParams, (err, data) => {
            if (err) {

                res.status(500).send({ message: 'failure' });
            }
            else{

                convertXLSXDataToJSON(req.file.buffer,function(items){
                    // Store the Data in DynamoDB
                    storeSensorData(items)
                    .then(flag => {
                        res.send({
                            message : 'success'
                        })
                    })
                    .catch(err => {
                        res.send({
                            message : 'failure',
                            error : err
                        })
                    })


                });


            }
        })
    }
})

app.post(`${apiPrefix}getCumulativeAccelerationData`, (req,res) =>{
    request.post({ url: config.ComputeInstanceEndpoint + "getCumulativeAccelerationData", json: req.body }, function (err, httpResponse, body) {
        if (err) {
            res.send({ message: 'failure', error: err });
        }
        else {
            res.send(httpResponse.body);
        }
    })
})

app.post(`${apiPrefix}getCumulativeAccelerationTimeData`, (req,res) =>{
    request.post({ url: config.ComputeInstanceEndpoint + "getCumulativeAccelerationTimeData", json: req.body }, function (err, httpResponse, body) {
        if (err) {

            res.send({ message: 'failure', error: err });
        }
        else {
            res.send(httpResponse.body);
        }
    })
})

app.post(`${apiPrefix}getCumulativeEventPressureData`, (req,res) =>{
    request.post({ url: config.ComputeInstanceEndpoint + "getCumulativeEventPressureData", json: req.body }, function (err, httpResponse, body) {
        if (err) {

            res.send({ message: 'failure', error: err });
        }
        else {
            res.send(httpResponse.body);
        }
    })
})

app.post(`${apiPrefix}getCumulativeEventLoadData`, (req,res) =>{
    request.post({ url: config.ComputeInstanceEndpoint + "getCumulativeEventLoadData", json: req.body }, function (err, httpResponse, body) {
        if (err) {

            res.send({ message: 'failure', error: err });
        }
        else {
            res.send(httpResponse.body);
        }
    })
})
app.post(`${apiPrefix}getHeadAccelerationEvents`, (req,res) =>{
    request.post({ url: config.ComputeInstanceEndpoint + "getHeadAccelerationEvents", json: req.body }, function (err, httpResponse, body) {
        if (err) {
            console.log(err);
            res.send({ message: 'failure', error: err });
        }
        else {
            res.send(httpResponse.body);
        }
    })
})
app.post(`${apiPrefix}getTeamAdminData`, (req,res) =>{
    request.post({ url: config.ComputeInstanceEndpoint + "getTeamAdminData", json: req.body }, function (err, httpResponse, body) {
        if (err) {

            res.send({ message: 'failure', error: err });
        }
        else {
            res.send(httpResponse.body);
        }
    })
})
app.post(`${apiPrefix}getImpactHistory`, (req,res) =>{
    request.post({ url: config.ComputeInstanceEndpoint + "getImpactHistory", json: req.body }, function (err, httpResponse, body) {
        if (err) {

            res.send({ message: 'failure', error: err });
        }
        else {
            res.send(httpResponse.body);
        }
    })
})

app.post(`${apiPrefix}getImpactSummary`, (req,res) =>{
    request.post({ url: config.ComputeInstanceEndpoint + "getImpactSummary", json: req.body }, function (err, httpResponse, body) {
        if (err) {

            res.send({ message: 'failure', error: err });
        }
        else {
            res.send(httpResponse.body);
        }
    })
})

app.post(`${apiPrefix}getPlayersData`, (req,res) =>{
    request.post({ url: config.ComputeInstanceEndpoint + "getPlayersDetails", json: req.body }, function (err, httpResponse, body) {
        if (err) {

            res.send({ message: 'failure', error: err });
        }
        else {
            res.send(httpResponse.body);
        }
    })
})

app.post(`${apiPrefix}getOrganizationAdminData`, (req,res) =>{
    request.post({ url: config.ComputeInstanceEndpoint + "getOrganizationAdminData", json: req.body }, function (err, httpResponse, body) {
        if (err) {

            res.send({ message: 'failure', error: err });
        }
        else {
            res.send(httpResponse.body);
        }
    })
})

app.post(`${apiPrefix}getAllRosters`, (req,res) =>{
    request.post({ url: config.ComputeInstanceEndpoint + "getAllRosters", json: req.body }, function (err, httpResponse, body) {
        if (err) {

            res.send({ message: 'failure', error: err });
        }
        else {
            res.send(httpResponse.body);
        }
    })
})

app.post(`${apiPrefix}fetchAllTeamsInOrganization`, (req,res) =>{
    request.post({ url: config.ComputeInstanceEndpoint + "fetchAllTeamsInOrganization", json: req.body }, function (err, httpResponse, body) {
        if (err) {

            res.send({ message: 'failure', error: err });
        }
        else {
            res.send(httpResponse.body);
        }
    })
})

app.post(`${apiPrefix}addTeam`, (req,res) =>{
    console.log(req.body);
    request.post({ url: config.ComputeInstanceEndpoint + "addTeam", json: req.body }, function (err, httpResponse, body) {
        if (err) {
            console.log(err);
            res.send({ message: 'failure', error: err });
        }
        else {
            res.send(httpResponse.body);
        }
    })
})


app.post(`${apiPrefix}deleteTeam`, (req,res) =>{
    console.log(req.body);
    request.post({ url: config.ComputeInstanceEndpoint + "deleteTeam", json: req.body }, function (err, httpResponse, body) {
        if (err) {

            res.send({ message: 'failure', error: err });
        }
        else {
            res.send(httpResponse.body);
        }
    })
})

app.post(`${apiPrefix}uploadModelRealData`, setConnectionTimeout('10m'), uploadModelRealData.single('file'), (req, res) => {
	convertDataToJSON(req.file.buffer,function(items){
		//console.log(items);
		return res.status(200).send(items);
    });

})


// Clearing the cookies
app.post(`${apiPrefix}logOut`, (req, res) => {
    res.cookie("token", "");
    res.send({
        message: "success"
    });
})

// Configuring port for APP
const port = 3001;
const server = app.listen(port, function () {
    console.log('Magic happens on ' + port);
});
