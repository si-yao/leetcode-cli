'use strict';
var prompt = require('prompt');

var chalk = require('../chalk');
var log = require('../log');
var core = require('../core');
var session = require('../session');

const cmd = {
  command: 'user',
  aliases: ['account'],
  desc:    'Manage account',
  builder: function(yargs) {
    return yargs
      .option('l', {
        alias:    'login',
        type:     'boolean',
        default:  false,
        describe: 'Login'
      })
      .option('L', {
        alias:    'logout',
        type:     'boolean',
        default:  false,
        describe: 'Logout'
      })
      .option('u', {
        alias:    'username',
        type:     'string',
        default:  "si-yao",
        describe: 'username'
      })
      .option('p', {
        alias:    'password',
        type:     'string',
        default:  "1234567890",
        describe: 'password'
      })
      .example(chalk.yellow('leetcode user'), 'Show current user')
      .example(chalk.yellow('leetcode user -l -u myid -p mypassword'), 'User login')
      .example(chalk.yellow('leetcode user -L'), 'User logout');
  }
};

cmd.handler = function(argv) {
  session.argv = argv;
  let user = null;
  if (argv.login) {
    var plainPassword = argv.password;
    var buf = new Buffer(plainPassword, 'base64');
    plainPassword = buf.toString('ascii');
    user = {
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
