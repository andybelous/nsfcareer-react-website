// ======================================
//         INITIALIZING DEPENDENCIES
// ======================================
const express = require('express'),
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
ms = require("ms"),
multer = require('multer'),
XLSX = require('xlsx'),
request = require('request'),
moment = require('moment'),
jwt = require('jsonwebtoken'),
// Load the core build of Lodash.
_array = require('lodash/array');
var md5 = require('md5');
global.fetch = require('node-fetch');
const https = require('https');
var _ = require('lodash');
const { exec } = require('child_process')
var nodemailer = require('nodemailer');
app.use(express.static(path.resolve('./public')));
// var transporter = nodemailer.createTransport({
//   host: 'email.us-west-2.amazonaws.com',
//   port: 465,
//   secure: true,
//   auth: {
//     user: 'AKIA5UBJSELBMRFTI2QO',
//     pass: 'BPwKxokCSkorDHhAnyrVaNbML8Ydlo3scXbQEmwbPJay'
//   }
// });

// ================================================
//          SOCKET <DOT> IO CONFIGURATION
// ================================================

const http = require('http')
const socketIO = require('socket.io')

// our server instance
const server = http.createServer(app)

// This creates our socket using the instance of the server
const io = socketIO(server)

// This is what the socket.io syntax is like, we will work this later
let interval;
// var ffmpeg = require('ffmpeg');

io.on('connection', socket => {
    console.log("New client connected");
    socket.on("connection", ()=> {

    })

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });

})



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

// var config = {
//     "awsAccessKeyId": process.env.AWS_ACCESS_KEY_ID,
//     "awsSecretAccessKey": process.env.AWS_ACCESS_SECRET_KEY,
//     "sportModelBucket": process.env.SPORT_MODEL_BUCKET,
//     "avatar3dClientId": process.env.AVATAR_3D_CLIENT_ID,
//     "avatar3dclientSecret": process.env.AVATAR_3D_CLIENT_SECRET,
//     "region": process.env.REGION,
//     "usersbucket": process.env.USER_BUCKET,
//     "userPoolId": process.env.USER_POOL_ID,
//     "apiVersion": process.env.API_VERSION,
//     "ClientId": process.env.CLIENT_ID,
//     "ComputeInstanceEndpoint": process.env.COMPUTE_INSTANCE_ENDPOINT,
//     "FrontendUrl": process.env.FRONTEND_URL
// };

var config = require('./config/configuration_keys.json'); 
var config_env = config;

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
const {
        getUserDetails,
        getUserDetailBySensorId,
        getUserByPlayerId,
        updateSimulationFileStatusInDB,
        addTeam,
        deleteTeam,
        fetchAllTeamsInOrganization,
        deleteTeamFromOrganizationList,
        addTeamToOrganizationList,
        getCumulativeAccelerationData,
        getTeamData,
        getCompletedJobs,
        updateJobComputedTime,
        getBrandData,
        getPlayerSimulationFile,
        removeRequestedPlayerFromOrganizationTeam,
        getCumulativeAccelerationRecords,
        addPlayer,
        getUserDetailByPlayerId,
        getAllTeamsOfOrganizationsOfSensorBrand,
        getSimulationImageRecord,
        createUserDbEntry,
        getPlayersListFromTeamsDB,
        createInviteUserDbEntry,
        addRecordInUsersDDB,
        getVerificationStatus,
        addUserDetailsToDb,
        getUserDbData,
        getUserTokenDBDetails,
        getUserSensor,
        getOrganizationList,
        InsertUserIntoSensor,
        InsertImpactVideoKey,
        storeSensorData,
        fetchNumbers,
        fetchStaffMembers,
        fetchAllUsers,
        putNumbers,
        addPlayerToTeamInDDB,
        getAllSensorBrands,
        setVideoTime,
        getOrgUniqueList,
        getOrgUniqueTeams,
        upDateUserFBGlid,
        upDateuserPassword,
        getUserAlreadyExists,
        upDateuser,
        DeleteOrganization,
        getOrganizatonBynameSensor,
        getOrganizatonByTeam,
        getOrgSensorData,
        renameOrganization,
        renameSensorOrganization,
        addOrganization,
        MergeOrganization,
        addorgTeam,
        getSernsorDataByTeam,
        renameTeam,
        getUserByTeam,
        renameUsers,
        getUserDbDataByUserId,
        getBrandOrganizationData,
        getPlayerSimulationStatus,
        getTeamList,
        getOrganizationTeamData,
        getPlayerList,
        getTeamDataWithPlayerRecords,
        fetchSensor,
        fetchOrgStaffMembers,
        getHeadAccelerationEvents,
        getPlayersListFromTeamsDB_2,
        getTeamDataWithPlayerRecords_2,
        getBrandOrganizationData2,
        getAllOrganizationsOfSensorBrand,
        getTeamSpheres,
        updateUserStatus,
        getTeamDataWithPlayerRecords_3,
        getPlayerCgValues,
        getBrandDataByorg,
        deleteSensorData,
        deleteSimulation_imagesData,
        InsertTrimVideoKey,
        updateTrimVideoKey,
        getSernsorDataByOrgTeam,
        getModalValidationDB
    } = require('./controllers/query');

// Multer Configuration


var storage = multer.memoryStorage()
var upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        //var ext = path.extname(file.originalname);
        console.log("This is filename ------> \n",file.originalname);

        let jpgFile = new RegExp(".jpg").test(file.originalname);
        let jpegFile = new RegExp(".jpeg").test(file.originalname);
        let JPEGFile = new RegExp(".JPEG").test(file.originalname);
        let JPGFile = new RegExp(".JPG").test(file.originalname);
        let pngFile = new RegExp(".png").test(file.originalname);
        let PNGFile = new RegExp(".PNG").test(file.originalname);
        let tiffFile = new RegExp(".tiff").test(file.originalname);
        let TIFFFile = new RegExp(".TIFF").test(file.originalname);

        if (!jpgFile && !jpegFile && !pngFile && !JPEGFile && !JPGFile && !PNGFile && !TIFFFile && !tiffFile) {

            //req.body["file_error"] = "Only JPEG/ JPG/ jpeg/ jpg/ PNG/ png/ tiff/ TIFF format file is allowed";

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
var uploadSidelineImpactVideo = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        //var ext = path.extname(file.originalname);
        console.log("This is filename ------> \n",file);

        // let csv = new RegExp(".csv").test(file.originalname);
        // let csv_upper = new RegExp(".CSV").test(file.originalname);
        // let excel = new RegExp(".xlsx").test(file.originalname);
        // let excelx = new RegExp(".xls").test(file.originalname);
        // if (!csv && !csv_upper && !excel && !excelx) {
        //     // res.send({message : "FAILURE"});
        //     req.body["file_error"] = "Only .csv , .xlsx file is allowed"
        // }
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


var s3 = new AWS.S3({useAccelerateEndpoint: true});

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

// Make io accessible to our router
app.use(function(req,res,next){
    req.io = io;
    next();
});

// Express configured for POST Request handling of multiple types
// xxx-url encoded (form type)  & json type
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({limit: '50mb'}));
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



function verifyImageToken(token, item){
    console.log(token, item);
    return new Promise((resolve, reject) => {
        jwt.verify(token, item.secret, function(err, decoded) {
            if(err){
                console.log(err);
                reject({
                    err : err,
                    authorized : false
                })
            }
            else{
                resolve(decoded);
            }
        });
    })
}

function getImageFromS3(image_record){
    return new Promise((resolve, reject) =>{
        var params = {
            Bucket: image_record.bucket_name ? image_record.bucket_name : config_env.usersbucket,
            Key: image_record.path
        };
        s3.getObject(params, function(err, data) {
            if (err) {
                // reject(err)
                resolve(null);
            }
            else{
                resolve(data);
            }
        });
    })
}

function getImageFromS3Buffer(image_data){
    return new Promise((resolve, reject) => {
        // console.log(image_data.Body);
            try{
                resolve(image_data.Body.toString('base64'))
            }
            catch (e){
                //reject(e)
                resolve(null);
            }

    })
}

function getFileFromS3(url, bucket_name) {
    // console.log('url', url)
    return new Promise((resolve, reject) => {
        var params = {
            Bucket: bucket_name ? bucket_name : config_env.usersbucket,
            Key: url
        };
        s3.getObject(params, function (err, data) {
            if (err) {
                // reject(err)
                resolve(null);
            }
            else {
                resolve(data);
            }
        });
    })
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

function getFileSignedUrl(key, cb, type) {

    var params = {
        Bucket: BUCKET_NAME,
        Key: key
    };

    if (type) {
        
        let filename = key.split('/').pop();
        filename = filename.split('.')[0];
        filename = filename + '-' + type + '.zip';
        params.ResponseContentDisposition = 'attachment; filename=' + filename 
    }

    s3.getSignedUrl('getObject', params, function (err, url) {
        if (err) {
            cb(err, "");
        } else {
            cb("", url);
        }
    });
}

function getAvatarInspectionFileSignedUrl(key, cb) {

    var params = {
        Bucket: BUCKET_NAME,
        Key: key
    };

    s3.headObject(params, function (err, metadata) {  
        if (err && err.code === 'NotFound') {  
          // Handle no object on cloud here 
          cb(err, "");
        } else {  
            s3.getSignedUrl('getObject', params, function (err, url) {
                if (err) {
                    cb(err, "");
                } else {
                    cb("", url);
                }
            });
        }
      });
}

// Get user details & all his attributes
function getUser(user_name, cb) {
    console.log('getUser',user_name)
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

//forgot password
function forgotPassword(user_name, cb) {
    console.log('forgotPassword',user_name)
    var params = {
        ClientId: cognito.ClientId,
        /* required */
        Username: user_name /* required */
    };
    COGNITO_CLIENT.forgotPassword(params, function (err, data) {
        if (err) {
            cb(err.code, "");
        } // an error occurred
        else {
            cb("", data);
        } // successful response
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

// Function to get the path of all simulation directory stored with Date as folder name
function getSimulationFilePath(user_name, cb) {
    const s3Params = {
        Bucket: BUCKET_NAME,
        Delimiter: '/',
        Prefix: `${user_name}/simulation/`
        // Key: req.query.key + ''
    };
    s3.listObjectsV2(s3Params, (err, data) => {
        if (err) {
            //   console.log(err);
            console.log(err);
            cb(err,'');
        }
        console.log(data);
        try {
            var pathArray = data.CommonPrefixes ;
            const simulationDirectoryPaths = pathArray.map(d => d.Prefix);
            cb('',simulationDirectoryPaths);

        } catch (e) {
            cb(err,'');
        }
    });
}

function getSimulationFilesOfPlayer(path, cb) {
    const s3Params = {
        Bucket: BUCKET_NAME,
        Delimiter: '/',
        Prefix: path
        // Key: req.query.key + ''
    };
    s3.listObjectsV2(s3Params, (err, data) => {
        if (err) {
            //   console.log(err);
            console.log(err);
            cb(err,'');
        }


        const imageList = data.Contents ;
        var counter = 0 ;
        var url_arrary = [];
        imageList.forEach(function(image,index){
            var params = {
                Bucket: BUCKET_NAME,
                Key: image.Key
            };
            s3.getSignedUrl('getObject', params, function (err, url) {
                counter++;

                if (err) {
                    console.log(err);
                } else {
                    console.log(url);
                    url_arrary.push(url);
                }
                if(counter == imageList.length){
                    cb('',url_arrary);
                }
            });
        });
    });
}



app.post(`${apiPrefix}checkIfPlayerExists`, (req,res) =>{
    console.log("Checking player",req.body);
    getPlayersListFromTeamsDB({
        organization : "PSU",
        team_name : "York Tech Football"
    })
    .then(data => {
        console.log("USER EXISTS ",data.player_list.indexOf(req.body.name));
        if(data.player_list.indexOf(req.body.name)>-1){
            res.send({
                message : "success",
                flag : true
            })
        }
        else{
            res.send({
                message : "success",
                flag : false
            })
        }
    })
    .catch(err => {
        res.send({
            message : "failure",
            error : err
        })
    })
})

app.post(`${apiPrefix}getSimulationFilePath`, (req,res) =>{
    console.log(req.body);
    getSimulationFilePath(req.body.player_id,function(err, data){
        if(err){
            res.send({
                message : "failure",
                error : err
            })
        }
        else{
            res.send({
                message : "success",
                data : data
            })
        }
    })
})

app.post(`${apiPrefix}getSimulationFilesOfPlayer`, (req,res) =>{
    console.log(req.body);
    getSimulationFilesOfPlayer(req.body.path,function(err, data){
        if(err){
            res.send({
                message : "failure",
                error : err
            })
        }
        else{
            res.send({
                message : "success",
                data : data
            })
        }
    })
})

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

function getUploadedVtkFileList(user_name, cb) {
    const s3Params = {
        Bucket: BUCKET_NAME,
        Delimiter: '/',
        // Prefix: user_name + '/profile/rbf/vtk/'
        Prefix: user_name + '/profile/morphed_vtk/combined_meshes/'
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


function getAge(dob) {
    let currentDate = new Date();
    let birthDate = new Date(dob);
    let age = currentDate.getFullYear() - birthDate.getFullYear()
    let month = currentDate.getMonth() - birthDate.getMonth()
    if ( month < 0 || ( month === 0 && currentDate.getDate() < birthDate.getDate() )) {
        age = age - 1
    }
    return age;
}
function adminUpdateUser(User, cb) {

    var params = {
        UserAttributes: [ /* required */
          {
            Name: 'email', /* required */
            Value: User.email
          },
          /* more items */
        ],
        UserPoolId: cognito.userPoolId, /* required */
        Username: User.user_name, /* required */
      };
      COGNITO_CLIENT.adminUpdateUserAttributes(params, function(err, data) {
        if (err) {
            cb(err, "");
        } // an error occurred
        else {
            cb("", data);
        }             // successful response
      });
}

// Function to create User by Admin
function adminCreateUser(User, cb) {
    var params = {
        ClientId: cognito.ClientId, /* required */
        Username: User.user_name, /* required */
        Password: User.password_code,
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
                Name: 'custom:level',  /* required */
                Value: User.level
            },
            {
                Name: 'custom:isSocialAccount',  /* required */
                Value: User.isSocialAccount
            },
            {
                Name: 'custom:account_id',  /* required */
                Value: User.account_id
            },
        ],
    };
    COGNITO_CLIENT.signUp(params, function (err, data) {
        if (err) {
            cb(err, "");
        }
        else {
            cb("", data);
        }
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

                 if ((/[{()}]/g).test(value)) {
                     value = value.replace(/[{()}]/g, '')
                 }

                headers[col] = value
                .split(" ")
                .join("_")
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
            data_array[i]["simulation_status"] = "pending";
            data_array[i].player_id = data_array[i].player_id + "$" + data_array[i].timestamp;
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
            if (row == 1) {

                /* headers[col] = value
                .split(" ")
                .join("_")
                .replace(/[{()}]/g, '')
                .toLowerCase(); */
                switch(col) {
                    case "A":
                    headers[col] = 'time_msec';
                    break;
                    case "B":
                    headers[col] = 'head_pressure_psi';
                    break;
                    case "C":
                    headers[col] = 'shoulder_pressure_psi';
                    break;
                    case "D":
                    headers[col] = 'chest_pressure_psi';
                    break;
                }
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

function concatArrays(arrays) {
    return [].concat.apply([], arrays);
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


function getVtkFileLink(user_id) {
    return new Promise((resolve, reject) => {

        getUploadedVtkFileList(user_id, (err, list) => {
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
                    // model_key = user_id + "/profile/rbf/vtk/";
                    model_key = user_id + "/profile/morphed_vtk/combined_meshes/";
                }
                // Generate SignedURL of the image
                getFileSignedUrl(model_key, (err, url) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(url);
                    }
                }, 'FEMesh')
            }
        })

    })
}

function getPresignedMovieUrl(image_details) {
  return new Promise((resolve, reject) => {
    const { movie_path, bucket_name } = image_details;
    if(movie_path) {
      var params = {
          Bucket: bucket_name ? bucket_name : config_env.usersbucket,
          Key: movie_path,
          Expires: 1800
      };
      s3.getSignedUrl('getObject', params, function (err, url) {
          if (err) {
              //reject(err);
              resolve(false);
          } else {
              resolve(url);
          }
      });
    } else {
      resolve(false);
    }
  })
}
function getBrainSimulationLogFile(image_details){
    // console.log('image_details',image_details)
    return new Promise((resolve, reject) => {
    const { log_path } = image_details;
    if(log_path) {
      var params = {
          Bucket: BUCKET_NAME,
          Key: log_path,
          Expires: 1800
      };
      s3.getSignedUrl('getObject', params, function (err, url) {
          if (err) {
              //reject(err);
              resolve(false);
          } else {
              resolve(url);
          }
      });
    } else {
      resolve(false);
    }
  })

}

function ImpactVideoUrl(image_details) {
  return new Promise((resolve, reject) => {
    const { impact_video_path } = image_details;
    console.log('impact_video_path',impact_video_path)
    if(impact_video_path) {
      var params = {
          Bucket: BUCKET_NAME,
          Key: impact_video_path,
          Expires: 1800
      };
      s3.getSignedUrl('getObject', params, function (err, url) {
          if (err) {
              reject(err);
          } else {
              resolve(url);
          }
      });
    } else {
      resolve(false);
    }
  })
}

function trimVideoUrl(image_details) {
  return new Promise((resolve, reject) => {
    const { trim_video_path } = image_details;
    console.log('trim_video_path------------------------\n',trim_video_path)
    if(trim_video_path) {
      var params = {
          Bucket: BUCKET_NAME,
          Key: trim_video_path,
          Expires: 1800
      };
      s3.getSignedUrl('getObject', params, function (err, url) {
          if (err) {
              reject(err);
          } else {
              resolve(url);
          }
      });
    } else {
      resolve(false);
    }
  })
}   


// Miliseconds to Human readable 
function timeConversion(duration) {
    const portions = [];
    duration = parseFloat(duration);
    const msInHour = 1000 * 60 * 60;
    const hours = Math.trunc(duration / msInHour);
    if (hours > 0) {
        portions.push(hours + ' Hours');
        duration = duration - (hours * msInHour);
    }

    const msInMinute = 1000 * 60;
    const minutes = Math.trunc(duration / msInMinute);
    if (minutes > 0) {
        portions.push(minutes + ' Minutes');
        duration = duration - (minutes * msInMinute);
    }

    const seconds = Math.trunc(duration / 1000);
    if (seconds > 0) {
        portions.push(seconds + ' Seconds');
    }

    return portions.join(' ');
}



// ============================================
//     				ROUTES
// ============================================


app.get(`${apiPrefix}simulation/results/:token/:image_id`, (req, res) => {
    const { image_id, token } = req.params;
    var imageData = '';
    // console.log(process.env.BRAIN_SIM_SERVICE_TOKEN)
    getSimulationImageRecord(req.params.image_id)
    .then(image_data => {
        imageData = image_data;
        return getPlayerCgValues(image_data.player_name);
    })
    .then(cg_coordinates => {
      // Setting cg values
      if(cg_coordinates) {
        imageData["cg_coordinates"] = cg_coordinates;
      }
      // convert Buffer to Image
      return verifyImageToken(token, imageData);
    })
    .then(decoded_token => {
        if (imageData.root_path && imageData.root_path != 'null') {
            imageData.path = imageData.root_path + imageData.image_id + '.png';
        } console.log(imageData.path);
        return getImageFromS3(imageData); 
    })
    .then(image_s3 => {
        return getImageFromS3Buffer(image_s3);
    })
    .then(image => {
        let computed_time = imageData.computed_time ? timeConversion(imageData.computed_time) : ''
        res.send(`
          <table style="text-align:left;">
            <tr>
              <th>Image Id</th>
              <th>:</th>
              <td>${image_id}</td>
            </tr>
            <tr>
              <th>Player Id</th>
              <th>:</th>
              <td>${imageData.player_name}</td>
            </tr>
            ${imageData.cg_coordinates && imageData.cg_coordinates.length > 0 ? `<tr><th>CG</th><th>:</th><td>${imageData.cg_coordinates}</td></tr>` : `<p></p>`}
            ${imageData.impact_number && imageData.impact_number != "null" ? `<tr><th>Impact</th><th>:</th><td>${imageData.impact_number}</td></tr>`:`<p></p>`}
            ${computed_time ? `<tr><th>Compute Time</th><th>:</th><td>${computed_time}</td></tr>` : `<p></p>`}
          </table>
            <div style="display:flex;">
                <div style="flex:50%">
                  <img style="transform : scale(0.5);transform-origin: top center" src="data:image/png;base64,${image}"/>
                </div>
              </div>
          </div>`);
    })
    .catch(err => {
        // res.removeHeader('X-Frame-Options');
        if("authorized" in err){
            res.send({
                message : "failure",
                error : "You are not authorized to access this resource."
            })
        }
        else{
            res.send({
                message : "Simulation is in process"
            })
        }
    })

});

// Get simulation movie link
app.get(`${apiPrefix}getSimulationMovie/:token/:image_id`, (req, res) => {
    const { image_id, token} = req.params;
    let imageData = '';

    getSimulationImageRecord(image_id)
        .then(image_data => {
            imageData = image_data;
            return verifyImageToken(token, image_data);
        })
        .then(decoded_token => {
            return getPlayerCgValues(imageData.player_name);
        })
        .then(cg_coordinates => {
            // Setting cg values
            if(cg_coordinates) {
              imageData["cg_coordinates"] = cg_coordinates;
            }
            if (!imageData.movie_path) {
                imageData.movie_path = imageData.root_path + 'movie/' + imageData.image_id + '.mp4';
            }
            return getPresignedMovieUrl(imageData);
        })
        .then(movie_link => {
            let computed_time = imageData.computed_time ? timeConversion(imageData.computed_time) : ''
            res.send(`<table style="text-align:left;">
            <tr>
              <th>Image Id</th>
              <th>:</th>
              <td>${image_id}</td>
            </tr>
            <tr>
              <th>Player Id</th>
              <th>:</th>
              <td>${imageData.player_name}</td>
            </tr>
            ${imageData.cg_coordinates && imageData.cg_coordinates.length > 0 ? `<tr><th>CG</th><th>:</th><td>${imageData.cg_coordinates}</td></tr>` : `<p></p>`}
            ${imageData.impact_number && imageData.impact_number != "null" ? `<tr><th>Impact</th><th>:</th><td>${imageData.impact_number}</td></tr>`:`<p></p>`}
            ${computed_time ? `<tr><th>Compute Time</th><th>:</th><td>${computed_time}</td></tr>` : `<p></p>`}
          </table>
            <div style="display:flex;">
                <video src=${movie_link} style="width:100%;" controls></video>
            </div>
          </div>`);
        })
        .catch(err => {
            console.log(err);
            // res.removeHeader('X-Frame-Options');
            if("authorized" in err){
                res.send({
                    message : "failure",
                    error : "You are not authorized to access this resource."
                })
            }
            else{
                res.send({
                    message : "Simulation is in process"
                })
            }
        })

});

app.get(`${apiPrefix}getBrainSimulationLogFile/:image_id`, (req, res) => {
    const { image_id } = req.body
    getPlayerSimulationFile(req.body)
        .then(imageData => {
            // console.log('image_data',imageData)
            if (imageData.log_path && imageData.log_path != 'null') {
                let key = imageData.log_path;
                key = key.replace(/'/g, "");
                return getFileFromS3(key, imageData.bucket_name);
            } else {
                if (imageData.root_path && imageData.root_path != 'null') {
                    let log_path = imageData.root_path + 'logs/femtech_' + imageData.image_id + '.log';
                    return getFileFromS3(log_path, imageData.bucket_name);
                }
            }
        }) .then(log_s3 => {
            let log = '';
            if (log_s3) {
                log = Buffer.from(log_s3.Body).toString('utf8');
                // console.log('body',body)
            }
            res.send({
                message: "success",
                data: log,
            })
        }).catch(err =>{
            res.send({
                message: "failure",
                data: '',
                error: err
            })
        })
})

//Getting brain simulation details page video
app.get(`${apiPrefix}getBrainSimulationMovie/:image_id`, (req, res) => {
    const { image_id } = req.params;
    let imageData = '';
    var movie_link_url = '';
    var motion_movie_link_url = '';
    var trim_video_url = '';

    let status = 'pending';

    getSimulationImageRecord(image_id)
    .then(image_data => {
        imageData = image_data;
        status = image_data.status;
        return verifyImageToken(imageData['token'], image_data);
    })
    .then(decoded_token => {
        return getPlayerCgValues(imageData.player_name);
    })
    .then(cg_coordinates => {
        if (!imageData.movie_path) {
            imageData.movie_path = imageData.root_path + 'movie/' + imageData.image_id + '.mp4';
        } 
        return getPresignedMovieUrl(imageData);
    })
    .then(movie_link => {
        console.log('movie_link',movie_link);
        movie_link_url = movie_link;
        imageData.movie_path = imageData.root_path + 'movie/' + imageData.image_id + '_mps.mp4';
        return getPresignedMovieUrl(imageData);
    })
    .then(motion_link_url => {
        motion_movie_link_url =   motion_link_url;
        return trimVideoUrl(imageData);
        
    }) 
    .then(trim_video => {
        console.log('trim_video_url ------------------------\n',trim_video)
        trim_video_url =   trim_video;
        return ImpactVideoUrl(imageData);
        
    }) 
    .then(impact_video_url => {
        console.log('trim_video_url -------------\n',trim_video_url)
        res.send({
            message : "success",
            simulation_id: imageData.log_stream_name,
            movie_link : movie_link_url,
            trim_video_url: trim_video_url,
            impact_video_url: impact_video_url,
            motion_link_url: motion_movie_link_url,
            video_lock_time: imageData.video_lock_time ? imageData.video_lock_time : '',
            left_lock_time: imageData.left_lock_time ? imageData.left_lock_time : '',
            right_lock_time: imageData.right_lock_time ? imageData.right_lock_time : '',
            status: status,
            log_stream_name: imageData.log_stream_name,
            video_lock_time_2: imageData.video_lock_time_2 ? imageData.video_lock_time_2 : '',
            account_id: imageData.account_id ? imageData.account_id : '',
        })
    })
    .catch(err => {
        console.log(err);
        if("authorized" in err){
            res.send({
                message : "failure",
                error : "You are not authorized to access this resource."
            })
        }
        else{
            res.send({
                log_stream_name: imageData.log_stream_name,
                account_id: imageData.account_id ? imageData.account_id : '',
                message : "Simulation is in process"
            })
        }
    })
});

/*+++++++++++++++++ Set video lock time funtion start here ++++++++++++++++ */
app.post(`${apiPrefix}setVideoTime`, (req, res) => {
    console.log(req.body);
    setVideoTime(req.body.image_id, req.body.left_lock_time,req.body.right_lock_time,req.body.type)
    .then(data=>{
        res.send({
            message:'success',
            status: '200',
            data:data
        })
    }).catch(err=>{
        res.send({
            message:'failure',
            status: '300',
            data: []
        })
    })
});



app.get(`${apiPrefix}userEmailVerification`, (req, res) => {
    console.log(req.query.code);
    const confirmationCode = req.query.code
    const username = req.query.username
    const clientId = req.query.clientId
    const region = req.query.region
    const email = req.query.email

    let params = {
        ClientId: clientId,
        ConfirmationCode: confirmationCode,
        Username: username
    }

    var confirmSignUp = COGNITO_CLIENT.confirmSignUp(params).promise()
    confirmSignUp.then(
        (data) => {
            res
            let redirectUrl = config.FrontendUrl + 'Login?success=true'
            res.redirect(redirectUrl);
        }
    ).catch(
        (error) => {
            let redirectUrl = config.FrontendUrl + 'Login?error=' + error.message
            res.redirect(redirectUrl);
        }
    )
});

/*================ Resend verfication email funtion start here ======================*/
app.post(`${apiPrefix}reSendVerficationEmail`, (req, res) => {
    console.log(req.body)
    const {user_name} = req.body;
  
    getUserAlreadyExists(user_name)
    .then(data=>{
        if(data[0]){
            var params = {
              ClientId: cognito.ClientId, /* required */
              Username: user_name, /* required */
            };
            COGNITO_CLIENT.resendConfirmationCode(params, function(err, data) {
              if (err){
                res.send({
                    message: "failure",
                    error: 'Somethig went wrong when sending verfication link.'
                });
              }
              else {
                res.send({
                    message: "success",
                    message_details : "Verification Link sended successfully in your mail account. Click on verify email button to verify your account.",
                })
              }    
            });
        }else{
            res.send({
                message: "failure",
                error: 'Your account dose not exists! Please check your entered email account.'
            });
        }
    }).catch(err=>{
        res.send({
            message: "failure",
            error: 'Somethig went wrong when sending verfication link.'
        });
    })
    
})


/*================ ======================================
        
        Resend verfication email funtion end  

====================== =======================================*/

/*+++++++++++++++++ Set video lock time funtion end here ++++++++++++++++ */
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

app.post(`${apiPrefix}getOrgUniqueList`, (req, res) => {
    console.log('get org list')
    getOrgUniqueList()
    .then(list => {
        let uniqueList = [];
        var orgList = list.filter(function (organization) {
            if (uniqueList.indexOf(organization.organization) === -1) {
                uniqueList.push(organization.organization);
                return organization;
            }
        });
        console.log('uniqueList',orgList)
        res.send({
            message: 'success',
            status: 200,
            data: orgList
        })
    })
    .catch(err=>{
        console.log('err',err);
        res.send({
            message: 'faiure',
            status: 300,
            data: []
        })
    })
})

app.post(`${apiPrefix}getOrgUniqueTeams`, (req, res) => {
    console.log('org name', req.body);
    getOrgUniqueTeams(req.body.org)
    .then(list => {
        let uniqueList = [];
        var teamList = list.filter(function (team) {
            if (uniqueList.indexOf(team.team_name) === -1) {
                uniqueList.push(team.team_name);
                return team;
            }
        });
        console.log('uniqueList',teamList)
        res.send({
            message: 'success',
            status: 200,
            data: teamList
        })
    })
    .catch(err=>{
        console.log('err',err);
        res.send({
            message: 'faiure',
            status: 300,
            data: []
        })
    })
})

function upDateuserProfile(User, cb) {
    if(User.email){
        var params = {
            UserAttributes: [ /* required */
              {
                Name: 'name', /* required */
                Value: User.name
              },
              {
                Name: 'phone_number', /* required */
                Value: User.phone_number
              },
              {
                Name: 'phone_number_verified', /* required */
                Value: User.phone_number_verified
              },
              /* more items */
            ],
            UserPoolId: cognito.userPoolId, /* required */
            Username: User.user_name, /* required */
          };
          COGNITO_CLIENT.adminUpdateUserAttributes(params, function(err, data) {
            if (err) {
                cb(err, "");
            } // an error occurred
            else {
                cb("", data);
            }             // successful response
          });
    }else{
        cb("", true);
    }
}


app.post(`${apiPrefix}updateUserDetails`,(req, res) => {
    console.log('req',req.body);
    let obj = {};
    obj.user_name = req.body.user_cognito_id;
    obj.name = req.body.first_name+req.body.last_name;
    obj.email = req.body.email;
    obj.phone_number = req.body.country_code+req.body.phone_number;
    obj.phone_number_verified = req.body.number_verified

    upDateuserProfile(obj, function (err, data) {
        if (err) {
            res.send({
                message : 'failure',
                error: err
            })
        }else{

            let update_details = {
                TableName : 'users',
                Key : {
                    "user_cognito_id": req.body.user_cognito_id
                },
                UpdateExpression : "set first_name = :fname, last_name = :lname, dob = :dob, gender = :gender, phone_number = :phone_number, phone_number_verified = :phone_number_verified",
                ExpressionAttributeValues : {
                    ":fname" : req.body.first_name,
                    ":lname" : req.body.last_name,
                    ":dob" : req.body.dob,
                    ":gender" : req.body.sex,
                    ":phone_number" : req.body.phone_number,
                    ":phone_number_verified" : req.body.number_verified
                },
                ReturnValues: "UPDATED_NEW"
            };

            docClient.update(update_details, function(err, data){
                if(err) {
                    res.send({
                        message : 'failure'
                    })
                } else {
                    res.send({
                        message : 'success'
                    })
                }
            })
        }
    })
})

app.post(`${apiPrefix}updateUserMouthguardDetails`,(req, res) => {
    console.log('req',req.body);
    let update_details = {
        TableName : 'users',
        Key : {
            "user_cognito_id": req.body.user_cognito_id
        },
        UpdateExpression : "set sensor = :sensor, sensor_id_number = :sensor_id_number",
        ExpressionAttributeValues : {
            ":sensor" : req.body.sensor,
            ":sensor_id_number" : req.body.sensor_id_number
        },
        ReturnValues: "UPDATED_NEW"
    };

    docClient.update(update_details, function(err, data){
        if(err) {
            res.send({
                message : 'failure'
            })
        } else {
            res.send({
                message : 'success'
            })
        }
    })
})
function adminVerifyNumber(User, cb) {

    var params = {
        UserAttributes: [ /* required */
          {
            Name: 'phone_number', /* required */
            Value: User.phone_number
          },
          {
            Name: 'phone_number_verified', /* required */
            Value: User.phone_number_verified
          },
          /* more items */
        ],
        UserPoolId: cognito.userPoolId, /* required */
        Username: User.user_name, /* required */
      };
      COGNITO_CLIENT.adminUpdateUserAttributes(params, function(err, data) {
        if (err) {
            cb(err, "");
        } // an error occurred
        else {
            cb("", data);
        }             // successful response
      });
}

app.post(`${apiPrefix}VerifyNumber`,(req, res) => {
    console.log('req',req.body);
    let obj = {};
    obj.user_name = req.body.user_cognito_id;
    obj.phone_number = req.body.country_code+req.body.phone_number;
    obj.phone_number_verified = 'true';
    var code = Math.floor(100000 + Math.random() * 900000);
    var d  = new Date(Date.now() + (5 * 60 * 1000));
    var code_exp = d.getTime();
    console.log('obj.phone_number',)
    var params = {
      Message: code+' is your NSFCAREER verification code', /* required */
      PhoneNumber: obj.phone_number,
    };

    // Create promise and SNS service object
    var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();

    // Handle promise's fulfilled/rejected states
    publishTextPromise.then(
    function(data) {
        console.log("MessageID is " + data.MessageId);
        let update_details = {
            TableName : 'users',
            Key : {
                "user_cognito_id": req.body.user_cognito_id
            },
            UpdateExpression : "set phone_number = :phone_number, country_code = :country_code,phone_number_verified= :phone_number_verified,number_verified_code= :number_verified_code, number_verified_code_exp= :number_verified_code_exp",
            ExpressionAttributeValues : {
                ":phone_number" : obj.phone_number,
                ":country_code" : req.body.country_code,
                ":phone_number_verified" : 'false',
                ":number_verified_code" : code,
                ":number_verified_code_exp" : code_exp
            },
            ReturnValues: "UPDATED_NEW"
        };

        docClient.update(update_details, function(err, data){
            if(err) {
                res.send({
                    message : 'failure',
                    err: 'Somthing went wrong! Please try later.'
                })
            } else {
                res.send({
                    message : 'success',
                    data: data
                })
            }
        })
      }).catch( err =>{
            res.send({
                message : 'failure',
                err: 'Failed to send verification code, Please try later.'
            })
      });


    // adminVerifyNumber(obj, function (err, data) {
    //     if (err) {
    //         console.log("COGNITO CREATE USER ERROR =========\n", err);

    //         res.send({
    //             message: "failure", 
    //             error: err.message
    //         });
    //     }
    //     else {
    //         // On success
    //         // res.send({
    //         //     message: 'success',
    //         //     data: data
    //         // });
    //         let update_details = {

    //             TableName : 'users',
    //             Key : {
    //                 "user_cognito_id": req.body.user_cognito_id
    //             },
    //             UpdateExpression : "set phone_number = :phone_number, country_code = :country_code,phone_number_verified= :phone_number_verified",
    //             ExpressionAttributeValues : {
    //                 ":phone_number" : obj.phone_number,
    //                 ":country_code" : req.body.country_code,
    //                 ":phone_number_verified" : 'true'
    //             },
    //             ReturnValues: "UPDATED_NEW"
    //         };

    //         docClient.update(update_details, function(err, data){
    //             if(err) {
    //                 res.send({
    //                     message : 'failure',
    //                     err: err
    //                 })
    //             } else {
    //                 res.send({
    //                     message : 'success',
    //                     data: data
    //                 })
    //             }
    //         })
    //     }
    // })
})

app.post(`${apiPrefix}VerifyVerificationCode`,(req, res) => {
    console.log('req',req.body);
    var user_cognito_id = req.body.user_cognito_id;
    var numberVerificationCode = req.body.numberVerificationCode;

    getUserDbData(user_cognito_id, function(err, user_details){
        if(err){
            console.log('err',err)
        }else{
            console.log('user_details');
            let obj = {};
            obj.user_name = user_cognito_id;
            obj.phone_number = user_details.Item.phone_number;
            obj.phone_number_verified = 'true';
            if(user_details.Item.number_verified_code){
                if(parseInt(numberVerificationCode) ===  user_details.Item.number_verified_code){
                    var currentTime = Date.now();
                    if(user_details.Item.number_verified_code_exp <  currentTime){
                        res.send({
                            message: "failure",
                            error:"Verification code has been expired!"
                        });
                    }else{
                        adminVerifyNumber(obj, function (err, data) {
                            if (err) {
                                console.log("COGNITO CREATE USER ERROR =========\n", err);

                                res.send({
                                    message: "failure", 
                                    error: err.message
                                });
                            }
                            else {
                                let update_details = {

                                    TableName : 'users',
                                    Key : {
                                        "user_cognito_id": user_cognito_id
                                    },
                                    UpdateExpression : "set phone_number_verified= :phone_number_verified",
                                    ExpressionAttributeValues : {
                                        ":phone_number_verified" : 'true'
                                    },
                                    ReturnValues: "UPDATED_NEW"
                                };

                                docClient.update(update_details, function(err, data){
                                    if(err) {
                                        res.send({
                                            message : 'failure',
                                            err: err
                                        })
                                    } else {
                                        res.send({
                                            message : 'success',
                                            data: data
                                        })
                                    }
                                })
                            }
                        })
                    }
                }else{
                    res.send({
                        message: "failure",
                        error:"Verification code dose not match."
                    });
                }
            }else{
                res.send({
                    message: "failure",
                    error: "Your number can not verified yet."
                });
            }
        }
    })

})

app.post(`${apiPrefix}singUpWithToken`, (req, res) => {
    // First we add an attirbute of `name` as cognito requires it from first_name and last_name
    req.body["name"] = req.body.first_name + req.body.last_name;
    req.body["email"] = req.body.user_name;
    req.body["is_selfie_image_uploaded"] = false;
    req.body["is_selfie_model_uploaded"] = false;
    req.body["is_selfie_inp_uploaded"] = false;
    // Hardcoding Done Here need to be replaced with actual organization in request.
    req.body["organization"] = req.body.organization;
    req.body["level"] = req.body.level;
    req.body.phone_number = req.body.country_code.split(" ")[0] + req.body.phone_number ;
    req.body.country_code = req.body.country_code.split(" ")[0] ;
    console.log("-----------------------------\n",req.body,"----------------------------------------\n");
    

})

app.post(`${apiPrefix}updateCognitoUser`, (req, res) => {
    let obj = {};
    obj.user_name = '9005758e-5fa9-4d83-898b-065ab520af2f';
    obj.email = 'rooks.t@gmail.com';

    adminUpdateUser(obj, function (err, data) {
        if (err) {
            console.log("COGNITO CREATE USER ERROR =========\n", err);

            res.send({
                message: "failure",
                error: err.message
            });
        }
        else {
            // On success
            res.send({
                message: 'success'
            });
        }
    })
})


app.post(`${apiPrefix}signUp`, (req, res) => {

    // Generate 10 digits unique number
    const account_id = Math.floor(Math.random() * 9000000000) + 1000000000;
    req.body["account_id"] = account_id.toString();

    // First we add an attirbute of `name` as cognito requires it from first_name and last_name
    req.body["name"] = req.body.first_name + req.body.last_name;
    var user_name = req.body.user_name;
    console.log('user_name',user_name)

    req.body["email"] = user_name.toLowerCase();
    req.body["user_name"] = user_name.toLowerCase();
    console.log('email',req.body["email"] )
    req.body["is_selfie_image_uploaded"] = false;
    req.body["is_selfie_model_uploaded"] = false;
    req.body["is_selfie_inp_uploaded"] = false;
    // Hardcoding Done Here need to be replaced with actual organization in request.
    if(!req.body.organization){
        req.body["organization"] = "PSU";
    }
    if(!req.body.level){
        req.body["level"] = '100';
    }
    req.body.phone_number = req.body.phone_number.replace(/[-() ]/g, '');
    req.body.phone_number = req.body.country_code.split(" ")[0] + req.body.phone_number ;
    req.body.country_code = req.body.country_code.split(" ")[0] ;
    var length = 25,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#^&%$@",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    if(req.body.password){
        req.body['password'] = md5(req.body.password);
    }
    req.body.password_code = retVal;
    var user_cognito_id = '';
    if(req.body.userIDfacebook || req.body.userIDgoogle){
        req.body['isSocialAccount'] = 'yes';
    }else{
        req.body['isSocialAccount'] = 'no';
    }
    console.log("-----------------------------\n",req.body,"----------------------------------------\n");
    /*======================= Checkign user account exists or not =====================================*/
    getUserAlreadyExists(req.body["email"])
    .then(data =>{
        console.log('data',data);
        if(data && data[0]){
            /*================== updating user for manual login =======================*/
            if(req.body.password){
                if(!data[0].password){
                    upDateuserPassword(req.body, data[0].user_cognito_id)
                    .then(success =>{
                        res.send({
                            message: "success",
                            message_details : "Successfully mereged account ! Your manul signUp has been completed successfully, You can update your profile from profile page",
                            user_cognito_id: user_cognito_id
                        })
                    }).catch(err=>{
                        console.log('err===========\n',err);
                        res.send({
                            message: "failure",
                            error: 'Somethig went wrong when mereging account'
                        });
                    })
                }else{
                    res.send({
                        message: "failure",
                        error: 'User already exists with this email'
                    });
                }
            }
            /* =================== Updating user for Facebook or google login ======================*/
            else{
                upDateUserFBGlid(req.body, data[0].user_cognito_id)  
                .then(success =>{
                    res.send({
                        message: "success",
                        message_details : "Your account mereged successfully! You can update your profile from profile page.",
                        user_cognito_id: user_cognito_id
                    })
                }).catch(err=>{
                    console.log('err===========\n',err);
                    res.send({
                        message: "failure",
                        error: 'Somethig went wrong when mereging account'
                    });
                })
            }
        }else{
            /*========================== Creating user entrey if not exists in database ================================*/
            adminCreateUser(req.body, function (err, data) {
                if (err) {
                    console.log("COGNITO CREATE USER ERROR =========\n", err);

                    res.send({
                        message: "failure",
                        error: err.message
                    });
                }
                else {
                    console.log('data------------\n',data);
                    
                    req.body["user_cognito_id"] = data.UserSub;
                    user_cognito_id = data.UserSub;
                    //Now check type of User and give permission accordingly
                    // res.send(data);
                    // user_type
                    // userName
                    var tempData = {};
                    tempData["user_name"] = data.UserSub;
                    tempData["userName"] = data.UserSub;

                    tempData["user_type"] = req.body.user_type;
                    tempData["phone_number"] = req.body.phone_number;
                    if(!req.body.level){
                        tempData["level"] = 100;
                    }else{
                         tempData["level"] =  parseInt(req.body.level);
                    }
                    
                    //tempData["is_sensor_company"] = true;

                    if (req.body.user_type == "Admin") {

                        // Admin User
                        var mergedObject = { ...req.body, ...tempData };
                        delete mergedObject.userName;
                        delete mergedObject.name;
                        console.log('mergedObject------------\n',mergedObject);
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
                                            message: 'success',
                                            user_cognito_id: user_cognito_id
                                        });
                                    }
                                });
                            }
                        })
                    }
                    else {

                        // Merging objects
                        var mergedObject = { ...req.body, ...tempData };
                        console.log('mergedObject------------\n',mergedObject);
                        delete mergedObject.userName;
                        delete mergedObject.name;
                        createUserDbEntry(mergedObject, function (dberr, dbdata) {
                            if (err) {
                                console.log("DB ERRRRRR =============================== \n", err);

                                res.send({
                                    message: "failure",
                                    error: dberr.code
                                });
                            }
                            else {
                                if(mergedObject.level == 400){
                                    InsertUserIntoSensor(mergedObject.user_cognito_id,mergedObject.sensor).
                                        then(sensor_data => {
                                           
                                            console.log('sensor_data',sensor_data)
                                        })
                                        .catch(err => {
                                           console.log('err',err)
                                        })
                                }
                                // Add user to corresponding group...
                                // event.user_type
                                // event.user_name
                                // console.log(tempData);

                                addUserToGroup(tempData, function (groupAddErr, groupData) {
                                    if (groupAddErr) {

                                        res.send({
                                            message: "failure",
                                            error: groupAddErr.message
                                        })
                                    }
                                    else {

                                        let age = getAge(mergedObject.dob);
                                        console.log("actual age is ", age);
                                        // Adding user's age in details
                                        mergedObject["age"] = age;

                                        if( age < 18) {
                                            // Disable user account
                                        }

                                        // Sending request to service to generate IRB form
                                        request.post({
                                            url: config.ComputeInstanceEndpoint + "IRBFormGenerate",
                                            json: mergedObject
                                        }, function (err, httpResponse, body) {
                                            if (err) {
                                                console.log('irb error is : ', err);
                                                res.send({
                                                    message: "failure",
                                                    error: err
                                                })
                                            }
                                            else {
                                                console.log("response body from irb", httpResponse.body);
                                                // if( age > 18 ) {
                                                //     res.send({
                                                //         message: "success",
                                                //         message_details : "Successfully created account ! Check your mail for temporary login credentials",
                                                //         user_cognito_id: user_cognito_id
                                                //     })
                                                // } else {

                                                //     disableUser(req.body.user_name, function (err, data) {
                                                //         if (err) {
                                                //             console.log("Failed to disable user",req.body.user_name )
                                                //             res.send({
                                                //                 message: "failure",
                                                //                 error: err
                                                //             })
                                                //         }
                                                //         else {
                                                //             res.send({
                                                //                 message : "success",
                                                //                 message_details : "Your request to join NSFCAREER study has successfully been mailed to your guardian for approval. Once they sign the consent form, you will be a part of the study!",
                                                //                 user_cognito_id: user_cognito_id
                                                //             })
                                                //         }
                                                //     })

                                                // }

                                                res.send({
                                                    message: "success",
                                                    message_details : req.body['isSocialAccount'] == 'yes' ? 'Your account created successfully. Please log In' : "Successfully created account ! Check your mail to verify your account.",
                                                    user_cognito_id: user_cognito_id,
                                                    account_id: req.body["account_id"],
                                                })

                                            }
                                        })
                                    }
                                });
                            }
                        })
                    }
                }
            })
        }
    })
    .catch(err=>{
        console.log('err===========\n',err)
    })
});

