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
})();
