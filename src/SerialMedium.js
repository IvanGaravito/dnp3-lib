// dnp3-lib: src/lib/SerialMedium.js
/**
 * Module that defines the SerialMedium class.
 * @module lib/SerialMedium.js
 */

const DnpError = require('./DnpError.js')
const DnpErrorPrefix = '[DnpError.SerialMedium]'

// Error constants
const ERR_OK            = true
const ERR_USINGNEW      = [1, `${DnpErrorPrefix} Constructor called directly`]

const Medium = require('Medium.js')

/** Class that abstract a serial communication medium. */
class SerialMedium extends Medium {
  static create () {}

  constructor () {
    super()
  }

  // ATTRIBUTES

  // METHODS

  toString () {
  }
}

module.exports = SerialMedium

