// using the ELO formulas to determine new rank of two players based on win
// ELO Rating formula: R' = R + K * (S - E)
// R' is the new rating
// R is the old rating
// K is a maximum value for increase or decrease of rating (16 or 32 for ELO)
// S is the score for a game
// E is the expected score for a game
//
// E(A) = 1 / [ 1 + 10 ^ ( [R(B) - R(A)] / 400 ) ]

var getNewRank = function (player1, player2, winner) {
  var winTuple = [];

  // build the winTuple based on who won the game
  if (winner === "player1") {
    winTuple = [1,0];
  } else {
    winTuple = [0,1];
  }

  // calculate the expected percentage that personX will beat personY based on their ranking
  var expectedA = 1.0 / (1.0 + Math.pow((player2.ranking - player1.ranking) / 400.0, 10));
  var expectedB = 1.0 / (1.0 + Math.pow((player1.ranking - player2.ranking) / 400.0, 10));

  // rounding up so the winning player always gains some points
  var player1Rating = Math.ceiling(player1.rating + 32.0 * (winTuple[0] - expectedA));
  var player2Rating = Math.ceiling(player2.rating + 32.0 * (winTuple[1] - expectedB));

  // return a tuple representing the new ratings of both players
  return [player1Rating, player2Rating];
};

module.exports.getNewRanks = getNewRanks;