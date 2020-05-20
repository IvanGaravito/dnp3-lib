// dnp3-lib: src/lib/Block.js
/**
 * Module that defines Block class.
 * @module lib/Block.js
 */

const DnpError = require('./DnpError.js')
const DnpErrorPrefix = '[DnpError.Block]'

// Error constants
const ERR_OK            = true
const ERR_NOTABUFFER    = [1, `${DnpErrorPrefix} Not a buffer`]
const ERR_BADLENGTH     = [2, `${DnpErrorPrefix} Bad block length`]
const ERR_LENGTHDIFFERS = [3, `${DnpErrorPrefix} Content length and buffer length differs`]
const ERR_USINGNEW      = [4, `${DnpErrorPrefix} Constructor called directly`]

// Error object list to export
const Errors = {
  ERR_OK,
  ERR_NOTABUFFER,
  ERR_BADLENGTH,
  ERR_LENGTHDIFFERS,
  ERR_USINGNEW
}

const crc = require('./crc.js')

/** Class that abstract a FT3 block. */
class Block {
  /**
   * Creates a new Block instance of specified length.
   * @param {number} len - The block content length (CRC not included).
   * @param {Buffer} [buffer] - Use existing buffer instead of instancing a new one.
   * @returns {Block} A new Block instance.
   */
  static create (len, buffer) {
    if (!len || len < 1 || len > 16) {
      return new DnpError(ERR_BADLENGTH[0], ERR_BADLENGTH[1])
    }
    // If buffer, forces always say content length (CRC not included)
    if (buffer && len !== buffer.length - 2) {
      return new DnpError(ERR_LENGTHDIFFERS[0], ERR_LENGTHDIFFERS[1])
    }
 
    return new Block({
      len,
      buffer: buffer || Buffer.alloc(len + 2),
      _from: 'create'
    })
  }

  /**
   * Creates a new Block instance from an existing data block and checks that the CRC at the last two bytes is correct.
   * @param {Buffer} buffer - A buffer instance with raw's block data and CRC
   * @returns {Block} A new Block instance.
   */
  static from (buffer) {
    if (!buffer || buffer.length === undefined) {
      return new DnpError(ERR_NOTABUFFER[0], ERR_NOTABUFFER[1])
    }

    // DNP3 blocks has at least one data byte and a maximum of 16 data bytes, plus 2 bytes of CRC
    if (buffer.length < 3 || buffer.length > 18) {
      return new DnpError(ERR_BADLENGTH[0], ERR_BADLENGTH[1])
    }

    return new Block({
      len: buffer.length - 2,
      buffer,
      _from: 'from'
    })
  }

  /**
   * Constructor's class that creates a new block. **NOTE:** You should use the form `Block.create()` or `Block.from()`.
   * @hideconstructor
   */
  constructor (options) {
    options = options || {}
    if (!options._from || options._from !== 'create' && options._from !== 'from') {
      throw new DnpError(ERR_USINGNEW[0], ERR_USINGNEW[1])
    }

    this._len = options.len   // content length and CRC offset
    this._buffer = options.buffer

    this._crcStatus = null
    // Validates CRC for the existing block
    if (options._from === 'from') {
      this.crcValidate()
    }
  }

  // ATTRIBUTES

  get buffer () {
    return this._buffer.slice()
  }
  get data () {
    return this._buffer.slice(0, this._len)
  }
  get crc () {
    return this._buffer.readUInt16LE(this._len)
  }
  get crcStatus() {
    return this._crcStatus
  }
  get length() {
    return this._len
  }

  // METHODS

  crcUpdate () {
    const _crc = crc.calculate(this.data)
    if (_crc instanceof DnpError) {
      this._crcStatus = _crc
      return _crc
    }
    this._crcStatus = true
    this._buffer.writeUInt16LE(_crc, this._len)
    return _crc
  }
  crcValidate() {
    this._crcStatus = crc.check(this._buffer)
    return this._crcStatus
  }
}

module.exports = Block

