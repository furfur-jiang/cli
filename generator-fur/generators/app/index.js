const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  // 命令行交互
  prompting() {
    //promise
    return this.prompt([
      {
        type: 'input',
        name: 'title',
        message: '你的项目名：',
        default: this.appname,
      },
    ]).then((ans) => {
      this.ans = ans
    })
  }

  writing() {
    // 建tmp.txt文件并写入'5555'，ps:String or a Buffer
    //   this.fs.write(this.destinationPath('tmp.txt'), '5555')

    // 模板替换
    // const tmpl = this.templatePath('index.html')
    // const output = this.destinationPath('index.html')
    // const context = this.ans
    // this.fs.copyTpl(tmpl, output, context)

    const templates = [
      'public/favicon.ico',
      'public/index.html',
      'src/assets/logo.png',
      'src/components/HelloWorld.vue',
      'src/router/index.js',
      'src/views/About.vue',
      'src/views/Home.vue',
      'src/App.vue',
      'src/main.js',
      '.gitignore',
      'babel.config.js',
      'package.json',
      'README.md',
    ]

    templates.forEach((item) => {
      this.fs.copyTpl(
        this.templatePath(item),
        this.destinationPath(item),
        this.ans,
      )
    })
  }
}
