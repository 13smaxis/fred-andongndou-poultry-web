
/**
 * Function: To apply a smooth scroll up on click that triggers the move
 */
export function smoothScrollToTop(duration = 1000): void 
{
  const startY = window.scrollY || window.pageYOffset;
  if (startY <= 0) return;

  const startTime = performance.now();

  const easeInOutQuint = (t: number) =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;

  const frame = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutQuint(progress);
    const nextY = Math.round(startY * (1 - eased));

    window.scrollTo(0, nextY);

    if (progress < 1) {
      window.requestAnimationFrame(frame);
    }
  };

  window.requestAnimationFrame(frame);
}
