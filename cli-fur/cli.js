#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const ejs = require('ejs')

inquirer
  .prompt([{ type: 'input', name: 'name', message: '项目名' }])
  .then((ans) => {
    const tmpDir = path.join(__dirname, 'templates') //模板路径
    const destDir = process.cwd() //需要写入的路径

    fs.readdir(tmpDir, (err, files) => {
      if (err) throw err
      files.forEach((file) => {
        ejs
          .renderFile(
            // renderFile（模版文件地址，传入渲染数据）
            path.join(tmpDir, file), //文件路径+名
            ans, //替换内容
          )
          .then((res) => {
            // 生成 ejs 处理后的模版文件
            fs.writeFileSync(path.join(destDir, file), res) //写入文件
          })
      })
    })
  })
