// dnp3-lib: src/lib/PhysicalLayer.js
/**
 * Module that defines the physical layer.
 * @module lib/PhysicalLayer.js
 */

const DnpError = require('./DnpError.js')
const DnpErrorPrefix = '[DnpError.PhysicalLayer]'

let errNo = 0

// Error constants
const ERR_OK                = true
const ERR_USINGNEW          = [++errNo, `${DnpErrorPrefix} Constructor called directly`]
const ERR_INVALIDMEDIUMTYPE = [++errNo, `${DnpErrorPrefix} Invalid medium type`]
const ERR_INVALIDLINKLAYER  = [++errNo, `${DnpErrorPrefix} Invalid link layer service`]

// Error object list to export
const Errors = {
  ERR_OK,
  ERR_USINGNEW,
  ERR_INVALIDMEDIUMTYPE,
  ERR_INVALIDLINKLAYER
}

const Medium = require('./Medium.js')
const mediumTypeList = {
  file: require('./FileMedium.js'),
  network: require('./NetworkMedium.js'),
  serial: require('./SerialMedium.js')
}

const LinkLayer = require('./LinkLayer.js')

/** Class that abstract the physical layer. */
class PhysicalLayer {
  /**
   * Creates a new PhysicalLayer instance with specified options.
   * @param {Object} options - The physical header layer options.
   * @param {string} options.mediumType - The medium type (e.g. file, network, serial).
   * @param {Object} options.mediumOptions - The options when instancing the medium object.
   * @returns {PhysicalLayer} A new PhysicalLayer instance.
   */
  static create ({mediumType, mediumOptions}) {
    mediumType = mediumType || null
    mediumOptions = mediumOptions || null

    if (!mediumType || Object.keys(mediumTypeList).indexOf(mediumType) === -1) {
      return new DnpError(ERR_INVALIDMEDIUMTYPE[0], ERR_INVALIDMEDIUMTYPE[1])
    }

    return new PhysicalLayer({
      mediumType,
      mediumOptions,
      _from: 'create'
    })
  }

  /**
   * Constructor's class that creates a new physical layer service. **NOTE:** You should use the form `PhysicalLayer.create()`.
   * @hideconstructor
   */
  constructor (options) {
    if (!options._from || options._from !== 'create' && options._from !== 'from') {
      throw new DnpError(ERR_USINGNEW[0], ERR_USINGNEW[1])
    }

    this._linkLayer = null

    // Creates a new instace of the medium
    this._medium = mediumTypeList[options.mediumType].create(options.mediumOptions)
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
  get medium () {
    return this._medium
  }

  // METHODS

  toString () {
    // TODO: convert to string
  }
}

module.exports = PhysicalLayer

