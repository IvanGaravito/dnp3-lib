// dnp3-lib: src/lib/Frame.js
/**
 * Module that defines Frame class.
 * @module lib/Frame.js
 */

const DnpError = require('./DnpError.js')
const DnpErrorPrefix = '[DnpError.Frame]'

// Error constants
const ERR_OK            = true
const ERR_NOTABUFFER    = [1, `${DnpErrorPrefix} Not a buffer`]
const ERR_BADLENGTH     = [2, `${DnpErrorPrefix} Bad buffer length`]
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

/*
Block 0  : 10 bytes =  8 data bytes + 2 CRC bytes
Block 1-n: 18 bytes = 16 data bytes + 2 CRC bytes

Max frame size: 1 Block 0 (10 bytes) + 15 Blocks (18 bytes) + 1 Block (12 bytes) = 292 bytes
*/

/** Class that abstract a FT3 block. */
class Frame {
  /**
   * Creates a new Frame instance of specified length.
   * @param {number} len - The frame total length (CRC included).
   * @param {Buffer} [buffer] - Use existing buffer instead of creating new Buffer instance.
   * @returns {Frame} A new Frame instance.
   */
  static create (len, buffer) {
    if (!len || len < 10 || len > 292) {
      return new DnpError(ERR_BADLENGTH[0], ERR_BADLENGTH[1])
    }
    // If buffer, forces always say total length
    if (buffer && len !== buffer.length) {
      return new DnpError(ERR_LENGTHDIFFERS[0], ERR_LENGTHDIFFERS[1])
    }
 
    return new Frame({
      len,
      buffer: buffer || Buffer.alloc(len),
      _from: 'create'
    })
  }

  /**
   * Creates a new Frame instance from an existing buffer.
   * @param {Buffer} buffer A buffer instance with raw's frame data
   * @returns {Frame} A new Frame instance.
   */
  static from (buffer) {
    if (!buffer || buffer.length === undefined) {
      return new DnpError(ERR_NOTABUFFER[0], ERR_NOTABUFFER[1])
    }

    // DNP3 frames has at least ten data bytes and are a maximum of 292 bytes length
    if (buffer.length < 10 || buffer.length > 292) {
      return new DnpError(ERR_BADLENGTH[0], ERR_BADLENGTH[1])
    }

    return new Frame({
      len: buffer.length,
      buffer,
      _from: 'from'
    })
  }

  /**
   * Constructor's class that creates a new frame. **NOTE:** You should use the form `Frame.create()` or `Frame.from()`.
   * @hideconstructor
   */
  constructor (options) {
  options = options || {}
    if (!options._from || options._from !== 'create' && options._from !== 'from') {
      throw new DnpError(ERR_USINGNEW[0], ERR_USINGNEW[1])
    }

    this._len = options.len
    this._buffer = options.buffer
  }

  // ATTRIBUTES

  get buffer () {
    return this._buffer.slice()
  }
  get length () {
    return this._buffer.length
  }

  // methods

  toString () {
    return this._buffer.toString('hex')
  }
}

module.exports = Frame

