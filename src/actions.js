'use strict'

function type (page, selector, text) {
  return () => page.$(selector).then((el) => el.type(text))
}

function openLink (page, link) {
  const gotoPageException = (e) =>
    Promise.reject({
      message: 'unable to open page',
      link: link,
      error: e.message
    })

  return page
    .goto(link, {waitUntil: 'networkidle0'})
    .catch(gotoPageException)
}

function readTitle (page) {
  return () => page.title()
}

function clickConfirm (page) {
  return () => page.click('.confirm-button')
}

function clickSubmit (page) {
  return () => page.click('input[value=Next]')
}

function clickPay (page) {
  return () => page.click('input[value=Pay]')
}

function selectCardType (page, type) {
  return () => page.click('input#card_type_001')
}

function waitForPageChange (page) {
  const pageChangeException = (e) => ({
    error: e,
    message: 'could not change page'
  })

  return () => page
    .waitForNavigation({ timeout: 5000 })
    .catch(pageChangeException)
}

function enterExpiryDate (page, month, year) {
  const enterYear = type(page, 'select#card_expiry_year', year)

  return () => page
    .$('select#card_expiry_month')
    .then(
      (el) => el.type(month)
    )
    .then(enterYear)
}

function enterCVN (page, cvn) {
  return type(page, 'input#card_cvn', cvn)
}

function enterCardNumber (page, number) {
  return type(page, 'input#card_number', number)
}

function takeScreenshot (page, testName, label) {
  const path = `./screenshots/${testName}_${label}.png`
  const options = { path: path, fullPage: true }

  return (v) => page.screenshot(options)
    .then(() => v)
}

module.exports = {
  clickConfirm,
  clickPay,
  clickSubmit,
  enterCVN,
  enterCardNumber,
  enterExpiryDate,
  openLink,
  readTitle,
  selectCardType,
  takeScreenshot,
  waitForPageChange
}
