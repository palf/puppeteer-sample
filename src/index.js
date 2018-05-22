'use strict'

const fs = require('fs')
const puppeteer = require('puppeteer')

const orderDeclinedTest = require('./tests/order-declined')
const baseUrl = 'http://localhost:3000/'

function runTest (page, someTest) {
  return someTest(page)
    .then((v) => ({ output: v, result: true}))
    .catch((e) => ({ output: e, result: false}))
}

function createDirectory (dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
}

(async () => {
  createDirectory('./screenshots')
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']})
  const page = await browser.newPage()
  const outcome = await runTest({ page, baseUrl }, orderDeclinedTest)
  console.log(outcome.output);
  await browser.close()
  process.exit(outcome.result ? 0 : 1);
})()
