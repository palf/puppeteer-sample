function assertEquals (expected) {
  return (actual) => new Promise((resolve, reject) =>
    (expected === actual)
      ? resolve(actual)
      : reject({ message: `expected (${expected}); actual (${actual})` })
  )
}

module.exports = {
  assertEquals
}
