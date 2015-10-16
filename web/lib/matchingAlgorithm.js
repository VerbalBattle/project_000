// Table: PlayerData
// Variable Names:
// winLoss: Float
// type: Post MVP
// winVelocity: Float
// rank: String
// winStreak: Integer

var playerObj = {winLoss: 1.2, winVelocity: 3, rank: 4, winStreak: 10};
var features = Object.keys(playerObj);

// initializing the coefficient values to multiply eaxh x by,
// this gives weighting to the x1, x2 ... xn
var thetas = {winLoss: 1, winVelocity: 1.2, rank: 1.8, winStreak: .7};

// not a deep clone
var cloneObj = function(obj) {
  var answer = {};

  for(key in obj) {
    answer[key] = obj[key];
  }

  return answer;
}

// finding the best opponent for a player to play
var findOpponent = function() {
  var bestMatch = [Infinity, null];

  // initializing min and max with the player stats
  var min = cloneObj(playerObj);
  var max = cloneObj(playerObj);

  // scale each feature so that the values are within the same range
  // and exert the same influence on the overall algorithm

  // find the min and max for each feature in dataset
  otherPlayers.forEach( function(player, index) {
    // if the users searching for matchmakin is not within a one rank margin,
    // dont consider the user as a potential match
    if(Math.abs(player.rank - playerObj.rank) <= 1) {
      features.forEach( function(feature) {
        if(feature !== 'username') {
          var val = player[feature];

          if( val > max[feature] ) {
            max[feature] = val;
          }
          if( val < min[feature] ) {
            min[feature] = val;
          }
        }
      });
    } else {
      delete otherPlayers[index];
    }
  })

  // scale the players stats
  for(feature in playerObj) {
    if(feature !== 'username') {
      var val = playerObj[feature];
      playerObj[feature] = (val - min[feature]) / (max[feature] - min[feature]);
    }
  }

  // perform feature scaling using the rescaling equation, scales each value from 0 to 1 relative to other data
  // points of same feature from all other potential matches.
  otherPlayers.forEach( function(player) {
    features.forEach( function(feature) {
      if(feature !== 'username') {
        var val = player[feature];

        player[feature] = (val - min[feature]) / (max[feature] - min[feature]);
      }
    });
  });
  // end of feature scaling

  // find the least euclidean distance of players searching for a match
  // to see which player most closely matches current player searching
  otherPlayers.forEach( function(player) {
    var distance = Math.sqrt(Math.pow((player.winLoss - playerObj.winLoss) * thetas['winLoss'], 2) + Math.pow((player.winVelocity - playerObj.winVelocity) * thetas['winVelocity'], 2) + Math.pow((player.rank - playerObj.rank) * thetas['rank'], 2) + Math.pow((player.winStreak - playerObj.winStreak) * thetas['winStreak'], 2));

    if(distance < bestMatch[0]) {
      bestMatch = [distance, player];
    }
  });

  // scale feature back to original value for testing purposes
  // for(feature in bestMatch[1]) {
  //   if(feature !== 'username') {
  //     bestMatch[1][feature] = bestMatch[1][feature] * (max[feature] - min[feature]) + min[feature];
  //   }
  // }

  return bestMatch[1];
}