// dnp3-lib: src/lib/ApplicationLayer.js
/**
 * Module that defines the application layer.
 * @module lib/ApplicationLayer.js
 */

const DnpError = require('./DnpError.js')
const DnpErrorPrefix = '[DnpError.ApplicationLayer]'

const TransportLayer = require('./TransportLayer.js')

/** Class that abstract the application layer Application Service Data Unit (ASDU). */
class ApplicationLayer {
  /**
   * Creates a new ApplicationLayer instance with specified options.
   * @param {Object} options - The application header layer options.
   * @returns {ApplicationLayer} A new ApplicationLayer instance.
   */
  static create (options) {
  }

  /**
   * Constructor's class that creates a new application layer service. **NOTE:** You should use the form `ApplicationLayer.create()`.
   * @hideconstructor
   */
  constructor () {
  }

  // ATTRIBUTES

  // METHODS

  toString () {
  }
}

module.exports = ApplicationLayer

