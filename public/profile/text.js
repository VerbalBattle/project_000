var fs = require('fs');
var db = require('./dbconn');

var getProfile = function(id, callback) {
	//gets us username, and all of his persoal data plus his profile image -> wallposts + comments and likes
	//
   var profileJson = {};

	db.query("select * from users where userID=?", id, function(err, result) {
		if(err) {
			throw err;
		}
		json.userdata = result;

		db.query("select * from images where userID = ?? and imageProfile = 1", id, function(err, result) {
			profileJson.imageDescription  = result.descrition;

			var imagePath = profileJson.imagePath;

			fs.readFile(id+'/images/'+imagePath, 'utf8', function (err,data) {

            if (err) {
              profileJson.imageSrc = "failed to load resources";
              callback(profileJson);
            return;
           }
             profileJson.imageSrc = data;
             callback(profileJson);

            });
		})
	})
};


var getUserPosts = function(id) {

	return new Promise(function(reject, resolve) {

	db.query("select * from wallposts where userID = ?", id, function (err, result) {
		if(err) {
			reject(err);
		}
		resolve(result);
	})
})

};


var getAlbumPictures = function(id, callback) {
	var Images = {};
	Images.imagesArray = [];

	db.query("select imagePath from images where imageID in(select imageID from albums where albumID = ??)", id, function(err, result) {
         //getting back an array of image sources
         //looping through all the images to get the files from the filesystem

         for(var i = 0; i<result.length; i++){

			fs.readFile('/images/'+result[i], 'utf8', function (err,data) {

            if (err) {
             
             throw err;
            return;
           }
           //pushing sourece for image in array 
           //maybe to unefficietnt??
            Images.imagesArray.push(data);
         }
         //returns an object with an array of all the images if an album
         callback(Images)
      

	})
};

var getMoreVideos = function (startid, callback) {
    var json = {};
	db.query("select content, sender from post where id >=??", startid, function(err, result) {

		json.currentStartIndex = startid;
		//incrementer sent back so that when getting more data it know where to start
		json.newPosts = result;

		callback(json);


	})

};


var updateUser = function (userID, data) {
     
     return new Promise(function(reject, resolve) {

     	db.query("update users set?? where userID = ?", ({username:data.username, school}), userID, function (err, result) {

     		if(err) {
     			reject(err);
     		}
     		resolve(result);
	});

     })
};


var createNewPlace = function (data, imagedata) {

	return new Promise(function(reject, resolve) {

		db.query("insert into dives set??", data, function (err, result) {

			if(err) {
				reject(err);
			}

			db.query("insert into images set??", 

				{imageData: imagedata, userID: result.diveID}, function (err, result) {

					if(err) {
						reject(err);
					}
					resolve(result);
			})
		})
	})
};


var login = function(logindata, callback) {
	//return this to the client
	var returnloginData = {};

	db.query("select * from users where username = ?", logindata.username, function(err, result) {
		if(err) {
			returnloginData.userrexists = false;

			return callback(returnloginData);
		}
		returnloginData.userfound = true;
		if(hashPassword(logindata)==result.password) {

			returnloginData.passwordMatch = true;

			returnloginData.loginSuccess = true;

             //probably has to be result[0] since array is getting returned??
			returnloginData.userData = result;
		}
		else {
			returnloginData.passwordMatch = false;

			returnloginData.loginSuccess = false;
		}

		callback(returnloginData);

	})

}


var hashPassword = function(password) {
	//returns hashed password
	//doing a synchronous operation here


};


var createUser = function (registerdata, callback) {

	var json = {};

	//checking if username is already in use -> if it is the
	db.query("select * from users where username = ?", registerdata.username, function (err, result) {
		if(err) {
			json.nameAvailable = true;

			//username is available -> insert new user into db
			var hashedPassword = hashPassword(password);

			//setting user

			db.query("insert into users set??", {password:hashPassword, username: registerdata.username}, function(err, result) {
				if(err) {
					json.insertionsuccess = false;
					return callback(json);
				}
				json.insertionsuccess = true;

				json.createdUser = result[0];
			})

		}

		else {
			json.nameAvailable = false;

			//username already exists -> invoking callback and telling user that he has to chose another one
			callback(json);

		}
	})

};

var makeAvatar = function (userID, avatarData, callback) {

  db.query("select * from avatars where userID = ?? and avtarName = ??", [userID], avatarData.avtarName, function (err, result) {
    if (err) {
      json.avatarUnique = true;

      db.query("insert into avatars set??", avatarData, function (err, result) {

        json.avatar = result[0];

        callback(result);

  });

    } else {
      json.avatarUnique = false;

      callback(json);
    }

  })

};

var writingQueue = function () {
  this.storage = [];

};

writingQueue.prototype.enq = function(val) {
   
  this.storage.push(val);
  console.log("put user i the queue", this.storage);

};

writingQueue.prototype.deq = function() {

  return this.storage.shift();


};

writingQueue.prototype.size = function () {

  return storage.length;

};

var setUPQueue = new writingQueue();


var putInqueue = function (userID, callback) {
  
  setUPQueue.enq(userID);


};










module.exports.getProfileData = getProfile;

module.exports.updateUser = updateUser;

module.exports.getAlbumPics = getAlbumPictures;