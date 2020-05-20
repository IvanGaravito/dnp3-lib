// dnp3-lib: src/lib/LinkLayer.js
/**
 * Module that defines the datalink layer.
 * @module lib/LinkLayer.js
 */

const DnpError = require('./DnpError.js')
const DnpErrorPrefix = '[DnpError.LinkLayer]'

// Error constants
const ERR_OK            = true
const ERR_USINGNEW      = [1, `${DnpErrorPrefix} Constructor called directly`]
const ERR_INVALIDDSTDIR = [2, `${DnpErrorPrefix} Invalid destination dir`]
const ERR_INVALIDSRCDIR = [3, `${DnpErrorPrefix} Invalid source dir`]
const ERR_SAMEDSTANDSRC = [4, `${DnpErrorPrefix} Same destination and source dir`]
const ERR_INVALIDPHYSICAL = [5, `${DnpErrorPrefix} Invalid physical layer service`]

// Error object list to export
const Errors = {
  ERR_OK,
  ERR_USINGNEW,
  ERR_INVALIDDSTDIR,
  ERR_INVALIDSRCDIR,
  ERR_SAMEDSTANDSRC,
  ERR_INVALIDPHYSICAL
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
   * @param {number} option.sdstDir - Destination dir.
   * @param {number} option.scrDir - Source dir.
   * @param {number} [option.physical] - PhysicalLayer instance to interface at physical layer.
   * @returns {LinkLayer} A new LinkLayer instance.
   */
  static create ({dstDir, srcDir, physical}) {
    dstDir = dstDir || null
    srcDir = srcDir || null
    physical = physical || null

    if (!dstDir || dstDir < 0 || dstDir > 0xFFFE) {
      return new DnpError(ERR_INVALIDDSTDIR[0], ERR_INVALIDDSTDIR[1])
    }
    if (!srcDir || srcDir < 0 || srcDir > 0xFFFE) {
      return new DnpError(ERR_INVALIDSRCDIR[0], ERR_INVALIDSRCDIR[1])
    }
    if (dstDir === srcDir) {
      return new DnpError(ERR_SAMEDSTANDSRC[0], ERR_SAMEDSTANDSRC[1])
    }
    if (physical && !physical instanceof PhysicalLayer) {
      return new DnpError(ERR_INVALIDPHYSICAL[0], ERR_INVALIDPHYSICAL[1])
    }

    return new LinkLayer({
      dstDir,
      srcDir,
      physical,
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
    this._physical = options.physical
  }

  // ATTRIBUTES

  get dstDir () {
    return this._dstDir
  }
  get srcDir () {
    return this._srcDir
  }
  get physical () {
    return this._dstDir
  }
  set physical (physical) {
    physical = physical || null
    if (physical && !physical instanceof PhysicalLayer) {
      return new DnpError(ERR_INVALIDPHYSICAL[0], ERR_INVALIDPHYSICAL[1])
    }

    this._physical = physical
  }

  // METHODS

  toString () {
  }
}

module.exports = LinkLayer

