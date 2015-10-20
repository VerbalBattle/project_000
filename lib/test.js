// construct this data format after receiving data from server
var players = {
  blaine: {winLossRatio: 1.32, winVelocity: 4, rank: 4, winStreak: 6},
  bowen: {winLossRatio: .69, winVelocity: 0, rank: 4, winStreak: 0},
  matt: {winLossRatio: .45, winVelocity: 3, rank: 3, winStreak: 3},
  zach: {winLossRatio: 1.00, winVelocity: 2, rank: 8, winStreak: 7},
  simon: {winLossRatio: .8, winVelocity: 0, rank: 1, winStreak: 8},
  answer: {winLossRatio: 1.4, winVelocity: 3, rank: 2, winStreak: 10}
};

var matchPairs = [];


while ( Object.keys(players).length > 1) {
  // not a deep clone, only handles copying primitives, nested objects,
  // and arrays.
  var cloneObj = function (obj) {
    var answer = {};

    for ( var key in obj) {
      if ( typeof obj[key] === "object") {
        if ( !Array.isArray(obj[key])) {
          answer[key] = cloneObj(obj[key]);
        } else {
          answer[key] = obj[key];
        }
      } else {
        answer[key] = obj[key];
      }
    }

    return answer;
  };

  var playerName = Object.keys(players)[0];
  var player1 = cloneObj(players[playerName]);
  delete players[playerName];

  var playersClone = cloneObj(players);
  var player2 = findOpponent(player1, playersClone, features);

  // if there was a match, push the match pair to an array
  if ( player2) {
    delete players[player2];

    matchPairs.push([playerName, player2]);
  }
}

console.log(matchPairs);
// answer should be "blaine"