// dnp3-lib: src/lib/ApplicationLayer.js
/**
 * Module that defines the application layer.
 * @module lib/ApplicationLayer.js
 */

const DnpError = require('./DnpError.js')
const DnpErrorPrefix = '[DnpError.ApplicationLayer]'

let errNo = 0

// Error constants
const ERR_OK            = true
const ERR_USINGNEW      = [++errNo, `${DnpErrorPrefix} Constructor called directly`]
const ERR_INVALIDTRANSPORTLAYER = [++errNo, `${DnpErrorPrefix} Invalid transport layer service`]

// Error object list to export
const Errors = {
  ERR_OK,
  ERR_USINGNEW,
  ERR_INVALIDTRANSPORTLAYER,
}

const TransportLayer = require('./TransportLayer.js')

/** Class that abstract the application layer Application Service Data Unit (ASDU). */
class ApplicationLayer {
  /**
   * Creates a new ApplicationLayer instance with specified options.
   * @param {Object} options - The application header layer options.
   * @returns {ApplicationLayer} A new ApplicationLayer instance.
   */
  static create (options) {
    return new ApplicationLayer({
      _from: 'create'
    })
  }

  /**
   * Constructor's class that creates a new application layer service. **NOTE:** You should use the form `ApplicationLayer.create()`.
   * @hideconstructor
   */
  constructor (options) {
    if (!options._from || options._from !== 'create' && options._from !== 'from') {
      throw new DnpError(ERR_USINGNEW[0], ERR_USINGNEW[1])
    }

    this._transportLayer = null
  }

  // ATTRIBUTES

  get transportLayer () {
    return this._transportLayer
  }
  set transportLayer (layer) {
    layer = layer || null
    if (layer && !layer instanceof TransportLayer) {
      throw new DnpError(ERR_INVALIDTRANSPORTLAYER[0], ERR_INVALIDTRANSPORTLAYER[1])
    }

    // TODO: unbind event handlers when layer is null, otherwise bind them

    this._transportLayer = layer
  }

  // METHODS

  toString () {
    // TODO: convert to string
  }
}

module.exports = ApplicationLayer

