// lib/Generator.js

const { getRepoList, getTagList } = require('./http')
const ora = require('ora')
const inquirer = require('inquirer')
const util = require('util')
const path = require('path')
const chalk = require('chalk')

const downloadGitRepo = require('download-git-repo') // 不支持 Promise
// 添加加载动画
async function wrapLoading(fn, message, ...args) {
  // 使用 ora 初始化，传入提示信息 message
  const spinner = ora(message)
  // 开始加载动画
  spinner.start()

  try {
    // 执行传入方法 fn
    const result = await fn(...args)
    // 状态为修改为成功
    spinner.succeed()
    return result ? result : true
  } catch (error) {
    console.log(error)
    // 状态为修改为失败
    spinner.fail('拉取失败，请重试')
    return false
  }
}

class Generator {
  constructor(name, targetDir) {
    // 目录名称
    this.name = name
    // 创建位置
    this.targetDir = targetDir
    // 对 download-git-repo 进行 promise 化改造
    this.downloadGitRepo = util.promisify(downloadGitRepo)
  }

  // 获取用户选择的模板
  // 1）从远程拉取模板数据
  // 2）用户选择自己新下载的模板名称
  // 3）return 用户选择的名称
  async getRepo() {
    // 1）从远程拉取模板数据
    const repoList = await wrapLoading(getRepoList, '拉取中...')
    if (!repoList) return

    // 过滤我们需要的模板名称
    const repos = repoList.map((item) => item.name)

    // 2）用户选择自己新下载的模板名称
    const { repo } = await inquirer.prompt({
      name: 'repo',
      type: 'list',
      choices: repos,
      message: '请选择一个模板来创建项目',
    })

    // 3）return 用户选择的名称
    return repo
  }

  // 获取用户选择的版本
  // 1）基于 repo 结果，远程拉取对应的 tag 列表
  // 2）用户选择自己需要下载的 tag
  // 3）return 用户选择的 tag
  async getTag(repo) {
    if (!repo) return
    // 1）基于 repo 结果，远程拉取对应的 tag 列表
    const tags = await wrapLoading(getTagList, '拉取中...', repo)
    if (!tags) return

    // 过滤我们需要的 tag 名称
    const tagsList = tags.map((item) => item.name)

    // 2）用户选择自己需要下载的 tag
    const { tag } = await inquirer.prompt({
      name: 'tag',
      type: 'list',
      choices: tagsList,
      message: '请选择一个标签来创建项目',
    })

    // 3）return 用户选择的 tag
    return tag
  }

  // 下载远程模板
  // 1）拼接下载地址
  // 2）调用下载方法
  async download(repo, tag) {
    // 1）拼接下载地址
    const requestUrl = `fur-cli/${repo}${tag ? '#' + tag : ''}`
    // 2）调用下载方法
    const status = await wrapLoading(
      this.downloadGitRepo, // 远程下载方法
      '等待模板下载', // 加载提示信息
      requestUrl, // 参数1: 下载地址
      path.resolve(process.cwd(), this.targetDir),
    ) // 参数2: 创建位置
    if (!status) return
    // 4）模板使用提示
    console.log(`\r\n项目 ${chalk.cyan(this.name)} 创建成功，请执行以下命令：`)
    console.log(`\r\n  cd ${chalk.cyan(this.name)}`)
    console.log('  npm install')
    console.log('  npm run dev\r\n')
  }

  // 核心创建逻辑
  // 1）获取模板名称
  // 2）获取 tag 名称
  // 3）下载模板到模板目录
  async create() {
    // 1）获取模板名称
    const repo = await this.getRepo()
    // 2) 获取 tag 名称
    const tag = await this.getTag(repo)
    // 3）下载模板到模板目录
    const res = await this.download(repo, tag)
  }
}

module.exports = Generator
