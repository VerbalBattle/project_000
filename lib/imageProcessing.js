var cv = require("opencv");
var images = ['boob.png', 'right-side-boob.png', 'left-side-boob.png'];

var checkForNudity = function (image) {
  for (var i = 0; i < images.length; i++) {
    var imagePath = images[i];

    cv.readImage(imagePath, function (err, mat) {
      if (cv.MatchTemplate(image, mat, 'CV_TM_SQDIFF_NORMED')) {
        return true;
      }
    });
  }

  return false;
};