#!/usr/bin/env node

var program = require('commander');
var appInfo = require('../package.json');

program
    .version(appInfo)
    //子命令
    .command('run <cmd>')
    //resume的子命令
    .option("-n, --name <mode>", "输出我的名字")
    //注册一个callback函数
    .action(function(cmd){
      console.log('run %s', cmd);
    });

program.on('--help', function () {
  console.log('    $', 'rc-tools run less'.to.magenta.color, 'transform less files into css');
  console.log('    $', 'rc-tools run build'.to.magenta.color, 'run build');
});

program.parse(process.argv);

var task = program.args[0];

if (!task) {
  program.help();
} else {
  var gulp = require('gulp');
  require('../gulpfile');
  gulp.start(task);
}
