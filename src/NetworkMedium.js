// dnp3-lib: src/lib/NetworkMedium.js
/**
 * Module that defines the NetworkMedium class.
 * @module lib/NetworkMedium.js
 */

const DnpError = require('./DnpError.js')
const DnpErrorPrefix = '[DnpError.NetworkMedium]'

// Error constants
const ERR_OK            = true
const ERR_USINGNEW      = [1, `${DnpErrorPrefix} Constructor called directly`]

const Medium = require('Medium.js')

/** Class that abstract a network communication medium. */
class NetworkMedium extends Medium {
  static create () {}

  constructor () {
    super()
  }

  // ATTRIBUTES

  // METHODS

  toString () {
  }
}

module.exports = NetworkMedium

