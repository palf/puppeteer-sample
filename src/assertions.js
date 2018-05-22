function assertEquals (expected) {
  return (actual) => new Promise((resolve, reject) =>
    (expected === actual)
      ? resolve(actual)
      : reject({ message: `expected (${expected}) did not match actual (${actual})` })
  )
}

module.exports = {
  assertEquals
}
