angular.module('VBattle.room', [])

.controller('RoomCtrl', function ($timeout, $scope, $location, $routeParams, GamePlay, socketFactory) {
  
  var user = JSON.parse(window.localStorage['user']);
  var userid = user.userID;
  var avatarID = Number($routeParams.playerID);
  $scope.messages;
  var room = $routeParams.roomID;
  $scope.shower = false;
  $scope.enemy;

  // State of the room
  $scope.roomState = -1;

  $scope.postMessage = function (text) {
   //getting userID and avatarID form localstorage
   //replace roomID with variable room
    var msg = {
      "userID": userid,
      "avatarID": avatarID,
      "message": text,
      "roomID": room
    };

  // {
  //     "userID": 17,
  //     "avatarID": 23,
  //     "message": "my message is here"
  // }

    // Post message to server if message isn't empt
    if (0 < msg.message.length) {
      GamePlay.postMessage(msg).then(function (result) {
        // If the game isn't over
        // var msgs =
        //   $scope.messages[Object.keys($scope.messages)[0]].messages;
        // if (msgs.length < 6) {
          // If it is not this users turn
        if (result.turnValid === false) {
          $scope.shower = true;
          $timeout( function () {
            $scope.shower = false;
          }, 2000);
        } else {
          // The message was sent successfuly
          $scope.input = "";
          // Reset character count
          $('#roomView_messageLength').text(144 + ' chars');
          // Scroll the div
          $('.roomView_messagesContainer').animate({
            scrollTop: $('.roomView_messagesContainer').height()
          }, 500);

          // Focus on message field
          $('#roomView_messageField').focus();

          // Resize input field
          resizeMessageField(true);
        }

        $timeout(function () {
          $scope.getMessages();
        }, 20);
        // } else {
          
        //   // Show that the room has ended
        // }
      });
    }
  };

  // Socket
  var mySocket = socketFactory();

  // Socket listener for turn update
  mySocket.on('client:turnUpdate', function (data) {
    $scope.messages = data.rooms;

    $scope.roomState =
      $scope.messages[Object.keys($scope.messages)[0]].roomState;
    // Scroll div to proper height
    $('.roomView_messagesContainer').animate({
      scrollTop: $('.roomView_messagesContainer').height()
    }, 500);
  });

  // Socket listener for when a room has been judged
  mySocket.on('client:gameJudgedUpdate', function (data) {
    // If the roomID is this room's, mark room as closed
    if (data.roomID === room) {
      $scope.roomState = 2;
    }
  });

  // Get all messages for a designated room
  $scope.getMessages = function () {

    // User service
    GamePlay.getMessages(room).then(function (result) {

      // Get rooms
      $scope.room = result.rooms[room];

      // Set roomstate
      $scope.roomState = $scope.room.roomState;

      // Mapping avatarID to avatarData
      $scope.avatarIDMap = {};

      // Get avatar1 mapping
      $scope.avatarIDMap[$scope.room.avatar1.avatarID] = {
        avatarName: $scope.room.avatar1.avatarName,
        avatarImage: $scope.room.avatar1.avatarImage
      };

      // Get avatar2 mapping
      $scope.avatarIDMap[ $scope.room.avatar2.avatarID] = {
        avatarName: $scope.room.avatar2.avatarName,
        avatarImage: $scope.room.avatar2.avatarImage
      };

      // Figure out which avatarID is the opponent
      var avatars = JSON.parse(localStorage.user).avatars;
      $scope.opponentAvatarID = -1;
      if (!($scope.room.avatar1.avatarID in avatars)) {

        // Avatar 1 is the opponent
        $scope.opponentAvatarID = $scope.room.avatar1.avatarID;
      } else if (!($scope.room.avatar2.avatarID in avatars)) {

        // Avatar 2 is the opponent
        $scope.opponentAvatarID = $scope.room.avatar2.avatarID;
      }

      // Set messages
      $scope.messages = result.rooms;

      // Set scroll height
      $('.roomView_messagesContainer').animate({
        scrollTop: $('.roomView_messagesContainer').height()
      }, 500);
    }); 

  };

  $scope.getMessages();

  // On message box input change
  var resizeMessageField = function (reset) {
    // If n supplied, set rows directly
    if (reset) {
      $('#roomView_messageField')[0].rows = 1;
      return;
    }
    // Count the number of newline characters
    var str = $('#roomView_messageField')[0].value;
    var rowCount = 1;
    for (var i = 0; i < str.length; ++i) {
      if (str[i] === '\n') {
        ++rowCount;
      }
    }
    // Add rows for 
    // Set the rows of this to be rowCount or 1
    $('#roomView_messageField')[0].rows = rowCount;
  };

  $('#roomView_messageField').keydown(function (e) {
    resizeMessageField();
  });
  $('#roomView_messageField').keyup(function (e) {
    // Set value to be substring
    if (144 < $('#roomView_messageField')[0].value.length) {
      $('#roomView_messageField')[0].value =
        $('#roomView_messageField')[0].value.substr(0, 144);
    }
    resizeMessageField();

    // Set character count in #roomView_messageLength
    $('#roomView_messageLength')
    .text(144 - $('#roomView_messageField')[0].value.length +
      ' chars');
  });

  // Initialize character count to 0
  $('#roomView_messageLength')
  .text(144 + ' chars');

  // Focus on message field
  $('#roomView_messageField').focus();
});