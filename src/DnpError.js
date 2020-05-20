// dnp3-lib: src/lib/DnpError
/**
 * Module that defines DnpError class.
 * @module lib/DnpError.js
 */

/** Class for DNP errors. */
class DnpError extends Error {
  /**
   * Constructor's class for DnpError.
   * @constructor
   */
  constructor (err_no, ...params) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DnpError)
    }

    this.err_no = err_no
    this.stamp = new Date()
  }

}

module.exports = DnpError