function updateCognitoUser(body, user_cognito_id) {
    return new Promise((resolve, reject) => {
        var params = {
            UserAttributes: [ /* required */
              {
                Name: 'name', /* required */
                Value: body.first_name+body.last_name,
              },
              {
                Name: 'custom:level', /* required */
                Value: body.level,
              },
              /* more items */
            ],
            UserPoolId: cognito.userPoolId, /* required */
            Username: user_cognito_id, /* required */
        };
        COGNITO_CLIENT.adminUpdateUserAttributes(params, function(err, data) {
            if (err) {
                reject(err);
            } // an error occurred
            else {
                resolve(data);
            }             // successful response
        });
    })
}
/*=========== Set user default login password =============*/
app.post(`${apiPrefix}setUserPassword`, (req, res) => {
    console.log(req.body)
    req.body['password'] = md5(req.body.password);
    upDateuserPassword(req.body,req.body.user_cognito_id)
    .then(data=>{
        res.send({
            message: "Success",
            data: data
        });
    }).catch(err=>{
        res.send({
            message: "faiure",
            error: err
        });
    })
})

/*=========== Set user default login password end =============*/

app.post(`${apiPrefix}InviteUsers`, (req, res) => {
    console.log("InviteUsers Called!",req.body);
    let email = req.body.email;
    req.body['email'] = email.toLowerCase();
    getUserAlreadyExists(req.body.email)
    .then(data=>{
        if(data[0]){
            console.log('data --------------------\n',data);
            if(!req.body['sensor']){
                req.body['sensor'] = ''
            }
            let mailBody = 'You have been added as a super admin. Go to your dashboard with this link '+config.FrontendUrl
            if(req.body['level'] == '400'){
                mailBody = 'You have been added as a sensor admin. Go to your dashboard with this link '+config.FrontendUrl+'OrganizationAdmin';
            }else if(req.body['level'] == '300'){
                mailBody = 'You have been added as a organization admin. Go to your dashboard with this link '+config.FrontendUrl+'TeamAdmin';
            }else if(req.body['level'] == '200'){
                mailBody = 'You have been added as a team admin. Go to your dashboard with this link '+config.FrontendUrl+'TeamAdmin/team/players';
            }
            updateCognitoUser(req.body,data[0].user_cognito_id)
            .then(result=>{
                let isReturn = false;
                req.body['level'] = parseInt(req.body.level);
                if(req.body['level'] == 400){
                    InsertUserIntoSensor(data[0].user_cognito_id,req.body['sensor']).
                    then(sensor_data => {
                       
                        console.log('sensor_data',sensor_data);
                         return  upDateuser(req.body,data[0].user_cognito_id);
                    })
                    .catch(err => {
                        res.send({
                            message: "faiure",
                            error: err
                        });
                        isReturn = false;
                    })
                }else{
                     return  upDateuser(req.body,data[0].user_cognito_id);
                }
            })
            .then(result=>{
                 var params = {
                      Destination: { /* required */
                        ToAddresses: [
                          req.body.email,
                          /* more items */
                        ]
                      },
                      Message: { /* required */
                        Body: { /* required */
                          Text: {
                           Charset: "UTF-8",
                           Data: mailBody
                          }
                         },
                         Subject: {
                          Charset: 'UTF-8',
                          Data: 'Your level has been changed'
                         }
                        },
                      Source: 'info@NSFCAREER.IO', /* required */
                      ReplyToAddresses: [
                         'info@NSFCAREER.IO',
                        /* more items */
                      ],
                    };

                // Create the promise and SES service object
                var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

                // Handle promise's fulfilled/rejected states
                sendPromise.then(
                  function(data) {
                    console.log(data.MessageId);
                    res.send({
                        message: "Success",
                        data: data.MessageId
                    });
                }).catch(
                    function(err) {
                    console.error(err, err.stack);
                    res.send({
                        message: "faiure",
                        error: err
                    });
                });
            })
            .catch(err=>{
                console.log("err updateCognitoUser =============================== \n", err);

                    res.send({
                        message: "faiure",
                        error: err
                    });
            })
        }else{
            createInviteUserDbEntry(req.body, function (dberr, dbdata) {
                if (dberr) {
                    console.log("DB ERRRRRR =============================== \n", dberr);

                    res.send({
                        message: "faiure",
                        error: dberr.code
                    });
                }
                else {
                    console.log('dbdata',dbdata)
                    var params = {
                      Destination: { /* required */
                        ToAddresses: [
                          dbdata.email,
                          /* more items */
                        ]
                      },
                      Message: { /* required */
                        Body: { /* required */
                          Text: {
                           Charset: "UTF-8",
                           Data: 'Signup by this url = '+config.FrontendUrl+'SignUp/'+dbdata.InviteToken
                          }
                         },
                         Subject: {
                          Charset: 'UTF-8',
                          Data: 'Thank you for joining Nsfcareer'
                         }
                        },
                      Source: 'info@NSFCAREER.IO', /* required */
                      ReplyToAddresses: [
                         'info@NSFCAREER.IO',
                        /* more items */
                      ],
                    };

                    // Create the promise and SES service object
                    var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

                    // Handle promise's fulfilled/rejected states
                    sendPromise.then(
                      function(data) {
                        console.log(data.MessageId);
                        res.send({
                            message: "Success",
                            data: data.MessageId
                        });
                      }).catch(
                        function(err) {
                        console.error(err, err.stack);
                        res.send({
                            message: "faiure",
                            error: err
                        });
                      });
                }
            })
        }
    }).catch(err=>{
        console.log('err',err)
    })
    
});

function emptyBucket(obj,callback){
  var params = {
    Bucket: obj.bucket_name,
    Prefix: obj.root_path
  };

  s3.listObjects(params, function(err, data) {
    if (err) return callback(err);

    if (data.Contents.length == 0) callback();

    params = {Bucket: obj.bucket_name};
    params.Delete = {Objects:[]};

    data.Contents.forEach(function(content) {
      params.Delete.Objects.push({Key: content.Key});
    });
    console.log('params -----------\n',params)
    s3.deleteObjects(params, function(err, data) {
      if (err) return callback(err);
      if(data.Contents){
        emptyBucket(obj.bucket_name,callback);
        }
      else{
        callback();
      } 
    });
  });
}

app.post(`${apiPrefix}deleteItem`, (req, res) => {
    let type = req.body.type;
    let data = req.body.data;
    if(type == 'team'){
        
        getBrandDataByorg(data.brand, data.organization)
        .then (result => {
            let sensorlen = result.length;
            let count1 = 0; 
            let count3 = 0;
            if(sensorlen > 0){

                /*========== Delete data from sensor data table ==============*/
                result.forEach(async function (record, index) {
                    count1++;
                    if( record.team && record.player_id){
                        deleteSensorData(record.team, record.player_id)
                        .then(deldata => {
                            console.log('deldata',deldata)
                        })
                    }
                    /*=-==========Get simulation data and root path of folder ==========*/
                    getPlayerSimulationFile({image_id: record.image_id})
                    .then(image_Data =>{
                        count3++;
                        console.log('image_Data root_path',image_Data.root_path)
                        //*** delete simulation file from s3
                        if(image_Data.root_path && image_Data.root_path != 'undefined'){
                            emptyBucket({bucket_name: image_Data.bucket_name,root_path: image_Data.root_path},function (err, data) {
                                console.log('data',data)
                            })
                        }

                        //**Deleting data of simulation data table
                        if(count3 == sensorlen){
                            let count2 = 0;
                            result.forEach(async function (record, index) {
                                count2++;
                                deleteSimulation_imagesData(record.image_id)
                                .then(deldata => {
                                    console.log('deldata',deldata)
                                })
                            })
                            if(count2 == sensorlen){
                                //** Delete data from organization table...
                                getOrganizatonBynameSensor(data.organization, data.brand)
                                .then(org =>{
                                    var orglen = org.length;
                                    orglen = orglen-1;
                                    if(org){
                                        org.forEach(function (record, index) {
                                            console.log('record',record.organization_id);
                                            console.log(index, orglen)
                                            DeleteOrganization(record.organization_id)
                                            .then(data => {
                                                console.log('res',data)
                                                if(index == orglen){
                                                    res.send({
                                                        message: 'success',
                                                        status: 200
                                                    })
                                                }
                                            }).catch(err => {
                                                console.log('err',err)
                                                if(index == orglen){
                                                     res.send({
                                                        message: 'failure',
                                                        status: 300,
                                                        err: err
                                                    })
                                                }
                                            })
                                        })
                                    }else{
                                        res.send({
                                            message: 'failure',
                                            status: 300,
                                            err: err
                                        })
                                    }
                                }).catch(err => {
                                    console.log('err',err)
                                    res.send({
                                        message: 'failure',
                                        status: 300,
                                        err: err
                                    })
                                })
                            }
                    
                        }
                    }).catch(err=>{
                        count3++;
                    })
                    //**Delete simulation data from simulation_image db...
                   
                })
            }else{
                getOrganizatonBynameSensor(data.organization, data.brand)
                .then(org =>{
                    var orglen = org.length;
                    orglen = orglen-1;
                    if(org){
                        org.forEach(function (record, index) {
                            console.log('record',record.organization_id);
                            console.log(index, orglen)
                            DeleteOrganization(record.organization_id)
                            .then(data => {
                                console.log('res',data)
                                if(index == orglen){
                                    res.send({
                                        message: 'success',
                                        status: 200
                                    })
                                }
                            }).catch(err => {
                                console.log('err',err)
                                if(index == orglen){
                                     res.send({
                                        message: 'failure',
                                        status: 300,
                                        err: err
                                    })
                                }
                            })
                        })
                    }else{
                        res.send({
                            message: 'failure',
                            status: 300,
                            err: err
                        })
                    }
                }).catch(err => {
                    console.log('err',err)
                    res.send({
                        message: 'failure',
                        status: 300,
                        err: err
                    })
                })
            }
        })
        
        
    }else if(type == 'orgTeam'){
        getOrganizationTeamData({sensor: data.brand,organization: data.organization,team: data.TeamName})
        .then (result => {
            console.log('result ----------------',result)
            let sensorlen = result.length;
            let count1 = 0; 
            let count3 = 0;
            console.log(sensorlen)
            if(sensorlen > 0){
                result.forEach(async function (record, index) {

                    count1++;
                    /*========== Delete data from sensor data table ==============*/
                    console.log('record.player_id', record.org_id,  record.player_id)
                    if(  record.org_id && record.player_id){
                        deleteSensorData(record.org_id, record.player_id)
                        .then(deldata => {
                            console.log('deldata',deldata)
                        }).catch(err=>{
                            console.log('deleteSensorData error \n', err)
                        })
                    }
                    console.log('image_id ----',record.image_id)
                    /*=========== Get simulation data and root path of folder ==========*/
                    getPlayerSimulationFile({image_id: record.image_id})
                    .then(image_Data =>{
                        count3++;
                        console.log('image_Data root_path',image_Data.root_path)
                        //*** delete simulation file from s3
                        if(image_Data.root_path && image_Data.root_path != 'undefined'){
                            emptyBucket({bucket_name: image_Data.bucket_name,root_path: image_Data.root_path},function (err, data) {
                                console.log('data',data)
                            })
                        }

                        //** Delete data from simulation images table...
                        if(count3 == sensorlen){
                            let count2 = 0;
                            result.forEach(async function (record, index) {
                                count2++;
                                deleteSimulation_imagesData(record.image_id)
                                .then(deldata => {
                                    console.log('deldata',deldata)
                                })
                            })
                            if(count2 == sensorlen){
                                getOrganizatonByTeam(data.organization, data.TeamName)
                                .then(org =>{
                                    var orglen = org.length;
                                    orglen = orglen-1;
                                    if(org){
                                        org.forEach(function (record, index) {
                                            console.log(index, orglen)
                                            DeleteOrganization(record.organization_id)
                                            .then(data => {
                                                console.log('res',data)
                                                if(index == orglen){
                                                    res.send({
                                                        message: 'success',
                                                        status: 200
                                                    })
                                                }
                                            }).catch(err => {
                                                console.log('err',err)
                                                if(index == orglen){
                                                     res.send({
                                                        message: 'failure',
                                                        status: 300,
                                                        err: err
                                                    })
                                                }
                                            })
                                        })
                                    }else{
                                        res.send({
                                            message: 'failure',
                                            status: 300,
                                            err: err
                                        })
                                    }
                                }).catch(err => {
                                    console.log('err',err)
                                    res.send({
                                        message: 'failure',
                                        status: 300,
                                        err: err
                                    })
                                })
                            }
                        }
                    });
                })
            }else{
                getOrganizatonByTeam(data.organization, data.TeamName)
                .then(org =>{
                    var orglen = org.length;
                    orglen = orglen-1;
                    if(org){
                        org.forEach(function (record, index) {
                            console.log('record',record.organization_id);
                            console.log(index, orglen)
                            DeleteOrganization(record.organization_id)
                            .then(data => {
                                console.log('res',data)
                                if(index == orglen){
                                    res.send({
                                        message: 'success',
                                        status: 200
                                    })
                                }
                            }).catch(err => {
                                console.log('err',err)
                                if(index == orglen){
                                     res.send({
                                        message: 'failure',
                                        status: 300,
                                        err: err
                                    })
                                }
                            })
                        })
                    }else{
                        res.send({
                            message: 'failure',
                            status: 300,
                            err: err
                        })
                    }
                }).catch(err => {
                    console.log('err',err)
                    res.send({
                        message: 'failure',
                        status: 300,
                        err: err
                    })
                })
            }
        })
       
    }
})

//Rename organization
app.post(`${apiPrefix}renameOrganization`, (req, res) => {
    console.log(req.body) ;
    let organization = req.body.data.organization;
    let sensor = req.body.data.brand;
    let OrganizationName = req.body.OrganizationName;
   
    renameOrganization(req.body.OrganizationName, req.body.organization_id)
    .then(data => {
        console.log('res',data)
        getOrgSensorData(organization, sensor)
        .then(sensor_data => {
            console.log('sensor_data',sensor_data);
            let sensorlen = sensor_data.length;
            if(sensorlen > 0){
                sensorlen = sensorlen-1;
                sensor_data.forEach(function (record, index) {
                    // console.log('sensor',record);
                    renameSensorOrganization(OrganizationName, record.player_id, record.team)
                    .then(response=>{
                        console.log('response',response)
                        if(index == sensorlen){
                            res.send({
                                message: 'success',
                                status: 200,
                            })
                        }
                    }).catch(err=>{
                        if(index == sensorlen){
                            res.send({
                                message: 'failure',
                                status: 300,
                                err: err
                            })
                        }
                    })
                })
            }else{
                res.send({
                    message: 'success',
                    status: 200,
                })
            }
        }).catch(err => {
            console.log("er",err)
        })
    }).catch(err =>{
        console.log(err)
        res.send({
            message: 'failure',
            status: 300,
            err: err
        })
    })
})

app.post(`${apiPrefix}addOrganization`, (req, res) => {
    console.log(req.body);
    addOrganization(req.body.OrganizationName, req.body.sensor)
    .then(data => {
        console.log('res',data)
        res.send({
            message: 'success',
            status: 200
        })
    }).catch(err =>{
        console.log(err)
        res.send({
            message: 'failure',
            status: 300,
            err: err
        })
    })
})

/*============ Team edit funtions start here===================*/
app.post(`${apiPrefix}addorgTeam`, (req, res) => {
    console.log(req.body);
    addorgTeam(req.body.TeamName, req.body.organization,req.body.sensor)
    .then(data => {
        console.log('res',data)
        res.send({
            message: 'success',
            status: 200
        })
    }).catch(err =>{
        console.log(err)
        res.send({
            message: 'failure',
            status: 300,
            err: err
        })
    })
});

app.post(`${apiPrefix}renameTeam`, (req, res) => {
    // console.log('body',req.body);
    let organization_id = req.body.organization_id;
    let team_name =  req.body.TeamName;
    let data = req.body.data;
    renameTeam(team_name,organization_id)
    .then(a => {
        return getSernsorDataByOrgTeam(organization_id, data.TeamName, data.organization);
    })
    .then(sensor_data => {
        console.log('sensor_data ', sensor_data);
        let sensor_cnt = 0;
        sensor_data.forEach(function (record, index) {
            const params = {
                TableName: "sensor_details",
                Key: {
                    org_id: record.org_id,
                    player_id: record.player_id,
                },
                UpdateExpression: "set team = :team_name",
                ExpressionAttributeValues: {
                    ":team_name": team_name
                },
                ReturnValues: "UPDATED_NEW"
            };
            docClient.update(params, function (err, data1) {
                if (err) {
                    console.log("Error when updating data\n", err);
                } else {
                    console.log("Sensor updated");
                }
                sensor_cnt++;
                if (sensor_cnt === sensor_data.length) {
                    getUserByTeam(data.TeamName, data.organization)
                        .then(response => {
                            console.log('response', response);
                            let users_data = response;
                            if(users_data[0]) {
                                let userslen = users_data.length;
                                userslen = userslen-1;
                                users_data.forEach(function (record1, index1) {
                                    renameUsers(record1.user_cognito_id, team_name)
                                    .then(data => {
                                        console.log('res',data)
                                        if(index1 == userslen){
                                            res.send({
                                                message: 'success',
                                                status: 200
                                            })
                                        }
                                    }).catch(err => {
                                        console.log('err',err)
                                        if (index1 == userslen){ 
                                            res.send({
                                                message: 'failure',
                                                status: 300,
                                                err: err
                                            })
                                        }
                                    })
                                })
                            } else {
                                res.send({
                                    message: 'success',
                                    status: 200
                                })
                            }
                        })
                        .catch(err =>{
                            console.log(err)
                            res.send({
                                message: 'failure',
                                status: 300,
                                err: err
                            })
                        })
                }
            });
        })
    })
});

