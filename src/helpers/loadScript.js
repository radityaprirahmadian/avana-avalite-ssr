export default function loadScript(src) {
  return new Promise(function (resolve, reject) {
    var s = document.createElement('script');
    s.async = true;
    if (typeof src === 'function') {
      // s.src = chrome.runtime.getURL('script.js');
      s.textContent = src();
      (document.head || document.documentElement).appendChild(s);
      return;
    }
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}