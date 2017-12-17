var _ = require('underscore');

var h = require('../helper');
var chalk = require('../chalk');
var log = require('../log');
var cache = require('../cache');
var session = require('../session');

var cmd = {
  command: 'cache [keyword]',
  desc:    'show cached problems',
  builder: {
    delete: {
      alias:    'd',
      type:     'boolean',
      describe: 'Delete cached problem',
      default:  false
    }
  }
};

cmd.handler = function(argv) {
  session.argv = argv;

  var caches = cache.list()
    .filter(function(f) {
      return argv.keyword === undefined || f.name.startsWith(argv.keyword + '.');
    });

  if (argv.delete) {
    caches.forEach(function(f) {
      if (f.name === '.user') return;
      cache.del(f.name);
    });
  } else {
    _.sortBy(caches, function(f) {
      var x = parseInt(f.name.split('.')[0], 10);
      if (_.isNaN(x)) x = 0;
      return x;
    })
    .forEach(function(f) {
      log.printf('%-60s %8s    %s ago',
          chalk.green(f.name),
          h.prettySize(f.size),
          h.prettyTime((Date.now() - f.mtime) / 1000));
    });
  }
};

module.exports = cmd;
