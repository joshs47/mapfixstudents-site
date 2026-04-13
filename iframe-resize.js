(() => {
  const iframes = Array.from(document.querySelectorAll('iframe[data-auto-resize="true"]'));

  if (!iframes.length) {
    return;
  }

  const observers = new WeakMap();

  const setIframeHeight = (iframe) => {
    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;

      if (!doc) {
        return;
      }

      const body = doc.body;
      const html = doc.documentElement;

      if (!body || !html) {
        return;
      }

      const height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight,
      );

      if (height > 0) {
        iframe.style.height = `${height}px`;
      }

      if (!observers.has(iframe) && "ResizeObserver" in window) {
        const resizeObserver = new ResizeObserver(() => setIframeHeight(iframe));
        resizeObserver.observe(body);
        resizeObserver.observe(html);
        observers.set(iframe, resizeObserver);
      }
    } catch (_error) {
      // Cross-origin access can fail outside same-origin environments.
    }
  };

  iframes.forEach((iframe) => {
    iframe.addEventListener("load", () => {
      setIframeHeight(iframe);
      window.setTimeout(() => setIframeHeight(iframe), 300);
      window.setTimeout(() => setIframeHeight(iframe), 1000);
      window.setTimeout(() => setIframeHeight(iframe), 2000);
      window.setTimeout(() => setIframeHeight(iframe), 3500);
      window.setTimeout(() => setIframeHeight(iframe), 5000);
    });
  });

  window.addEventListener("resize", () => {
    iframes.forEach(setIframeHeight);
  });
})();
