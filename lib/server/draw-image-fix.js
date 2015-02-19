var drawImage = Canvas.Context2d.prototype.drawImage;

var algorithms = {};

algorithms.graphicsmagick = function () {
  if (arguments.length === 3) {
    return drawImage.apply(this, arguments);
  }

  if (arguments.length === 5) {
    var img = arguments[0];
    var x = arguments[1];
    var y = arguments[2];
    var width = arguments[3];
    var height = arguments[4];

    var imgCanvas = new Canvas(img.width, img.height);
    var imgCtx = imgCanvas.getContext('2d');
    drawImage.call(imgCtx, img, 0, 0);

    var readStream = imgCanvas.createPNGStream();
    var bufferStream = new BufferStream();
    var gmStream = gm(readStream).filter('Sinc').resize(width, height, '!').stream();

    Streams.pipe(gmStream, bufferStream);

    var resizedImg = new Image();
    resizedImg.src = bufferStream.buffer;

    drawImage.call(this, resizedImg, x, y);
  }

  if (arguments.length === 9) {
    return drawImage.apply(this, arguments);
  }
};

algorithms.bicubic = function () {
  if (arguments.length === 3) {
    return drawImage.apply(this, arguments);
  }

  if (arguments.length === 5) {
    var img = arguments[0];
    var x = arguments[1];
    var y = arguments[2];
    var width = arguments[3];
    var height = arguments[4];

    var inputCanvas = new Canvas(img.width, img.height);
    var inputCtx = inputCanvas.getContext('2d');
    drawImage.call(inputCtx, img, 0, 0);

    var outputCanvas = new Canvas(img.width, img.height);
    var outputCtx = outputCanvas.getContext('2d');

    var inputData = inputCtx.getImageData(0, 0, img.width, img.height);
    var outputData = outputCtx.createImageData(width, height);

    outputCtx.putImageData(copyResized(inputData, outputData), 0, 0);

    return drawImage.call(this, outputCanvas, x, y);
  }

  if (arguments.length === 9) {
    return drawImage.apply(this, arguments);
  }
};

algorithms.bilinear = function () {
  if (arguments.length === 3) {
    return drawImage.apply(this, arguments);
  }

  var getScaled = function (img) {
    var width = img.width / 2;
    var height = img.height / 2;
    var canvas = new Canvas(width, height);
    var ctx = canvas.getContext('2d');
    drawImage.call(ctx, img, 0, 0, img.width, img.height, 0, 0, width, height);
    return canvas;
  };

  if (arguments.length === 5) {
    var img = arguments[0];
    var x = arguments[1];
    var y = arguments[2];
    var width = arguments[3];
    var height = arguments[4];

    var canvases = [];

    var xFactor = img.width / width;
    var yFactor = img.height / height;
    var steps = Math.floor(Math.log(xFactor < yFactor ? xFactor : yFactor) /
      Math.log(2));

    if (steps > 0) {
      for (var i = 0; i < steps; i++) {
        if (i === 0) {
          canvases.push(getScaled(img));
        } else {
          var canvas = canvases[canvases.length - 1];
          canvases.push(getScaled(canvas));
        }
      }

      var canvas = canvases[canvases.length - 1];
      return drawImage.call(this, canvas, x, y, width, height);
    } else {
      return drawImage.call(this, img, x, y, width, height);
    }
  }

  if (arguments.length === 9) {
    return drawImage.apply(this, arguments);
  }
};

Canvas.Context2d.prototype.scalingAlgorithm = 'graphicsmagick';

Canvas.Context2d.prototype.drawImage = function () {
  algorithms[this.scalingAlgorithm].apply(this, arguments);
};
