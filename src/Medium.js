// dnp3-lib: src/lib/Medium.js
/**
 * Module that defines the common Medium class.
 * @module lib/Medium.js
 */

const DnpError = require('./DnpError.js')
const DnpErrorPrefix = '[DnpError.Medium]'

// Error constants
const ERR_OK            = true
const ERR_USINGNEW      = [1, `${DnpErrorPrefix} Constructor called directly`]
const ERR_INVALIDMEDIUM = [4, `${DnpErrorPrefix} Invalid medium`]

// Error object list to export
const Errors = {
  ERR_OK,
  ERR_USINGNEW,
  ERR_INVALIDMEDIUM,
}

/** Class that abstract a communication medium. */
class Medium {
  /**
   * Creates a new Medium instance with specified options.
   * @param {Object} options - The medium options.
   * @param {Buffer} [buffer] - Use existing buffer instead of creating new Buffer instance.
   * @returns {Medium} A new Medium instance.
   */
  static create ({}) {
  }

  constructor () {
  }

  // ATTRIBUTES

  // METHODS

  toString () {
  }
}

module.exports = Medium

