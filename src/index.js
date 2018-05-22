const fs = require('fs')
const puppeteer = require('puppeteer')

function readTitle (page) {
  return () => page.title()
}

function clickConfirm (page) {
  return () => page.click('.confirm-button')
}

function assertEquals (expected) {
  return (actual) => new Promise((resolve, reject) =>
    (expected === actual)
      ? resolve(actual)
      : reject({ message: `expected (${expected}) did not match actual (${actual})` })
  )
}

function waitForPageChange (page, href) {
  const pageChangeException = (e) => ({
    error: e,
    message: 'could not change page'
  })

  return () =>
    (page.waitForNavigation({ timeout: 5000 }).catch(pageChangeException))
      .then(readTitle(page))
      .then(assertEquals(href))
}

function thisTest (page) {
  const testName = 'post-test'
  return openLink(page)
    .then(readTitle(page))
    .then(assertEquals('Cybersource POST test'))
    .then(clickConfirm(page))
    .then(waitForPageChange(page, 'Checkout'))
    .then(selectCardType(page, 'visa'))
    .then(enterCardDetails(page))
    .then(enterCVN(page))
    .then(enterExpiryDate(page))
    .then(screenshot(page, testName))
}

function enterExpiryDate (page) {
  return () => page.$('select#card_expiry_month')
    .then((el) => el.type('01'))
    .then(() => page.$('select#card_expiry_year')
      .then((el) => el.type('2019'))
    )
}

function enterCVN (page) {
  return () => page.$('input#card_cvn')
    .then((el) => el.type('123'))
}

function enterCardDetails (page) {
  return () => page.$('input#card_number')
    .then((el) => el.type('4111111111111111'))
}

function selectCardType (page, type) {
  // const selectError = (e) => {
  //   console.log('error!')
  //   return ({
  //     error: e,
  //     message: 'could not select card 001'
  //   })
  // }

  return () => page.click('input#card_type_001')
}

function screenshot (page, testName) {
  return () => page.screenshot({
    path: `./screenshots/${new Date().toISOString()}-${testName}.png`,
    fullPage: true
  })
}

function openLink (page) {
  const pageLink = 'http://localhost:3000/'

  const gotoPageException = (e) =>
    new Promise((resolve, reject) =>
      reject({
        message: 'unable to open page',
        link: pageLink,
        error: e.message
      })
    )

  return page
    .goto(pageLink, {waitUntil: 'networkidle0'})
    .catch(gotoPageException)
}

function runTest (page, someTest) {
  return someTest(page)
    .then(() => ({ message: 'generic success' }))
    .catch((e) => ({ message: 'generic error', error: e }))
}

(async () => {
  fs.mkdirSync('./screenshots')
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']})
  const page = await browser.newPage()
  const outcome = await runTest(page, thisTest)
  console.log(outcome)
  await browser.close()
})()
