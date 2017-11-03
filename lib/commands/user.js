var prompt = require('prompt');

var chalk = require('../chalk');
var log = require('../log');
var core = require('../core');
var session = require('../session');

var cmd = {
  command: 'user',
  desc:    'login/logout with leetcode account',
  builder: {
    login: {
      alias:    'l',
      type:     'boolean',
      default:  false,
      describe: 'Login'
    },
    logout: {
      alias:    'L',
      type:     'boolean',
      default:  false,
      describe: 'Logout'
    },
    username: {
      alias: "u",
      type: "string",
      default: "si-yao",
      describe: "username"
    },
    password: {
      alias: "p",
      type: "string",
      default: "1234567890",
      describe: "password"
    }
  }
};

cmd.handler = function(argv) {
  session.argv = argv;
  var user = null;
  if (argv.login) {
    var plainPassword = argv.password;
    var buf = new Buffer(plainPassword, 'base64');
    plainPassword = buf.toString('ascii');
    var user = {
      login: argv.username,
      pass: plainPassword
    };
    // login
    core.login(user, function(e, user) {
      if (e) return log.fail(e);
      log.info('Successfully login as', chalk.yellow(user.name));
    });
  } else if (argv.logout) {
    // logout
    user = core.logout(user, true);
    if (user)
      log.info('Successfully logout as', chalk.yellow(user.name));
    else
      log.fail('You are not login yet?');
  } else {
    // show current user
    user = session.getUser();
    if (user)
      log.info('You are now login as', chalk.yellow(user.name));
    else
      return log.fail('You are not login yet?');
  }
};

module.exports = cmd;