app.post(`${apiPrefix}MergeTeam`, (req, res) => {
    console.log('body',req.body);
    let data = req.body.data;
    let organization_id = data.organization_id;
    let team_name =  req.body.TeamName;
    
    renameTeam(team_name,organization_id)
    .then(response=>{
        // return getSernsorDataByTeam(data.TeamName,data.organization);
        return getUserByTeam(data.TeamName,data.selectOrg)
    })
    .then(response=>{
        console.log('response',response);
        let users_data = response;
        if(users_data[0]){
            let userslen = users_data.length;
            userslen = userslen-1;
            users_data.forEach(function (record, index) {
                renameUsers(record.user_cognito_id, team_name)
                .then(data => {
                    console.log('res',data)
                    if(index == userslen){
                        res.send({
                            message: 'success',
                            status: 200
                        })
                    }
                }).catch(err => {
                    console.log('err',err)
                    if(index == userslen){
                         res.send({
                            message: 'failure',
                            status: 300,
                            err: err
                        })
                    }
                })
            })
        }else{
            res.send({
                message: 'success',
                status: 200
            })
        }
    })
    .catch(err =>{
        console.log(err)
        res.send({
            message: 'failure',
            status: 300,
            err: err
        })
    })
})
/*============ Team edit funtions end here===================*/

app.post(`${apiPrefix}MergeOrganization`, (req, res) => {
    console.log('MergeOrganization',req.body);
    MergeOrganization(req.body.OrganizationName, req.body.organization_id)
    .then(data => {
        console.log('res',data)
        let organization = req.body.data.selectOrg;
        let sensor = req.body.data.brand;
        let OrganizationName = req.body.OrganizationName;
        getOrgSensorData(organization, sensor)
        .then(sensor_data => {
            console.log('sensor_data',sensor_data);
            let sensorlen = sensor_data.length;
            if(sensorlen > 0){
                sensorlen = sensorlen-1;
                sensor_data.forEach(function (record, index) {
                    // console.log('sensor',record);
                    renameSensorOrganization(OrganizationName, record.player_id, record.team)
                    .then(response=>{
                        console.log('response',response)
                        if(index == sensorlen){
                            res.send({
                                message: 'success',
                                status: 200,
                            })
                        }
                    }).catch(err=>{
                        if(index == sensorlen){
                            res.send({
                                message: 'failure',
                                status: 300,
                                err: err
                            })
                        }
                    })
                })
            }else{
                res.send({
                    message: 'success',
                    status: 200,
                })
            }
        }).catch(err => {
            console.log("er",err)
        })
    }).catch(err =>{
        console.log(err)
        res.send({
            message: 'failure',
            status: 300,
            err: err
        })
    })
    
})

//LoginWithoutEmail
app.post(`${apiPrefix}LoginWithoutEmail`, (req, res) => {
    console.log("LoginWithoutEmail In API Called!",req.body);
    let userID = req.body.userID;
    let type = req.body.type;
    if(req.body.email){
        req.body['email'] = req.body.email.toLowerCase();
    }
    let userData = '';
    getUserDbDataByUserId(userID,type, req.body.email, function (err, data) {
        if(err){
            console.log('err',err) 
        }else{
            console.log('data',data);
            if(data[0]){
                userData = data[0];
                if(!userData.password){
                    res.send({
                        message: "failure",
                        error: 'You are a user who had an existing account before the new sign in options for using Facebook and Google authentication were added.\n \n If you would like to use this feature, please contact the support team at <a href="mailto:support@nsfcareer.io?bcc=reuben.kraft@gmail.com" style="color:white;text-decoration: underline;">support@nsfcareer.io</a>'
                    });
                }else{
                    if(type == "facebook"){
                        if(!userData.userIDfacebook){
                            req.body['userIDfacebook'] = userID;
                            upDateUserFBGlid(req.body,userData.user_cognito_id)
                        }
                    }else{
                        if(!userData.userIDgoogle){
                            req.body['userIDgoogle'] = userID;
                            upDateUserFBGlid(req.body,userData.user_cognito_id)
                        }
                    }

                    getUser(data[0].email, function (err, data) {
                        if (err) {
                            console.log('err0',err);

                            res.send({
                                message: "failure",
                                error: 'Incorrect login credentials'
                            });
                        } else {
                            console.log("USER DATA is =====================> \n",data);
                            getListGroupForUser(data.Username, function (error, groupData) {
                                if (error) {
                                    console.log('error1',error)
                                    res.send({
                                        message: "failure",
                                        error: 'Incorrect login credentials'
                                    });
                                } else {
                                    // Now checking is user is ADMIN or not

                                    if (data.UserStatus == "FORCE_CHANGE_PASSWORD") {
                                        // Sends the user to first login page
                                        // respond with status of FORCE_CHANGE_PASSWORD
                                        res.send({
                                            message: "success",
                                            status: "FORCE_CHANGE_PASSWORD",
                                            user_name: userData.email
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
                                        login(userData.email, userData.password_code, userType, function (err, result) {

                                            if (err) {
                                                console.log('err2',err)
                                                res.cookie("token", "");
                                                res.send({
                                                    message: "failure",
                                                    error: err
                                                })
                                            }
                                            else {


                                                res.cookie("token", result.getIdToken().getJwtToken(),{ maxAge: 604800000 }); 

                                                getUserDbData(data.Username, function(err, user_details){
                                                    if(err){
                                                         console.log('err3',err)
                                                        res.send({
                                                            message : "failure",
                                                            error : err
                                                        })
                                                    }
                                                    else{
                                                        if (user_details.Item["level"] === 400) {
                                                            getUserSensor(data.Username)
                                                                .then(sensor_data => {
                                                                    user_details.Item["sensor"] = sensor_data[0]["sensor"];
                                                                    res.send({
                                                                        message : "success",
                                                                        user_details : user_details.Item,
                                                                        user_type: userType
                                                                    })
                                                                    
                                                                })
                                                                .catch(err => {
                                                                     console.log('err4',err)
                                                                    res.send({
                                                                        message : "failure",
                                                                        error : err
                                                                    })
                                                                })
                                                        } else {
                                                            res.send({
                                                                message : "success",
                                                                user_details : user_details.Item,
                                                                user_type: userType
                                                            })
                                                        }  
                                                    }
                                                })
                                            }
                                        })
                                    }
                                }
                            })

                        }
                    });
                }
            }else{
                res.send({
                    status:'success',
                    message:'notExists'
                });
            }
        }
    })
})
/*--------------Hidden login start here .....................*/
app.post(`${apiPrefix}logInHidden`, (req, res) => {
    console.log('re',req.body)
    // Getting user data of that user
    let user_name = req.body.user_name;
    req.body['user_name'] = user_name.toLowerCase();
    let userData = '';
    let data = '';
    getUser(req.body.user_name, function (err, data) {
        if (err) {
            console.log('err0',err);

            res.send({
                message: "failure",
                error: 'Incorrect login credentials'
            });
        } else {
            data = data;
            console.log("USER DATA is =====================> \n",data);
            getUserAlreadyExists(req.body['user_name'])
            .then(userresponse =>{
                console.log('userresponse',userresponse);
                if(userresponse[0]){
                    userData = userresponse[0];
                    /* ======================
    
                        For new users
                        
                    ==========================*/
                    if(userData.password){
                         // Now getting the list of Groups of user
                         /*============== Match user password ===============*/
                        if(userData.password == md5(req.body.password)){
                            getListGroupForUser(data.Username, function (error, groupData) {
                                if (error) {
                                    console.log('error1',error)
                                    res.send({
                                        message: "failure",
                                        error: 'Incorrect login credentials'
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
                                        login(req.body.user_name, userData.password_code, userType, function (err, result) {

                                            if (err) {
                                                console.log('err2',err)
                                                res.cookie("token", "");
                                                res.send({
                                                    message: "failure",
                                                    error: err == 'User is not confirmed.' ? 'your email is not verified, Check your mail to verify your account' : 'Incorrect login credentials'
                                                })
                                            }
                                            else {


                                                res.cookie("token", result.getIdToken().getJwtToken(),{ maxAge: 604800000 }); 

                                                getUserDbData(data.Username, function(err, user_details){
                                                    if(err){
                                                         console.log('err3',err)
                                                        res.send({
                                                            message : "failure",
                                                            error : err
                                                        })
                                                    }
                                                    else{
                                                        if (user_details.Item["level"] === 400) {
                                                            getUserSensor(data.Username)
                                                                .then(sensor_data => {
                                                                    user_details.Item["sensor"] = sensor_data[0]["sensor"];
                                                                    res.send({
                                                                        message : "success",
                                                                        user_details : user_details.Item,
                                                                        user_type: userType
                                                                    })
                                                                    
                                                                })
                                                                .catch(err => {
                                                                     console.log('err4',err)
                                                                    res.send({
                                                                        message : "failure",
                                                                        error : err
                                                                    })
                                                                })
                                                        } else {
                                                            res.send({
                                                                message : "success",
                                                                user_details : user_details.Item,
                                                                user_type: userType
                                                            })
                                                        }  
                                                    }
                                                })
                                            }
                                        })
                                    }
                                }
                            })
                        }else{
                            res.send({
                                message: "failure",
                                error: 'Incorrect login password'
                            });
                        }
                    }else{
                        /* ======================
    
                            For old users
                        
                        ==========================*/
                        getListGroupForUser(data.Username, function (error, groupData) {
                            if (error) {
                                console.log('error1',error)
                                res.send({
                                    message: "failure",
                                    error: 'Incorrect login credentials'
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
                                            console.log('err2',err)
                                            res.cookie("token", "");
                                            res.send({
                                                message: "failure",
                                                error: err == 'User is not confirmed.' ? 'your email is not verified, Check your mail to verify your account' : 'Incorrect login credentials'
                                            })
                                        }
                                        else {


                                            res.cookie("token", result.getIdToken().getJwtToken(),{ maxAge: 604800000 }); 

                                            getUserDbData(data.Username, function(err, user_details){
                                                if(err){
                                                     console.log('err3',err)
                                                    res.send({
                                                        message : "failure",
                                                        error : err
                                                    })
                                                }
                                                else{
                                                    if (user_details.Item["level"] === 400) {
                                                        getUserSensor(data.Username)
                                                            .then(sensor_data => {
                                                                user_details.Item["sensor"] = sensor_data[0]["sensor"];
                                                                res.send({
                                                                    message : "success",
                                                                    user_details : user_details.Item,
                                                                    user_type: userType
                                                                })
                                                                
                                                            })
                                                            .catch(err => {
                                                                 console.log('err4',err)
                                                                res.send({
                                                                    message : "failure",
                                                                    error : err
                                                                })
                                                            })
                                                    } else {
                                                        res.send({
                                                            message : "success",
                                                            user_details : user_details.Item,
                                                            user_type: userType
                                                        })
                                                    }  
                                                }
                                            })
                                        }
                                    })
                                }
                            }
                        })
                    }
                }else{

                }
            }).catch(err=>{

            })
        }
    })
})

app.post(`${apiPrefix}logIn`, (req, res) => {
    console.log('re',req.body)
    // Getting user data of that user
    let user_name = req.body.user_name;
    req.body['user_name'] = user_name.toLowerCase();
    let userData = '';
    let data = '';
    getUser(req.body.user_name, function (err, data) {
        if (err) {
            console.log('err0',err);

            res.send({
                message: "failure",
                error: 'Incorrect login credentials'
            });
        } else {
            data = data;
            console.log("USER DATA is =====================> \n",data);
            getUserAlreadyExists(req.body['user_name'])
            .then(userresponse =>{
                console.log('userresponse',userresponse);
                if(userresponse[0]){
                    userData = userresponse[0];
                    /* ======================
    
                        For new users
                        
                    ==========================*/
                    if(userData.password){
                         // Now getting the list of Groups of user
                         /*============== Match user password ===============*/
                        if(userData.password == md5(req.body.password)){
                            getListGroupForUser(data.Username, function (error, groupData) {
                                if (error) {
                                    console.log('error1',error)
                                    res.send({
                                        message: "failure",
                                        error: 'Incorrect login credentials'
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
                                        login(req.body.user_name, userData.password_code, userType, function (err, result) {

                                            if (err) {
                                                console.log('err2',err)
                                                res.cookie("token", "");
                                                res.send({
                                                    message: "failure",
                                                    error: err == 'User is not confirmed.' ? 'your email is not verified, Check your mail to verify your account' : 'Incorrect login credentials'
                                                })
                                            }
                                            else {


                                                res.cookie("token", result.getIdToken().getJwtToken(),{ maxAge: 604800000 }); 

                                                getUserDbData(data.Username, function(err, user_details){
                                                    if(err){
                                                         console.log('err3',err)
                                                        res.send({
                                                            message : "failure",
                                                            error : err
                                                        })
                                                    }
                                                    else{
                                                        if (user_details.Item["level"] === 400) {
                                                            getUserSensor(data.Username)
                                                                .then(sensor_data => {
                                                                    user_details.Item["sensor"] = sensor_data[0]["sensor"];
                                                                    res.send({
                                                                        message : "success",
                                                                        user_details : user_details.Item,
                                                                        user_type: userType
                                                                    })
                                                                    
                                                                })
                                                                .catch(err => {
                                                                     console.log('err4',err)
                                                                    res.send({
                                                                        message : "failure",
                                                                        error : err
                                                                    })
                                                                })
                                                        } else {
                                                            res.send({
                                                                message : "success",
                                                                user_details : user_details.Item,
                                                                user_type: userType
                                                            })
                                                        }  
                                                    }
                                                })
                                            }
                                        })
                                    }
                                }
                            })
                        }else{
                            res.send({
                                message: "failure",
                                error: 'Incorrect login password'
                            });
                        }
                    }else{
                        /* ======================
    
                            For old users
                        
                        ==========================*/
                        getListGroupForUser(data.Username, function (error, groupData) {
                            if (error) {
                                console.log('error1',error)
                                res.send({
                                    message: "failure",
                                    error: 'Incorrect login credentials'
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
                                            console.log('err2',err)
                                            res.cookie("token", "");
                                            res.send({
                                                message: "failure",
                                                error: err == 'User is not confirmed.' ? 'your email is not verified, Check your mail to verify your account' : 'Incorrect login credentials'
                                            })
                                        }
                                        else {


                                            res.cookie("token", result.getIdToken().getJwtToken(),{ maxAge: 604800000 }); 

                                            getUserDbData(data.Username, function(err, user_details){
                                                if(err){
                                                     console.log('err3',err)
                                                    res.send({
                                                        message : "failure",
                                                        error : err
                                                    })
                                                }
                                                else{
                                                    if (user_details.Item["level"] === 400) {
                                                        getUserSensor(data.Username)
                                                            .then(sensor_data => {
                                                                user_details.Item["sensor"] = sensor_data[0]["sensor"];
                                                                res.send({
                                                                    message : "success",
                                                                    user_details : user_details.Item,
                                                                    user_type: userType
                                                                })
                                                                
                                                            })
                                                            .catch(err => {
                                                                 console.log('err4',err)
                                                                res.send({
                                                                    message : "failure",
                                                                    error : err
                                                                })
                                                            })
                                                    } else {
                                                        res.send({
                                                            message : "success",
                                                            user_details : user_details.Item,
                                                            user_type: userType
                                                        })
                                                    }  
                                                }
                                            })
                                        }
                                    })
                                }
                            }
                        })
                    }
                }else{

                }
            }).catch(err=>{

            })
        }
    })
})

/* Forget password function start */
app.post(`${apiPrefix}forgotPassword`, (req, res) => {
    console.log("Log In API Called!",req.body);
    getUser(req.body.user_name, function (err, data) {
        if (err) {
            console.log(err);

            res.send({
                message: "failure",
                error: 'Incorrect username'
            });
        } else {
            forgotPassword(req.body.user_name, function (err, data) {
                console.log('res',err,data)
                if (err) {
                    res.send({
                        message: "failure",
                        error: err
                    });
                }else{
                    res.send({
                        message: "success",
                        error: data
                    });
                }
           });
        }
    });
});

/* Forget password function end */

app.post(`${apiPrefix}isAuthenticated`, VerifyToken, (req,res) =>{
    console.log('checking isAuthenticated=============\n',req.user_cognito_id)
    if(req.user_cognito_id){
        res.send({
            message : "success",
            user_cognito_id : req.user_cognito_id
        })
    }
})

// Login first time with temporary password
app.post(`${apiPrefix}logInFirstTime`, (req, res) => {
    console.log('logInFirstTime',req.body)
    let user_name = req.body.user_name;
    req.body['user_name'] = user_name.toLowerCase();
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
                            // res.send({
                            //     message: "success",
                            //     user_type: userType
                            // })
                            res.cookie("token", result.getIdToken().getJwtToken(),{ maxAge: 604800000 }); 
                            getUserDbData(data.Username, function(err, user_details){
                                if(err){
                                    res.send({
                                        message : "failure",
                                        error : err
                                    })
                                }
                                else{
                                    if (user_details.Item["level"] === 400) {
                                        getUserSensor(data.Username)
                                            .then(sensor_data => {
                                                user_details.Item["sensor"] = sensor_data[0]["sensor"];
                                                res.send({
                                                    message : "success",
                                                    user_details : user_details.Item,
                                                    user_type: userType
                                                })
                                                
                                            })
                                            .catch(err => {
                                                res.send({
                                                    message : "failure",
                                                    error : err
                                                })
                                            })
                                    } else {
                                        res.send({
                                            message : "success",
                                            user_details : user_details.Item,
                                            user_type: userType
                                        })
                                    }  
                                }
                            })
                        }
                    });

                }
            }
        );

    }
})

})

app.post(`${apiPrefix}getOrganizationList`, (req, res) => {
    getOrganizationList()
        .then(list => {
            let uniqueList = [];
            var orgList = list.filter(function (organization) {
                if (uniqueList.indexOf(organization.organization) === -1) {
                    uniqueList.push(organization.organization);
                    return organization;
                }
            });

            let counter = 0;
            if (orgList.length == 0) {
                res.send({
                    message: "success",
                    data: []
                })
            } else {
                orgList.forEach(function (org, index) {
                    let data = org;
                    let i = index;
                    getBrandOrganizationData('' , data.organization )
                        .then(simulation_records => {
                            
                            org["simulation_count"] = Number(simulation_records.length).toString();
                            org["simulation_status"] = '';
                            org["computed_time"] = '';
                            org["simulation_timestamp"] = '';

                            simulation_records.forEach(function (simulation_record, index) {
                                simulation_record['date_time'] = simulation_record.player_id.split('$')[1];
                            })

                            simulation_records.sort(function (b, a) {
                                var keyA = a.date_time,
                                    keyB = b.date_time;
                                if (keyA < keyB) return -1;
                                if (keyA > keyB) return 1;
                                return 0;
                            });

                            if (simulation_records.length > 0) {
                                getPlayerSimulationStatus(simulation_records[0].image_id)
                                    .then(simulation => {
                                        org["simulation_status"] = simulation ? simulation.status : '';
                                        org["computed_time"] = simulation ? simulation.computed_time : '';
                                        org["simulation_timestamp"] = simulation_records[0].player_id.split('$')[1];
                                        counter++;
                                        if (counter == orgList.length) {
                                            res.send({
                                                message: "success",
                                                data: orgList
                                            })
                                        }
                                    }).catch(err => {
                                        console.log('err',err);
                                    })
                            } else {
                                counter++;
                                if (counter == orgList.length) {
                                    res.send({
                                        message: "success",
                                        data: orgList
                                    })
                                }
                            }
                        })
                        .catch(err => {
                            counter++
                            if (counter == orgList.length) {
                                res.send({
                                    message: "failure",
                                    error: err
                                })
                            }
                        })
                })
            }
        })
        .catch(err =>{
            console.log('err',err)
        })
})

app.post(`${apiPrefix}getOrganizationNameList`, (req, res) => {
    getOrganizationList()
    .then(list => {
        let uniqueList = [];
        var orgList = list.filter(function (organization) {
            if (uniqueList.indexOf(organization.organization) === -1) {
                uniqueList.push(organization.organization);
                return organization;
            }
        });
        res.send({
            message: "success",
            data: orgList
        })
    }).catch(err => {                  
        res.send({
            message: "failure",
            error: err
        })
    })
})

app.post(`${apiPrefix}getTeamList`, (req, res) => {
    getTeamList()
        .then(list=>{
            // console.log('list',list)
            let uniqueList = [];
            var teamList = list.filter(function (team_name) {
                return (!("teamList" in team_name));
            });

            // console.log(teamList);

            let counter = 0;
            if (teamList.length == 0) {
                res.send({
                    message: "success",
                    data: []
                })
            } else {
                // console.log(teamList);
                teamList.forEach(function (team, index) {
                    let data = team;
                    let i = index;
                    getOrganizationTeamData({ sensor: data.sensor ? data.sensor : false , organization: data.organization, team: data.team_name})
                        .then(simulation_records => {
                            
                            team["simulation_count"] = Number(simulation_records.length).toString();
                            team["simulation_status"] = '';
                            team["computed_time"] = '';
                            team["simulation_timestamp"] = '';

                            simulation_records.forEach(function (simulation_record, index) {
                                simulation_record['date_time'] = simulation_record.player_id.split('$')[1];
                            })

                            simulation_records.sort(function (b, a) {
                                var keyA = a.date_time,
                                    keyB = b.date_time;
                                if (keyA < keyB) return -1;
                                if (keyA > keyB) return 1;
                                return 0;
                            });

                            if (simulation_records.length > 0) {
                                getPlayerSimulationStatus(simulation_records[0].image_id)
                                    .then(simulation => {
                                        team["simulation_status"] = simulation ? simulation.status : '';
                                        team["computed_time"] = simulation ? simulation.computed_time : '';
                                        team["simulation_timestamp"] = simulation_records[0].player_id.split('$')[1];
                                        counter++;
                                        if (counter == teamList.length) {
                                            res.send({
                                                message: "success",
                                                data: teamList
                                            })
                                        }

                                    }).catch(err => {
                                        console.log('err',err);
                                    })
                            } else {
                                counter++;
                                if (counter == teamList.length) {
                                    res.send({
                                        message: "success",
                                        data: teamList
                                    })
                                }
                            }
                        })
                        .catch(err => {
                            counter++
                            if (counter == teamList.length) {
                                res.send({
                                    message: "failure",
                                    error: err
                                })
                            }
                        })
                })
            }
        }).catch(err => {
            res.send({
                message: "failure",
                error: err
            })
        })
});

app.post(`${apiPrefix}getTeamNameList`, (req, res) => {
    getTeamList()
    .then(list=>{
        // console.log('list',list)
        let uniqueList = [];
        var teamList = list.filter(function (team_name) {
            return (!("teamList" in team_name));
        });
        res.send({
            message: "success",
            data: teamList
        })
    }) .catch(err => {                  
        res.send({
            message: "failure",
            error: err
        })        
    })

})


app.post(`${apiPrefix}getPlayerList`, (req, res) => {
    getPlayerList().then(players => {
        var player_list = [];
        for(var i =0; i < 10; i++){
            if(players[i].player_list && player_list.length < 10){
                var list = players[i].player_list;
                for(var j = 0;j < 10; j++){
                    player_list.push({player_id: list[j],team:players[i].team_name,sensor:  players[i].sensor,organization: players[i].organization})
                }
            }
        }
        if (player_list.length == 0) {
            res.send({
                message: "success",
                data: []
            })
        }
        else {
            var counter = 0;
            var indx = 0;
            var p_data = [];
            var player_listLn = player_list.length;
            player_list.forEach(function (player, index) {
                let p = player;
                let playerData = '';
                
                if(player.player_id && player.player_id != 'undefined'){
                    getTeamDataWithPlayerRecords_3(player.player_id, player.team, player.sensor, player.organization)
                    .then(player_data => {

                        playerData = player_data;
                        counter++;
                        p_data.push({
                            player_name: p,
                            //vsimulation_image: image ? image : '',
                            simulation_data: playerData,
                            date_time: playerData[0] ? playerData[0].player_id.split('$')[1]: '',
                        });
                       
                         if (counter == player_listLn) {
                            p_data.sort(function (b, a) {
                                var keyA = a.date_time,
                                    keyB = b.date_time;
                                if (keyA < keyB) return -1;
                                if (keyA > keyB) return 1;
                                return 0;
                            }); 

                            let k = 0;
                            var p_datalen = p_data.length;
                            p_data.forEach(function (record, index) {
                                if(record.simulation_data[0]){
                                    getPlayerSimulationStatus(record.simulation_data[0].image_id)
                                        .then(simulation => {
                                            // console.log('simulation',simulation.status)
                                            k++;
                                            p_data[index]['simulation_data'][0]['simulation_status'] = simulation ? simulation.status : '';
                                            p_data[index]['simulation_data'][0]['computed_time'] = simulation ? simulation.computed_time : '';
                                            
                                            if (k == p_datalen) {
                                                res.send({
                                                    message: "success",
                                                    data: p_data
                                                })
                                            }
                                        })
                                        .catch(err => {
                                            console.log(err);
                                        })
                                }else{
                                    p_datalen--;
                                }
                            })
                        }
                        
                        indx++;
                    })
                    .catch(err => {
                        console.log('err =============\n',err)
                        counter++;
                        if (counter == player_listLn) {
                            res.send({
                                message: "failure",
                                data: p_data
                            })
                        }
                    })
                } else {
                    counter++;
                }
            })
        }

    }).catch(err =>{
        console.log('err',err)
        res.send({
            message: "failure",
            error: err
        })
    })
})

