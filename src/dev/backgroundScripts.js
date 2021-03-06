// Author: huzi(moustache)
// Date: 18-8-29 14:52
// Description: 背景脚本，用于建立和devtools和content-scripts的双向连接。
chrome.extension.onConnect.addListener(function (port) {
  console.log("backgroundScripts connect!");
  let extensionListener = function (message, sender, sendResponse) {
    if (message.tabId && message.content) {
      if (message.action === 'code') {
        console.log("执行code");
        chrome.tabs.executeScript(message.tabId, {code: message.content});
      } else if (message.action === 'script') {
        console.log("执行script");
        chrome.tabs.executeScript(message.tabId, {file: message.content});
      } else {
        console.log("执行other");
        chrome.tabs.sendMessage(message.tabId, message, sendResponse);
      }
    } else {
      port.postMessage(message);
    }
    // sendResponse(message);
  };
  chrome.extension.onMessage.addListener(extensionListener);
  port.onDisconnect.addListener(function (port) {
    chrome.extension.onMessage.removeListener(extensionListener);
  });
});