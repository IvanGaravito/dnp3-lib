// dnp3-lib: src/lib/Segment.js
/**
 * Module that defines the pseudo-transport layer Transport Protocol Data Unit (TPDU).
 * @module lib/Segment.js
 */

/** Class that abstract the pseudo-transport layer Transport Protocol Data Unit (TPDU). */
class Segment {
  static create ({transportHeader, segmentPayload}) {
  }
  static from (linkPayload) {
  }

  constructor () {
  }

  // ATTRIBUTES

  get linkPayload () {
  }
  get transportHeader () {
  }
  get segmentPayload () {
  }

  // METHODS

  toString () {
  }
}

module.exports = Segment

