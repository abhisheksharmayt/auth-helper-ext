chrome.runtime.onConnect.addListener(function (port) {
  console.assert(port.name === "authKeyComing");
  port.onMessage.addListener(function (msg) {
    if (msg.authKey.length && msg.authValue.length) {
      localStorage.removeItem("authTokens");
      localStorage.removeItem("at");
      localStorage.setItem(msg.authKey, msg.authValue);
      location.reload();
      port.postMessage({ question: "applied succesfully!!" });
    } else {
      port.postMessage({ question: "something went wrong" });
    }
  });
});
