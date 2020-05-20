// dnp3-lib: src/lib/LinkHeader.js
/**
 * Module that defines the datalink header.
 * @module lib/LinkHeader.js
 */

const DnpError = require('./DnpError.js')
const DnpErrorPrefix = '[DnpError.LinkHeader]'

// Error constants
const ERR_OK              = true
const ERR_USINGNEW        = [1, `${DnpErrorPrefix} Constructor called directly`]
const ERR_INVALIDLENGTH   = [2, `${DnpErrorPrefix} Invalid frame length`]
const ERR_INVALIDDSTDIR   = [3, `${DnpErrorPrefix} Invalid destination dir`]
const ERR_INVALIDSRCDIR   = [4, `${DnpErrorPrefix} Invalid source dir`]
const ERR_SAMEDSTANDSRC   = [5, `${DnpErrorPrefix} Same destination and source dir`]
const ERR_INVALIDBITVALUE = [6, `${DnpErrorPrefix} Invalid bit value`]
const ERR_BADFUNCTIONCODE = [7, `${DnpErrorPrefix} Bad function code`]
const ERR_NOTABLOCK       = [8, `${DnpErrorPrefix} Its not a block`]
const ERR_BADBLOCKSTART   = [9, `${DnpErrorPrefix} Block start is not 0564`]
const ERR_BADBLOCKLENGTH  = [10, `${DnpErrorPrefix} Bad block 0 length`]

// Error object list to export
const Errors = {
  ERR_OK,
  ERR_USINGNEW,
  ERR_INVALIDLENGTH,
  ERR_INVALIDDSTDIR,
  ERR_INVALIDSRCDIR,
  ERR_SAMEDSTANDSRC,
  ERR_INVALIDBITVALUE,
  ERR_BADFUNCTIONCODE,
  ERR_NOTABLOCK,
  ERR_BADBLOCKLENGTH
}

const Block = require('./Block.js')

function getBit (byte, bit) {
  return (byte & (1 << bit)) >> bit
}

function setBit (byte, bit, value) {
    return byte & ~(1 << bit) | value << bit
}

/*
*/

/** Class that abstract the datalink layer Link Protocol Data Unit (LPDU).
  *
  * Block 0 is 10 bytes = 8 data bytes + 2 CRC bytes, as follows:
  * ```
  * |   START   | LEN | CTR |    DST    |    SRC    |    CRC    |  Block 0
  * |    2 B    | 1 B | 1 B |    2 B    |    2 B    |    2 B    |  Field's length
  * |  1  |  2  |  3  |  4  |  5  |  6  |  7  |  8  |  9  | 10  |  Byte number
  * ```
  *
  * Link header fields:
  *  * START  Start mark for DNP3 frames
  *  * LEN    Content length (excludes START, LEN, and CRC of each block
  *  * CTR+   Control field for communication
  *  * DST+   DNP3 destination dir to send to the frame
  *  * SRC+   DNP3 source dir from which the frame is sent
  *
  * Note: fields marked with `+` are considered part of the content len
  *
  * CTR byte as follows:
  * ```
  * | DIR | PRM |-----------|     FUNCTION CODE     |
  * |     |  1  | FCB | FCV |          FNC          |  Frame type: primary
  * |     |  0  |  0  | DFC |                       |  Frame type: secondary
  * | 1 b | 1 b | 1 b | 1 b |          4 b          |  Field's length
  * |  7  |  6  |  5  |  4  |  3  |  2  |  1  |  0  |  Bit number
  * ```
  *
  * CTR fields:
  *  * DIR  Communication direction
  *     + 1 Master to slave
  *     + 0 Slave to master
  *  * PRM  Frame type, FNC should be accord
  *     + 1 Primary
  *     + 0 Secundary
  *  * FCB  Frame Count Bit
  *  * FCV  Frame Count bit Valid
  *  * DFC  Data Flow Control bit
  *  * RES  Reserved = 0
  *  * FNC  Purpose of the frame
  */
class LinkHeader {
  static fcvRequired = [2, 3] 
  static validFunctionCodes = [
    [0, 1, 11],         // prm = 0
    [0, 1, 2, 3, 4, 9]  // prm = 1
  ]

