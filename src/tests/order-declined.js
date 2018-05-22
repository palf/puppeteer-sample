'use strict'

const a = require('../actions')
const e = require('../assertions')

const card = {
  type: 'visa',
  cvn: '123',
  number: '4111111111111111',
  expiry: {
    month: '01',
    year: '2019'
  }
}

function orderDeclinedTest ({page, baseUrl}) {
  const localScreenshot = a.takeScreenshot.bind(null, page, `order-declined`)

  return a.openLink(page, baseUrl)
    .then(a.readTitle(page))
    .then(e.assertEquals('Cybersource POST test'))
    .then(localScreenshot('01_before-confirm'))

    .then(a.clickConfirm(page))
    .then(a.waitForPageChange(page))
    .then(a.readTitle(page))
    .then(e.assertEquals('Checkout'))
    .then(a.selectCardType(page, card.type))
    .then(a.enterCardNumber(page, card.number))
    .then(a.enterCVN(page, card.cvn))
    .then(a.enterExpiryDate(page, card.expiry.month, card.expiry.year))
    .then(localScreenshot('02_before-submit'))

    .then(a.clickSubmit(page))
    .then(a.waitForPageChange(page))
    .then(a.readTitle(page))
    .then(e.assertEquals('Review your Order'))
    .then(localScreenshot('03_before-pay'))

    .then(a.clickPay(page))
    .then(a.waitForPageChange(page))
    .then(a.readTitle(page))
    .then(e.assertEquals('Order Declined'))
    .then(localScreenshot('04_after-pay'))
}

module.exports = orderDeclinedTest
