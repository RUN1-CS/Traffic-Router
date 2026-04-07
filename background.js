async function getOptions() {
  const oldDomain = await browser.storage.sync.get("oldDomain");
  const newDomain = await browser.storage.sync.get("newDomain");
  const options = {
    oldDomain: oldDomain.oldDomain || "megacloud.blog",
    newDomain: newDomain.newDomain || "megacloud.tv",
  };
  console.log("Options loaded:", options);
  return options;
}

let options = {
  oldDomain: "megacloud.blog",
  newDomain: "megacloud.tv",
};

function handleBeforeRequest(details) {
  const newURL = details.url.replace(options.oldDomain, options.newDomain);

  console.log("[Traffic Router] onBeforeRequest:", {
    requestUrl: details.url,
    oldDomain: options.oldDomain,
    newDomain: options.newDomain,
    redirectUrl: newURL,
  });

  if (newURL === details.url) {
    console.log("[Traffic Router] Request unchanged, no redirect applied.");
    return {};
  }

  console.log("[Traffic Router] Redirecting request.");
  return {
    redirectUrl: newURL,
  };
}

// function handleHeadersReceived(details) {
//   const headers = details.responseHeaders || [];
//   console.log("[Traffic Router] onHeadersReceived:", {
//     requestUrl: details.url,
//     requestType: details.type,
//     headerCount: headers.length,
//   });
//
//   if (details.type !== "main_frame" && details.type !== "sub_frame") {
//     return { responseHeaders: headers };
//   }
//
//   const filteredHeaders = headers.filter((header) => {
//     const name = header.name.toLowerCase();
//     return (
//       name !== "x-frame-options" &&
//       name !== "content-security-policy" &&
//       name !== "content-security-policy-report-only"
//     );
//   });
//
//   if (filteredHeaders.length !== headers.length) {
//     console.log("[Traffic Router] Removed frame-blocking response headers.");
//   }
//
//   return { responseHeaders: filteredHeaders };
// }

async function registerListeners() {
  console.log("[Traffic Router] Registering webRequest listeners.");
  browser.webRequest.onBeforeRequest.removeListener(handleBeforeRequest);
  // browser.webRequest.onHeadersReceived.removeListener(handleHeadersReceived);

  options = await getOptions();

  browser.webRequest.onBeforeRequest.addListener(
    handleBeforeRequest,
    { urls: [`*://${options.oldDomain}/*`] },
    ["blocking"],
  );

  // browser.webRequest.onHeadersReceived.addListener(
  //   handleHeadersReceived,
  //   { urls: [`*://${options.newDomain}/*`] },
  //   ["blocking", "responseHeaders"],
  // );

  console.log("[Traffic Router] Listeners registered:", options);
}

registerListeners().catch((error) => {
  console.error("[Traffic Router] Failed to register listeners:", error);
});

browser.storage.onChanged.addListener((changes, areaName) => {
  console.log("[Traffic Router] Storage change detected:", {
    areaName,
    changes,
  });

  if (areaName !== "sync" || (!changes.oldDomain && !changes.newDomain)) {
    console.log(
      "[Traffic Router] Ignoring storage change outside watched keys.",
    );
    return;
  }

  registerListeners().catch((error) => {
    console.error("[Traffic Router] Failed to refresh listeners:", error);
  });
});