  /**
   * Creates a new LinkHeader instance with specified options.
   * @param {Block} block - A block 0 to write data to.
   * @param {Object} options - The datalink header layer options.
   * @param {number} options.len - The frame's content length.
   * @param {number} options.dir - Communication direction.
   * @param {number} options.prm - Frame type.
   * @param {number} options.fnc - Datalink function code.
   * @param {number} options.dstDir - Destination dir.
   * @param {number} options.srcDir - Source dir.
   * @returns {LinkHeader} A new LinkHeader instance.
   */
  static create (block, {len, dir, prm, fnc, dstDir, srcDir}) {
    // Validate block 0
    if (!(block && block instanceof Block)) {
      return new DnpError(ERR_NOTABLOCK[0], ERR_NOTABLOCK[1])
    }
    if (block.length !== 8) {
      return new DnpError(ERR_BADBLOCKLENGTH[0], ERR_BADBLOCKLENGTH[1])
    }

    // Prepare options
    len = len || null
    dir = dir || null
    prm = prm || null
    fnc = fnc || null
    dstDir = dstDir || null
    srcDir = srcDir || null

    // Creates new instance
    return new LinkHeader({
      block,
      len,
      dir,
      prm,
      fnc,
      dstDir,
      srcDir,
      _from: 'create'
    })
  }

  /**
   * Creates a new LinkHeader instance from an existing block 0.
   * @param {Block} block - Existing block 0 to read data from.
   * @returns {LinkHeader} A new LinkHeader instance.
   */
  static from (block) {
    // Validate block 0
    if (!(block && block instanceof Block)) {
      return new DnpError(ERR_NOTABLOCK[0], ERR_NOTABLOCK[1])
    }
    if (block.length !== 8) {
      return new DnpError(ERR_BADBLOCKLENGTH[0], ERR_BADBLOCKLENGTH[1])
    }
    let buffer = block.buffer
    if (buffer[0] !== 0x05 || buffer[1] !== 0x64) {
      return new DnpError(ERR_BADBLOCKSTART[0], ERR_BADBLOCKSTART[1])
    }

    // Creates new instance
    return new LinkHeader({
      block,
      buffer,
      _from: 'from'
    })
  }

  /**
   * Constructor's class that creates a new datalink header. **NOTE:** You should use the form `LinkHeader.create()` or `LinkHeader.from()`.
   * @hideconstructor
   */
  constructor (options) {
    if (!options._from || options._from !== 'create' && options._from !== 'from') {
      throw new DnpError(ERR_USINGNEW[0], ERR_USINGNEW[1])
    }

    // keep a local reference
    this._block = options.block
    this._buffer = options.buffer || this._block.buffer

    if (options._from === 'create') {
      this._buffer.writeUInt16BE(0, 0x0564)
      this.len = options.len
      this.dir = options.dir
      this.prm = options.prm
      this.fnc = options.fnc
      this.dstDir = options.dstDir
      this.srcDir = options.srcDir
    }
  }

  // ATTRIBUTES

  get block () {
    return this._block
  }

  get len () {
    return this._buffer[2]
  }
  set len (value) {
    if (5 > value || value > 255) {
      throw new DnpError(ERR_INVALIDLENGTH[0], ERR_INVALIDLENGTH[1])
    }
    this._buffer[2] = value
  }

  get dir () {
    return this._buffer[3] & 0x80 ? 1 : 0
  }
  set dir (value) {
    if (0 > value || value > 1) {
      throw new DnpError(ERR_INVALIDBITVALUE[0], ERR_INVALIDBITVALUE[1] + ': dir')
    }
    this._buffer[3] = this._buffer[3] & ~0x80 | (value ? 0x80 : 0)
  }
  get prm () {
    return this._buffer[3] & 0x40 ? 1 : 0
  }
  set prm (value) {
    if (0 > value || value > 1) {
      throw new DnpError(ERR_INVALIDBITVALUE[0], ERR_INVALIDBITVALUE[1] + ': prm')
    }
    this._buffer[3] = this._buffer[3] & ~0x40 | (value ? 0x40 : 0)
    if (value === 0) {
      // res bit should be zero for prm = 0
      this._buffer[3] = this._buffer[3] & ~0x20
    }
  }
  get fcb () {
    if (this.prm === 0) {
      throw new DnpError(ERR_INVALIDFIELD[0], ERR_INVALIDFIELD[1] + ': fcb')
    }
    return this._buffer[3] & 0x20 ? 1 : 0
  }
  set fcb (value) {
    if (this.prm === 0) {
      throw new DnpError(ERR_INVALIDFIELD[0], ERR_INVALIDFIELD[1] + ': fcb')
    }
    if (0 > value || value > 1) {
      throw new DnpError(ERR_INVALIDBITVALUE[0], ERR_INVALIDBITVALUE[1] + ': fcb')
    }
    this._buffer[3] = this._buffer[3] & ~0x20 | (value ? 0x20 : 0)
  }
  get fcv () {
    if (this.prm === 0) {
      throw new DnpError(ERR_INVALIDFIELD[0], ERR_INVALIDFIELD[1] + ': fcv')
    }
    return this._buffer[3] & 0x10 ? 1 : 0
  }
  set fcv (value) {
    if (this.prm === 0) {
      throw new DnpError(ERR_INVALIDFIELD[0], ERR_INVALIDFIELD[1] + ': fcv')
    }
    if (0 > value || value > 1) {
      throw new DnpError(ERR_INVALIDBITVALUE[0], ERR_INVALIDBITVALUE[1] + ': fcv')
    }
    this._buffer[3] = this._buffer[3] & ~0x10 | (value ? 0x10 : 0)
  }
  get dfc () {
    if (this.prm === 1) {
      throw new DnpError(ERR_INVALIDFIELD[0], ERR_INVALIDFIELD[1] + ': dfc')
    }
    return this._buffer[3] & 0x10 ? 1 : 0
  }
  set dfc (value) {
    if (this.prm === 1) {
      throw new DnpError(ERR_INVALIDFIELD[0], ERR_INVALIDFIELD[1] + ': dfc')
    }
    if (0 > value || value > 1) {
      throw new DnpError(ERR_INVALIDBITVALUE[0], ERR_INVALIDBITVALUE[1] + ': dfc')
    }
    this._buffer[3] = this._buffer[3] & ~0x10 | (value ? 0x10 : 0)
  }
  get fnc () {
    return this._buffer[3] & 0x0F
  }
  set fnc (value) {
    const prm = this.prm
    // Check valid function code
    if (LinkHeader.validFunctionCodes[prm].indexOf(value) === -1) {
      throw new DnpError(ERR_BADFUNCTIONCODE[0], ERR_BADFUNCTIONCODE[1])
    }
    this.buffer[3] = this._buffer[3] & ~0x0F | value & 0x0F
    if (prm === 1) {
      // Sets FCV bit according the function code
      this.fcv = LinkHeader.fcvRequired.indexOf(value) === -1 ? 0 : 1
    }
  }

