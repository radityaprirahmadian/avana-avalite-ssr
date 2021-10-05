export default function loadScript(src) {
  return new Promise(function (resolve, reject) {
    if (typeof src === 'function') {
      var s = document.createElement('script');
      // s.src = chrome.runtime.getURL('script.js');
      s.textContent = src();
      (document.head || document.documentElement).appendChild(s);
      return;
    }
    var s;
    s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}