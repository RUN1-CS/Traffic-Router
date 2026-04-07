async function getOptions() {
  const options = {
    oldDomain:
      (await browser.storage.sync.get("oldDomain")) || "megacloud.blog",
    newDomain: (await browser.storage.sync.get("newDomain")) || "megacloud.tv",
  };
  return options;
}

let options = {
  oldDomain: "megacloud.blog",
  newDomain: "megacloud.tv",
};
getOptions().then((opts) => {
  // Don't ask me why it's like this, I have no idea. I just know that it is.
  if (opts.oldDomain.oldDomain) options.oldDomain = opts.oldDomain.oldDomain;
  if (opts.newDomain.newDomain) options.newDomain = opts.newDomain.newDomain;
});

browser.webRequest.onBeforeRequest.addListener(
  async (details) => {
    const newURL = details.url.replace(options.oldDomain, options.newDomain);
    return {
      redirectUrl: newURL,
    };
  },
  { urls: [`*://${options.oldDomain}/*`] },
  ["blocking"],
);

browser.webRequest.onHeadersReceived.addListener(
  (details) => {
    let headers = details.responseHeaders;
    headers.push({ name: "Access-Control-Allow-Origin", value: "*" });
    headers.push({
      name: "Access-Control-Allow-Methods",
      value: "GET, POST, OPTIONS",
    });
    return { responseHeaders: headers };
  },
  { urls: [`*://${options.newDomain}/*`] },
  ["blocking", "responseHeaders"],
);