  get dstDir () {
    return this._buffer.readUInt16LE(4)
  }
  set dstDir (dstDir) {
    if (0 > dstDir || dstDir > 0xFFFF) {
      throw new DnpError(ERR_INVALIDDSTDIR[0], ERR_INVALIDDSTDIR[1])
    }
    if (dstDir === this.srcDir) {
      throw new DnpError(ERR_SAMEDSTANDSRC[0], ERR_SAMEDSTANDSRC[1])
    }
    this._buffer.writeUInt16LE(4, dstDir)
  }
  get srcDir () {
    return this._buffer.readUInt16LE(6)
  }
  set srcDir (srcDir) {
    if (0 > srcDir || srcDir > 0xFFFE) {
      throw new DnpError(ERR_INVALIDSRCDIR[0], ERR_INVALIDSRCDIR[1])
    }
    if (this.dstDir === srcDir) {
      throw new DnpError(ERR_SAMEDSTANDSRC[0], ERR_SAMEDSTANDSRC[1])
    }
    this._buffer.writeUInt16LE(6, srcDir)
  }

  // METHODS

  validate () {
    const buffer = this._buffer
    const len = buffer[2]

    // Check content length is at least 5 bytes
    if (5 > len) {
      return new DnpError(ERR_INVALIDLENGTH[0], ERR_INVALIDLENGTH[1])
    }

    const CTR = buffer[3]
    const prm = CTR & 0x40
    const fcb_res = CTR & 0x20
    const fcv_dfc = CTR & 0x10
    const fnc = CTR & 0x0F

    // Check bits into control field
    if (LinkHeader.validFunctionCodes[prm].indexOf(fnc) === -1) {
      return new DnpError(ERR_BADFUNCTIONCODE[0], ERR_BADFUNCTIONCODE[1])
    }
    if (prm) {
      const req = LinkHeader.fcvRequired.indexOf(fnc) === -1 ? 0 : 1
      // Check FCV bit is only set when required by function code
      if (req && !fcv_dfc || !req && fcv_dfc) {
        return new DnpError(ERR_INVALIDBITVALUE[0], ERR_INVALIDBITVALUE[1] + ': fcv')
      }
    } else if (fcb_res) {
      // res bit should be zero for prm = 0
      throw new DnpError(ERR_INVALIDFIELD[0], ERR_INVALIDFIELD[1] + ': res')
    }

    const dstDir = buffer.readUInt16LE(4)
    const srcDir = buffer.readUInt16LE(6)

    // Check source direction isn't broadcast
    if (srcDir === 0xFFFF) {
      return new DnpError(ERR_INVALIDSRCDIR[0], ERR_INVALIDSRCDIR[1])
    }
    if (dstDir === srcDir) {
      return new DnpError(ERR_SAMEDSTANDSRC[0], ERR_SAMEDSTANDSRC[1])
    }

    return ERR_OK
  }
}

module.exports = LinkHeader