app.post(`${apiPrefix}loadMorePlayerList`, (req, res) => {
    getPlayerList().then(players => {
        var player_list = [];
        for(var i =0; i < players.length; i++){
            if(players[i].player_list){
                var list = players[i].player_list;
                for(var j = 0;j < list.length; j++){
                    player_list.push({player_id: list[j],team:players[i].team_name,sensor:  players[i].sensor,organization: players[i].organization})
                }
            }
        }
        if (player_list.length == 0) {
            res.send({
                message: "success",
                data: []
            })
        }
        else {
            var counter = 0;
            var indx = 0;
            var p_data = [];
            var player_listLn = player_list.length;
            player_list.forEach(function (player, index) {
                let p = player;
                let playerData = '';
                
                if(player.player_id && player.player_id != 'undefined'){
                    getTeamDataWithPlayerRecords_3(player.player_id, player.team, player.sensor, player.organization)
                    .then(player_data => {

                        playerData = player_data;
                        counter++;
                        p_data.push({
                            player_name: p,
                            //vsimulation_image: image ? image : '',
                            simulation_data: playerData,
                            date_time: playerData[0] ? playerData[0].player_id.split('$')[1]: '',
                        });
                       
                         if (counter == player_listLn) {
                            p_data.sort(function (b, a) {
                                var keyA = a.date_time,
                                    keyB = b.date_time;
                                if (keyA < keyB) return -1;
                                if (keyA > keyB) return 1;
                                return 0;
                            }); 

                            let k = 0;
                            var p_datalen = p_data.length;
                            p_data.forEach(function (record, index) {
                                if(record.simulation_data[0]){
                                    getPlayerSimulationStatus(record.simulation_data[0].image_id)
                                        .then(simulation => {
                                            // console.log('simulation',simulation.status)
                                            k++;
                                            p_data[index]['simulation_data'][0]['simulation_status'] = simulation ? simulation.status : '';
                                            p_data[index]['simulation_data'][0]['computed_time'] = simulation ? simulation.computed_time : '';
                                            
                                            if (k == p_datalen) {
                                                res.send({
                                                    message: "success",
                                                    data: p_data
                                                })
                                            }
                                        })
                                        .catch(err => {
                                            console.log(err);
                                        })
                                }else{
                                    p_datalen--;
                                }
                            })
                        }
                        
                        indx++;
                    })
                    .catch(err => {
                        console.log('err =============\n',err)
                        counter++;
                        if (counter == player_listLn) {
                            res.send({
                                message: "failure",
                                data: p_data
                            })
                        }
                    })
                } else {
                    counter++;
                }
            })
        }

    }).catch(err =>{
        console.log('err',err)
        res.send({
            message: "failure",
            error: err
        })
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


app.post(`${apiPrefix}fetchAdminStaffMembers`, (req,res) =>{ 
     
    var params = {
        TableName: 'users',
        FilterExpression: "#level = :level",
        ExpressionAttributeNames: {
            "#level": "level",
        },
        ExpressionAttributeValues: {
            ":level": 1000
        }
    };
    var item = [];
    docClient.scan(params).eachPage((err, data, done) => {
        if (err) {
            res.send({
                message : "failure",
                error : err,
                data : []
            }) 
        }
        if (data == null) {
            res.send({
                message : "success",
                data : concatArrays(item)
            })
        } else {
            item.push(data.Items);
        }
        done();
    });
});
app.post(`${apiPrefix}fetchTeamStaffMembers`, (req,res) =>{ 
 console.log('fetchTeamStaffMembers',req.body)
    var params = {
        TableName: 'users',
        FilterExpression: "#level = :level and #organization = :organization and #team =:team",
        ExpressionAttributeNames: {
            "#level": "level",
            "#organization": "organization",
            "#team": "team"
        },
        ExpressionAttributeValues: {
            ":level": 200,
            ":organization": req.body.organization,
            ":team": req.body.team_name
        }
    };
    var item = [];
    docClient.scan(params).eachPage((err, data, done) => {
        if (err) {
            res.send({
                message : "failure",
                error : err,
                data : []
            }) 
        }
        if (data == null) {
            res.send({
                message : "success",
                data : concatArrays(item)
            })
        } else {
            item.push(data.Items);
        }
        done();
    });
})


app.post(`${apiPrefix}fetchOrgStaffMembers`, (req,res) =>{ 
    console.log('fetchOrgStaffMembers',req.body);
    fetchOrgStaffMembers(req.body.organization).
    then(data=>{
        console.log('staff',data);
        res.send({
            message : "success",
            data : data
        })
    }).catch(err=>{
        console.log('er',err);
        res.send({
            message : "failure",
            error : err,
            data : []
        })  
    })
})


app.post(`${apiPrefix}fetchStaffMembers`, (req,res) =>{ 
     fetchSensor(req.body.brand)
        .then(sensors => {
            console.log('sensors',sensors.users);
            var user_cognito_id = sensors.users;
            var cId_len = user_cognito_id.length;
            var cId_len2 = cId_len-1;
            var memebers = [];
            var f = 0;

            if (cId_len === 0) {
                res.send({
                    message : "success",
                    data : memebers
                })
            }

            for(var i = 0; i < cId_len; i++){
                fetchStaffMembers(user_cognito_id[i],req.body.brand)
                .then(data => {
                    memebers.push({data});
                    console.log(cId_len2,f)
                    if(f == cId_len2){
                        res.send({
                            message : "success",
                            data : memebers
                        })
                    }
                    f++;
                })
                .catch(err => {
                    res.send({
                        message : "failure",
                        error : err,
                        data : []
                    })  
                })
            }
        }) .catch(err => {
            res.send({
                message : "failure",
                error : err,
                data : []
            })  
        });
    //
  
});

//getting only user db details
app.post(`${apiPrefix}getUserDBDetails`, VerifyToken, (req, res) => {
    // If request comes to get detail of specific player
    console.log(req.body);
    if(req.body.user_cognito_id){
        req.user_cognito_id = req.body.user_cognito_id ;
    }
    getUserDbData(req.user_cognito_id, function (err, data) {
        if (err) {
            res.send({
                message: "failure",
                error: err
            })
        }
        else {
            userData = data.Item;
            res.send({
                message: "success",
                data: userData
            });
        }
    });
});

app.post(`${apiPrefix}getUserTokenDBDetails`, (req, res) => {
    // If request comes to get detail of specific player
    console.log(req.body);
    if(req.body.InviteToken){
        req.InviteToken = req.body.InviteToken ;
    }
    getUserTokenDBDetails(req.InviteToken, function (err, data) {
        if (err) {
            res.send({
                message: "failure",
                error: err
            })
        }
        else {
            userData = data.Item;
            res.send({
                message: "success",
                data: userData
            });
        }
    });
});

app.post(`${apiPrefix}getAvatarInspection`, VerifyToken, (req, res) => {
    if (req.body.user_cognito_id){
        req.user_cognito_id = req.body.user_cognito_id ;
    }
    if (req.user_cognito_id) { 
        let userData = {};
        getAvatarInspectionFileSignedUrl( req.user_cognito_id + "/profile/avatar/brain.ply", function (err, brain_ply) {
            if (err) {
                userData["brain_ply"] = "";
                res.send({
                    message: "failure",
                    data: userData
                })
            }
            else {
                userData["brain_ply"] = brain_ply;
                getAvatarInspectionFileSignedUrl( req.user_cognito_id + "/profile/avatar/skull.ply", function (err, skull_ply) {
                    if (err) {
                        userData["skull_ply"] = "";
                        res.send({
                            message: "failure",
                            data: userData
                        })
                    }
                    else {
                        userData["skull_ply"] = skull_ply;
                        getAvatarInspectionFileSignedUrl( req.user_cognito_id + "/profile/avatar/model.ply", function (err, model_ply) {
                            if (err) {
                                userData["model_ply"] = "";
                                res.send({
                                    message: "failure",
                                    data: userData
                                })
                            }
                            else {
                                userData["model_ply"] = model_ply;
                                getAvatarInspectionFileSignedUrl( req.user_cognito_id + "/profile/avatar/model.jpg", function (err, model_jpg) {
                                    if (err) {
                                        userData["model_jpg"] = "";
                                        res.send({
                                            message: "failure",
                                            data: userData
                                        })
                                    }
                                    else {
                                        userData["model_jpg"] = model_jpg;
                                        res.send({
                                            message: "success",
                                            data: userData
                                        })

                                    }
                                })
                            }
                        })
                    }
                })
            }
        })    
    } else {
        res.send({
            message: "failure",
            error: 'User cognito id is required '
        })
    }
})    

app.post(`${apiPrefix}getUserDetails`, VerifyToken, (req, res) => {
    // If request comes to get detail of specific player
    console.log(req.body);
    if(req.body.user_cognito_id){
        req.user_cognito_id = req.body.user_cognito_id ;
    }
    getUserDbData(req.user_cognito_id, function (err, data) {
        if (err) {
            res.send({
                message: "failure",
                error: err
            })
        }
        else {
            userData = data.Item;
            if(userData){
                if (userData && userData.account_id) {
                    req.user_cognito_id = userData.account_id;
                }
                
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

                                                getVtkFileLink(req.user_cognito_id)
                                                .then(url => {
                                                    userData["vtk_file_url"] = url;

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
                                                    .catch(err => {
                                                        res.send({
                                                            message: "failure",
                                                            error : err
                                                        })
                                                    })


                                                })
                                                .catch((err) => {
                                                    res.send({
                                                        message: "failure"
                                                    })
                                                })
                                            }

                                        }, 'avatar')

                                    }

                                })
                            }
                        });
                    }
                })
            }else{
                res.send({
                    message: "failure",
                    data: {}
                })
            }

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
    app.post(`${apiPrefix}getVtkFileLink`, (req, res) => {
        getVtkFileLink(req.body.user_cognito_id).then((url) => {
            res.send({
                message: "success",
                vtk_file_url: url
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
        console.log(req.body);
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

                }, 'avatar')

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

    app.post(`${apiPrefix}listAllUsers`, (req, res) => {
        fetchAllUsers({})
        .then(list => {
            res.send({
                message : "success",
                data : list
            })
        })
        .catch(err => {
            res.send({
                message : "failure",
                error : err
            })
        })
    })

    app.post(`${apiPrefix}listUsers`, (req, res) => {
        // var attributes = ["name", "phone_number", "email"];
        // listAllUsers(attributes, function (err, data) {
        //     if (err) {
        //         res.send({
        //             message: "failure",
        //             error: err
        //         })
        //     }
        //     else {
        //         let users = utility.concatArrays(data);
        //
        //         let count = 0;
        //         var tempArray = [];
        //         for (let i = 0; i < users.length; i++) {
        //
        //             setTimeout(() => {
        //                 getUser(users[i].Username, function (err, userData) {
        //                     if (err) {
        //                         console.log(err);
        //
        //                         res.send({
        //                             message: "failed",
        //                             error: err
        //                         });
        //                     } else {
        //                         getUserDbData(users[i].Username, function (err, userDbData) {
        //
        //                             getListGroupForUser(users[i].Username, function (err, groupData) {
        //
        //                                 if (err) {
        //                                     console.log("List group for user ", err);
        //                                 }
        //
        //                                 count++;
        //
        //                                 // Now checking is user is ADMIN or not
        //                                 var flag = false;
        //                                 groupData.forEach(element => {
        //                                     if (element.GroupName == "Admin") {
        //                                         flag = true;
        //                                     }
        //                                 });
        //                                 // var temp = {};
        //                                 userDbData = userDbData.Item;
        //                                 userDbData["Enabled"] = userData.Enabled;
        //
        //                                 if (flag) {
        //                                     userDbData.user_type = "Admin"
        //                                 }
        //                                 else {
        //                                     userDbData.user_type = "Standard"
        //                                 }
        //                                 tempArray.push(userDbData);
        //                                 if (count == users.length) {
        //                                     // console.log(data);
        //
        //                                     res.send(
        //                                         {
        //                                             message: "success",
        //                                             data: tempArray
        //                                         });
        //                                     }
        //
        //                                 });
        //
        //                             })
        //
        //
        //                         }
        //                     });
        //
        //                 }, 20 * i);
        //
        //             }
        //         }
        //     })
        fetchAllUsers({})
        .then(list => {
            res.send({
                message : "success",
                data : list
            })
        })
        .catch(err => {
            res.send({
                message : "failure",
                error : err
            })
        })
    })

    // API To upload profile pic to S310m
    app.post(`${apiPrefix}uploadProfilePic`, VerifyToken, setConnectionTimeout('10m'), upload.single("profile_pic"), awsWorker.doUpload);

    // API To upload selfie pic to S310m
    app.post(`${apiPrefix}uploadProfileSelfie`, setConnectionTimeout('10m'), upload.single("profile_pic"), awsWorker.doUpload);

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

app.post(`${apiPrefix}getUpdatesAndNotifications`, (req, res)=> {
    request.post({ url: config.ComputeInstanceEndpoint + "getUpdatesAndNotifications", json: req.body }, function (err, httpResponse, body) {

        if (err) {
            res.send({ message: 'failure', error: err });
        }
        else {
            console.log(httpResponse.body);
            res.send(httpResponse.body);
        }
    })


})

function removes3Object(path){
    return new Promise((resolve, reject) =>{
        var params = {
            Bucket: config_env.usersbucket,
            Key: path
        };
        s3.deleteObject(params, function(err, data) {
            if (err) {
                // reject(err)
                reject(err);
            }
            else{
                resolve(data);
            }
        });
    })
}

app.post(`${apiPrefix}removeVideo`, (req, res)=> {
    console.log('req',req.body)
    var image_id = req.body.image_id;
    var imageData = '';
    getSimulationImageRecord(image_id)
    .then(image_data =>{
        console.log('image_data',image_data);
        imageData = image_data;
       
        if (imageData.impact_video_path && imageData.impact_video_path != 'null') {
            removes3Object(imageData.impact_video_path)
            .then(response =>{
                // console.log('res',res);
                InsertImpactVideoKey(image_id,false)
                .then(response => {
                    res.send({
                        message: "success",
                        data: res
                    });
                }) .catch(err =>{
                    console.log('errdatabase',err)
                    res.send({
                        message: "success",
                        data: err
                    });
                })
            })
            .catch(err =>{
                console.log('errremoves3Object',err)
                res.send({
                    message: "failure",
                    err: 'Somthing went wrong! Please try again.'
                });
            })
        }else{
            res.send({
                message: "failure",
                err: 'Video not found.'
            });
        }

        /**
        * Removing trim video form s3 if exists...
        */
        if (imageData.trim_video_path && imageData.trim_video_path != 'null') {
            removes3Object(imageData.trim_video_path)
            .then(response =>{
                console.log('trim video removed ===============')
            })
        }

    }).catch(err =>{
        console.log('err',err)
    })

})

app.post(`${apiPrefix}resetToOriginal`, (req, res)=> {
    console.log('req',req.body)
    var image_id = req.body.image_id;
    var imageData = '';
    getSimulationImageRecord(image_id)
    .then(image_data =>{
        console.log('image_data',image_data);
        imageData = image_data;
       
        if (imageData.trim_video_path && imageData.trim_video_path != 'null') {
            removes3Object(imageData.trim_video_path)
            .then(response =>{
                // console.log('res',res);
                updateTrimVideoKey(image_id,false)
                .then(response => {
                    res.send({
                        message: "success",
                        data: res
                    });
                }) .catch(err =>{
                    console.log('errdatabase',err)
                    res.send({
                        message: "success",
                        data: err
                    });
                })
            })
            .catch(err =>{
                console.log('errremoves3Object',err)
                res.send({
                    message: "failure",
                    err: 'Somthing went wrong! Please try again.'
                });
            })
        }else{
            updateTrimVideoKey(image_id,false)
            .then(response => {
                res.send({
                    message: "success",
                    data: res
                });
            }) .catch(err =>{
                console.log('errdatabase',err)
                res.send({
                    message: "success",
                    data: err
                });
            })
        }
    }).catch(err =>{
        console.log('err',err)
    })

})

// Uploading the Sensor Data (CSV) file
app.post(`${apiPrefix}uploadSidelineImpactVideo`, VerifyToken, setConnectionTimeout('10m'), uploadSidelineImpactVideo.single('file'), (req, res) => {
        console.log('file',req.body);
        var file_name = Date.now();
        var image_id = req.body.image_id;
        var uploadParams = {
            Bucket: config.usersbucket,
            Key: '', // pass key
            Body: null, // pass file body
        };
        getSimulationImageRecord(image_id)
        .then(data => {

            /**
            * Removing trim video form s3 if exists...
            */
            if (data.trim_video_path && data.trim_video_path != 'null') {
                removes3Object(imageData.trim_video_path)
                .then(response =>{
                    console.log('trim video removed ===============')
                })
            }

            // File Extensions
            var file_extension = req.file.originalname.split(".");
            file_extension = file_extension[file_extension.length - 1];
            var d = new Date();
            console.log(d.toLocaleDateString('pt-PT'));
            d = d.toLocaleDateString('pt-PT');
            var date = d.replace("/", "-");
            date = date.replace("/", "-");
            console.log('date',date);
            // Setting Attributes for file upload on S3
            uploadParams.Key =  data['player_name']+"/simulation/"+date+"/impact-video/"+image_id+"/" + file_name + "." + file_extension;
            // console.log('req.file.buffer', req.file.buffer)
            uploadParams.Body = req.file.buffer;
           
            // console.log('uploadParams',uploadParams)
            s3.upload(uploadParams, (err, data) => {
                if (err) {
                    console.log('======errr \n',err)
                    res.send({
                        message: "failure",
                        data: err
                    });
                   
                }else{
                    console.log('data',uploadParams.Key )
                    InsertImpactVideoKey(req.body.image_id,uploadParams.Key ).
                    then(sensor_data => {
                        const  image_id  = req.body.image_id;
                        console.log('image_id',image_id)
                        let imageData = '';
                        getSimulationImageRecord(image_id)
                            .then(image_data => {
                                console.log('image_data -----------------------------------\n',image_data)
                                imageData = image_data;
                                return verifyImageToken(imageData['token'], image_data);
                            })
                            .then(decoded_token => {
                                // console.log('decoded_token',decoded_token)
                                return getPlayerCgValues(imageData.player_name);
                            })
                            .then(cg_coordinates => {
                                // Setting cg values
                                // console.log("cg_coordinates",cg_coordinates)
                                if(cg_coordinates) {
                                  imageData["cg_coordinates"] = cg_coordinates;
                                }
                                return ImpactVideoUrl(imageData);
                            })
                            .then(movie_link => {
                                // let computed_time = imageData.computed_time ? timeConversion(imageData.computed_time) : ''
                                console.log('movie_link',movie_link);
                                res.send({
                                    message : "success",
                                    impact_video_url : movie_link
                                })
                                
                            })
                            .catch(err => {
                                console.log(err);
                                // res.removeHeader('X-Frame-Options');
                                // if(err.message == 'The provided key element does not match the schema'){
                                    res.send({
                                        message: "failure",
                                        data: err
                                    });
                                // }
                            })
                    })
                    .catch(err => {
                       console.log('err',err)
                        res.send({
                            message: "failure",
                            data: err
                        });
                    })
                }
            })
        }).catch(err => {
           console.log('err',err)
            res.send({
                message: "failure",
                data: err
            });
        })
})

// Uploading the Sensor Data (CSV) file
app.post(`${apiPrefix}uploadSensorDataAndCompute`, VerifyToken, setConnectionTimeout('10m'), uploadSensorData.single('sensor_csv_file'), (req, res) => {
    // Upload this data in Profile Bucket of USER
    console.log("API Called to upload to upload Sensor Data")
    getUserDbData(req.user_cognito_id, function (err, user) {
        if (err) {
            console.log(err);
            res.send({
                message: "failure",
                error: err
            })
        }else{
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
                req.io.sockets.emit('fileUploadLog', "Uploading Sensor Data ..." )
                s3.upload(uploadParams, (err, data) => {
                    if (err) {

                        res.status(500).send({ message: 'failure' });
                    }
                    else{
                        req.io.sockets.emit('fileUploadLog', "Parsing Sensor Data ..." )
                        convertXLSXDataToJSON(req.file.buffer,function(items){
                            console.log(items)
                            // Store the Data in DynamoDB
                            // now broadcast the updated foo..

                            req.io.sockets.emit('fileUploadLog', "Populating Data-Base with Sensor Data ..." )
                            // Appending organization in elements of array
                            if(user.organization === undefined){
                                user["organization"] = "PSU"
                            }
                            console.log(items);
                            items.map((element) => {
                                return element.organization = user.organization;
                            });

                            const new_items_array = _.map(items, o => _.extend({organization: user.organization}, o));

                            storeSensorData(new_items_array)
                            .then(flag => {

                                var players = items.map(function (player) {
                                    return {    player_id : player.player_id.split("$")[0],
                                    team : player.team,
                                    organization : player.organization
                                }
                            });



                            var unique_players = _.uniq(players, 'player_id');
                            const result = [];
                            const map = new Map();

                            for (const item of players) {
                                if(!map.has(item.player_id)){
                                    map.set(item.player_id, true);    // set any value to Map
                                    result.push(item);
                                }
                            }
                            if(result.length == 0){
                                res.send({
                                    message : "success"
                                })
                            }
                            else{
                                // Run simulation here and send data
                                // {
                                //     "player_id" : "STRING",
                                //     "team" : "STRING",
                                //     "organization" : "STRING"
                                // }
                                var counter = 0 ;
                                console.log("UNIQUE PLAYERS ++++++++++++++ ",result);

                                for(var i =0 ; i< result.length ; i++){
                                    var temp = result[i];

                                    addPlayerToTeamInDDB(temp.organization, temp.team, temp.player_id)
                                    .then(d => {
                                        req.io.sockets.emit('fileUploadLog', `Running Simulation for ${temp.player_id} ...` )
                                        request.post({ url: config.ComputeInstanceEndpoint + "generateSimulationForPlayer", json: temp }, function (err, httpResponse, body) {
                                            counter++;
                                            if (err) {
                                                console.log(err);

                                                res.send({
                                                    message : "failure",
                                                    error : err
                                                })
                                            }
                                            else {

                                                console.log(data);

                                            }

                                            if(counter == result.length){
                                                res.send({
                                                    message : "success"
                                                })
                                            }
                                        })
                                    })
                                    .catch(err => {
                                        counter = result.length ;
                                        res.send({
                                            message : "failure"
                                        })
                                    })
                                }
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            res.send({
                                message : 'failure',
                                error : err
                            })
                        })


                    });


                }
            })
        }
    }
})

})

app.post(`${apiPrefix}getUserDetailsForIRB`, (req,res) =>{
    console.log("API HIT ", req.body, config.ComputeInstanceEndpoint + "getUserDetailsForIRB" );
    request.post({ url: config.ComputeInstanceEndpoint + "getUserDetailsForIRB", json: req.body }, function (err, httpResponse, body) {
        if (err) {
            res.send({ message: 'failure', error: err });
        }
        else {
            console.log(httpResponse.body);
            res.send(httpResponse.body);
        }
    })
})

app.post(`${apiPrefix}confirmGuardianIRBConsent`, (req,res) =>{
    console.log("API HIT ", req.body );
    // =======================================
    // Check if IRB Is already done
    // if yes then send failure
    // else
    // 2. call API TO create IRB Details & Send
    // =======================================
    getUserDbData(req.body.user_cognito_id, (err,data)=>{
        if(err){
            res.send({
                message : "failure",
                error : err
            })
        }
        else{
            let user_data = data.Item ;
            if(user_data.isIRBComplete){
                res.send({
                    message : "failure",
                    error : {
                        message : "IRB process is already completed."
                    }
                })
            }
            else{
                // CHANGE it TO TRUE
                user_data["isIRBComplete"] = true ;
                user_data["guardian_first_name"] = req.body.guardian_first_name ;
                user_data["guardian_last_name"] = req.body.guardian_last_name ;
                user_data["guardian_signature"] = req.body.guardian_signature ;

                // Store the code in DynamoDB
                addRecordInUsersDDB(user_data)
                .then(value => {

                    // Call API To Make IRB Form
                    request.post({ url: config.ComputeInstanceEndpoint + "IRBFormGenerate", json: user_data }, function (err, httpResponse, body) {
                        if (err) {
                            res.send({ message: 'failure', error: err });
                        }
                        else {
                            console.log(httpResponse.body);
                            enableUser(req.body.user_cognito_id, function (err, data) {
                                if (err) {
                                    res.send({
                                        message: "failure",
                                        error: err
                                    })
                                }
                                else {
                                    res.send(httpResponse.body);
                                }
                            })

                        }
                    })

                })
                .catch(err => {
                    res.send({
                        message : "failure",
                        error : err
                    })
                })


            }
        }
    })

})

/****** ===============================================

    
        Merge video fuitons start here


============================= ==============================******/


/* ====================== 
 *remove yesterday videos folders...
*/

function removeYesterdayFolder(){
    var d = new Date();
    d.setMonth(d.getMonth() - 1);
    let yesterday = d.getMonth()+'-'+d.getFullYear();
    var dir = 'public/uploads/'+yesterday;
    console.log('yesterday -------\n',yesterday)
    // if (fs.existsSync(dir)){
    //     fs.unlinkSync(dir,function(err){
    //     if(err) return console.log(err);
    //         console.log('file deleted successfully');
    //     });   
    // }
}

app.post(`${apiPrefix}merge-video`, (req, res) => {
    console.log(req.body);
    removeYesterdayFolder(); // Remove yesterday directory ...
    /*
        Creating directory
    */
    var d = new Date();
    let datetoday = d.getMonth()+'-'+d.getFullYear();
    var dir = 'public/uploads/'+datetoday;

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    //** 
    //files name ..........
    var file_path = '/uploads/'+datetoday+'/'+Date.now() + 'output.mp4';
    var outputFilePath = 'public'+file_path;
    let list = []

        //uploading files.             
        var name = Date.now();
        var file_store_path =  'public/uploads/'+ name +'_movie.mp4';
        list.push(`public/uploads/${name}_movie.mp4`);
        https.get(req.body.movie_link , function(response ,error) { 

            const file = fs.createWriteStream(file_store_path);
            response.pipe(file);
            file.on('finish',() => {

                // ===================
                // uploading file 2
                //====================
                https.get(req.body.impact_video_url , function(response ,error) {
                    var name = Date.now();
                    var file_store_path =  'public/uploads/'+ name + '_movie.mp4';
                    const file = fs.createWriteStream(file_store_path);
                    list.push(`public/uploads/${name}_movie.mp4`);
                    response.pipe(file);
                    file.on('finish',() => {
                        console.log('finished -------------------------');
                        setTimeout(()=>{
                            writeTextfile(list);
                        },6000)
                    })
                    
                }); 
            })
        });
    /**
    *
        Creating video frame.
        ** Exicuting ffmpeg cmd...
    */
    const writeTextfile = (list)=>{
        console.log('list',list);
        exec(`ffmpeg -i ${list[0]} -i ${list[1]}  -filter_complex  "[0:v]pad=iw*2:ih[int]; [int][1:v]overlay=W/2:0[vid]" -map "[vid]" -c:v libx264 -crf 23  ${outputFilePath}`, (error, stdout, stderr) => {
          
            if (error) {
                console.log(`error: ${error.message}`);
                list.forEach(file => {
                    fs.unlinkSync(file)                    
                });
                res.send({
                    message: 'faiure',
                    error: error.message
                });
            }
            else{
                console.log("videos are successfully merged");
                list.forEach(file => {
                    fs.unlinkSync(file)                    
                });
                res.send({
                    message:'success',
                    file_path: file_path,
                });
                
            }
            
        })
    }
    
    
    // const request = https.get("https://nsfcareer-users-data.s3-accelerate.amazonaws.com/35317-Prevent-Biometrics/simulation/07-22-2019/qIYe2mOoS/movie/qIYe2mOoS.mp4?AWSAccessKeyId=AKIA5UBJSELBEIFVBRCC&Expires=1603439485&Signature=%2FhX5ww3Eie9BH18D4jlW53hnRY0%3D", function(response ,error) {
        
    //     response.pipe(file);
    // })
     /*exec(`ffmpeg -safe 0 -f concat -i ${listFilePath} -c copy ${outputFilePath}`, (error, stdout, stderr) => {
          
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            else{
                console.log("videos are successfully merged")
            res.download(outputFilePath,(err) => {
                if(err) throw err

                // req.files.forEach(file => {
                //     fs.unlinkSync(file.path)                    
                // });

                // fs.unlinkSync(listFilePath)
                // fs.unlinkSync(outputFilePath)

              

            })
        }
            
        })*/

})

app.post(`${apiPrefix}merge-video`, (req, res) => {
    console.log(req.body);
    removeYesterdayFolder(); // Remove yesterday directory ...
    /*
        Creating directory
    */
    var d = new Date();
    let datetoday = d.getMonth()+'-'+d.getFullYear();
    var dir = 'public/uploads/'+datetoday;

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    //** 
    //files name ..........
    var file_path = '/uploads/'+datetoday+'/'+Date.now() + 'output.mp4';
    var outputFilePath = 'public'+file_path;
    let list = []

        //uploading files.             
        var name = Date.now();
        var file_store_path =  'public/uploads/'+ name +'_movie.mp4';
        list.push(`public/uploads/${name}_movie.mp4`);
        https.get(req.body.movie_link , function(response ,error) { 

            const file = fs.createWriteStream(file_store_path);
            response.pipe(file);
            file.on('finish',() => {

                // ===================
                // uploading file 2
                //====================
                https.get(req.body.impact_video_url , function(response ,error) {
                    var name = Date.now();
                    var file_store_path =  'public/uploads/'+ name + '_movie.mp4';
                    const file = fs.createWriteStream(file_store_path);
                    list.push(`public/uploads/${name}_movie.mp4`);
                    response.pipe(file);
                    file.on('finish',() => {
                        console.log('finished -------------------------');
                        setTimeout(()=>{
                            writeTextfile(list);
                        },6000)
                    })
                    
                }); 
            })
        });
    /**
    *
        Creating video frame.
        ** Exicuting ffmpeg cmd...
    */
    const writeTextfile = (list)=>{
        console.log('list',list);
        exec(`ffmpeg -i ${list[0]} -i ${list[1]}  -filter_complex  "[0:v]pad=iw*2:ih[int]; [int][1:v]overlay=W/2:0[vid]" -map "[vid]" -c:v libx264 -crf 23  ${outputFilePath}`, (error, stdout, stderr) => {
          
            if (error) {
                console.log(`error: ${error.message}`);
                list.forEach(file => {
                    fs.unlinkSync(file)                    
                });
                res.send({
                    message: 'faiure',
                    error: error.message
                });
            }
            else{
                console.log("videos are successfully merged");
                list.forEach(file => {
                    fs.unlinkSync(file)                    
                });
                res.send({
                    message:'success',
                    file_path: file_path,
                });
                
            }
            
        })
    }
    
    
    // const request = https.get("https://nsfcareer-users-data.s3-accelerate.amazonaws.com/35317-Prevent-Biometrics/simulation/07-22-2019/qIYe2mOoS/movie/qIYe2mOoS.mp4?AWSAccessKeyId=AKIA5UBJSELBEIFVBRCC&Expires=1603439485&Signature=%2FhX5ww3Eie9BH18D4jlW53hnRY0%3D", function(response ,error) {
        
    //     response.pipe(file);
    // })
     /*exec(`ffmpeg -safe 0 -f concat -i ${listFilePath} -c copy ${outputFilePath}`, (error, stdout, stderr) => {
          
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            else{
                console.log("videos are successfully merged")
            res.download(outputFilePath,(err) => {
                if(err) throw err

                // req.files.forEach(file => {
                //     fs.unlinkSync(file.path)                    
                // });

                // fs.unlinkSync(listFilePath)
                // fs.unlinkSync(outputFilePath)

              

            })
        }
            
        })*/

})
/*=======================merge video end ======================*/

/*=======================================
    Trim uploaded video function start
=========================================*/

app.post(`${apiPrefix}trimVideo`, (req, res) => {
    console.log(req.body);
    let image_id = req.body.image_id;
    /*
    *    Creating directory...
    */
    var d = new Date();
    let month = d.getMonth() + 1;
    let datetoday = month+'-'+d.getFullYear();
    var dir = 'public/uploads/'+datetoday;

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    //** 
    //files name ..........
    var file_path = '/uploads/'+datetoday+'/'+Date.now() + '_trim.mp4';
    var outputFilePath = 'public'+file_path;
    let list = []

    

    //uploading files.             
    var name = Date.now();
    var file_store_path =  'public/uploads/'+ name +'_movie.mp4';
    list.push(`public/uploads/${name}_movie.mp4`);
    https.get(req.body.impact_video_url , function(response ,error) { 
        const file = fs.createWriteStream(file_store_path);
        response.pipe(file);
        file.on('finish',() => {
        console.log('finished -------------------------');
        setTimeout(()=>{
                writeTextfile(list);
            },6000)
        })
                
         
        
    });

    const writeTextfile = (list)=>{
        console.log('list',list);
        exec(`ffmpeg -i ${list[0]} -ss ${req.body.startTime} -to ${req.body.endTime}  -c copy  ${outputFilePath}`, (error, stdout, stderr) => {
          
            if (error) {
                console.log(`error: ${error.message}`);
                list.forEach(file => {
                    fs.unlinkSync(file)                    
                });
                res.send({
                    message: 'faiure',
                    error: error.message
                });
            }
            else{
                console.log("videos are successfully merged");
                /*-- Delete all generated files --*/
                list.forEach(file => {
                    fs.unlinkSync(file)                    
                });
                var bufs = [];
                var readableStream = fs.createReadStream(outputFilePath);
                readableStream.on('data', function(chunk) {
                    bufs.push(chunk); 
                });
                readableStream.on('end', function(){
                    var buf = Buffer.concat(bufs);
                    console.log('stream end', buf)
                    var uploadParams = {
                        Bucket: config.usersbucket,
                        Key: '', // pass key
                        Body: null, // pass file body
                    };
                    getSimulationImageRecord(image_id)
                    .then(data => {

                        /*
                        * Remove trim video from s3 if already exists before trim...
                        */
                        removes3Object(data.trim_video_path)
                        .then(response =>{
                            console.log('Trim video removed successfully =================================')
                        })
                        /*--end--*/

                        // File Extensions
                        let file_name = Date.now()+'_'+image_id+'_trimed.mp4'
                        var d = new Date();
                        console.log(d.toLocaleDateString('pt-PT'));
                        d = d.toLocaleDateString('pt-PT');
                        var date = d.replace("/", "-");
                        date = date.replace("/", "-");
                        console.log('date',date);
                        // Setting Attributes for file upload on S3
                        uploadParams.Key =  data['player_name']+"/simulation/"+date+"/impact-video/"+image_id+"/"+file_name;
                        // console.log('req.file.buffer', req.file.buffer)
                        uploadParams.Body = buf;
                        
                        s3.upload(uploadParams, (err, data) => {
                            if (err) {
                                console.log('======errr \n',err)
                                res.send({
                                    message: "failure",
                                    data: err
                                });
                               
                            }else{
                                /*-- Unlink trimed video from directory --*/
                                fs.unlinkSync(outputFilePath)

                                /*
                                * Insert s3 video path in simulation_image table...
                                */
                                InsertTrimVideoKey(req.body.image_id,uploadParams.Key).
                                then(sensor_data => {
                                    const  image_id  = req.body.image_id;
                                    let imageData = '';

                                    /*
                                    * Getting image simulation image record from simulation_image table...
                                    */
                                    getSimulationImageRecord(image_id)
                                    .then(image_data => {
                                        console.log('image_data -----------------------------------\n',image_data)
                                        imageData = image_data;
                                        return verifyImageToken(imageData['token'], image_data);
                                    })
                                    .then(decoded_token => {
                                        // console.log('decoded_token',decoded_token)
                                        return getPlayerCgValues(imageData.player_name);
                                    })
                                    .then(cg_coordinates => {
                                        // Setting cg values
                                        // console.log("cg_coordinates",cg_coordinates)
                                        if(cg_coordinates) {
                                          imageData["cg_coordinates"] = cg_coordinates;
                                        }
                                        return trimVideoUrl(imageData);
                                    })
                                    .then(movie_link => {
                                        // let computed_time = imageData.computed_time ? timeConversion(imageData.computed_time) : ''
                                        console.log('movie_link',movie_link);
                                        res.send({
                                            message : "success",
                                            trim_video_path : movie_link
                                        })
                                        
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        // res.removeHeader('X-Frame-Options');
                                        // if(err.message == 'The provided key element does not match the schema'){
                                            res.send({
                                                message: "failure",
                                                data: err
                                            });
                                        // }
                                    })
                                })
                                .catch(err => {
                                   console.log('err',err)
                                    res.send({
                                        message: "failure",
                                        data: err
                                    });
                                })
                            }
                        })
                    }).catch(err => {
                       console.log('err',err)
                        res.send({
                            message: "failure",
                            data: err
                        });
                    })

                })
            }
            
        })
    }
})
// var file_name = Date.now();
//         var image_id = req.body.image_id;
//         var uploadParams = {
//             Bucket: config.usersbucket,
//             Key: '', // pass key
//             Body: null, // pass file body
//         };
//        
/*-- trim function end --*/


/*
================================================
                 API'S START
================================================

*/
app.post(`${apiPrefix}getSimulationStatusCount`, (req,res) =>{
    console.log('getSimulationStatusCount',req.body);

    let completed = 0;
    let failed = 0;
    let pending = 0;

    getTeamData(req.body)
        .then(sensor_data => {
            let k = 0
            if (sensor_data.length > 0) {
                sensor_data.forEach(function (record, index) {
                    getPlayerSimulationFile(record)
                        .then(simulation => {
                            k++;
                            if (simulation && simulation.status === 'pending') {
                                pending++;
                            } else if (simulation && simulation.status === 'completed') {
                                completed++;
                            } else {
                                failed++;
                            }

                            if (k == sensor_data.length) {
                                res.send({
                                    message: "success",
                                    data: {
                                        completed: completed,
                                        failed: failed,
                                        pending: pending
                                    }
                                })
                            }
                        })
                        .catch(err => {
                            res.send({
                                message: "failure",
                                error: err,
                                data: {
                                    completed: 0,
                                    failed: 0,
                                    pending: 0
                                }
                            })
                        })
                })
            } else {
                res.send({
                    message: "success",
                    data: {
                        completed: 0,
                        failed: 0,
                        pending: 0
                    }
                })
            }
            
        })
        .catch(err => {
            res.send({
                message: "failure",
                error: err,
                data: {
                    completed: 0,
                    failed: 0,
                    pending: 0
                }
            })
        })
})

app.post(`${apiPrefix}getCumulativeAccelerationData`, (req,res) =>{
    getCumulativeAccelerationData(req.body)
        .then(data => {
            res.send({
                message: "success",
                data: data[0],
                simulationCount: data.length
            })
        })
        .catch(err => {
            res.send({
                message: "failure",
                data: {},
                simulationCount:0,
                error: err
            })
        })
})

app.post(`${apiPrefix}getAllCumulativeAccelerationTimeRecords`, (req,res) =>{
    getCumulativeAccelerationData(req.body)
        .then(data => {
            let acceleration_data_list = [];
            // let frontal_Lobe = [];
            let brainRegions = {};
            let principal_max_strain = {};
            let principal_min_strain = {};
            let axonal_strain_max = {};
            let csdm_max = {};
            let masXsr_15_max = {};
            let cnt = 1;

            if (data.length === 0){
                brainRegions['principal-max-strain'] = {};
                brainRegions['principal-min-strain'] = {};
                brainRegions['axonal-strain-max'] = {};
                brainRegions['csdm-max'] = {};
                brainRegions['masXsr-15-max'] = {};
                
                res.send({
                    message: "success",
                    data: acceleration_data_list,
                    // frontal_Lobe: frontal_Lobe,
                    brainRegions: brainRegions
                })
            }

            data.forEach(function (acc_data, acc_index) {
                let accData = acc_data;
                let imageData = '';
                let outputFile = '';
                let jsonOutputFile = '';
                let simulationImage = '';
                getPlayerSimulationFile(acc_data)
                .then(image_data => {
                    imageData = image_data;
                    // console.log(acc_index, imageData.player_name);
                    if (acc_index === 0 && imageData.player_name && imageData.player_name != 'null') {
                        console.log('summary json url ----------------------------\n', imageData.player_name + '/simulation/summary.json');
                        let file_path = imageData.player_name + '/simulation/summary.json';
                        return getFileFromS3(file_path, imageData.bucket_name);
                        }
                })
               .then(output_file => {
                    if (output_file)
                        outputFile = output_file;
                    // if (imageData.path && imageData.path != 'null') {
                    //     return getFileFromS3(imageData.path, imageData.bucket_name);
                    // } else {
                    //     if (imageData.root_path && imageData.root_path != 'null') {
                    //         let image_path = imageData.root_path + imageData.image_id + '.png';
                    //         return getFileFromS3(image_path, imageData.bucket_name);
                    //     }
                    // }
                })
                .then(image_s3 => {
                    // if (image_s3) {
                    //     return getImageFromS3Buffer(image_s3);
                    // }
                })
                .then(image => {
                    simulationImage = image;

                    // if (imageData.ouput_file_path && imageData.ouput_file_path != 'null') {
                    //     let file_path = imageData.ouput_file_path;
                    //     file_path = file_path.replace(/'/g, "");
                    //     return getFileFromS3(file_path, imageData.bucket_name);
                    // } else {
                    //     if (imageData.root_path && imageData.root_path != 'null') {
                    //         let summary_path = imageData.root_path + imageData.image_id + '_output.json';
                    //         summary_path = summary_path.replace(/'/g, "");
                    //         console.log('summary_path',summary_path)
                    //         return getFileFromS3(summary_path, imageData.bucket_name);
                    //     }
                    // }
                }).then(json_output_file => {
                    if (json_output_file){
                        jsonOutputFile = JSON.parse(json_output_file.Body.toString('utf-8'));
                    }
                    // X- Axis Linear Acceleration
                    let linear_acceleration = accData['impact-date'] ? accData.simulation['linear-acceleration'] : accData['linear-acceleration'];
                    // X- Axis Angular Acceleration
                    let angular_acceleration = accData['impact-date'] ? accData.simulation['angular-acceleration'] : accData['angular-acceleration'];
                    // Y Axis timestamp
                    let time = accData['impact-date'] ? accData.simulation['linear-acceleration']['xt'] : accData['linear-acceleration']['xt'];
                    time = time ? time : [];
                    
                    // console.log(time);
                    time.forEach((t, i) => {
                        var _temp_time = parseFloat(t).toFixed(1);
                        time[i] = _temp_time;
                    })

                    acceleration_data_list.push({
                        linear_acceleration: linear_acceleration,
                        angular_acceleration: angular_acceleration,
                        time: time,
                        simulation_image: simulationImage ? simulationImage : '',
                        jsonOutputFile: jsonOutputFile ? jsonOutputFile : '',
                        //simulation_output_data: outputFile ? JSON.parse(outputFile.Body.toString('utf-8')) : '',
                        timestamp: accData.date,
                        record_time: accData.time,
                        sensor_data: accData,
                        date_time: accData.player_id.split('$')[1]
                    })

                    if (acc_index === 0 && outputFile) {
                        outputFile = JSON.parse(outputFile.Body.toString('utf-8'));
                        if (outputFile.Insults) {
                            outputFile.Insults.forEach(function (summary_data, index) {
                                if (summary_data['principal-max-strain'] && summary_data['principal-max-strain'].location) {
                                    let coordinate = {};
                                    coordinate.x = summary_data['principal-max-strain'].location[0];
                                    coordinate.y = summary_data['principal-max-strain'].location[1];
                                    coordinate.z = summary_data['principal-max-strain'].location[2];
                                    if (summary_data['principal-max-strain']['brain-region']) {
                                        region = summary_data['principal-max-strain']['brain-region'].toLowerCase();
                                        principal_max_strain[region] = principal_max_strain[region] || [];
                                        principal_max_strain[region].push(coordinate);
                                    }
                                }
                                if (summary_data['principal-min-strain'] && summary_data['principal-min-strain'].location) {
                                    let coordinate = {};
                                    coordinate.x = summary_data['principal-min-strain'].location[0];
                                    coordinate.y = summary_data['principal-min-strain'].location[1];
                                    coordinate.z = summary_data['principal-min-strain'].location[2];
                                    if (summary_data['principal-min-strain']['brain-region']) {
                                        region = summary_data['principal-min-strain']['brain-region'].toLowerCase();
                                        principal_min_strain[region] = principal_min_strain[region] || [];
                                        principal_min_strain[region].push(coordinate);
                                    }
                                }
                                if (summary_data['axonal-strain-max'] && summary_data['axonal-strain-max'].location) {
                                    let coordinate = {};
                                    coordinate.x = summary_data['axonal-strain-max'].location[0];
                                    coordinate.y = summary_data['axonal-strain-max'].location[1];
                                    coordinate.z = summary_data['axonal-strain-max'].location[2];
                                    if (summary_data['axonal-strain-max']['brain-region']) {
                                        region = summary_data['axonal-strain-max']['brain-region'].toLowerCase();
                                        axonal_strain_max[region] = axonal_strain_max[region] || [];
                                        axonal_strain_max[region].push(coordinate);
                                    }
                                }
                                if (summary_data['csdm-max'] && summary_data['csdm-max'].location) {
                                    let coordinate = {};
                                    coordinate.x = summary_data['csdm-max'].location[0];
                                    coordinate.y = summary_data['csdm-max'].location[1];
                                    coordinate.z = summary_data['csdm-max'].location[2];
                                    if (summary_data['csdm-max']['brain-region']) {
                                        region = summary_data['csdm-max']['brain-region'].toLowerCase();
                                        csdm_max[region] = csdm_max[region] || [];
                                        csdm_max[region].push(coordinate);
                                    }
                                }
                                if (summary_data['masXsr-15-max'] && summary_data['masXsr-15-max'].location) {
                                    let coordinate = {};
                                    coordinate.x = summary_data['masXsr-15-max'].location[0];
                                    coordinate.y = summary_data['masXsr-15-max'].location[1];
                                    coordinate.z = summary_data['masXsr-15-max'].location[2];
                                    if (summary_data['masXsr-15-max']['brain-region']) {
                                        region = summary_data['masXsr-15-max']['brain-region'].toLowerCase();
                                        masXsr_15_max[region] = masXsr_15_max[region] || [];
                                        masXsr_15_max[region].push(coordinate);
                                    }
                                }
                            })
                        }
                    }

                    brainRegions['principal-max-strain'] = principal_max_strain;
                    brainRegions['principal-min-strain'] = principal_min_strain;
                    brainRegions['axonal-strain-max'] = axonal_strain_max;
                    brainRegions['csdm-max'] = csdm_max;
                    brainRegions['masXsr-15-max'] = masXsr_15_max;

                    // console.log('brainRegions', JSON.stringify(brainRegions));

                    if (data.length === cnt) {
                        acceleration_data_list.sort(function(b, a) {
                            var keyA = a.date_time,
                            keyB = b.date_time;
                            if (keyA < keyB) return -1;
                            if (keyA > keyB) return 1;
                            return 0;
                        });
                        res.send({
                            message: "success",
                            data: acceleration_data_list,
                            // frontal_Lobe: frontal_Lobe,
                            brainRegions: brainRegions
                        })
                    }

                    cnt++;
                })
            })
           
        })
        .catch(err => {
            var acceleration_data_list = [];
            acceleration_data_list.push({
                linear_acceleration: [],
                angular_acceleration: [],
                time: '',
                simulation_image: '',
                timestamp: '',
                record_time: '',
                sensor_data: ''
            })
            let brainRegions = {};
            brainRegions['principal-max-strain'] = {};
            brainRegions['principal-min-strain'] = {};
            brainRegions['axonal-strain-max'] = {};
            brainRegions['csdm-max'] = {};
            brainRegions['masXsr-15-max'] = {};

            res.send({
                message: "failure",
                data: acceleration_data_list,
                brainRegions: brainRegions,
                error: err
            })
        })
})

app.post(`${apiPrefix}AllCumulativeAccelerationTimeRecords`, (req,res) =>{
   getCumulativeAccelerationData(req.body)
        .then(data => {
            let acceleration_data_list = [];
            // let frontal_Lobe = [];
            let brainRegions = {};
            let principal_max_strain = {};
            let principal_min_strain = {};
            let axonal_strain_max = {};
            let csdm_max = {};
            let masXsr_15_max = {};
            let MPS_95  = {};
            let CSDM_5  = {};
            let CSDM_10 = {};
            let CSDM_15 = {};

            let cnt = 1;

            if (data.length === 0){
                brainRegions['principal-max-strain'] = {};
                brainRegions['principal-min-strain'] = {};
                brainRegions['axonal-strain-max'] = {};
                brainRegions['csdm-max'] = {};
                brainRegions['masXsr-15-max'] = {};
                brainRegions['MPS-95'] = {};
                brainRegions['CSDM-5'] = {};
                brainRegions['CSDM-10'] = {};
                brainRegions['CSDM-15'] = {};
                
                res.send({
                    message: "success",
                    data: acceleration_data_list,
                    // frontal_Lobe: frontal_Lobe,
                    brainRegions: brainRegions
                })
            }
            let index_file = 0;
            let file_count = 0;
            data.forEach(function (acc_data, acc_index) {
                let accData = acc_data;
                let imageData = '';
                let outputFile = '';
                let jsonOutputFile = '';
                let simulationImage = '';
                getPlayerSimulationFile(acc_data)
                .then(image_data => {
                    imageData = image_data;
                    if (imageData.player_name && imageData.player_name != 'null') {
                        if(file_count < 1){
                            file_count++;
                            index_file = acc_index;
                            let file_path = imageData.player_name + '/simulation/summary.json';
                            return getFileFromS3(file_path, imageData.bucket_name);
                        }
                    }
                })
               .then(output_file => {
                    if (output_file) outputFile = output_file;
                    acceleration_data_list.push({
                        sensor_data: accData,   
                        status: imageData ? imageData.status : '',
                        computed_time : imageData ? imageData.computed_time : '',
                        log_stream_name: imageData.log_stream_name,
                        date_time: accData.player_id.split('$')[1]
                    })

                    if (acc_index === index_file && outputFile) {
                        outputFile = JSON.parse(outputFile.Body.toString('utf-8'));
                        if (outputFile.Insults) {
                            outputFile.Insults.forEach(function (summary_data, index) {
                                if (summary_data['principal-max-strain'] && summary_data['principal-max-strain'].location) {
                                    let coordinate = {};
                                    coordinate.x = summary_data['principal-max-strain'].location[0];
                                    coordinate.y = summary_data['principal-max-strain'].location[1];
                                    coordinate.z = summary_data['principal-max-strain'].location[2];
                                    if (summary_data['principal-max-strain']['brain-region']) {
                                        region = summary_data['principal-max-strain']['brain-region'].toLowerCase();
                                        principal_max_strain[region] = principal_max_strain[region] || [];
                                        principal_max_strain[region].push(coordinate);
                                    }
                                }
                                if (summary_data['principal-min-strain'] && summary_data['principal-min-strain'].location) {
                                    let coordinate = {};
                                    coordinate.x = summary_data['principal-min-strain'].location[0];
                                    coordinate.y = summary_data['principal-min-strain'].location[1];
                                    coordinate.z = summary_data['principal-min-strain'].location[2];
                                    if (summary_data['principal-min-strain']['brain-region']) {
                                        region = summary_data['principal-min-strain']['brain-region'].toLowerCase();
                                        principal_min_strain[region] = principal_min_strain[region] || [];
                                        principal_min_strain[region].push(coordinate);
                                    }
                                }
                                if (summary_data['axonal-strain-max'] && summary_data['axonal-strain-max'].location) {
                                    let coordinate = {};
                                    coordinate.x = summary_data['axonal-strain-max'].location[0];
                                    coordinate.y = summary_data['axonal-strain-max'].location[1];
                                    coordinate.z = summary_data['axonal-strain-max'].location[2];
                                    if (summary_data['axonal-strain-max']['brain-region']) {
                                        region = summary_data['axonal-strain-max']['brain-region'].toLowerCase();
                                        axonal_strain_max[region] = axonal_strain_max[region] || [];
                                        axonal_strain_max[region].push(coordinate);
                                    }
                                }
                                if (summary_data['csdm-max'] && summary_data['csdm-max'].location) {
                                    let coordinate = {};
                                    coordinate.x = summary_data['csdm-max'].location[0];
                                    coordinate.y = summary_data['csdm-max'].location[1];
                                    coordinate.z = summary_data['csdm-max'].location[2];
                                    if (summary_data['csdm-max']['brain-region']) {
                                        region = summary_data['csdm-max']['brain-region'].toLowerCase();
                                        csdm_max[region] = csdm_max[region] || [];
                                        csdm_max[region].push(coordinate);
                                    }
                                }
                                if (summary_data['masXsr-15-max'] && summary_data['masXsr-15-max'].location) {
                                    let coordinate = {};
                                    coordinate.x = summary_data['masXsr-15-max'].location[0];
                                    coordinate.y = summary_data['masXsr-15-max'].location[1];
                                    coordinate.z = summary_data['masXsr-15-max'].location[2];
                                    if (summary_data['masXsr-15-max']['brain-region']) {
                                        region = summary_data['masXsr-15-max']['brain-region'].toLowerCase();
                                        masXsr_15_max[region] = masXsr_15_max[region] || [];
                                        masXsr_15_max[region].push(coordinate);
                                    }
                                }

                                /*
                                * Commented mps 95 data ----------------
                                */
                                //-- For mps 95--
                                /*if (summary_data['MPS-95']) {    
                                    if(summary_data['MPS-95']['stem']){
                                        let newCordinates = summary_data['MPS-95']['stem'].map(function (data, index) {
                                            return {x:data[0],y:data[1],z:data[2]};
                                        })
                                        newCordinates.forEach(function (summary_data, index) {
                                            var region = 'stem';
                                            MPS_95[region] = MPS_95[region] || [];
                                            MPS_95[region].push(summary_data);
                                        })
                                    }  
                                    if(summary_data['MPS-95']['frontal']){
                                        let newCordinates = summary_data['MPS-95']['frontal'].map(function (data, index) {
                                            return {x:data[0],y:data[1],z:data[2]};
                                        })
                                        newCordinates.forEach(function (summary_data, index) {
                                            var region = 'frontal';
                                            MPS_95[region] = MPS_95[region] || [];
                                            MPS_95[region].push(summary_data);
                                        })
                                    }
                                    if(summary_data['MPS-95']['parietal']){
                                        let newCordinates = summary_data['MPS-95']['parietal'].map(function (data, index) {
                                            return {x:data[0],y:data[1],z:data[2]};
                                        })
                                        newCordinates.forEach(function (summary_data, index) {
                                            var region = 'parietal';
                                            MPS_95[region] = MPS_95[region] || [];
                                            MPS_95[region].push(summary_data);
                                        })
                                    }
                                    if(summary_data['MPS-95']['msc']){
                                        let newCordinates = summary_data['MPS-95']['msc'].map(function (data, index) {
                                            return {x:data[0],y:data[1],z:data[2]};
                                        })
                                        newCordinates.forEach(function (summary_data, index) {
                                            var region = 'msc';
                                            MPS_95[region] = MPS_95[region] || [];
                                            MPS_95[region].push(summary_data);
                                        })
                                    }
                                    if(summary_data['MPS-95']['cerebellum']){
                                        let newCordinates = summary_data['MPS-95']['cerebellum'].map(function (data, index) {
                                            return {x:data[0],y:data[1],z:data[2]};
                                        })
                                        newCordinates.forEach(function (summary_data, index) {
                                            var region = 'cerebellum';
                                            MPS_95[region] = MPS_95[region] || [];
                                            MPS_95[region].push(summary_data);
                                        })
                                    }
                                    if(summary_data['MPS-95']['occipital']){
                                        let newCordinates = summary_data['MPS-95']['occipital'].map(function (data, index) {
                                            return {x:data[0],y:data[1],z:data[2]};
                                        })
                                        newCordinates.forEach(function (summary_data, index) {
                                            var region = 'occipital';
                                            MPS_95[region] = MPS_95[region] || [];
                                            MPS_95[region].push(summary_data);
                                        })
                                    }
                                    if(summary_data['MPS-95']['temporal']){
                                        let newCordinates = summary_data['MPS-95']['temporal'].map(function (data, index) {
                                            return {x:data[0],y:data[1],z:data[2]};
                                        })
                                        newCordinates.forEach(function (summary_data, index) {
                                            var region = 'temporal';
                                            MPS_95[region] = MPS_95[region] || [];
                                            MPS_95[region].push(summary_data);
                                        })
                                    }
                                }

                                // mps 95 data end


                                //-- For CSDM-5--
                                if (summary_data['CSDM-5']) {   
                                    if(summary_data['CSDM-5']['stem']){
                                        let newCordinates = summary_data['CSDM-5']['stem'].map(function (data, index) {
                                            return {x:data[0],y:data[1],z:data[2]};
                                        })
                                        newCordinates.forEach(function (summary_data, index) {
                                            var region = 'stem';
                                            CSDM_5[region] = CSDM_5[region] || [];
                                            CSDM_5[region].push(summary_data);
                                        })
                                    }     
                                    if(summary_data['CSDM-5']['frontal']){
                                        let newCordinates = summary_data['CSDM-5']['frontal'].map(function (data, index) {
                                            return {x:data[0],y:data[1],z:data[2]};
                                        })
                                        newCordinates.forEach(function (summary_data, index) {
                                            var region = 'frontal';
                                            CSDM_5[region] = CSDM_5[region] || [];
                                            CSDM_5[region].push(summary_data);
                                        })
                                    }
                                    if(summary_data['CSDM-5']['parietal']){
                                        let newCordinates = summary_data['CSDM-5']['parietal'].map(function (data, index) {
                                            return {x:data[0],y:data[1],z:data[2]};
                                        })
                                        newCordinates.forEach(function (summary_data, index) {
                                            var region = 'parietal';
                                            CSDM_5[region] = CSDM_5[region] || [];
                                            CSDM_5[region].push(summary_data);
                                        })
                                    }
                                    if(summary_data['CSDM-5']['msc']){
                                        let newCordinates = summary_data['CSDM-5']['msc'].map(function (data, index) {
                                            return {x:data[0],y:data[1],z:data[2]};
                                        })
                                        newCordinates.forEach(function (summary_data, index) {
                                            var region = 'msc';
                                            CSDM_5[region] = CSDM_5[region] || [];
                                            CSDM_5[region].push(summary_data);
                                        })
                                    }
                                    if(summary_data['CSDM-5']['cerebellum']){
                                        let newCordinates = summary_data['CSDM-5']['cerebellum'].map(function (data, index) {
                                            return {x:data[0],y:data[1],z:data[2]};
                                        })
                                        newCordinates.forEach(function (summary_data, index) {
                                            var region = 'cerebellum';
                                            CSDM_5[region] = CSDM_5[region] || [];
                                            CSDM_5[region].push(summary_data);
                                        })
                                    }
                                    if(summary_data['CSDM-5']['occipital']){
                                        let newCordinates = summary_data['CSDM-5']['occipital'].map(function (data, index) {
                                            return {x:data[0],y:data[1],z:data[2]};
                                        })
                                        newCordinates.forEach(function (summary_data, index) {
                                            var region = 'occipital';
                                            CSDM_5[region] = CSDM_5[region] || [];
                                            CSDM_5[region].push(summary_data);
                                        })
                                    }
                                    if(summary_data['CSDM-5']['temporal']){
                                        let newCordinates = summary_data['CSDM-5']['temporal'].map(function (data, index) {
                                            return {x:data[0],y:data[1],z:data[2]};
                                        })
                                        newCordinates.forEach(function (summary_data, index) {
                                            var region = 'temporal';
                                            CSDM_5[region] = CSDM_5[region] || [];
                                            CSDM_5[region].push(summary_data);
                                        })
                                    }
                                }
                                //-- For CSDM-10--
                                if (summary_data['CSDM-10']) {   
                                    if(summary_data['CSDM-10']['stem']){
                                        let newCordinates = summary_data['CSDM-10']['stem'].map(function (data, index) {
                                            return {x:data[0],y:data[1],z:data[2]};
                                        })
                                        newCordinates.forEach(function (summary_data, index) {
                                            var region = 'stem';
                                            CSDM_10[region] = CSDM_10[region] || [];
                                            CSDM_10[region].push(summary_data);
                                        })
                                    }     
                                    if(summary_data['CSDM-10']['frontal']){
                                        let newCordinates = summary_data['CSDM-10']['frontal'].map(function (data, index) {
                                            return {x:data[0],y:data[1],z:data[2]};
                                        })
                                        newCordinates.forEach(function (summary_data, index) {
                                            var region = 'frontal';
                                            CSDM_10[region] = CSDM_10[region] || [];
                                            CSDM_10[region].push(summary_data);
                                        })
                                    }
                                    if(summary_data['CSDM-10']['parietal']){
                                        let newCordinates = summary_data['CSDM-10']['parietal'].map(function (data, index) {
                                            return {x:data[0],y:data[1],z:data[2]};
                                        })
                                        newCordinates.forEach(function (summary_data, index) {
                                            var region = 'parietal';
                                            CSDM_10[region] = CSDM_10[region] || [];
                                            CSDM_10[region].push(summary_data);
                                        })
                                    }
                                    if(summary_data['CSDM-10']['msc']){
                                        let newCordinates = summary_data['CSDM-10']['msc'].map(function (data, index) {
                                            return {x:data[0],y:data[1],z:data[2]};
                                        })
                                        newCordinates.forEach(function (summary_data, index) {
                                            var region = 'msc';
                                            CSDM_10[region] = CSDM_10[region] || [];
                                            CSDM_10[region].push(summary_data);
                                        })
                                    }
                                    if(summary_data['CSDM-10']['cerebellum']){
                                        let newCordinates = summary_data['CSDM-10']['cerebellum'].map(function (data, index) {
                                            return {x:data[0],y:data[1],z:data[2]};
                                        })
                                        newCordinates.forEach(function (summary_data, index) {
                                            var region = 'cerebellum';
                                            CSDM_10[region] = CSDM_10[region] || [];
                                            CSDM_10[region].push(summary_data);
                                        })
                                    }
                                    if(summary_data['CSDM-10']['occipital']){
                                        let newCordinates = summary_data['CSDM-10']['occipital'].map(function (data, index) {
                                            return {x:data[0],y:data[1],z:data[2]};
                                        })
                                        newCordinates.forEach(function (summary_data, index) {
                                            var region = 'occipital';
                                            CSDM_10[region] = CSDM_10[region] || [];
                                            CSDM_10[region].push(summary_data);
                                        })
                                    }
                                    if(summary_data['CSDM-10']['temporal']){
                                        let newCordinates = summary_data['CSDM-10']['temporal'].map(function (data, index) {
                                            return {x:data[0],y:data[1],z:data[2]};
                                        })
                                        newCordinates.forEach(function (summary_data, index) {
                                            var region = 'temporal';
                                            CSDM_10[region] = CSDM_10[region] || [];
                                            CSDM_10[region].push(summary_data);
                                        })
                                    }
                                }

                                //-- For CSDM-15--
                                if (summary_data['CSDM-15']) {   
                                    if(summary_data['CSDM-15']['stem']){
                                        let newCordinates = summary_data['CSDM-15']['stem'].map(function (data, index) {
                                            return {x:data[0],y:data[1],z:data[2]};
                                        })
                                        newCordinates.forEach(function (summary_data, index) {
                                            var region = 'stem';
                                            CSDM_15[region] = CSDM_15[region] || [];
                                            CSDM_15[region].push(summary_data);
                                        })
                                    }     
                                    if(summary_data['CSDM-15']['frontal']){
                                        let newCordinates = summary_data['CSDM-15']['frontal'].map(function (data, index) {
                                            return {x:data[0],y:data[1],z:data[2]};
                                        })
                                        newCordinates.forEach(function (summary_data, index) {
                                            var region = 'frontal';
                                            CSDM_15[region] = CSDM_15[region] || [];
                                            CSDM_15[region].push(summary_data);
                                        })
                                    }
                                    if(summary_data['CSDM-15']['parietal']){
                                        let newCordinates = summary_data['CSDM-15']['parietal'].map(function (data, index) {
                                            return {x:data[0],y:data[1],z:data[2]};
                                        })
                                        newCordinates.forEach(function (summary_data, index) {
                                            var region = 'parietal';
                                            CSDM_15[region] = CSDM_15[region] || [];
                                            CSDM_15[region].push(summary_data);
                                        })
                                    }
                                    if(summary_data['CSDM-15']['msc']){
                                        let newCordinates = summary_data['CSDM-15']['msc'].map(function (data, index) {
                                            return {x:data[0],y:data[1],z:data[2]};
                                        })
                                        newCordinates.forEach(function (summary_data, index) {
                                            var region = 'msc';
                                            CSDM_15[region] = CSDM_15[region] || [];
                                            CSDM_15[region].push(summary_data);
                                        })
                                    }
                                    if(summary_data['CSDM-15']['cerebellum']){
                                        let newCordinates = summary_data['CSDM-15']['cerebellum'].map(function (data, index) {
                                            return {x:data[0],y:data[1],z:data[2]};
                                        })
                                        newCordinates.forEach(function (summary_data, index) {
                                            var region = 'cerebellum';
                                            CSDM_15[region] = CSDM_15[region] || [];
                                            CSDM_15[region].push(summary_data);
                                        })
                                    }
                                    if(summary_data['CSDM-15']['occipital']){
                                        let newCordinates = summary_data['CSDM-15']['occipital'].map(function (data, index) {
                                            return {x:data[0],y:data[1],z:data[2]};
                                        })
                                        newCordinates.forEach(function (summary_data, index) {
                                            var region = 'occipital';
                                            CSDM_15[region] = CSDM_15[region] || [];
                                            CSDM_15[region].push(summary_data);
                                        })
                                    }
                                    if(summary_data['CSDM-15']['temporal']){
                                        let newCordinates = summary_data['CSDM-15']['temporal'].map(function (data, index) {
                                            return {x:data[0],y:data[1],z:data[2]};
                                        })
                                        newCordinates.forEach(function (summary_data, index) {
                                            var region = 'temporal';
                                            CSDM_15[region] = CSDM_15[region] || [];
                                            CSDM_15[region].push(summary_data);
                                        })
                                    }
                                }
                                */
                            })
                        }
                    }

                    brainRegions['principal-max-strain'] = principal_max_strain;
                    brainRegions['principal-min-strain'] = principal_min_strain;
                    brainRegions['axonal-strain-max'] = axonal_strain_max;
                    brainRegions['csdm-max'] = csdm_max;
                    brainRegions['masXsr-15-max'] = masXsr_15_max;
                    brainRegions['MPS-95'] = MPS_95;
                    brainRegions['CSDM-5'] = CSDM_5;
                    brainRegions['CSDM-10'] = CSDM_10;
                    brainRegions['CSDM-15'] = CSDM_15;

                    // console.log('brainRegions', JSON.stringify(brainRegions));

                    if (data.length === cnt) {
                        acceleration_data_list.sort(function(b, a) {
                            var keyA = a.date_time,
                            keyB = b.date_time;
                            if (keyA < keyB) return -1;
                            if (keyA > keyB) return 1;
                            return 0;
                        });
                        res.send({
                            message: "success",
                            data: acceleration_data_list,
                            // frontal_Lobe: frontal_Lobe,
                            brainRegions: brainRegions
                        })
                    }

                    cnt++;
                })
                .catch(err => {
                    let brainRegions = {};
                    brainRegions['principal-max-strain'] = {};
                    brainRegions['principal-min-strain'] = {};
                    brainRegions['axonal-strain-max'] = {};
                    brainRegions['csdm-max'] = {};
                    brainRegions['masXsr-15-max'] = {};
                    brainRegions['CSDM-5'] = {};
                    brainRegions['CSDM-10'] = {};
                    brainRegions['CSDM-15'] = {};
                    brainRegions['MPS-95'] = {}
                    var acceleration_data_list = [];
                    // acceleration_data_list.push({
                    //     sensor_data: ''
                    // })
                    res.send({
                        message: "failure",
                        data: acceleration_data_list,
                        brainRegions: brainRegions,
                        error: err
                    })
                })
            })
           
        })
        .catch(err => {
            let brainRegions = {};
            brainRegions['principal-max-strain'] = {};
            brainRegions['principal-min-strain'] = {};
            brainRegions['axonal-strain-max'] = {};
            brainRegions['csdm-max'] = {};
            brainRegions['masXsr-15-max'] = {};
            var acceleration_data_list = [];
            // acceleration_data_list.push({
            //     sensor_data: ''
            // })
            res.send({
                message: "failure",
                data: acceleration_data_list,
                brainRegions: brainRegions,
                error: err
            })
        })
})

function getbrainRegions_V1(summary_data, dataFor){
    return new Promise((resolve, reject) => {
        var MPS_95 = {};
        if(summary_data[dataFor]['stem']){                 
            let newCordinates = summary_data[dataFor]['stem'].map(function (data, index) {
                return {x:data[0],y:data[1],z:data[2]};
            })
            newCordinates.forEach(function (summary_data, index) {
                var region = 'stem';
                MPS_95[region] = MPS_95[region] || [];
                MPS_95[region].push(summary_data);
            })
        }  
        if(summary_data[dataFor]['frontal']){
            let newCordinates = summary_data[dataFor]['frontal'].map(function (data, index) {
                return {x:data[0],y:data[1],z:data[2]};
            })
            newCordinates.forEach(function (summary_data, index) {
                var region = 'frontal';
                MPS_95[region] = MPS_95[region] || [];
                MPS_95[region].push(summary_data);
            })
        }
        if(summary_data[dataFor]['parietal']){
            let newCordinates = summary_data[dataFor]['parietal'].map(function (data, index) {
                return {x:data[0],y:data[1],z:data[2]};
            })
            newCordinates.forEach(function (summary_data, index) {
                var region = 'parietal';
                MPS_95[region] = MPS_95[region] || [];
                MPS_95[region].push(summary_data);
            })
        }
        if(summary_data[dataFor]['msc']){
            let newCordinates = summary_data[dataFor]['msc'].map(function (data, index) {
                return {x:data[0],y:data[1],z:data[2]};
            })
            newCordinates.forEach(function (summary_data, index) {
                var region = 'msc';
                MPS_95[region] = MPS_95[region] || [];
                MPS_95[region].push(summary_data);
            })
        }
        if(summary_data[dataFor]['cerebellum']){
            let newCordinates = summary_data[dataFor]['cerebellum'].map(function (data, index) {
                return {x:data[0],y:data[1],z:data[2]};
            })
            newCordinates.forEach(function (summary_data, index) {
                var region = 'cerebellum';
                MPS_95[region] = MPS_95[region] || [];
                MPS_95[region].push(summary_data);
            })
        }
        if(summary_data[dataFor]['occipital']){
            let newCordinates = summary_data[dataFor]['occipital'].map(function (data, index) {
                return {x:data[0],y:data[1],z:data[2]};
            })
            newCordinates.forEach(function (summary_data, index) {
                var region = 'occipital';
                MPS_95[region] = MPS_95[region] || [];
                MPS_95[region].push(summary_data);
            })
        }
        if(summary_data[dataFor]['temporal']){
            let newCordinates = summary_data[dataFor]['temporal'].map(function (data, index) {
                return {x:data[0],y:data[1],z:data[2]};
            })
            newCordinates.forEach(function (summary_data, index) {
                var region = 'temporal';
                MPS_95[region] = MPS_95[region] || [];
                MPS_95[region].push(summary_data);
            })
        }

        resolve(MPS_95);
    })
}

app.post(`${apiPrefix}getCumulativeAccelerationTimeRecords`, (req,res) =>{
   getCumulativeAccelerationRecords(req.body)
        .then(data => {
            let acceleration_data_list = [];
            // let frontal_Lobe = [];
            let brainRegions = {};
            let principal_max_strain = {};
            let principal_min_strain = {};
            let axonal_strain_max = {};
            let csdm_max = {};
            let masXsr_15_max = {};
            let cnt = 1;

            if (data.length === 0){
                brainRegions['principal-max-strain'] = {};
                brainRegions['principal-min-strain'] = {};
                brainRegions['axonal-strain-max'] = {};
                brainRegions['csdm-max'] = {};
                brainRegions['masXsr-15-max'] = {};
                
                res.send({
                    message: "success",
                    data: acceleration_data_list,
                    // frontal_Lobe: frontal_Lobe,
                    brainRegions: brainRegions
                })
            }

            data.forEach(function (acc_data, acc_index) {
                let accData = acc_data;
                let imageData = '';
                let outputFile = '';
                let jsonOutputFile = '';
                let simulationImage = '';
                getPlayerSimulationFile(acc_data)
                .then(image_data => {
                    imageData = image_data;
                    console.log(acc_index, imageData.player_name);
                    if (acc_index === 0 && imageData.player_name && imageData.player_name != 'null') {
                        console.log(imageData.player_name + '/simulation/summary.json');
                        let file_path = imageData.player_name + '/simulation/summary.json';
                        return getFileFromS3(file_path, imageData.bucket_name);
                    }
                })
               .then(output_file => {
                    if (output_file)
                        outputFile = output_file;
                    // if (imageData.path && imageData.path != 'null') {
                    //     return getFileFromS3(imageData.path, imageData.bucket_name);
                    // } else {
                    //     if (imageData.root_path && imageData.root_path != 'null') {
                    //         let image_path = imageData.root_path + imageData.image_id + '.png';
                    //         return getFileFromS3(image_path, imageData.bucket_name);
                    //     }
                    // }
                })
                .then(image_s3 => {
                    // if (image_s3) {
                    //     return getImageFromS3Buffer(image_s3);
                    // }
                })
                .then(image => {
                    simulationImage = image;

                    // if (imageData.ouput_file_path && imageData.ouput_file_path != 'null') {
                    //     let file_path = imageData.ouput_file_path;
                    //     file_path = file_path.replace(/'/g, "");
                    //     return getFileFromS3(file_path, imageData.bucket_name);
                    // } else {
                    //     if (imageData.root_path && imageData.root_path != 'null') {
                    //         let summary_path = imageData.root_path + imageData.image_id + '_output.json';
                    //         summary_path = summary_path.replace(/'/g, "");
                    //         console.log('summary_path',summary_path)
                    //         return getFileFromS3(summary_path, imageData.bucket_name);
                    //     }
                    // }
                }).then(json_output_file => {
                    if (json_output_file){
                        jsonOutputFile = JSON.parse(json_output_file.Body.toString('utf-8'));
                    }
                    // X- Axis Linear Acceleration
                    let linear_acceleration = accData['impact-date'] ? accData.simulation['linear-acceleration'] : accData['linear-acceleration'];
                    // X- Axis Angular Acceleration
                    let angular_acceleration = accData['impact-date'] ? accData.simulation['angular-acceleration'] : accData['angular-acceleration'];
                    // Y Axis timestamp
                    let time = accData['impact-date'] ? accData.simulation['linear-acceleration']['xt'] : accData['linear-acceleration']['xt'];
                    time = time ? time : [];
                    
                    // console.log(time);
                    time.forEach((t, i) => {
                        var _temp_time = parseFloat(t).toFixed(1);
                        time[i] = _temp_time;
                    })

                    acceleration_data_list.push({
                        linear_acceleration: linear_acceleration,
                        angular_acceleration: angular_acceleration,
                        time: time,
                        simulation_image: simulationImage ? simulationImage : '',
                        jsonOutputFile: jsonOutputFile ? jsonOutputFile : '',
                        //simulation_output_data: outputFile ? JSON.parse(outputFile.Body.toString('utf-8')) : '',
                        timestamp: accData.date,
                        record_time: accData.time,
                        sensor_data: accData,
                        date_time: accData.player_id.split('$')[1]
                    })

                    if (acc_index === 0 && outputFile) {
                        outputFile = JSON.parse(outputFile.Body.toString('utf-8'));
                        if (outputFile.Insults) {
                            outputFile.Insults.forEach(function (summary_data, index) {
                                if (summary_data['principal-max-strain'] && summary_data['principal-max-strain'].location) {
                                    let coordinate = {};
                                    coordinate.x = summary_data['principal-max-strain'].location[0];
                                    coordinate.y = summary_data['principal-max-strain'].location[1];
                                    coordinate.z = summary_data['principal-max-strain'].location[2];
                                    if (summary_data['principal-max-strain']['brain-region']) {
                                        region = summary_data['principal-max-strain']['brain-region'].toLowerCase();
                                        principal_max_strain[region] = principal_max_strain[region] || [];
                                        principal_max_strain[region].push(coordinate);
                                    }
                                }
                                if (summary_data['principal-min-strain']  && summary_data['principal-min-strain'].location) {
                                    let coordinate = {};
                                    coordinate.x = summary_data['principal-min-strain'].location[0];
                                    coordinate.y = summary_data['principal-min-strain'].location[1];
                                    coordinate.z = summary_data['principal-min-strain'].location[2];
                                    if (summary_data['principal-min-strain']['brain-region']) {
                                        region = summary_data['principal-min-strain']['brain-region'].toLowerCase();
                                        principal_min_strain[region] = principal_min_strain[region] || [];
                                        principal_min_strain[region].push(coordinate);
                                    }
                                }
                                if (summary_data['axonal-strain-max'] && summary_data['axonal-strain-max'].location) {
                                    let coordinate = {};
                                    coordinate.x = summary_data['axonal-strain-max'].location[0];
                                    coordinate.y = summary_data['axonal-strain-max'].location[1];
                                    coordinate.z = summary_data['axonal-strain-max'].location[2];
                                    if (summary_data['axonal-strain-max']['brain-region']) {
                                        region = summary_data['axonal-strain-max']['brain-region'].toLowerCase();
                                        axonal_strain_max[region] = axonal_strain_max[region] || [];
                                        axonal_strain_max[region].push(coordinate);
                                    }
                                }
                                if (summary_data['csdm-max'] && summary_data['csdm-max'].location) {
                                    let coordinate = {};
                                    coordinate.x = summary_data['csdm-max'].location[0];
                                    coordinate.y = summary_data['csdm-max'].location[1];
                                    coordinate.z = summary_data['csdm-max'].location[2];
                                    if (summary_data['csdm-max']['brain-region']) {
                                        region = summary_data['csdm-max']['brain-region'].toLowerCase();
                                        csdm_max[region] = csdm_max[region] || [];
                                        csdm_max[region].push(coordinate);
                                    }
                                }
                                if (summary_data['masXsr-15-max'] && summary_data['masXsr-15-max'].location) {
                                    let coordinate = {};
                                    coordinate.x = summary_data['masXsr-15-max'].location[0];
                                    coordinate.y = summary_data['masXsr-15-max'].location[1];
                                    coordinate.z = summary_data['masXsr-15-max'].location[2];
                                    if (summary_data['masXsr-15-max']['brain-region']) {
                                        region = summary_data['masXsr-15-max']['brain-region'].toLowerCase();
                                        masXsr_15_max[region] = masXsr_15_max[region] || [];
                                        masXsr_15_max[region].push(coordinate);
                                    }
                                }
                            })
                        }
                    }

                    brainRegions['principal-max-strain'] = principal_max_strain;
                    brainRegions['principal-min-strain'] = principal_min_strain;
                    brainRegions['axonal-strain-max'] = axonal_strain_max;
                    brainRegions['csdm-max'] = csdm_max;
                    brainRegions['masXsr-15-max'] = masXsr_15_max;

                    // console.log('brainRegions', JSON.stringify(brainRegions));

                    if (data.length === cnt) {
                        acceleration_data_list.sort(function(b, a) {
                            var keyA = a.date_time,
                            keyB = b.date_time;
                            if (keyA < keyB) return -1;
                            if (keyA > keyB) return 1;
                            return 0;
                        });
                        res.send({
                            message: "success",
                            data: acceleration_data_list,
                            // frontal_Lobe: frontal_Lobe,
                            brainRegions: brainRegions
                        })
                    }

                    cnt++;
                })
            })
           
        })
        .catch(err => {
            var acceleration_data_list = [];
            acceleration_data_list.push({
                linear_acceleration: [],
                angular_acceleration: [],
                time: '',
                simulation_image: '',
                timestamp: '',
                record_time: '',
                sensor_data: ''
            })
            let brainRegions = {};
            brainRegions['principal-max-strain'] = {};
            brainRegions['principal-min-strain'] = {};
            brainRegions['axonal-strain-max'] = {};
            brainRegions['csdm-max'] = {};
            brainRegions['masXsr-15-max'] = {};

            res.send({
                message: "failure",
                data: acceleration_data_list,
                brainRegions: brainRegions,
                error: err
            })
        })
})

app.post(`${apiPrefix}getAllCumulativeAccelerationJsonData`, (req,res) =>{
    getCumulativeAccelerationData(req.body)
        .then(data => {
            data.forEach(function (acc_data) {
                let accData = acc_data;
                let imageData = '';
                let outputFile = '';
                getPlayerSimulationFile(acc_data)
                .then(file_data => {
                    // console.log('image_data',image_data)
                    imageData = file_data;
                    
                    if (imageData.ouput_file_path && imageData.ouput_file_path != 'null') {
                        let file_path = image_data.ouput_file_path;
                        file_path = file_path.replace(/'/g, "");
                        return getFileFromS3(file_path, imageData.bucket_name);
                    } else {
                        if (imageData.root_path && imageData.root_path != 'null') {
                            let summary_path = imageData.root_path + imageData.image_id + '_ouput.json';
                            return getFileFromS3(summary_path, imageData.bucket_name);
                        }
                    }
                }).then(output_file => {
                    outputFile = output_file;
                    if (output_file)
                        outputFile = JSON.parse(outputFile.Body.toString('utf-8'));
                    console.log('outputFile',outputFile)
                    // if (imageData.path && imageData.path != 'null')
                    //     return getFileFromS3(imageData.path, imageData.bucket_name);
                    res.send({
                        message: "success",
                        data: {
                            'JsonFile':outputFile
                        }
                    })
                })
                // .catch(err => {
                //     res.send({
                //         message: "failure",
                //         error: err
                //     })
                // })
            })

            
        }).catch(err => {
         
            res.send({
                message: "failure",
                error: err
            })
        })
})

app.post(`${apiPrefix}getCumulativeAccelerationTimeData`, (req,res) =>{
    getCumulativeAccelerationData(req.body)
            .then(data => {
                let linear_accelerations = data.map(function (impact_data) {
                    return impact_data.linear_acceleration_pla
                });

                // X- Axis Linear Acceleration
                let max_linear_acceleration = Math.max(...linear_accelerations);
                // Y Axis timestamp
                let time = [0, 20, 40];

                res.send({
                    message: "success",
                    data: {
                        linear_accelerations: [0, max_linear_acceleration, 0],
                        time: time
                    }
                })
            })
            .catch(err => {
                res.send({
                    message: "failure",
                    data: {
                        linear_accelerations: [],
                        time: []
                    },
                    error: err
                })
            })
})
function getCumulativeEventPressureData() {
    var myObject = {
        message: "success",
        data: {
            pressure: [241, 292, 125, 106, 282, 171, 58, 37, 219, 263],
            time_label: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45],
            timestamp: Number(Date.now()).toString()
        }
    }
    return myObject;
}
function getCumulativeEventLoadData() {
    var myObject = {
        message: "success",
        data: {
            load: [{ dataset: [198, 69, 109, 139, 73] }
                , { dataset: [28, 113, 31, 10, 148] }
                , { dataset: [28, 2, 1, 10, 148] }
                , { dataset: [182, 3, 16, 97, 240] }
            ],

            time_label: ["W1", "W2", "W3", "W4", "W5"],
            timestamp: Number(Date.now()).toString()
        }
    }
    return myObject;
}
app.post(`${apiPrefix}getCumulativeEventPressureData`, (req,res) =>{
    res.send(getCumulativeEventPressureData());
})

app.post(`${apiPrefix}getCumulativeEventLoadData`, (req,res) =>{
    res.send(getCumulativeEventLoadData());
})


app.post(`${apiPrefix}getHeadAccelerationEvents`, (req,res) =>{
    getHeadAccelerationEvents(req.body)
    .then(data => {
        res.send({
            message: "success",
            data: data
        })
    })
    .catch(err => {
        console.log("========================>,ERRROR ,", err);
        res.send({
            message: "failure",
            error: err
        });
    })
})
app.post(`${apiPrefix}getTeamAdminData`, (req,res) =>{
   res.send(getTeamAdminData());
})
app.post(`${apiPrefix}getImpactHistory`, (req,res) =>{
    res.send(getImpactHistory());
})

app.post(`${apiPrefix}getImpactSummary`, (req,res) =>{
    res.send(getImpactSummary());
})


app.post(`${apiPrefix}getPlayersData`, (req,res) =>{
    getPlayersListFromTeamsDB_2(req.body)
        .then(data => {
            let player_list = [];
            let requested_player_list = [];
            data.forEach(function (u) {
                if (u.player_list) {
                    if (req.body.brand && u.sensor === req.body.brand) {
                        player_list = player_list.concat(u.player_list);
                    }
                    if (!req.body.brand) {
                        player_list = player_list.concat(u.player_list);
                    }
                    
                }
                console.log('0------------\n',u.requested_player_list)
                if (u.requested_player_list) {
                    requested_player_list = requested_player_list.concat(u.requested_player_list);
                }
            }) 
            console.log('requested_player_list', requested_player_list);
            // let player_list = data[0].player_list ? data[0].player_list : [];
            if (player_list.length == 0) {
                let requested_players = []
                if (requested_player_list && requested_player_list.length > 0) {
                    let p_cnt = 0;
                    requested_player_list.forEach(function (p_record) {
                        console.log('p_record 11',p_record)
                        getUserDetails(p_record)
                            .then (user_detail => {
                                p_cnt++; 
                                requested_players.push(user_detail.Item);

                                if (p_cnt === requested_player_list.length) {
                                    res.send({
                                        message: "success",
                                        data: [],
                                        requested_players: requested_players
                                    })
                                }
                            })
                    })         
                } else {
                    res.send({
                        message: "success",
                        data: [],
                        requested_players: []
                    })
                }
            }
            else {
                var counter = 0;
                var p_data = [];
                var player_listLen = player_list.length;
                player_list.forEach(function (player, index) {
                    console.log('player 112',player)
                    if(player && player != 'undefined'){
                        console.log('player_list', player);
                        let p = player;
                        let i = index;
                        let playerData = '';
                        getTeamDataWithPlayerRecords_2({ player_id: p, team: req.body.team_name, sensor: req.body.brand, organization: req.body.organization })
                        .then(player_data => {
                            playerData = player_data;
                            counter++;
                            if(playerData[0]){
                                p_data.push({
                                    date_time: playerData[0].player_id.split('$')[1],
                                    simulation_data: playerData,
                                });
                            }
                            console.log('p_data length', player_listLen, counter)
                            if (counter >= player_listLen) {
                                p_data.sort(function (b, a) {
                                    var keyA = a.date_time,
                                        keyB = b.date_time;
                                    if (keyA < keyB) return -1;
                                    if (keyA > keyB) return 1;
                                    return 0;
                                });

                                let k = 0;
                                p_data.forEach(function (record, index) {
                                    getPlayerSimulationFile(record.simulation_data[0])
                                        .then(simulation => {
                                            p_data[index]['simulation_data'][0]['simulation_status'] = simulation ? simulation.status : '';
                                            p_data[index]['simulation_data'][0]['computed_time'] = simulation ? simulation.computed_time : '';

                                            getUserDetailByPlayerId(record.simulation_data[0].player_id.split('$')[0]+'-'+record.simulation_data[0]['sensor'])
                                                .then (u_detail => {
                                                    console.log('user details ', u_detail[0]['first_name'])
                                                    p_data[index]['simulation_data'][0]['user_data'] = u_detail.length > 0 ? u_detail[0] : '';
                                                    k++;
                                                    if (k == p_data.length) {
                                                        let requested_players = []
                                                        if (requested_player_list.length > 0) {
                                                            let p_cnt = 0;
                                                            requested_player_list.forEach(function (p_record) {
                                                                console.log('p_record--------------------\n',p_record)
                                                                getUserDetails(p_record)
                                                                    .then (user_detail => {

                                                                        p_cnt++; 
                                                                        requested_players.push(user_detail.Item);
    
                                                                        if (p_cnt === requested_player_list.length) {
                                                                            res.send({
                                                                                message: "success",
                                                                                data: p_data,
                                                                                requested_players: requested_players
                                                                            })
                                                                        }
                                                                    })
                                                            })         
                                                        } else {
                                                            res.send({
                                                                message: "success",
                                                                data: p_data,
                                                                requested_players: requested_players
                                                            })
                                                        }
                                                    }

                                                })
                                        })
                                })
                            }
                        })
                        .catch(err => {
                            console.log('err ------------------\n',err)
                            counter++;
                            if (counter == player_list.length) {
                                res.send({
                                    message: "failure",
                                    data: p_data,
                                    requested_players: [],
                                    error:err
                                })
                            }
                        })
                    }else{
                        player_listLen--;
                    }
                })
            }
        })
        .catch(err => {
            res.send({
                message: "failure",
                error: err
            })
        });
})

app.post(`${apiPrefix}getOrganizationAdminData`, (req,res) =>{
    res.send(getOrganizationAdminData());
})

app.post(`${apiPrefix}getAllRosters`, (req,res) =>{
    res.send(getAllRosters());
})

function getAllRosters() {
    var myObject = {
        message: "success",
        data: {
            rosters: ["Roster 1", "Roster 2", "Roster 3", "Roster 4"]
        }
    }
    return myObject;
}

function getOrganizationAdminData() {
    var myObject = {
        message: "success",
        data: {
            organization: "York tech Football",
            sports_type: "football",
            roster_count: 3,
            impacts: 4,
            avg_load: 6,
            alerts: 8,
            highest_load: 0.046,
            most_impacts: 7
        }
    }
    return myObject;
}

function getPlayersData() {
    var myObject = {
        message: "success",
        data: [
            {
                player_name: "Player 1",
                sport: "Football",
                position: "RB",
                alerts: 2,
                impacts: 4,
                load: 0.34
            },
            {
                player_name: "Player 1",
                sport: "Football",
                position: "RB",
                alerts: 2,
                impacts: 4,
                load: 0.32
            },
            {
                player_name: "Player 2",
                sport: "Football",
                position: "FA",
                alerts: 2,
                impacts: 8,
                load: 0.31
            }
        ]
    }
    return myObject;
}

function getTeamAdminData() {
    var myObject = {
        message: "success",
        data: {
            organization: "York tech Football",
            sports_type: "football",
            roster_count: 3,
            impacts: 4,
            avg_load: 6,
            alerts: 8,
            highest_load: 0.046,
            most_impacts: 7
        }
    }
    return myObject;
}
function getImpactHistory() {
    var myObject =
    {
        message: "success",
        data: {
            pressure: [0.2, 0.5, 1.0, 0.5, 0.2, 0.5, 0.1],
            force: ["20-29g", "30-39g", "40-49g", "50-59g", "60-69g", "70-79g", "80-89g"]
        }
    }
    return myObject;
}

function getImpactSummary() {
    var myObject =
    {
        message: "success",
        data: {
            pressure: [0, 0, 0.1, 0.5, 0.2],
            force: ["20-29g", "30-39g", "40-49g", "50-59g", "60-69g"]
        }
    }
    return myObject;
}

app.post(`${apiPrefix}fetchAllTeamsInOrganization`, (req,res) =>{
    fetchAllTeamsInOrganization(req.body.organization)
        .then(list => {
            var teamList = list.filter(function (team) {

                return (!("team_list" in team));
            });
            let counter = 1;
            if (teamList.length == 0) {
                res.send({
                    message: "success",
                    data: []
                })
            }
            else {
                teamList.forEach(function (team, index) {
                    let data = team;
                    let i = index;
                    getTeamData({ team: data.team_name })
                        .then(simulation_records => {
                            counter++;
                            team["simulation_count"] = Number(simulation_records.length).toString();

                            if (counter == teamList.length) {
                                res.send({
                                    message: "success",
                                    data: teamList
                                })
                            }
                        })
                        .catch(err => {
                            counter++
                            if (counter == teamList.length) {
                                res.send({
                                    message: "failure",
                                    error: err
                                })
                            }
                        })
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.send({
                message: "failure",
                error: err
            })
        })
})

app.post(`${apiPrefix}addTeam`, (req,res) =>{
    addTeam(req.body)
        .then(data => {
            // Adding user to organization
            return new addTeamToOrganizationList(req.body.organization, req.body.team_name)
        })
        .then(d => {
            res.send({
                message: "success"
            })
        })
        .catch(err => {
            res.send({
                message: "failure",
                error: err
            })
        })
})


app.post(`${apiPrefix}deleteTeam`, (req,res) =>{
    deleteTeam(req.body)
    .then(d => {
        return new deleteTeamFromOrganizationList(req.body.organization, req.body.team_name)
    })
    .then(d => {
        res.send({
            message: "success"
        })
    })
    .catch(err => {
        res.send({
            message: "failure",
            error: err
        })
    })
})

app.post(`${apiPrefix}uploadModelRealData`, setConnectionTimeout('10m'), uploadModelRealData.single('file'), (req, res) => {
    convertDataToJSON(req.file.buffer,function(items){
        //console.log(items);
        return res.status(200).send(items);
    });

})

/*
================================================
                 API'S END
================================================

*/

function hadleAuthanticat(user_name,password){
    return new Promise((resolve, reject) => {
        // var password = password;
        getUserAlreadyExists(user_name)
        .then(userresponse =>{
            console.log('userresponse',userresponse);
            if(userresponse[0]){
                userData = userresponse[0];
                /* ======================

                    For new users
                    
                ==========================*/
                if(userData.password){
                     // Now getting the list of Groups of user
                     /*============== Match user password ===============*/
                    if(userData.password === md5(password)){
                       resolve({
                            message: 'success',
                            password: userData.password_code
                       })
                    }else{
                        resolve({
                            message: 'faiure',
                            error: 'Login password dose not match.'
                        })
                    }
                }else{
                    resolve({
                        message: 'success',
                        password: password
                    })
                }
            }else{
                resolve({
                    message: 'faiure',
                    error: 'User not found.'
                })
            }
        })
    })
}

app.post(`${apiPrefix}api/upload/sensor-file`, setConnectionTimeout('10m'), (req, res) => {
    // TODO : Start receiving user type or remove user type from this function
    var user_type = "standard";
    hadleAuthanticat(req.body.user_name, req.body.password)
    .then(response =>{
        if(response.message == 'failure'){
            res.send({
                message: "failure",
                error: response.error
            })
        }else{
            login(req.body.user_name, response.password, user_type, (err, data) => {
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
                                message: "failure",
                                error: err
                            });
                        } else {
                            getUserDbData(data.Username, function (err, user_details) {
                                if (err) {
                                    res.send({
                                        message: "failure",
                                        error: err
                                    })
                                }else {
                                    if (user_details.Item["level"] === 400 || user_details.Item["level"] === 300) {
                                        // console.log(user_details.Item);
                                        req.body["user_cognito_id"] = user_details.Item["user_cognito_id"];
                                        req.body["sensor_brand"] = user_details.Item["sensor"];
                                        req.body["level"] = user_details.Item["level"];
                                        if (user_details.Item["level"] === 300 && !req.body["organization"]) {
                                            req.body["organization"] = user_details.Item["organization"];
                                        }
                                        request.post({
                                            url: config.ComputeInstanceEndpoint + "generateSimulationForSensorData",
                                            json: req.body
                                        }, function (err, httpResponse, body) {
                                            if (err) {
                                                res.send({
                                                    message: "failure",
                                                    error: err
                                                })
                                            }
                                            else {
                                                res.send(httpResponse.body);
                                            }
                                        })
                                    } else {
                                        res.send({
                                            message: "failure",
                                            error: 'User is not sensor company.'
                                        })
                                    }
                                }
                            })
                        }
                    })
                }
            })
        }
    }).catch(err=>{
        res.send({
            message: "failure",
            error: 'Internal server error.'
        })
    })
    
})
// Run simulation using cURL command
app.post(`${apiPrefix}api/upload/sensor`, upload.fields([{name: "filename", maxCount: 1}, {name: "selfie", maxCount: 1}]),  (req, res) => {

    let data_filename = null;
    let base64File = null;
    if (req.files.filename) {
        let file_data = req.files.filename[0].buffer
        base64File = file_data.toString('base64');
        data_filename = req.files.filename[0].originalname
    }

    let selfie = null;
    let base64Selfie = null;
    if (req.files.selfie) {
        let selfie_data = req.files.selfie[0].buffer
        base64Selfie = selfie_data.toString('base64');
        selfie = req.files.selfie[0].originalname;
    }
    var user_type = "standard";
    hadleAuthanticat(req.body.user, req.body.password)
    .then(response =>{
        console.log('response===================\n',response)
        if(response.message == 'failure'){
            res.send({
                message: "failure",
                error: response.error
            })
        }else{
            login(req.body.user, response.password, user_type, (err, data) => {
            if (err) {
                res.send({
                    message: "failure",
                    error: err
                })
            }
            else {
                getUser(req.body.user, function (err, data) {
                    if (err) {
                        console.log(err);

                        res.send({
                            message: "failure",
                            error: err
                        });
                    } else {
                        getUserDbData(data.Username, function (err, user_details) {
                            console.log('user_details =====================\n',user_details)
                            if (err) {
                                res.send({
                                    message: "failure",
                                    error: err
                                })
                            }
                            else {
                                if (user_details.Item["level"] === 400 || user_details.Item["level"] === 300) {
                                    // console.log(user_details.Item);
                                    req.body["user_cognito_id"] = user_details.Item["user_cognito_id"];
                                    req.body["sensor_brand"] = user_details.Item["sensor"];
                                    req.body["level"] = user_details.Item["level"];
                                    if (user_details.Item["level"] === 300 && !req.body["organization"]) {
                                        req.body["organization"] = user_details.Item["organization"];
                                    }
                                    req.body["upload_file"] = base64File;
                                    req.body["data_filename"] = data_filename;
                                    req.body["selfie"] = base64Selfie;
                                    req.body["filename"] = selfie; 
                                    request.post({
                                        url: config.ComputeInstanceEndpoint + "generateSimulationForSensorData",
                                        json: req.body
                                    }, function (err, httpResponse, body) {
                                        if (err) {
                                            res.send({
                                                message: "failure",
                                                error: err
                                            })
                                        }
                                        else {
                                            if (httpResponse.body.image_url) {
                                                let body = '<!DOCTYPE html>\
                                                    <html>\
                                                    <body>';
                                                let counter = 0;                                                
                                                httpResponse.body.image_url.forEach((url, m) => {
                                                    counter++;
                                                    body += '<iframe src=\'' + url + '\' width=\'100%\' height=\'500px\'></iframe>';
                                                    if (counter == httpResponse.body.image_url.length) {
                                                        body += '</body>\
                                                                </html>';
                                                        //res.send(body);
                                                        res.send({
                                                            message: "success",
                                                            data: body
                                                        })
                                                    }
                                                })
                                            } else {
                                                res.send(httpResponse.body);
                                            }
                                        }
                                    })
                                } else {
                                    res.send({
                                        message: "failure",
                                        error: 'User is not sensor company.'
                                    })
                                }
                            }
                        })
                    }
                })
                }
            })
        }
    }).catch(err=>{
        console.log('err==============\n',err)
        res.send({
            message: "failure",
            error: 'Internal server error.'
        })
    })
})

app.post(`${apiPrefix}getAllSensorBrandsList`, (req,res) =>{
    getAllSensorBrands()
    .then(list => {
        var brandList = list.filter(function (brand) {
            return (!("brandList" in brand));
        });
        res.send({
            message: "success",
            data: brandList
        })
    }).catch(err => {
        res.send({
            message: "failure",
            error: err
        })
    })
})

app.post(`${apiPrefix}getAllSensorBrands`, (req,res) =>{
    getAllSensorBrands()
    .then(list => {
        var brandList = list.filter(function (brand) {
            return (!("brandList" in brand));
        });

        let counter = 0;
        if (brandList.length == 0) {
            res.send({
                message: "success",
                data: []
            })
        } else {
            brandList.forEach(function (brand, index) {
                let data = brand;
                let i = index;
                getBrandData({ sensor: data.sensor })
                    .then(simulation_records => {
                        
                        brand["simulation_count"] = Number(simulation_records.length).toString();
                        brand["simulation_status"] = '';
                        brand["computed_time"] = '';
                        brand["simulation_timestamp"] = '';

                        simulation_records.forEach(function (simulation_record, index) {
                            simulation_record['date_time'] = simulation_record.player_id.split('$')[1];
                        })

                        simulation_records.sort(function (b, a) {
                            var keyA = a.date_time,
                                keyB = b.date_time;
                            if (keyA < keyB) return -1;
                            if (keyA > keyB) return 1;
                            return 0;
                        });
                                                        
                        if (simulation_records.length > 0) {

                            console.log('simulation_records ---------------------------------\n',simulation_records)
                            getPlayerSimulationStatus(simulation_records[0].image_id)
                            .then(simulation => {
                                
                                brand["simulation_status"] = simulation ? simulation.status : '';
                                brand["computed_time"] = simulation ? simulation.computed_time : '';
                                brand["simulation_timestamp"] = simulation_records[0].player_id.split('$')[1];
                                counter++;
                                if (counter == brandList.length) {
                                    res.send({
                                        message: "success",
                                        data: brandList
                                    })
                                }
                            }).catch(err => {
                                console.log('err', err);
                            })
                        } else {
                            counter++;
                            if (counter == brandList.length) {
                                res.send({
                                    message: "success",
                                    data: brandList
                                })
                            }
                        }
                    })
                    .catch(err => {
                        counter++
                        if (counter == brandList.length) {
                            res.send({
                                message: "failure",
                                error: err
                            })
                        }
                    })
            })
        }
    })
    .catch(err => {
        res.send({
            message: "failure",
            error: err
        })
    })
})

app.post(`${apiPrefix}getAllOrganizationsOfSensorBrandList`, (req,res) =>{
    getAllOrganizationsOfSensorBrand(req.body)
    .then(list => {
        // console.log(list);
        let uniqueList = [];
        var orgList = list.filter(function (organization) {
            if (uniqueList.indexOf(organization.organization) === -1) {
                uniqueList.push(organization.organization);
                return organization;
            }
        });
        res.send({
            message: "success",
            data: orgList
        })
    })                                           
    .catch(err => {
        res.send({
            message: "failure",
            error: err
        })
    })
})

app.post(`${apiPrefix}getAllOrganizationsOfSensorBrand`, (req,res) =>{
    getAllOrganizationsOfSensorBrand(req.body)
        .then(list => {
            // console.log(list);
            let uniqueList = [];
            var orgList = list.filter(function (organization) {
                if (uniqueList.indexOf(organization.organization) === -1) {
                    uniqueList.push(organization.organization);
                    return organization;
                }
            });

            let counter = 0;
            if (orgList.length == 0) {
                res.send({
                    message: "success",
                    data: []
                })
            } else {
                orgList.forEach(function (org, index) {
                    let data = org;
                    let i = index;
                    getBrandOrganizationData2({ sensor: data.sensor, organization: data.organization })
                        .then(simulation_records => {
                            
                            org["simulation_count"] = Number(simulation_records.length).toString();
                            org["simulation_status"] = '';
                            org["computed_time"] = '';
                            org["simulation_timestamp"] = '';

                            simulation_records.forEach(function (simulation_record, index) {
                                simulation_record['date_time'] = simulation_record.player_id.split('$')[1];
                            })

                            simulation_records.sort(function (b, a) {
                                var keyA = a.date_time,
                                    keyB = b.date_time;
                                if (keyA < keyB) return -1;
                                if (keyA > keyB) return 1;
                                return 0;
                            });
                            
                            if (simulation_records.length > 0) {
                                getPlayerSimulationStatus(simulation_records[0].image_id)
                                    .then(simulation => {
                                        org["simulation_status"] = simulation ? simulation.status : '';
                                        org["computed_time"] = simulation ? simulation.computed_time : '';
                                        org["simulation_timestamp"] = simulation_records[0].player_id.split('$')[1];
                                        counter++;
                                        if (counter == orgList.length) {
                                            res.send({
                                                message: "success",
                                                data: orgList
                                            })
                                        }
                                    }).catch(err => {
                                        console.log('err',err);
                                    })
                            } else {
                                counter++;
                                if (counter == orgList.length) {
                                    res.send({
                                        message: "success",
                                        data: orgList
                                    })
                                }
                            }
                        })
                        .catch(err => {
                            counter++
                            if (counter == orgList.length) {
                                res.send({
                                    message: "failure",
                                    error: err
                                })
                            }
                        })
                })
            }
        })
})

app.post(`${apiPrefix}getAllteamsOfOrganizationOfSensorBrandList`, (req,res) =>{
    getAllTeamsOfOrganizationsOfSensorBrand(req.body)
    .then(list => {
        let uniqueList = [];
        var teamList = list.filter(function (team_name) {
            if (uniqueList.indexOf(team_name.team_name) === -1) {
                uniqueList.push(team_name.team_name);
                return team_name;
            }
        });
        res.send({
            message: "success",
            data: teamList
        })
    })
    .catch(err => {              
        res.send({
            message: "failure",
            error: err
        })
    })
                
})

app.post(`${apiPrefix}getAllteamsOfOrganizationOfSensorBrand`, (req,res) =>{
    getAllTeamsOfOrganizationsOfSensorBrand(req.body)
        .then(list => {
            // console.log(list);
            // let uniqueList = [];
            // var teamList = list.filter(function (team_name) {
            //     return (!("teamList" in team_name));
            // });
            let uniqueList = [];
            var teamList = list.filter(function (team_name) {
                if (uniqueList.indexOf(team_name.team_name) === -1) {
                    uniqueList.push(team_name.team_name);
                    return team_name;
                }
            });
            
            let counter = 0;
            if (teamList.length == 0) {
                res.send({
                    message: "success",
                    data: []
                })
            } else {
                teamList.forEach(function (team, index) {
                    let data = team;
                    let i = index;
                    getOrganizationTeamData({ sensor: data.sensor && req.body.brand ? data.sensor : false, organization: data.organization, team: data.team_name })
                        .then(simulation_records => {
                            
                            team["simulation_count"] = Number(simulation_records.length).toString();
                            team["simulation_status"] = '';
                            team["computed_time"] = '';
                            team["simulation_timestamp"] = '';

                            simulation_records.forEach(function (simulation_record, index) {
                                simulation_record['date_time'] = simulation_record.player_id.split('$')[1];
                            })

                            simulation_records.sort(function (b, a) {
                                var keyA = a.date_time,
                                    keyB = b.date_time;
                                if (keyA < keyB) return -1;
                                if (keyA > keyB) return 1;
                                return 0;
                            });
                            
                            if (simulation_records.length > 0) {
                                getPlayerSimulationStatus(simulation_records[0].image_id)
                                    .then(simulation => {
                                        team["simulation_status"] = simulation ? simulation.status : '';
                                        team["computed_time"] = simulation ? simulation.computed_time : '';
                                        team["simulation_timestamp"] = simulation_records[0].player_id.split('$')[1];
                                        counter++;
                                        if (counter == teamList.length) {
                                            res.send({
                                                message: "success",
                                                data: teamList
                                            })
                                        }
                                    }).catch(err => {
                                        console.log('err',err);
                                    })
                            } else {
                                counter++;
                                if (counter == teamList.length) {
                                    res.send({
                                        message: "success",
                                        data: teamList
                                    })
                                }
                            }
                        })
                        .catch(err => {
                            counter++
                            if (counter == teamList.length) {
                                res.send({
                                    message: "failure",
                                    error: err
                                })
                            }
                        })
                })
            }
        })
})

app.post(`${apiPrefix}updateUserStatus`, VerifyToken, (req, res) => {
    updateUserStatus(req.body)
        .then(data => {
            res.send({
                message: "success",
                data: data
            });
        })
        .catch(err => {
            res.send({
                message : "failure",
                error : err
            })
        })
});

app.post(`${apiPrefix}getTeamSpheres`, (req, res) => {
    console.log('req ----',req.body)
    let spharesData = [];
    let count_sp = 0;
    req.body.team.forEach(function (team_name, index) {
        getTeamSpheres({brand:req.body.brand, organization: req.body.organization, team: team_name})
        .then(data => {
            spharesData = spharesData.concat(data);
            count_sp++;
            if(count_sp == req.body.team.length){
                data = spharesData;
                console.log('data of team sphares -----\n',data)

                let brainRegions = {};
                let principal_max_strain = {};
                let principal_min_strain = {};
                let axonal_strain_max = {};
                let csdm_max = {};
                let masXsr_15_max = {};
                let MPS_95  = {};
                let CSDM_5  = {};
                let CSDM_10 = {};
                let CSDM_15 = {};
                let MPS_95_DATA = [];
                let MAX_ANGULAR_EXLARATION = [];



                if (data.length === 0){
                    brainRegions['principal-max-strain'] = {};
                    brainRegions['principal-min-strain'] = {};
                    brainRegions['axonal-strain-max'] = {};
                    brainRegions['csdm-max'] = {};
                    brainRegions['masXsr-15-max'] = {};
                    brainRegions['MPS-95'] = {};
                    brainRegions['CSDM-5'] = {};
                    brainRegions['CSDM-10'] = {};
                    brainRegions['CSDM-15'] = {};

                    res.send({
                        message: "success",
                        brainRegions: brainRegions,
                        MPS_95_DATA: MPS_95_DATA,
                        MAX_ANGULAR_EXLARATION: MAX_ANGULAR_EXLARATION,
                    })
                }

                let players = [];
                const processData = data.map(acc_data => {
                    return new Promise((resolve, reject) => {
                        let player_id = acc_data.player_id.split('$')[0];
                        if (!players.includes(player_id)) {
                            players.push(player_id);
                            getPlayerSimulationStatus(acc_data.image_id)
                                .then(imageData => {
                                    if (imageData && imageData.player_name && imageData.player_name != 'null') {
                                        console.log(imageData.player_name + '/simulation/summary.json');
                                        let file_path = imageData.player_name + '/simulation/summary.json';
                                        return getFileFromS3(file_path, imageData.bucket_name);
                                    }
                                })
                                .then(output_file => {
                                    if (output_file) {
                                        outputFile = JSON.parse(output_file.Body.toString('utf-8'));
                                        if (outputFile.Insults) {
                                            outputFile.Insults.forEach(function (summary_data, index) {
                                                pushdata(summary_data);
                                            })
                                        }
                                    }
                                    resolve(null);
                                })
                                .catch(err => {
                                    reject(err);
                                })
                        } else {
                            resolve(null);
                        }
                    })
                });

                const pushdata = (summary_data)=>{
                    if (summary_data['MPS-95']) {
                                                   
                        if(summary_data['MPS-95']['value'] && summary_data['max-angular-acc-rads2']){
                            MPS_95_DATA.push(summary_data['MPS-95']['value']);
                            MAX_ANGULAR_EXLARATION.push(summary_data['max-angular-acc-rads2']);
                        }
                    }
                }

                Promise.all(processData).then(resolveData => {
                    console.log('All executed');
                    brainRegions['principal-max-strain'] = principal_max_strain;
                    brainRegions['principal-min-strain'] = principal_min_strain;
                    brainRegions['axonal-strain-max'] = axonal_strain_max;
                    brainRegions['csdm-max'] = csdm_max;
                    brainRegions['masXsr-15-max'] = masXsr_15_max;
                    brainRegions['CSDM-5'] = CSDM_5;
                    brainRegions['CSDM-10'] = CSDM_10;
                    brainRegions['MPS-95'] = MPS_95;
                    
                    res.send({
                        message: "success",
                        brainRegions: brainRegions,
                        MPS_95_DATA: MPS_95_DATA,
                        MAX_ANGULAR_EXLARATION: MAX_ANGULAR_EXLARATION,
                    });
                });
            }
        }).catch(err => {
            res.send({
                message : "failure",
                error : err
            })
        }) 
    })

        
});

app.post(`${apiPrefix}getFilterdTeamSpheres`, (req, res) => {
    let filter = req.body.filter;
    let gs = parseInt(req.body.gs);
    let type = req.body.type;
    let sensor = req.body.brand;
    console.log('req body -------------------------------\n',req.body)
    /**
    * Get sphares of each team 
    */

    let spharesData = [];
    let count_sp = 0;
    req.body.team.forEach(function (team_name, index) {
        getTeamSpheres({brand:req.body.brand, organization: req.body.organization, team: team_name})
        .then(data => {
            spharesData = spharesData.concat(data);
            count_sp++;
            if(count_sp == req.body.team.length){
                data = spharesData;
                // console.log('data of team sphares -----\n',data)

                let brainRegions = {};
                let principal_max_strain = {};
                let principal_min_strain = {};
                let axonal_strain_max = {};
                let csdm_max = {};
                let masXsr_15_max = {};
                let MPS_95  = {};
                let CSDM_5  = {};
                let CSDM_10 = {};
                let CSDM_15 = {};

                if (data.length === 0){
                    brainRegions['principal-max-strain'] = {};
                    brainRegions['principal-min-strain'] = {};
                    brainRegions['axonal-strain-max'] = {};
                    brainRegions['csdm-max'] = {};
                    brainRegions['masXsr-15-max'] = {};
                    brainRegions['MPS-95'] = {};
                    brainRegions['CSDM-5'] = {};
                    brainRegions['CSDM-10'] = {};
                    brainRegions['CSDM-15'] = {};

                    res.send({
                        message: "success",
                        data: brainRegions
                    })
                }

                let players = [];
                const processData = data.map(acc_data => {
                    return new Promise((resolve, reject) => {
                        let player_id = acc_data.player_id.split('$')[0];
                        if (!players.includes(player_id)) {
                            players.push(player_id);
                            var newPlayerId = player_id+'-'+sensor;
                            if(newPlayerId){
                                console.log('player_id',newPlayerId)
                                getUserDetailByPlayerId(newPlayerId)
                                .then(userData => {
                                    var player_status = userData[0].player_status
                                    getPlayerSimulationStatus(acc_data.image_id)
                                    .then(imageData => {
                                        if (imageData && imageData.player_name && imageData.player_name != 'null') {
                                            // console.log('imageData',imageData);
                                            let file_path = imageData.player_name + '/simulation/summary.json';
                                            return getFileFromS3(file_path, imageData.bucket_name);
                                        }
                                    })
                                    .then(output_file => {
                                        if (output_file && player_status == 'approved') {
                                            outputFile = JSON.parse(output_file.Body.toString('utf-8'));
                                            if (outputFile.Insults) {
                                                outputFile.Insults.forEach(function (summary_data, index) {
                                                    //** 
                                                    //Fetch value is less then....
                                                    if(filter == 'less'){
                                                        if(type == 'resultant-Angular-acceleration'){
                                                            if(summary_data['max-angular-acc-rads2'] <= gs){
                                                                pushdata(summary_data);
                                                            }
                                                        }else if(type == 'resultant-linear-acceleration'){
                                                            if(summary_data['max-linear-acc-g'] <= gs){
                                                                pushdata(summary_data);
                                                            }  
                                                        }else if(type == 'principal-max-strain'){
                                                            if(summary_data['principal-max-strain'] && summary_data['principal-max-strain'].value <= gs){
                                                                pushdata(summary_data);
                                                            } 
                                                        }else if(type == 'principal-min-strain'){
                                                            if(summary_data['principal-min-strain'] && summary_data['principal-min-strain'].value <= gs){
                                                                pushdata(summary_data);
                                                            } 
                                                        }else if(type == 'csdm-max'){
                                                            if(summary_data['csdm-max'] && summary_data['csdm-max'].value <= gs){
                                                                pushdata(summary_data);
                                                            } 
                                                        }else if(type == 'axonal-strain-max'){
                                                            if(summary_data['axonal-strain-max'] && summary_data['axonal-strain-max'].value <= gs){
                                                                pushdata(summary_data);
                                                            } 
                                                        }else if(type == 'masXsr-15-max'){
                                                            if(summary_data['masXsr-15-max'] && summary_data['masXsr-15-max'].value <= gs){
                                                                pushdata(summary_data);
                                                            } 
                                                        }else if(type == 'CSDM-5'){
                                                            if(summary_data['CSDM-5'] && summary_data['CSDM-5'].value <= gs){
                                                                pushdata(summary_data);
                                                            } 
                                                        }else if(type == 'CSDM-10'){
                                                            if(summary_data['CSDM-10'] && summary_data['CSDM-10'].value <= gs){
                                                                pushdata(summary_data);
                                                            } 
                                                        }
                                                    //** 
                                                    //Fetch value is greater then.....   
                                                    }else{
                                                        if(type == 'resultant-Angular-acceleration'){
                                                            if(summary_data['max-angular-acc-rads2'] >= gs){
                                                               pushdata(summary_data);
                                                            }
                                                        }else if(type == 'resultant-linear-acceleration'){
                                                            if(summary_data['max-linear-acc-g'] >= gs){
                                                                pushdata(summary_data);
                                                            }
                                                        }else if(type == 'principal-max-strain'){
                                                            if(summary_data['principal-max-strain'] && summary_data['principal-max-strain'].value >= gs){
                                                                pushdata(summary_data);
                                                            } 
                                                        }else if(type == 'principal-min-strain'){
                                                            if(summary_data['principal-min-strain'] && summary_data['principal-min-strain'].value >= gs){
                                                                pushdata(summary_data);
                                                            } 
                                                        }else if(type == 'csdm-max'){
                                                            if(summary_data['csdm-max'] && summary_data['csdm-max'].value >= gs){
                                                                pushdata(summary_data);
                                                            } 
                                                        }else if(type == 'axonal-strain-max'){
                                                            if(summary_data['axonal-strain-max'] && summary_data['axonal-strain-max'].value >= gs){
                                                                pushdata(summary_data);
                                                            } 
                                                        }else if(type == 'masXsr-15-max'){
                                                            if(summary_data['masXsr-15-max'] && summary_data['masXsr-15-max'].value >= gs){
                                                                pushdata(summary_data);
                                                            } 
                                                        }else if(type == 'CSDM-5'){
                                                            if(summary_data['CSDM-5'] && summary_data['CSDM-5'].value >= gs){
                                                                pushdata(summary_data);
                                                            } 
                                                        }else if(type == 'CSDM-10'){
                                                            if(summary_data['CSDM-10'] && summary_data['CSDM-10'].value >= gs){
                                                                pushdata(summary_data);
                                                            } 
                                                        }else if(type == 'MPS-95'){
                                                            if(summary_data['MPS-95'] && summary_data['MPS-95'].value >= gs){
                                                                pushdata(summary_data);
                                                            } 
                                                        }
                                                    }
                                                })
                                            }
                                        }
                                        resolve(null);
                                    })
                                    .catch(err => {
                                        reject(err);
                                    })
                                    
                                }).catch(err => {
                                    reject(err);
                                })
                            }
                        } else {
                            resolve(null);
                        }
                    })
                });

                const pushdata = (summary_data)=>{
                    if (summary_data['principal-max-strain'] && summary_data['principal-max-strain']['brain-region']) {
                        let coordinate = {};
                        coordinate.x = summary_data['principal-max-strain'].location[0];
                        coordinate.y = summary_data['principal-max-strain'].location[1];
                        coordinate.z = summary_data['principal-max-strain'].location[2];
                        region = summary_data['principal-max-strain']['brain-region'].toLowerCase();
                        principal_max_strain[region] = principal_max_strain[region] || [];
                        principal_max_strain[region].push(coordinate);
                    }
                    if (summary_data['principal-min-strain'] && summary_data['principal-min-strain']['brain-region']) {
                        let coordinate = {};
                        coordinate.x = summary_data['principal-min-strain'].location[0];
                        coordinate.y = summary_data['principal-min-strain'].location[1];
                        coordinate.z = summary_data['principal-min-strain'].location[2];
                        region = summary_data['principal-min-strain']['brain-region'].toLowerCase();
                        principal_min_strain[region] = principal_min_strain[region] || [];
                        principal_min_strain[region].push(coordinate);
                    }
                    if (summary_data['axonal-strain-max']) {
                        let coordinate = {};
                        coordinate.x = summary_data['axonal-strain-max'].location[0];
                        coordinate.y = summary_data['axonal-strain-max'].location[1];
                        coordinate.z = summary_data['axonal-strain-max'].location[2];
                        region = summary_data['axonal-strain-max']['brain-region'].toLowerCase();
                        axonal_strain_max[region] = axonal_strain_max[region] || [];
                        axonal_strain_max[region].push(coordinate);
                    }
                    if (summary_data['csdm-max']) {
                        let coordinate = {};
                        coordinate.x = summary_data['csdm-max'].location[0];
                        coordinate.y = summary_data['csdm-max'].location[1];
                        coordinate.z = summary_data['csdm-max'].location[2];
                        region = summary_data['csdm-max']['brain-region'].toLowerCase();
                        csdm_max[region] = csdm_max[region] || [];
                        csdm_max[region].push(coordinate);
                    }
                    if (summary_data['masXsr-15-max']) {
                        let coordinate = {};
                        coordinate.x = summary_data['masXsr-15-max'].location[0];
                        coordinate.y = summary_data['masXsr-15-max'].location[1];
                        coordinate.z = summary_data['masXsr-15-max'].location[2];
                        region = summary_data['masXsr-15-max']['brain-region'].toLowerCase();
                        masXsr_15_max[region] = masXsr_15_max[region] || [];
                        masXsr_15_max[region].push(coordinate);
                    }
                    if (summary_data['CSDM-5']) {
                                                   
                        if(summary_data['CSDM-5']['frontal']){
                            var coordinate = {};
                            summary_data['CSDM-5']['frontal'].forEach(function (data, index) {
                                
                                coordinate.x = data[0];
                                coordinate.y = data[1];
                                coordinate.z = data[2];
                                region = 'frontal';
                                CSDM_5[region] = CSDM_5[region] || [];
                                CSDM_5[region].push(coordinate);
                            })
                        }
                        if(summary_data['CSDM-5']['parietal']){
                            var coordinate = {};
                            summary_data['CSDM-5']['parietal'].forEach(function (data, index) {
                                
                                coordinate.x = data[0];
                                coordinate.y = data[1];
                                coordinate.z = data[2];
                                region = 'parietal';
                                CSDM_5[region] = CSDM_5[region] || [];
                                CSDM_5[region].push(coordinate);
                            })
                        }
                        if(summary_data['CSDM-5']['msc']){
                            var coordinate = {};
                            summary_data['CSDM-5']['msc'].forEach(function (data, index) {
                                
                                coordinate.x = data[0];
                                coordinate.y = data[1];
                                coordinate.z = data[2];
                                region = 'msc';
                                CSDM_5[region] = CSDM_5[region] || [];
                                CSDM_5[region].push(coordinate);
                            })
                        }
                        if(summary_data['CSDM-5']['cerebellum']){
                            var coordinate = {};
                            summary_data['CSDM-5']['cerebellum'].forEach(function (data, index) {
                                
                                coordinate.x = data[0];
                                coordinate.y = data[1];
                                coordinate.z = data[2];
                                region = 'cerebellum';
                                CSDM_5[region] = CSDM_5[region] || [];
                                CSDM_5[region].push(coordinate);
                            })
                        }
                        if(summary_data['CSDM-5']['occipital']){
                            var coordinate = {};
                            summary_data['CSDM-5']['occipital'].forEach(function (data, index) {
                                
                                coordinate.x = data[0];
                                coordinate.y = data[1];
                                coordinate.z = data[2];
                                region = 'occipital';
                                CSDM_5[region] = CSDM_5[region] || [];
                                CSDM_5[region].push(coordinate);
                            })
                        }
                        if(summary_data['CSDM-5']['temporal']){
                            var coordinate = {};
                            summary_data['CSDM-5']['temporal'].forEach(function (data, index) {
                                
                                coordinate.x = data[0];
                                coordinate.y = data[1];
                                coordinate.z = data[2];
                                region = 'temporal';
                                CSDM_5[region] = CSDM_5[region] || [];
                                CSDM_5[region].push(coordinate);
                            })
                        }
                    }
                    if (summary_data['CSDM-10']) {
                                                   
                        if(summary_data['CSDM-10']['frontal']){
                            var coordinate = {};
                            summary_data['CSDM-10']['frontal'].forEach(function (data, index) {
                                
                                coordinate.x = data[0];
                                coordinate.y = data[1];
                                coordinate.z = data[2];
                                region = 'frontal';
                                CSDM_10[region] = CSDM_10[region] || [];
                                CSDM_10[region].push(coordinate);
                            })
                        }
                        if(summary_data['CSDM-10']['parietal']){
                            var coordinate = {};
                            summary_data['CSDM-10']['parietal'].forEach(function (data, index) {
                                
                                coordinate.x = data[0];
                                coordinate.y = data[1];
                                coordinate.z = data[2];
                                region = 'parietal';
                                CSDM_10[region] = CSDM_10[region] || [];
                                CSDM_10[region].push(coordinate);
                            })
                        }
                        if(summary_data['CSDM-10']['msc']){
                            var coordinate = {};
                            summary_data['CSDM-10']['msc'].forEach(function (data, index) {
                                
                                coordinate.x = data[0];
                                coordinate.y = data[1];
                                coordinate.z = data[2];
                                region = 'msc';
                                CSDM_10[region] = CSDM_10[region] || [];
                                CSDM_10[region].push(coordinate);
                            })
                        }
                        if(summary_data['CSDM-10']['cerebellum']){
                            var coordinate = {};
                            summary_data['CSDM-10']['cerebellum'].forEach(function (data, index) {
                                
                                coordinate.x = data[0];
                                coordinate.y = data[1];
                                coordinate.z = data[2];
                                region = 'cerebellum';
                                CSDM_10[region] = CSDM_10[region] || [];
                                CSDM_10[region].push(coordinate);
                            })
                        }
                        if(summary_data['CSDM-10']['occipital']){
                            var coordinate = {};
                            summary_data['CSDM-10']['occipital'].forEach(function (data, index) {
                                
                                coordinate.x = data[0];
                                coordinate.y = data[1];
                                coordinate.z = data[2];
                                region = 'occipital';
                                CSDM_10[region] = CSDM_10[region] || [];
                                CSDM_10[region].push(coordinate);
                            })
                        }
                        if(summary_data['CSDM-10']['temporal']){
                            var coordinate = {};
                            summary_data['CSDM-10']['temporal'].forEach(function (data, index) {
                                
                                coordinate.x = data[0];
                                coordinate.y = data[1];
                                coordinate.z = data[2];
                                region = 'temporal';
                                CSDM_10[region] = CSDM_10[region] || [];
                                CSDM_10[region].push(coordinate);
                            })
                        }
                    }if (summary_data['MPS-95']) {
                                                   
                        if(summary_data['MPS-95']['frontal']){
                            var coordinate = {};
                            summary_data['MPS-95']['frontal'].forEach(function (data, index) {
                                
                                coordinate.x = data[0];
                                coordinate.y = data[1];
                                coordinate.z = data[2];
                                region = 'frontal';
                                MPS_95[region] = MPS_95[region] || [];
                                MPS_95[region].push(coordinate);
                            })
                        }
                        if(summary_data['MPS-95']['parietal']){
                            var coordinate = {};
                            summary_data['MPS-95']['parietal'].forEach(function (data, index) {
                                
                                coordinate.x = data[0];
                                coordinate.y = data[1];
                                coordinate.z = data[2];
                                region = 'parietal';
                                MPS_95[region] = MPS_95[region] || [];
                                MPS_95[region].push(coordinate);
                            })
                        }
                        if(summary_data['MPS-95']['msc']){
                            var coordinate = {};
                            summary_data['MPS-95']['msc'].forEach(function (data, index) {
                                
                                coordinate.x = data[0];
                                coordinate.y = data[1];
                                coordinate.z = data[2];
                                region = 'msc';
                                MPS_95[region] = MPS_95[region] || [];
                                MPS_95[region].push(coordinate);
                            })
                        }
                        if(summary_data['MPS-95']['cerebellum']){
                            var coordinate = {};
                            summary_data['MPS-95']['cerebellum'].forEach(function (data, index) {
                                
                                coordinate.x = data[0];
                                coordinate.y = data[1];
                                coordinate.z = data[2];
                                region = 'cerebellum';
                                MPS_95[region] = MPS_95[region] || [];
                                MPS_95[region].push(coordinate);
                            })
                        }
                        if(summary_data['MPS-95']['occipital']){
                            var coordinate = {};
                            summary_data['MPS-95']['occipital'].forEach(function (data, index) {
                                
                                coordinate.x = data[0];
                                coordinate.y = data[1];
                                coordinate.z = data[2];
                                region = 'occipital';
                                MPS_95[region] = MPS_95[region] || [];
                                MPS_95[region].push(coordinate);
                            })
                        }
                        if(summary_data['MPS-95']['temporal']){
                            var coordinate = {};
                            summary_data['MPS-95']['temporal'].forEach(function (data, index) {
                                
                                coordinate.x = data[0];
                                coordinate.y = data[1];
                                coordinate.z = data[2];
                                region = 'temporal';
                                MPS_95[region] = MPS_95[region] || [];
                                MPS_95[region].push(coordinate);
                            })
                        }
                    }
                }

                Promise.all(processData).then(resolveData => {
                    console.log('All executed');
                    brainRegions['principal-max-strain'] = principal_max_strain;
                    brainRegions['principal-min-strain'] = principal_min_strain;
                    brainRegions['axonal-strain-max'] = axonal_strain_max;
                    brainRegions['csdm-max'] = csdm_max;
                    brainRegions['masXsr-15-max'] = masXsr_15_max;
                    brainRegions['CSDM-5'] = CSDM_5;
                    brainRegions['CSDM-10'] = CSDM_10;
                    brainRegions['MPS-95'] = MPS_95;
                    
                    res.send({
                        message: "success",
                        data: brainRegions
                    });
                });
            }
        }).catch(err => {
            res.send({
                message : "failure",
                error : err
            })
        }) 
    })

    /*getTeamSpheres(req.body)
        .then(data => {

            let brainRegions = {};
            let principal_max_strain = {};
            let principal_min_strain = {};
            let axonal_strain_max = {};
            let csdm_max = {};
            let masXsr_15_max = {};
            let MPS_95  = {};
            let CSDM_5  = {};
            let CSDM_10 = {};
            let CSDM_15 = {};

            if (data.length === 0){
                brainRegions['principal-max-strain'] = {};
                brainRegions['principal-min-strain'] = {};
                brainRegions['axonal-strain-max'] = {};
                brainRegions['csdm-max'] = {};
                brainRegions['masXsr-15-max'] = {};
                brainRegions['MPS-95'] = {};
                brainRegions['CSDM-5'] = {};
                brainRegions['CSDM-10'] = {};
                brainRegions['CSDM-15'] = {};

                res.send({
                    message: "success",
                    data: brainRegions
                })
            }

            let players = [];
            const processData = data.map(acc_data => {
                return new Promise((resolve, reject) => {
                    let player_id = acc_data.player_id.split('$')[0];
                    if (!players.includes(player_id)) {
                        players.push(player_id);
                        getPlayerSimulationStatus(acc_data.image_id)
                            .then(imageData => {
                                if (imageData && imageData.player_name && imageData.player_name != 'null') {
                                    console.log(imageData.player_name + '/simulation/summary.json');
                                    let file_path = imageData.player_name + '/simulation/summary.json';
                                    return getFileFromS3(file_path, imageData.bucket_name);
                                }
                            })
                            .then(output_file => {
                                if (output_file) {
                                    outputFile = JSON.parse(output_file.Body.toString('utf-8'));
                                    if (outputFile.Insults) {
                                        outputFile.Insults.forEach(function (summary_data, index) {
                                            //** 
                                            //Fetch value is less then....
                                            if(filter == 'less'){
                                                if(type == 'resultant-Angular-acceleration'){
                                                    if(summary_data['max-angular-acc-rads2'] <= gs){
                                                        pushdata(summary_data);
                                                    }
                                                }else if(type == 'resultant-linear-acceleration'){
                                                    if(summary_data['max-linear-acc-g'] <= gs){
                                                        pushdata(summary_data);
                                                    }  
                                                }else if(type == 'principal-max-strain'){
                                                    if(summary_data['principal-max-strain'] && summary_data['principal-max-strain'].value <= gs){
                                                        pushdata(summary_data);
                                                    } 
                                                }else if(type == 'principal-min-strain'){
                                                    if(summary_data['principal-min-strain'] && summary_data['principal-min-strain'].value <= gs){
                                                        pushdata(summary_data);
                                                    } 
                                                }else if(type == 'csdm-max'){
                                                    if(summary_data['csdm-max'] && summary_data['csdm-max'].value <= gs){
                                                        pushdata(summary_data);
                                                    } 
                                                }else if(type == 'axonal-strain-max'){
                                                    if(summary_data['axonal-strain-max'] && summary_data['axonal-strain-max'].value <= gs){
                                                        pushdata(summary_data);
                                                    } 
                                                }else if(type == 'masXsr-15-max'){
                                                    if(summary_data['masXsr-15-max'] && summary_data['masXsr-15-max'].value <= gs){
                                                        pushdata(summary_data);
                                                    } 
                                                }else if(type == 'CSDM-5'){
                                                    if(summary_data['CSDM-5'] && summary_data['CSDM-5'].value <= gs){
                                                        pushdata(summary_data);
                                                    } 
                                                }else if(type == 'CSDM-10'){
                                                    if(summary_data['CSDM-10'] && summary_data['CSDM-10'].value <= gs){
                                                        pushdata(summary_data);
                                                    } 
                                                }
                                            //** 
                                            //Fetch value is greater then.....   
                                            }else{
                                                if(type == 'resultant-Angular-acceleration'){
                                                    if(summary_data['max-angular-acc-rads2'] >= gs){
                                                       pushdata(summary_data);
                                                    }
                                                }else if(type == 'resultant-linear-acceleration'){
                                                    if(summary_data['max-linear-acc-g'] >= gs){
                                                        pushdata(summary_data);
                                                    }
                                                }else if(type == 'principal-max-strain'){
                                                    if(summary_data['principal-max-strain'] && summary_data['principal-max-strain'].value >= gs){
                                                        pushdata(summary_data);
                                                    } 
                                                }else if(type == 'principal-min-strain'){
                                                    if(summary_data['principal-min-strain'] && summary_data['principal-min-strain'].value >= gs){
                                                        pushdata(summary_data);
                                                    } 
                                                }else if(type == 'csdm-max'){
                                                    if(summary_data['csdm-max'] && summary_data['csdm-max'].value >= gs){
                                                        pushdata(summary_data);
                                                    } 
                                                }else if(type == 'axonal-strain-max'){
                                                    if(summary_data['axonal-strain-max'] && summary_data['axonal-strain-max'].value >= gs){
                                                        pushdata(summary_data);
                                                    } 
                                                }else if(type == 'masXsr-15-max'){
                                                    if(summary_data['masXsr-15-max'] && summary_data['masXsr-15-max'].value >= gs){
                                                        pushdata(summary_data);
                                                    } 
                                                }else if(type == 'CSDM-5'){
                                                    if(summary_data['CSDM-5'] && summary_data['CSDM-5'].value >= gs){
                                                        pushdata(summary_data);
                                                    } 
                                                }else if(type == 'CSDM-10'){
                                                    if(summary_data['CSDM-10'] && summary_data['CSDM-10'].value >= gs){
                                                        pushdata(summary_data);
                                                    } 
                                                }
                                            }
                                        })
                                    }
                                }
                                resolve(null);
                            })
                            .catch(err => {
                                reject(err);
                            })
                    } else {
                        resolve(null);
                    }
                })
            });

            const pushdata = (summary_data)=>{
                if (summary_data['principal-max-strain']) {
                    let coordinate = {};
                    coordinate.x = summary_data['principal-max-strain'].location[0];
                    coordinate.y = summary_data['principal-max-strain'].location[1];
                    coordinate.z = summary_data['principal-max-strain'].location[2];
                    region = summary_data['principal-max-strain']['brain-region'].toLowerCase();
                    principal_max_strain[region] = principal_max_strain[region] || [];
                    principal_max_strain[region].push(coordinate);
                }
                if (summary_data['principal-min-strain']) {
                    let coordinate = {};
                    coordinate.x = summary_data['principal-min-strain'].location[0];
                    coordinate.y = summary_data['principal-min-strain'].location[1];
                    coordinate.z = summary_data['principal-min-strain'].location[2];
                    region = summary_data['principal-min-strain']['brain-region'].toLowerCase();
                    principal_min_strain[region] = principal_min_strain[region] || [];
                    principal_min_strain[region].push(coordinate);
                }
                if (summary_data['axonal-strain-max']) {
                    let coordinate = {};
                    coordinate.x = summary_data['axonal-strain-max'].location[0];
                    coordinate.y = summary_data['axonal-strain-max'].location[1];
                    coordinate.z = summary_data['axonal-strain-max'].location[2];
                    region = summary_data['axonal-strain-max']['brain-region'].toLowerCase();
                    axonal_strain_max[region] = axonal_strain_max[region] || [];
                    axonal_strain_max[region].push(coordinate);
                }
                if (summary_data['csdm-max']) {
                    let coordinate = {};
                    coordinate.x = summary_data['csdm-max'].location[0];
                    coordinate.y = summary_data['csdm-max'].location[1];
                    coordinate.z = summary_data['csdm-max'].location[2];
                    region = summary_data['csdm-max']['brain-region'].toLowerCase();
                    csdm_max[region] = csdm_max[region] || [];
                    csdm_max[region].push(coordinate);
                }
                if (summary_data['masXsr-15-max']) {
                    let coordinate = {};
                    coordinate.x = summary_data['masXsr-15-max'].location[0];
                    coordinate.y = summary_data['masXsr-15-max'].location[1];
                    coordinate.z = summary_data['masXsr-15-max'].location[2];
                    region = summary_data['masXsr-15-max']['brain-region'].toLowerCase();
                    masXsr_15_max[region] = masXsr_15_max[region] || [];
                    masXsr_15_max[region].push(coordinate);
                }
                if (summary_data['CSDM-5']) {
                                               
                    if(summary_data['CSDM-5']['frontal']){
                        var coordinate = {};
                        summary_data['CSDM-5']['frontal'].forEach(function (data, index) {
                            
                            coordinate.x = data[0];
                            coordinate.y = data[1];
                            coordinate.z = data[2];
                            region = 'frontal';
                            CSDM_5[region] = CSDM_5[region] || [];
                            CSDM_5[region].push(coordinate);
                        })
                    }
                    if(summary_data['CSDM-5']['parietal']){
                        var coordinate = {};
                        summary_data['CSDM-5']['parietal'].forEach(function (data, index) {
                            
                            coordinate.x = data[0];
                            coordinate.y = data[1];
                            coordinate.z = data[2];
                            region = 'parietal';
                            CSDM_5[region] = CSDM_5[region] || [];
                            CSDM_5[region].push(coordinate);
                        })
                    }
                    if(summary_data['CSDM-5']['msc']){
                        var coordinate = {};
                        summary_data['CSDM-5']['msc'].forEach(function (data, index) {
                            
                            coordinate.x = data[0];
                            coordinate.y = data[1];
                            coordinate.z = data[2];
                            region = 'msc';
                            CSDM_5[region] = CSDM_5[region] || [];
                            CSDM_5[region].push(coordinate);
                        })
                    }
                    if(summary_data['CSDM-5']['cerebellum']){
                        var coordinate = {};
                        summary_data['CSDM-5']['cerebellum'].forEach(function (data, index) {
                            
                            coordinate.x = data[0];
                            coordinate.y = data[1];
                            coordinate.z = data[2];
                            region = 'cerebellum';
                            CSDM_5[region] = CSDM_5[region] || [];
                            CSDM_5[region].push(coordinate);
                        })
                    }
                    if(summary_data['CSDM-5']['occipital']){
                        var coordinate = {};
                        summary_data['CSDM-5']['occipital'].forEach(function (data, index) {
                            
                            coordinate.x = data[0];
                            coordinate.y = data[1];
                            coordinate.z = data[2];
                            region = 'occipital';
                            CSDM_5[region] = CSDM_5[region] || [];
                            CSDM_5[region].push(coordinate);
                        })
                    }
                    if(summary_data['CSDM-5']['temporal']){
                        var coordinate = {};
                        summary_data['CSDM-5']['temporal'].forEach(function (data, index) {
                            
                            coordinate.x = data[0];
                            coordinate.y = data[1];
                            coordinate.z = data[2];
                            region = 'temporal';
                            CSDM_5[region] = CSDM_5[region] || [];
                            CSDM_5[region].push(coordinate);
                        })
                    }
                }
                if (summary_data['CSDM-10']) {
                                               
                    if(summary_data['CSDM-10']['frontal']){
                        var coordinate = {};
                        summary_data['CSDM-10']['frontal'].forEach(function (data, index) {
                            
                            coordinate.x = data[0];
                            coordinate.y = data[1];
                            coordinate.z = data[2];
                            region = 'frontal';
                            CSDM_10[region] = CSDM_10[region] || [];
                            CSDM_10[region].push(coordinate);
                        })
                    }
                    if(summary_data['CSDM-10']['parietal']){
                        var coordinate = {};
                        summary_data['CSDM-10']['parietal'].forEach(function (data, index) {
                            
                            coordinate.x = data[0];
                            coordinate.y = data[1];
                            coordinate.z = data[2];
                            region = 'parietal';
                            CSDM_10[region] = CSDM_10[region] || [];
                            CSDM_10[region].push(coordinate);
                        })
                    }
                    if(summary_data['CSDM-10']['msc']){
                        var coordinate = {};
                        summary_data['CSDM-10']['msc'].forEach(function (data, index) {
                            
                            coordinate.x = data[0];
                            coordinate.y = data[1];
                            coordinate.z = data[2];
                            region = 'msc';
                            CSDM_10[region] = CSDM_10[region] || [];
                            CSDM_10[region].push(coordinate);
                        })
                    }
                    if(summary_data['CSDM-10']['cerebellum']){
                        var coordinate = {};
                        summary_data['CSDM-10']['cerebellum'].forEach(function (data, index) {
                            
                            coordinate.x = data[0];
                            coordinate.y = data[1];
                            coordinate.z = data[2];
                            region = 'cerebellum';
                            CSDM_10[region] = CSDM_10[region] || [];
                            CSDM_10[region].push(coordinate);
                        })
                    }
                    if(summary_data['CSDM-10']['occipital']){
                        var coordinate = {};
                        summary_data['CSDM-10']['occipital'].forEach(function (data, index) {
                            
                            coordinate.x = data[0];
                            coordinate.y = data[1];
                            coordinate.z = data[2];
                            region = 'occipital';
                            CSDM_10[region] = CSDM_10[region] || [];
                            CSDM_10[region].push(coordinate);
                        })
                    }
                    if(summary_data['CSDM-10']['temporal']){
                        var coordinate = {};
                        summary_data['CSDM-10']['temporal'].forEach(function (data, index) {
                            
                            coordinate.x = data[0];
                            coordinate.y = data[1];
                            coordinate.z = data[2];
                            region = 'temporal';
                            CSDM_10[region] = CSDM_10[region] || [];
                            CSDM_10[region].push(coordinate);
                        })
                    }
                }
            }

            Promise.all(processData).then(resolveData => {
                console.log('All executed');
                brainRegions['principal-max-strain'] = principal_max_strain;
                brainRegions['principal-min-strain'] = principal_min_strain;
                brainRegions['axonal-strain-max'] = axonal_strain_max;
                brainRegions['csdm-max'] = csdm_max;
                brainRegions['masXsr-15-max'] = masXsr_15_max;
                brainRegions['CSDM-5'] = CSDM_5;
                brainRegions['CSDM-10'] = CSDM_10;
                res.send({
                    message: "success",
                    data: brainRegions
                });
            });
        })
        .catch(err => {
            res.send({
                message : "failure",
                error : err
            })
        }) */
});

/**
*   Demo filter team shpares api start here...
*/

app.post(`${apiPrefix}getFilterdTeamSpheres_demo`, (req, res) => {
    console.log('body', req.body);
    let filter = req.body.filter;
    let gs = parseInt(req.body.gs);
    let type = req.body.type;

   
    //**
    let brainRegions = {};
    let principal_max_strain = {};
    let principal_min_strain = {};
    let axonal_strain_max = {};
    let csdm_max = {};
    let masXsr_15_max = {};
    let MPS_95  = {};
    let CSDM_5  = {};
    let CSDM_10 = {};
    let CSDM_15 = {};

    //Pushing data into array...
    const pushdata = (summary_data)=>{
        if (summary_data['principal-max-strain'] && summary_data['principal-max-strain']['brain-region']) {
            let coordinate = {};
            coordinate.x = summary_data['principal-max-strain'].location[0];
            coordinate.y = summary_data['principal-max-strain'].location[1];
            coordinate.z = summary_data['principal-max-strain'].location[2];
            region = summary_data['principal-max-strain']['brain-region'].toLowerCase();
            principal_max_strain[region] = principal_max_strain[region] || [];
            principal_max_strain[region].push(coordinate);
        }
        if (summary_data['principal-min-strain'] && summary_data['principal-min-strain']['brain-region']) {
            let coordinate = {};
            coordinate.x = summary_data['principal-min-strain'].location[0];
            coordinate.y = summary_data['principal-min-strain'].location[1];
            coordinate.z = summary_data['principal-min-strain'].location[2];
            region = summary_data['principal-min-strain']['brain-region'].toLowerCase();
            principal_min_strain[region] = principal_min_strain[region] || [];
            principal_min_strain[region].push(coordinate);
        }
        if (summary_data['axonal-strain-max']) {
            let coordinate = {};
            coordinate.x = summary_data['axonal-strain-max'].location[0];
            coordinate.y = summary_data['axonal-strain-max'].location[1];
            coordinate.z = summary_data['axonal-strain-max'].location[2];
            region = summary_data['axonal-strain-max']['brain-region'].toLowerCase();
            axonal_strain_max[region] = axonal_strain_max[region] || [];
            axonal_strain_max[region].push(coordinate);
        }
        if (summary_data['csdm-max']) {
            let coordinate = {};
            coordinate.x = summary_data['csdm-max'].location[0];
            coordinate.y = summary_data['csdm-max'].location[1];
            coordinate.z = summary_data['csdm-max'].location[2];
            region = summary_data['csdm-max']['brain-region'].toLowerCase();
            csdm_max[region] = csdm_max[region] || [];
            csdm_max[region].push(coordinate);
        }
        if (summary_data['masXsr-15-max']) {
            let coordinate = {};
            coordinate.x = summary_data['masXsr-15-max'].location[0];
            coordinate.y = summary_data['masXsr-15-max'].location[1];
            coordinate.z = summary_data['masXsr-15-max'].location[2];
            region = summary_data['masXsr-15-max']['brain-region'].toLowerCase();
            masXsr_15_max[region] = masXsr_15_max[region] || [];
            masXsr_15_max[region].push(coordinate);
        }
        if (summary_data['CSDM-5']) {
                                       
            if(summary_data['CSDM-5']['frontal']){
                var coordinate = {};
                summary_data['CSDM-5']['frontal'].forEach(function (data, index) {
                    
                    coordinate.x = data[0];
                    coordinate.y = data[1];
                    coordinate.z = data[2];
                    region = 'frontal';
                    CSDM_5[region] = CSDM_5[region] || [];
                    CSDM_5[region].push(coordinate);
                })
            }
            if(summary_data['CSDM-5']['parietal']){
                var coordinate = {};
                summary_data['CSDM-5']['parietal'].forEach(function (data, index) {
                    
                    coordinate.x = data[0];
                    coordinate.y = data[1];
                    coordinate.z = data[2];
                    region = 'parietal';
                    CSDM_5[region] = CSDM_5[region] || [];
                    CSDM_5[region].push(coordinate);
                })
            }
            if(summary_data['CSDM-5']['msc']){
                var coordinate = {};
                summary_data['CSDM-5']['msc'].forEach(function (data, index) {
                    
                    coordinate.x = data[0];
                    coordinate.y = data[1];
                    coordinate.z = data[2];
                    region = 'msc';
                    CSDM_5[region] = CSDM_5[region] || [];
                    CSDM_5[region].push(coordinate);
                })
            }
            if(summary_data['CSDM-5']['cerebellum']){
                var coordinate = {};
                summary_data['CSDM-5']['cerebellum'].forEach(function (data, index) {
                    
                    coordinate.x = data[0];
                    coordinate.y = data[1];
                    coordinate.z = data[2];
                    region = 'cerebellum';
                    CSDM_5[region] = CSDM_5[region] || [];
                    CSDM_5[region].push(coordinate);
                })
            }
            if(summary_data['CSDM-5']['occipital']){
                var coordinate = {};
                summary_data['CSDM-5']['occipital'].forEach(function (data, index) {
                    
                    coordinate.x = data[0];
                    coordinate.y = data[1];
                    coordinate.z = data[2];
                    region = 'occipital';
                    CSDM_5[region] = CSDM_5[region] || [];
                    CSDM_5[region].push(coordinate);
                })
            }
            if(summary_data['CSDM-5']['temporal']){
                var coordinate = {};
                summary_data['CSDM-5']['temporal'].forEach(function (data, index) {
                    
                    coordinate.x = data[0];
                    coordinate.y = data[1];
                    coordinate.z = data[2];
                    region = 'temporal';
                    CSDM_5[region] = CSDM_5[region] || [];
                    CSDM_5[region].push(coordinate);
                })
            }
        }
        if (summary_data['CSDM-10']) {
                                       
            if(summary_data['CSDM-10']['frontal']){
                var coordinate = {};
                summary_data['CSDM-10']['frontal'].forEach(function (data, index) {
                    
                    coordinate.x = data[0];
                    coordinate.y = data[1];
                    coordinate.z = data[2];
                    region = 'frontal';
                    CSDM_10[region] = CSDM_10[region] || [];
                    CSDM_10[region].push(coordinate);
                })
            }
            if(summary_data['CSDM-10']['parietal']){
                var coordinate = {};
                summary_data['CSDM-10']['parietal'].forEach(function (data, index) {
                    
                    coordinate.x = data[0];
                    coordinate.y = data[1];
                    coordinate.z = data[2];
                    region = 'parietal';
                    CSDM_10[region] = CSDM_10[region] || [];
                    CSDM_10[region].push(coordinate);
                })
            }
            if(summary_data['CSDM-10']['msc']){
                var coordinate = {};
                summary_data['CSDM-10']['msc'].forEach(function (data, index) {
                    
                    coordinate.x = data[0];
                    coordinate.y = data[1];
                    coordinate.z = data[2];
                    region = 'msc';
                    CSDM_10[region] = CSDM_10[region] || [];
                    CSDM_10[region].push(coordinate);
                })
            }
            if(summary_data['CSDM-10']['cerebellum']){
                var coordinate = {};
                summary_data['CSDM-10']['cerebellum'].forEach(function (data, index) {
                    
                    coordinate.x = data[0];
                    coordinate.y = data[1];
                    coordinate.z = data[2];
                    region = 'cerebellum';
                    CSDM_10[region] = CSDM_10[region] || [];
                    CSDM_10[region].push(coordinate);
                })
            }
            if(summary_data['CSDM-10']['occipital']){
                var coordinate = {};
                summary_data['CSDM-10']['occipital'].forEach(function (data, index) {
                    
                    coordinate.x = data[0];
                    coordinate.y = data[1];
                    coordinate.z = data[2];
                    region = 'occipital';
                    CSDM_10[region] = CSDM_10[region] || [];
                    CSDM_10[region].push(coordinate);
                })
            }
            if(summary_data['CSDM-10']['temporal']){
                var coordinate = {};
                summary_data['CSDM-10']['temporal'].forEach(function (data, index) {
                    
                    coordinate.x = data[0];
                    coordinate.y = data[1];
                    coordinate.z = data[2];
                    region = 'temporal';
                    CSDM_10[region] = CSDM_10[region] || [];
                    CSDM_10[region].push(coordinate);
                })
            }
        }if (summary_data['MPS-95']) {
                                       
            if(summary_data['MPS-95']['frontal']){
                var coordinate = {};
                summary_data['MPS-95']['frontal'].forEach(function (data, index) {
                    
                    coordinate.x = data[0];
                    coordinate.y = data[1];
                    coordinate.z = data[2];
                    region = 'frontal';
                    MPS_95[region] = MPS_95[region] || [];
                    MPS_95[region].push(coordinate);
                })
            }
            if(summary_data['MPS-95']['parietal']){
                var coordinate = {};
                summary_data['MPS-95']['parietal'].forEach(function (data, index) {
                    
                    coordinate.x = data[0];
                    coordinate.y = data[1];
                    coordinate.z = data[2];
                    region = 'parietal';
                    MPS_95[region] = MPS_95[region] || [];
                    MPS_95[region].push(coordinate);
                })
            }
            if(summary_data['MPS-95']['msc']){
                var coordinate = {};
                summary_data['MPS-95']['msc'].forEach(function (data, index) {
                    
                    coordinate.x = data[0];
                    coordinate.y = data[1];
                    coordinate.z = data[2];
                    region = 'msc';
                    MPS_95[region] = MPS_95[region] || [];
                    MPS_95[region].push(coordinate);
                })
            }
            if(summary_data['MPS-95']['cerebellum']){
                var coordinate = {};
                summary_data['MPS-95']['cerebellum'].forEach(function (data, index) {
                    
                    coordinate.x = data[0];
                    coordinate.y = data[1];
                    coordinate.z = data[2];
                    region = 'cerebellum';
                    MPS_95[region] = MPS_95[region] || [];
                    MPS_95[region].push(coordinate);
                })
            }
            if(summary_data['MPS-95']['occipital']){
                var coordinate = {};
                summary_data['MPS-95']['occipital'].forEach(function (data, index) {
                    
                    coordinate.x = data[0];
                    coordinate.y = data[1];
                    coordinate.z = data[2];
                    region = 'occipital';
                    MPS_95[region] = MPS_95[region] || [];
                    MPS_95[region].push(coordinate);
                })
            }
            if(summary_data['MPS-95']['temporal']){
                var coordinate = {};
                summary_data['MPS-95']['temporal'].forEach(function (data, index) {
                    
                    coordinate.x = data[0];
                    coordinate.y = data[1];
                    coordinate.z = data[2];
                    region = 'temporal';
                    MPS_95[region] = MPS_95[region] || [];
                    MPS_95[region].push(coordinate);
                })
            }
        }
    }

    //Reading summary.json file...
    let summaryFile = fs.readFileSync('summary_demo.json');//file location ./summary_demo.json
    let outputFile = JSON.parse(summaryFile);
    var len = outputFile.Insults.length - 1;
    if (outputFile.Insults) {
        outputFile.Insults.forEach(function (summary_data, index) {
            //** 
            //Fetch value is less then....
            if(filter == 'less'){
                if(type == 'resultant-Angular-acceleration'){
                    if(summary_data['max-angular-acc-rads2'] <= gs){
                        pushdata(summary_data); 
                    }   
                }else if(type == 'resultant-linear-acceleration'){
                    if(summary_data['max-linear-acc-g'] <= gs){
                        pushdata(summary_data);
                    }  
                }else if(type == 'principal-max-strain'){
                    if(summary_data['principal-max-strain'] && summary_data['principal-max-strain'].value <= gs){
                        pushdata(summary_data);
                    } 
                }else if(type == 'principal-min-strain'){
                    if(summary_data['principal-min-strain'] && summary_data['principal-min-strain'].value <= gs){
                        pushdata(summary_data);
                    } 
                }else if(type == 'csdm-max'){
                    if(summary_data['csdm-max'] && summary_data['csdm-max'].value <= gs){
                        pushdata(summary_data);
                    } 
                }else if(type == 'axonal-strain-max'){
                    if(summary_data['axonal-strain-max'] && summary_data['axonal-strain-max'].value <= gs){
                        pushdata(summary_data);
                    } 
                }else if(type == 'masXsr-15-max'){
                    if(summary_data['masXsr-15-max'] && summary_data['masXsr-15-max'].value <= gs){
                        pushdata(summary_data);
                    } 
                }else if(type == 'CSDM-5'){
                    if(summary_data['CSDM-5'] && summary_data['CSDM-5'].value <= gs){
                        pushdata(summary_data);
                    } 
                }else if(type == 'CSDM-10'){
                    if(summary_data['CSDM-10'] && summary_data['CSDM-10'].value <= gs){
                        pushdata(summary_data);
                    } 
                }
            //** 
            //Fetch value is greater then.....   
            }else{
                if(type == 'resultant-Angular-acceleration'){
                    if(summary_data['max-angular-acc-rads2'] >= gs){
                       pushdata(summary_data);
                    }
                }else if(type == 'resultant-linear-acceleration'){
                    if(summary_data['max-linear-acc-g'] >= gs){
                        pushdata(summary_data);
                    }
                }else if(type == 'principal-max-strain'){
                    if(summary_data['principal-max-strain'] && summary_data['principal-max-strain'].value >= gs){
                        pushdata(summary_data);
                    } 
                }else if(type == 'principal-min-strain'){
                    if(summary_data['principal-min-strain'] && summary_data['principal-min-strain'].value >= gs){
                        pushdata(summary_data);
                    } 
                }else if(type == 'csdm-max'){
                    if(summary_data['csdm-max'] && summary_data['csdm-max'].value >= gs){
                        pushdata(summary_data);
                    } 
                }else if(type == 'axonal-strain-max'){
                    if(summary_data['axonal-strain-max'] && summary_data['axonal-strain-max'].value >= gs){
                        pushdata(summary_data);
                    } 
                }else if(type == 'masXsr-15-max'){
                    if(summary_data['masXsr-15-max'] && summary_data['masXsr-15-max'].value >= gs){
                        pushdata(summary_data);
                    } 
                }else if(type == 'CSDM-5'){
                    if(summary_data['CSDM-5'] && summary_data['CSDM-5'].value >= gs){
                        pushdata(summary_data);
                    } 
                }else if(type == 'CSDM-10'){
                    if(summary_data['CSDM-10'] && summary_data['CSDM-10'].value >= gs){
                        pushdata(summary_data);
                    } 
                }else if(type == 'MPS-95'){
                    if(summary_data['MPS-95'] && summary_data['MPS-95'].value >= gs){
                        pushdata(summary_data);
                    } 
                }
            }

            //Sending response on foreach loop completing...
            if(len === index){
                setTimeout(()=>{
                    brainRegions['principal-max-strain'] = principal_max_strain;
                    brainRegions['principal-min-strain'] = principal_min_strain;
                    brainRegions['axonal-strain-max'] = axonal_strain_max;
                    brainRegions['csdm-max'] = csdm_max;
                    brainRegions['masXsr-15-max'] = masXsr_15_max;
                    brainRegions['CSDM-5'] = CSDM_5;
                    brainRegions['CSDM-10'] = CSDM_10;
                    brainRegions['MPS-95'] = MPS_95;
                    
                    res.send({
                        message: "success",
                        data: brainRegions
                    });
                },1000)
            }
        })
    }

    
   
})


//Getting team shares data for mps 95% mps chart...
app.post(`${apiPrefix}getTeamSpheres_Demo`, (req, res) => {
    let brainRegions = {};
    let principal_max_strain = {};
    let principal_min_strain = {};
    let axonal_strain_max = {};
    let csdm_max = {};
    let masXsr_15_max = {};
    let MPS_95  = {};
    let CSDM_5  = {};
    let CSDM_10 = {};
    let CSDM_15 = {};
    let MPS_95_DATA = [];
    let MAX_ANGULAR_EXLARATION = [];

    let players = [];
    //Reading summary.json file...
    let summaryFile = fs.readFileSync('summary_demo.json');//file location ./summary_demo.json
    let outputFile = JSON.parse(summaryFile);
    var len = outputFile.Insults.length - 1;
    const pushdata = (summary_data)=>{
        if (summary_data['MPS-95']) {
                                       
            if(summary_data['MPS-95']['value'] && summary_data['max-angular-acc-rads2']){
                MPS_95_DATA.push(summary_data['MPS-95']['value']);
                MAX_ANGULAR_EXLARATION.push(summary_data['max-angular-acc-rads2']);
            }
        }
    }

    if (outputFile.Insults) {
        outputFile.Insults.forEach(function (summary_data, index) {
            pushdata(summary_data);
            if(len === index){
                setTimeout(()=>{
                    brainRegions['principal-max-strain'] = principal_max_strain;
                    brainRegions['principal-min-strain'] = principal_min_strain;
                    brainRegions['axonal-strain-max'] = axonal_strain_max;
                    brainRegions['csdm-max'] = csdm_max;
                    brainRegions['masXsr-15-max'] = masXsr_15_max;
                    brainRegions['CSDM-5'] = CSDM_5;
                    brainRegions['CSDM-10'] = CSDM_10;
                    brainRegions['MPS-95'] = MPS_95;
                    
                    res.send({
                        message: "success",
                        brainRegions: brainRegions,
                        MPS_95_DATA: MPS_95_DATA,
                        MAX_ANGULAR_EXLARATION: MAX_ANGULAR_EXLARATION,
                    });
                },1000)
            }
        })
    }
   
        
});

/**
*Getting modal validation output...
*/
app.post(`${apiPrefix}modalValidationOutput`, (req, res) => {
    console.log('modalValidationOutput')
    let image_id = "ngkCxmTbR";
    let staticPath = 'HardyExperimentalData_C288T3/';
    let json_data = '';
    let newDisplacementData = {
        time_x_0: [],
        dis_x_0: [],
        time_y_0: [],
        dis_y_0: [],
        time_z_0: [],
        dis_z_0: [],

        time_x_1: [],
        dis_x_1: [],
        time_y_1: [],
        dis_y_1: [],
        time_z_1: [],
        dis_z_1: [],

        time_x_2: [],
        dis_x_2: [],
        time_y_2: [],
        dis_y_2: [],
        time_z_2: [],
        dis_z_2: [],

        time_x_3: [],
        dis_x_3: [],
        time_y_3: [],
        dis_y_3: [],
        time_z_3: [],
        dis_z_3: [],

        time_x_4: [],
        dis_x_4: [],
        time_y_4: [],
        dis_y_4: [],
        time_z_4: [],
        dis_z_4: [],

        time_x_5: [],
        dis_x_5: [],
        time_y_5: [],
        dis_y_5: [],
        time_z_5: [],
        dis_z_5: [],

        time_x_6: [],
        dis_x_6: [],
        time_y_6: [],
        dis_y_6: [],
        time_z_6: [],
        dis_z_6: [],

        time_x_7: [],
        dis_x_7: [],
        time_y_7: [],
        dis_y_7: [],
        time_z_7: [],
        dis_z_7: [],

        time_x_8: [],
        dis_x_8: [],
        time_y_8: [],
        dis_y_8: [],
        time_z_8: [],
        dis_z_8: [],

        time_x_9: [],
        dis_x_9: [],
        time_y_9: [],
        dis_y_9: [],
        time_z_9: [],
        dis_z_9: [],

        time_x_10: [],
        dis_x_10: [],
        time_y_10: [],
        dis_y_10: [],
        time_z_10: [],
        dis_z_10: [],

        time_x_11: [],
        dis_x_11: [],
        time_y_11: [],
        dis_y_11: [],
        time_z_11: [],
        dis_z_11: [],

        time_x_12: [],
        dis_x_12: [],
        time_y_12: [],
        dis_y_12: [],
        time_z_12: [],
        dis_z_12: [],

        time_x_13: [],
        dis_x_13: [],
        time_y_13: [],
        dis_y_13: [],
        time_z_13: [],
        dis_z_13: [],
    }
    getModalValidationDB(image_id)
    .then(response =>{
        console.log('response',staticPath)
        if(staticPath){
            let file_path = staticPath+image_id+'_output.json';
            let file_pathHardyExperimentalData = staticPath+'HardyExperimentalData_C288T3.json';
            getFileFromS3(file_pathHardyExperimentalData, config_env.usersbucket)
            .then(buffData=>{
                json_data = JSON.parse(buffData.Body.toString('utf-8'));
                // console.log('buffData',json_data)
                return getFileFromS3(file_path, config_env.usersbucket);
            })
            .then(data=>{
                if(json_data){
                    for (var i = 0; i < json_data.length  ; i++) {
                        // json_data[i]
                         console.log(i)
                        for (var j = 0; j < 14; j++) {
                            if(json_data[i] && json_data[i]['dis_x_'+j] != null){
                               // console.log(json_data[i]['time_x_'+j] )
                                newDisplacementData['time_x_'+j].push(json_data[i]['time_x_'+j]);
                                newDisplacementData['dis_x_'+j].push(json_data[i]['dis_x_'+j]);
                            }

                            if(json_data[i] && json_data[i]['dis_y_'+j] != null){
                               // console.log(json_data[i]['time_x_'+j] )
                                newDisplacementData['time_y_'+j].push(json_data[i]['time_y_'+j]);
                                newDisplacementData['dis_y_'+j].push(json_data[i]['dis_y_'+j]);
                            }

                            if(json_data[i] && json_data[i]['dis_z_'+j] != null){
                               // console.log(json_data[i]['time_x_'+j] )
                                newDisplacementData['time_z_'+j].push(json_data[i]['time_z_'+j]);
                                newDisplacementData['dis_z_'+j].push(json_data[i]['dis_z_'+j]);
                            }
                        }
                    }
                }
                if(data.Body){
                    var file = JSON.parse(data.Body.toString('utf-8'));
                    // console.log('data',file);
                    res.send({
                        status: 'success',
                        data: file.plot,
                        data_2: newDisplacementData
                    })
                }else{
                    res.send({
                        status: 'faiure',
                        message: 'File not found.',
                    })
                }
                
            }).catch(error=>{
                console.log('error froms s3',error)
                res.send({
                    status: 'faiure',
                    message: 'Failed to fetch output file.',
                })
            })

        }
    }).catch(err=>{
        res.send({
            status: 'faiure',
            message: 'Failed to fetch output file.',
        })
        console.log('error when fetching -\n',err)
    })
})

/*-- Demo api end --*/

app.post(`${apiPrefix}getSimulationDetail`, (req, res) => {
    let jsonOutputFile = '';
    let simulationImage = '';
    let simulationData = '';
    let machinLearningImage = '';
    getSimulationImageRecord(req.body.image_id)
        .then(simulation_data => {
            simulationData = simulation_data;
            if (simulationData.path && simulationData.path != 'null') {
                return getFileFromS3(simulationData.path, simulationData.bucket_name);
            } else {
                if (simulationData.root_path && simulationData.root_path != 'null') {
                    let image_path = simulationData.root_path + simulationData.image_id + '.png';
                    return getFileFromS3(image_path, simulationData.bucket_name);
                }
            }
        })
        .then(image_s3 => {
            if (image_s3) {
                return getImageFromS3Buffer(image_s3);
            }
        })
        .then(image => {
            simulationImage = image;

            if (simulationData.root_path && simulationData.root_path != 'null') {
                let image_path = simulationData.root_path + simulationData.image_id + '_ML.png';
                return getFileFromS3(image_path, simulationData.bucket_name);
            }else{
                return false;
            }
            
        }).then(image_s3 => {
            if (image_s3) {
                return getImageFromS3Buffer(image_s3);
            }else{
                return false;
            }
        }).then(ml_image => {
            machinLearningImage = ml_image || '';
            if (simulationData.ouput_file_path && simulationData.ouput_file_path != 'null') {
                let file_path = simulationData.ouput_file_path;
                file_path = file_path.replace(/'/g, "");
                return getFileFromS3(file_path, simulationData.bucket_name);
            } else {
                if (simulationData.root_path && simulationData.root_path != 'null') {
                    let summary_path = simulationData.root_path + simulationData.image_id + '_output.json';
                    summary_path = summary_path.replace(/'/g, "");
                    console.log('summary_path',summary_path)
                    return getFileFromS3(summary_path, simulationData.bucket_name);
                }
            }
        })
        .then(json_output_file => {
            if (json_output_file){
                jsonOutputFile = JSON.parse(json_output_file.Body.toString('utf-8'));
            }

            res.send({
                message: "success",
                data: {simulationImage: simulationImage, jsonOutputFile: jsonOutputFile, machinLearningImage: machinLearningImage},
            })
        }) 
        .catch(err => {
            res.send({
                message : "failure",
                error : err
            })
        })  
})



// Clearing the cookies
app.post(`${apiPrefix}logOut`, (req, res) => {
    res.cookie("token", "");
    res.send({
        message: "success"
    });
})
const port = process.env.PORT || 3001;
// Configuring port for APP
server.listen(port, () => console.log(`Listening on port ${port}`))