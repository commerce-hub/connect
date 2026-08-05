// Masked overlay text for sensitive fields. Reveals only the last visible
// character for a brief peek when `revealLast` is set; spaces are preserved so
// the overlay aligns with formatted values (e.g. card numbers).
export const maskRevealText = (value: string, revealLast: boolean): string => {
  if (!value) {
    return '';
  }

  const chars = [...value];
  let lastVisibleIndex = -1;

  for (let index = chars.length - 1; index >= 0; index -= 1) {
    if (chars[index] !== ' ') {
      lastVisibleIndex = index;
      break;
    }
  }

  return chars
    .map((char, index) => {
      if (char === ' ') {
        return ' ';
      }

      return revealLast && index === lastVisibleIndex ? char : '\u2022';
    })
    .join('');
};
