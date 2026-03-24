
/* Intended as a temporary location for helper functions until they can be refactored into the base.parser.js */

/**
 * @param {Array<{startTime: Date, endTime: Date}>} items
 */
function getStartAndEndTime(items) {
  let startTime = null;
  let endTime = null;
  items.forEach(_item => {
    if (_item.startTime) {
      if (!startTime || _item.startTime < startTime) {
        startTime = _item.startTime;
      }
    }
    if (_item.endTime) {
      if (!endTime || _item.endTime > endTime) {
        endTime = _item.endTime;
      }
    }
  });
  return { startTime, endTime };
}

/** parse date string into Date object */
function getDate(rawDate) {
  if (!rawDate) return null;
  return new Date(rawDate);
}

/**
 *
 * @param {number} passed
 * @param {number} failed
 * @param {number} skipped
 * @param {number} errors
 * @returns {'PASS' | 'FAIL' | 'SKIP'}
 */
function resolveStatus(passed, failed, skipped, errors) {
  if (failed > 0 || errors > 0) {
    return 'FAIL';
  }
  if (passed > 0) {
    return 'PASS';
  }
  return 'SKIP';
}

module.exports = { getStartAndEndTime, getDate, resolveStatus }