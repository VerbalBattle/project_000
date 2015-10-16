var otherPlayers = [
  {username: "blaine", winLoss: 1.32, winVelocity: 4, rank: 4, winStreak: 6},
  {username: "bowen", winLoss: .69, winVelocity: 0, rank: 4, winStreak: 0},
  {username: "matt", winLoss: .45, winVelocity: 3, rank: 3, winStreak: 3},
  {username: "zach", winLoss: 1.00, winVelocity: 2, rank: 8, winStreak: 7},
  {username: "simon", winLoss: .8, winVelocity: 0, rank: 1, winStreak: 8},
  {username: "answer", winLoss: 1.4, winVelocity: 3, rank: 2, winStreak: 10}
]

var answer = findOpponent();
console.log(answer);
// answer should be "blaine"