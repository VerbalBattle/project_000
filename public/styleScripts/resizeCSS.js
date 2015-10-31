// On document ready
$(document).ready(function () {

  // CSS Adjuster function
  var adjustCSS = function () {

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
      (1 - opponentImageWidth / roomContainerWidth) * 100 + -5 + '%';
    // Get opponent image width
    $('.lobbyView_roomSummary').css({
      'width': roomSummaryPercentage
    });

    // ______           __ _ _       ______          _         
    // | ___ \         / _(_) |      | ___ \        (_)        
    // | |_/ / __ ___ | |_ _| | ___  | |_/ /___  ___ _ _______ 
    // |  __/ '__/ _ \|  _| | |/ _ \ |    // _ \/ __| |_  / _ \
    // | |  | | | (_) | | | | |  __/ | |\ \  __/\__ \ |/ /  __/
    // \_|  |_|  \___/|_| |_|_|\___| \_| \_\___||___/_/___\___|
    
    // Avatar name recalculations

    // Desired base font-height in vh
    var baseAvatarNameFontSize = 4.5;
    // Minimum length for font resizing
    var minAvatarNameResizeLength = 8;

    // Iterate over each avatar name
    var nameTags = $('body').find('.avatarsView_avatarName');
    nameTags.each(function (i) {
      // Get the text length
      var nameLength = $(this).text().length;

      // Map to percentage of baseAvatarNameFontSize
      var newFontSize =
        baseAvatarNameFontSize - nameLength * .05;
      // Set CSS
      $(this).css({
        'font-size': newFontSize + 'vh',
        'margin-top': baseAvatarNameFontSize - newFontSize + 'vh'
      });
    });
  };

  // Window resizing
  $(window).resize(adjustCSS);
});