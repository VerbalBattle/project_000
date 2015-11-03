// construct this data format after receiving data from server
var players = [
  {avatarID: 3, userID: 1, avatarStats: {winLossRatio: 1.32, winVelocity: 4, elo: 1450, winStreak: 6}},
  {avatarID: 10, userID: 2, avatarStats: {winLossRatio: .69, winVelocity: 0, elo: 1425, winStreak: 0}},
  {avatarID: 100, userID: 3, avatarStats: {winLossRatio: .45, winVelocity: 3, elo: 1525, winStreak: 3}},
  {avatarID: 1, userID: 4, avatarStats: {winLossRatio: 1.00, winVelocity: 2, elo: 1125, winStreak: 7}},
  {avatarID: 4, userID: 5, avatarStats: {winLossRatio: .8, winVelocity: 0, elo: 1700, winStreak: 8}},
  {avatarID: 9, userID: 6, avatarStats: {winLossRatio: 1.4, winVelocity: 3, elo: 1625, winStreak: 10}}
];

// {10: {winLossRatio: .69, winVelocity: 0, rank: 4, winStreak: 0}},
// {100: {winLossRatio: .45, winVelocity: 3, rank: 3, winStreak: 3}},
// {1: {winLossRatio: 1.00, winVelocity: 2, rank: 8, winStreak: 7}},
// {4: {winLossRatio: .8, winVelocity: 0, rank: 1, winStreak: 8}},
// {9: {winLossRatio: 1.4, winVelocity: 3, rank: 2, winStreak: 10}}

var playersList = new LinkedList();

players.forEach(function (obj) {
  playersList.addToBack(obj);
});

console.log( matchBatch (playersList, 10, {1: {2: true}, 2: {1: true}}));
// answer should be "blaine"