// using the ELO formulas to determine new rank of two players based on win
// ELO Rating formula: R' = R + K * (S - E)
// R' is the new rating
// R is the old rating
// K is a maximum value for increase or decrease of rating (16 or 32 for ELO)
// S is the score for a game
// E is the expected score for a game
//
// E(A) = 1 / [ 1 + 10 ^ ( [R(B) - R(A)] / 400 ) ]

var Ranking = {};

Ranking.getNewRank = function (player1, player2, winner) {
  // build the winTuple based on who won the game
  var winTuple = (winner === "player1") ? [1,0] : [0,1];

  // calculate the expected percentage that personX will beat personY based on both of their rankings
  var expectedA = 1.0 / (1.0 + Math.pow((player2.elo - player1.elo) / 400.0, 10));
  var expectedB = 1.0 / (1.0 + Math.pow((player1.elo - player2.elo) / 400.0, 10));

  // rounding up so the winning player always gains some points,
  // ensure the rating never drops below zero.
  var player1Rating = Math.max(Math.ceiling(player1.elo + 32.0 * (winTuple[0] - expectedA)), 0);
  var player2Rating = Math.max(Math.ceiling(player2.elo + 32.0 * (winTuple[1] - expectedB)), 0);

  // return a tuple representing the new ratings of both players
  return [player1Rating, player2Rating];
};

// takes in an ELO rating and returns the division the player is in
Ranking.determineRank = function (rank) {
  if (rank <= 1050) {
    return 10;
  } else if (rank <= 1100) {
    return 9;
  } else if (rank <= 1150) {
    return 8;
  } else if (rank <= 1200) {
    return 7;
  } else if (rank <= 1250) {
    return 6;
  } else if (rank <= 1300) {
    return 5;
  } else if (rank <= 1475) {
    return 4;
  } else if (rank <= 1550) {
    return 3;
  } else if (rank <= 1650) {
    return 2;
  } else {
    return 1;
  }
};

module.exports = Ranking;