Package.describe({
  summary: 'NodeCanvas for Meteor',
  version: '0.1.0',
  name: 'jagi:node-canvas',
  git: 'https://github.com/jagi/meteor-node-canvas.git'
});

Npm.depends({
  'canvas': '1.1.6'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.0');

  api.use('jagi:streams@0.1.0');
  api.use('jagi:graphics-magick@1.0.0');

  api.addFiles('lib/server/canvas.js', 'server');
  api.addFiles('lib/server/canvas-copy.js', 'server');
  api.addFiles('lib/server/draw-image-fix.js', 'server');
  api.addFiles('lib/server/fonts-fix.js', 'server');

  api.export(['Canvas', 'Image'], 'server');
});
