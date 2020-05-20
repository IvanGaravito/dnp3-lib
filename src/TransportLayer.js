// dnp3-lib: src/lib/TransportLayer.js
/**
 * Module that defines the pseudo-transport layer.
 * @module lib/TransportLayer.js
 */

const DnpError = require('./DnpError.js')
const DnpErrorPrefix = '[DnpError.TransportLayer]'

// Error constants
const ERR_OK            = true
const ERR_USINGNEW      = [1, `${DnpErrorPrefix} Constructor called directly`]

// Error object list to export
const Errors = {
  ERR_OK,
  ERR_USINGNEW
}

const Segment = require('./Segment.js')

const LinkLayer = require('./LinkLayer.js')
const ApplicationLayer = require('./ApplicationLayer.js')

/** Class that abstract the pseudo-transport layer Transport Service Data Unit (TSDU). */
class TransportLayer {
  /**
   * Creates a new TransportLayer instance with specified options.
   * @param {Object} options - The transport header layer options.
   * @returns {TransportLayer} A new TransportLayer instance.
   */
  static create (options) {
  }

  /**
   * Constructor's class that creates a new pseudo-transport layer service. **NOTE:** You should use the form `TransportLayer.create()`.
   * @hideconstructor
   */
  constructor (options) {
    if (!options._from || options._from !== 'create' && options._from !== 'from') {
      throw new DnpError(ERR_USINGNEW[0], ERR_USINGNEW[1])
    }
  }

  // ATTRIBUTES

  // METHODS

  toString () {
  }
}

module.exports = TransportLayer

