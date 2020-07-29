// dnp3-lib: src/lib/Medium.js
/**
 * Module that defines the common Medium class.
 * @module lib/Medium.js
 */

const DnpError = require('./DnpError.js')
const DnpErrorPrefix = '[DnpError.Medium]'

let errNo = 0

// Error constants
const ERR_OK             = true
const ERR_USINGNEW       = [++errNo, `${DnpErrorPrefix} Constructor called directly`]
const ERR_INVALIDOPTIONS = [++errNo, `${DnpErrorPrefix} Invalid options`]
const ERR_INVALIDOPTION  = [++errNo, `${DnpErrorPrefix} Invalid option`]

// Error object list to export
const Errors = {
  ERR_OK,
  ERR_USINGNEW,
  ERR_INVALIDMEDIUMOPTIONS,
  ERR_INVALIDOPTION
}

/** Class that abstract a communication medium. */
class Medium {
  /**
   * Creates a new Medium instance with specified options.
   * @param {Object} options - The medium options.
   * @returns {Medium} A new Medium instance.
   */
  static create (options) {
    options = options || null

    if (!options || Object.keys(options).length === 0) {
      return new DnpError(ERR_INVALIDOPTIONS[0], ERR_INVALIDOPTIONS[1])
    }

    return new Medium({
      options,
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

    this._options = options
  }

  // ATTRIBUTES

  // METHODS

  getOption (name) {
    if (!this._options.hasOwnProperty(name)) {
      throw new DnpError(ERR_INVALIDOPTION[0], ERR_INVALIDOPTION[1])
    }
    return this._options[name]
  }
  setOption (name, value) {
    if (!this._options.hasOwnProperty(name)) {
      throw new DnpError(ERR_INVALIDOPTION[0], ERR_INVALIDOPTION[1])
    }
    this._options[name] = value
  }

  toString () {
    // TODO: convert to string
  }
}

module.exports = Medium

