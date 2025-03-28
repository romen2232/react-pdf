import append from './append';
import add from '../run/add';
import insert from '../run/insert';
import runIndexAt from './runIndexAt';
import stringFromCodePoints from '../utils/stringFromCodePoints';
import { AttributedString, Glyph } from '../types';

/**
 * Insert glyph into attributed string
 *
 * @param index - Index
 * @param glyph - Glyph or code point
 * @param attributedString - Attributed string
 * @returns Attributed string with new glyph
 */
const insertGlyph = (
  index: number,
  glyph: Glyph | number,
  attributedString: AttributedString,
): AttributedString => {
  const runIndex = runIndexAt(index, attributedString);

  // Add glyph to the end if run index invalid
  if (runIndex === -1) return append(glyph, attributedString);

  const codePoints =
    typeof glyph === 'number' ? [glyph] : glyph?.codePoints || [];

  const string =
    attributedString.string.slice(0, index) +
    stringFromCodePoints(codePoints) +
    attributedString.string.slice(index);

  const runs = attributedString.runs.map((run, i) => {
    if (i === runIndex) return insert(index - run.start, glyph, run);

    if (i > runIndex) return add(codePoints.length, run);

    return run;
  });

  return Object.assign({}, attributedString, { string, runs });
};

export default insertGlyph;
