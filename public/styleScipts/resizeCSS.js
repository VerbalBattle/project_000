// On document ready
$(document).ready(function () {
  // Window resizing
  $(window).resize(function () {

    //  _           _     _            ______          _         
    // | |         | |   | |           | ___ \        (_)        
    // | |     ___ | |__ | |__  _   _  | |_/ /___  ___ _ _______ 
    // | |    / _ \| '_ \| '_ \| | | | |    // _ \/ __| |_  / _ \
    // | |___| (_) | |_) | |_) | |_| | | |\ \  __/\__ \ |/ /  __/
    // \_____/\___/|_.__/|_.__/ \__, | \_| \_\___||___/_/___\___|
    //                           __/ |                           
    //                          |___/      

    // Room summary recalculations

    // Opponent image width in px
    var opponentImageWidth = $('.lobbyView_opponentImage').width();
    // Room container width in px
    var roomContainerWidth = $('.lobbyView_roomContainer').width();
    // Desired of room summary
    var roomSummaryPercentage =
      (1 - opponentImageWidth / roomContainerWidth) * 100 + '%';
    // Get opponent image width
    $('.lobbyView_roomSummary').css({
      'width': roomSummaryPercentage
    });


  });
});