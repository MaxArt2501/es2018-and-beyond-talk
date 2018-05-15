(() => {
  const FALLING_DURATION = 3;
  document.querySelectorAll('ul.falling > li').forEach(item => {
    const left = Math.random() * 60 + 20;
    const delay = Math.random() * FALLING_DURATION;
    const duration = Math.random() + FALLING_DURATION - .5;
    Object.assign(item.style, {
      left: left + '%',
      animationDuration: duration + 's',
      animationDelay: delay + 's'
    });
  });

  hljs.initHighlightingOnLoad();

  const TIME_LIMIT = 420000;
  let countDownTimer;
  let countDownStart;
  document.addEventListener('keydown', ({ code }) => {
    if (code === 'KeyB') {
      if (countDownStart) {
        console.log('%c Countdown stopped at ' + getMinSec(), 'font-size: 2em');
        clearInterval(countDownTimer);
        countDownStart = null;
      } else {
        countDownTimer = setInterval(() => {
          console.log('%c ' + getMinSec(), 'font-size: 2em; color: ' + getTimerColor());
        }, 60000);
        countDownStart = Date.now();
        console.log('%c Countdown started', 'font-size: 2em');
      }
    }
  });

  function getMinSec() {
    if (!countDownStart) {
      return 'no time';
    }
    const diff = Math.round((Date.now() - countDownStart) / 1e3);
    return Math.floor(diff / 60) + ':' + ('0' + (diff % 60)).slice(-2);
  }
  function getTimerColor() {
    if (!countDownStart) {
      return 'inherit';
    }
    const diff = Date.now() - countDownStart;
    const hue = Math.max(0, TIME_LIMIT - diff) * 120 / TIME_LIMIT;
    return `hsl(${hue}, 100%, 50%)`;
  }
})();
