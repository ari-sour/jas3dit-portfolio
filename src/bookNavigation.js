export const pageIds = ['home', 'works', 'services', 'about', 'contact'];
export const hashPage = () => Math.max(0, pageIds.indexOf(window.location.hash.slice(1).split('/')[0].toLowerCase()));
export const atBoundary = (element, direction) => direction > 0
  ? element.scrollTop + element.clientHeight >= element.scrollHeight - 2
  : element.scrollTop <= 2;

// Momentum belongs to the same gesture until the input has been quiet.
export function createWheelGesture() {
  let last = -Infinity, consumed = false, total = 0, direction = 0;
  return {
    input(delta, now, boundary, locked) {
      if (now - last > 220) { consumed = false; total = 0; direction = 0; }
      last = now;
      if (locked || !boundary) { consumed = true; return 0; }
      if (consumed) return 0;
      const next = Math.sign(delta);
      if (next !== direction) { total = 0; direction = next; }
      total += Math.abs(delta);
      if (total < 48) return 0;
      consumed = true;
      return direction;
    },
  };
}
