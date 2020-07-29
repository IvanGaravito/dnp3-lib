// dnp3-lib: src/lib/TransportLayer.js
/**
 * Module that defines the pseudo-transport layer.
 * @module lib/TransportLayer.js
 */

const DnpError = require('./DnpError.js')
const DnpErrorPrefix = '[DnpError.TransportLayer]'

let errNo = 0

// Error constants
const ERR_OK            = true
const ERR_USINGNEW      = [++errNo, `${DnpErrorPrefix} Constructor called directly`]
const ERR_INVALIDLINKLAYER        = [++errNo, `${DnpErrorPrefix} Invalid link layer service`]
const ERR_INVALIDAPPLICATIONLAYER = [++errNo, `${DnpErrorPrefix} Invalid application layer service`]

// Error object list to export
const Errors = {
  ERR_OK,
  ERR_USINGNEW,
  ERR_INVALIDLINKLAYER,
  ERR_INVALIDAPPLICATIONLAYER
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
    return new TransportLayer({
      _from: 'create'
    })
  }

  /**
   * Constructor's class that creates a new pseudo-transport layer service. **NOTE:** You should use the form `TransportLayer.create()`.
   * @hideconstructor
   */
  constructor (options) {
    if (!options._from || options._from !== 'create' && options._from !== 'from') {
      throw new DnpError(ERR_USINGNEW[0], ERR_USINGNEW[1])
    }

    this._linkLayer = null
    this._applicationLayer = null
  }

  // ATTRIBUTES

  get linkLayer () {
    this._linkLayer
  }
  set linkLayer (layer) {
    layer = layer || null
    if (layer && !layer instanceof LinkLayer) {
      throw new DnpError(ERR_INVALIDLINKLAYER[0], ERR_INVALIDLINKLAYER[1])
    }

    // TODO: unbind event handlers when layer is null, otherwise bind them

    this._linkLayer = layer
  }
  get applicationLayer () {
    this._applicationLayer
  }
  set applicationLayer (layer) {
    layer = layer || null
    if (layer && !layer instanceof ApplicationLayer) {
      throw new DnpError(ERR_INVALIDAPPLICATIONLAYER[0], ERR_INVALIDAPPLICATIONLAYER[1])
    }

    // TODO: unbind event handlers when layer is null, otherwise bind them

    this._applicationLayer = layer
  }

  // METHODS

  toString () {
    // TODO: convert to string
  }
}

module.exports = TransportLayer

