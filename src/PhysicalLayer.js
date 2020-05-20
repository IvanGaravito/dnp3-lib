// dnp3-lib: src/lib/PhysicalLayer.js
/**
 * Module that defines the physical layer.
 * @module lib/PhysicalLayer.js
 */

const DnpError = require('./DnpError.js')
const DnpErrorPrefix = '[DnpError.PhysicalLayer]'

// Error constants
const ERR_OK            = true
const ERR_USINGNEW      = [1, `${DnpErrorPrefix} Constructor called directly`]

const LinkLayer = require('./LinkLayer.js')

/** Class that abstract the physical layer. */
class PhysicalLayer {
  /**
   * Creates a new PhysicalLayer instance with specified options.
   * @param {Object} options - The physical header layer options.
   * @returns {PhysicalLayer} A new PhysicalLayer instance.
   */
  static create (options) {
  }

  /**
   * Constructor's class that creates a new physical layer service. **NOTE:** You should use the form `PhysicalLayer.create()`.
   * @hideconstructor
   */
  constructor () {
  }

  // ATTRIBUTES

  // METHODS

  toString () {
  }
}

module.exports = PhysicalLayer

