#!/usr/bin/env node
// const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const ejs = require('ejs')
const program = require('commander')
const fs = require('fs-extra')
const chalk = require('chalk')
const figlet = require('figlet')
//提示用户输入内容
program
  .command('create <项目名>')
  .description('创建新项目')
  .option('-f, --force', '如果目标位置项目存在，重写目标项目')
  .action((name, options) => {
    require('../lib/create.js')(name, options)
  })
program
  .version(`v${require('../package.json')}.version`)
  .usage('<command> [option]')
program
  // 监听 --help 执行
  .on('--help', () => {
    console.log(
      `${chalk.cyan(
        '\r\n' +
          figlet.textSync('fur', {
            font: 'Ghost',
            horizontalLayout: 'default',
            verticalLayout: 'default',
            width: 80,
            whitespaceBreak: true,
          }),
      )}`,
    )
    // 新增说明信息
    console.log(
      `\r\n运行 ${chalk.cyan(
        `fur <command> --help`,
      )} 了解给定命令的详细用法\r\n`,
    )
  })

program.parse(process.argv)
