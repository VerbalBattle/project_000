// construct this data format after receiving data from server
var players = {
  blaine: {winLossRatio: 1.32, winVelocity: 4, rank: 4, winStreak: 6},
  bowen: {winLossRatio: .69, winVelocity: 0, rank: 4, winStreak: 0},
  matt: {winLossRatio: .45, winVelocity: 3, rank: 3, winStreak: 3},
  zach: {winLossRatio: 1.00, winVelocity: 2, rank: 8, winStreak: 7},
  simon: {winLossRatio: .8, winVelocity: 0, rank: 1, winStreak: 8},
  answer: {winLossRatio: 1.4, winVelocity: 3, rank: 2, winStreak: 10}
};

console.log( matchGroup( players));
// answer should be "blaine"