// dnp3-lib: src/lib/LinkLayer.js
/**
 * Module that defines the datalink layer.
 * @module lib/LinkLayer.js
 */

const DnpError = require('./DnpError.js')
const DnpErrorPrefix = '[DnpError.LinkLayer]'

let errNo = 0

// Error constants
const ERR_OK            = true
const ERR_USINGNEW      = [++errNo, `${DnpErrorPrefix} Constructor called directly`]
const ERR_INVALIDDSTDIR = [++errNo, `${DnpErrorPrefix} Invalid destination dir`]
const ERR_INVALIDSRCDIR = [++errNo, `${DnpErrorPrefix} Invalid source dir`]
const ERR_SAMEDSTANDSRC = [++errNo, `${DnpErrorPrefix} Same destination and source dir`]
const ERR_INVALIDPHYSICALLAYER  = [++errNo, `${DnpErrorPrefix} Invalid physical layer service`]
const ERR_INVALIDTRANSPORTLAYER = [++errNo, `${DnpErrorPrefix} Invalid transport layer service`]

// Error object list to export
const Errors = {
  ERR_OK,
  ERR_USINGNEW,
  ERR_INVALIDDSTDIR,
  ERR_INVALIDSRCDIR,
  ERR_SAMEDSTANDSRC,
  ERR_INVALIDPHYSICALLAYER,
  ERR_INVALIDTRANSPORTLAYER
}

const Block = require('./Block.js')
const Frame = require('./Frame.js')
const LinkHeader = require('./LinkHeader.js')

const PhysicalLayer = require('./PhysicalLayer.js')
const TransportLayer = require('./TransportLayer.js')

/*
Block 0  : 10 bytes =  8 data bytes + 2 CRC bytes
Block 1-n: 18 bytes = 16 data bytes + 2 CRC bytes

Max frame size: 1 Block 0 (10 bytes) + 15 Blocks (18 bytes) + 1 Block (12 bytes) = 292 bytes
*/

/** Class that abstract the datalink layer Link Service Data Unit (LSDU). */
class LinkLayer {
  /**
   * Creates a new LinkLayer instance with specified options.
   * @param {Object} options - The datalink header layer options.
   * @param {number} options.sdstDir - Destination dir.
   * @param {number} options.scrDir - Source dir.
   * @returns {LinkLayer} A new LinkLayer instance.
   */
  static create ({dstDir, srcDir}) {
    dstDir = dstDir || null
    srcDir = srcDir || null

    if (!dstDir || dstDir < 0 || dstDir > 0xFFFE) {
      return new DnpError(ERR_INVALIDDSTDIR[0], ERR_INVALIDDSTDIR[1])
    }
    if (!srcDir || srcDir < 0 || srcDir > 0xFFFE) {
      return new DnpError(ERR_INVALIDSRCDIR[0], ERR_INVALIDSRCDIR[1])
    }
    if (dstDir === srcDir) {
      return new DnpError(ERR_SAMEDSTANDSRC[0], ERR_SAMEDSTANDSRC[1])
    }

    return new LinkLayer({
      dstDir,
      srcDir,
      _from: 'create'
    })
  }

  /**
   * Constructor's class that creates a new datalink layer service. **NOTE:** You should use the form `LinkLayer.create()`.
   * @hideconstructor
   */
  constructor (options) {
    if (!options._from || options._from !== 'create' && options._from !== 'from') {
      throw new DnpError(ERR_USINGNEW[0], ERR_USINGNEW[1])
    }

    this._dstDir = options.dstDir
    this._srcDir = options.srcDir
    this._physicalLayer = null
    this._transportLayer = null
  }


  // ATTRIBUTES

  get dstDir () {
    return this._dstDir
  }
  get srcDir () {
    return this._srcDir
  }
  get physicalLayer () {
    return this._physicalLayer
  }
  set physicalLayer (layer) {
    layer = layer || null
    if (layer && !layer instanceof PhysicalLayer) {
      throw new DnpError(ERR_INVALIDPHYSICAL[0], ERR_INVALIDPHYSICAL[1])
    }

    // TODO: unbind event handlers when layer is null, otherwise bind them

    this._physicalLayer = layer
  }
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

module.exports = LinkLayer

