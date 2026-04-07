document.addEventListener("DOMContentLoaded", async () => {
  const iframe = document.getElementById("iframe-embed");
  if (iframe) {
    iframe.src = await replaceDomain(iframe.src);
    console.log("Iframe source updated:", iframe.src);
  } else {
    console.warn("Iframe with id 'iframe-embed' not found.");
  }
});

async function replaceDomain(url) {
  const options = {
    oldDomain:
      (await browser.storage.sync.get("oldDomain")) || "megacloud.blog",
    newDomain: (await browser.storage.sync.get("newDomain")) || "megacloud.tv",
  };
  return url.replace(options.oldDomain, options.newDomain);
}

console.log("Content script loaded, waiting for DOMContentLoaded event...");
