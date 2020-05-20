// dnp3-lib: src/lib/FileMedium.js
/**
 * Module that defines the FileMedium class.
 * @module lib/FileMedium.js
 */

const DnpError = require('./DnpError.js')
const DnpErrorPrefix = '[DnpError.FileMedium]'

// Error constants
const ERR_OK            = true
const ERR_USINGNEW      = [1, `${DnpErrorPrefix} Constructor called directly`]

const Medium = require('Medium.js')

/** Class that abstract a file communication medium. */
class FileMedium extends Medium {
  static create () {}

  constructor () {
    super()
  }

  // ATTRIBUTES

  // METHODS

  toString () {
  }
}

module.exports = FileMedium

