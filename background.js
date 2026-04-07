const oldDomain = "megacloud.blog";
const newDomain = "megacloud.tv";

browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    const newURL = details.url.replace(oldDomain, newDomain);
    return {
      redirectUrl: newURL,
    };
  },
  { urls: [`*://${oldDomain}/*`] },
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
  { urls: [`*://${newDomain}/*`] },
  ["blocking", "responseHeaders"],
);
