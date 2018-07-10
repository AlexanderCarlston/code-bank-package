#!/usr/bin/env node
//Dependencies 
const program = require('commander');
const inquirer = require('inquirer');
const shell = require('shelljs');
const fetch = require('node-fetch');
const beautify = require('js-beautify').js_beautify, fs = require('fs');
//Used vars
const questions = [
  {
    type: 'input',
    name: 'user',
    message: 'User Name'
  },
  {
    type: 'password',
    name: 'code',
    message: 'Vault Access Code'
  },
  {
    type: 'confirm',
    name: 'link',
    message: 'Npm Link?'
  }];

const welcomeStr = shell.cat('~/code_bank/art/08b207831da9cb5f8bdafa3dc3ce2041/welcome.txt')
const bankStr = shell.cat('~/code_bank/art/e8d23e60b3f0329285e4827b9e859d7c/bank.txt')
const vaultStr = shell.cat('~/code_bank/art/822ff404072160c9ab8d499514326a2e/vault.txt')
//ASCII Art
shell.echo(welcomeStr)
shell.echo(bankStr)
//User prompt
inquirer.prompt(questions).then(answers => {
  shell.echo(vaultStr)
  //Animation for fetch delay
  console.log("answers", answers)
  fetch(`https://secret-island-17002.herokuapp.com/vaults/code/${answers.code}`)
    .then(res => res.json())
    .then(data => {
      if (data.message) {
        //Error handling
        shell.echo(`Vault with access code ${answers.code} not found`)
      } else {
        const vaultName = data.vaultItem.vault_name
        const snippets = data.vaultItem.vault_code_snippets.data
        if (!answers.link) {
          //Make the js file on .
          shell.mkdir(vaultName)
          shell.cd(vaultName)
          for (var i = 0; i < snippets.length; i++) {
            shell.exec(`git clone ${snippets[i].git_pull_url}`)
          }
          shell.exec("git clone https://gist.github.com/3d6c04518e71003b7b25447314e83271.git")
          shell.cp("./3d6c04518e71003b7b25447314e83271/index.js", ".")
          shell.rm("-rf", "3d6c04518e71003b7b25447314e83271")
          shell.exec("npm init -y")
          shell.exec("npm install require-directory")
        } else {
          shell.cd("~")
          shell.cd("code_bank")
          shell.mkdir(vaultName)
          shell.cd(vaultName)
          for (var i = 0; i < snippets.length; i++) {
            shell.exec(`git clone ${snippets[i].git_pull_url}`)
          }
          shell.exec("git clone https://gist.github.com/3d6c04518e71003b7b25447314e83271.git")
        }
      }
    })
    .catch(console.log("err"))
});