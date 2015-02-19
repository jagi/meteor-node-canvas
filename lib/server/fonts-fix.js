var sharedFonts = null;

var getContext = Canvas.prototype.getContext;

Canvas.prototype.getContext = function () {
  var ctx = getContext.apply(this, arguments);

  ctx._fonts = sharedFonts;

  return ctx;
};

var addFont = Canvas.Context2d.prototype.addFont;

Canvas.Context2d.prototype.addFont = function () {
  addFont.apply(this, arguments);

  sharedFonts = this._fonts;
};
