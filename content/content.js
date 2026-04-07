document.addEventListener("DOMContentLoaded", () => {
  console.log("[Traffic Router] Content script loaded at DOMContentLoaded.");

  const updateIframeSrc = async (iframe) => {
    const currentSrc = iframe.getAttribute("src");
    if (!currentSrc) {
      console.log(
        "[Traffic Router] iframe#iframe-embed has no src attribute yet.",
      );
      return;
    }

    console.log("[Traffic Router] Found iframe src:", currentSrc);

    const nextSrc = await replaceDomain(currentSrc);
    if (nextSrc === currentSrc) {
      console.log("[Traffic Router] iframe src already matches target domain.");
      return;
    }

    iframe.setAttribute("src", nextSrc);
    console.log("[Traffic Router] iframe src updated:", {
      before: currentSrc,
      after: nextSrc,
    });
  };

  const watchIframeSrc = (iframe) => {
    console.log("[Traffic Router] Watching iframe src for future changes.");

    const attributeObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "src"
        ) {
          console.log("[Traffic Router] Detected iframe src mutation.");
          updateIframeSrc(iframe);
          return;
        }
      }
    });

    attributeObserver.observe(iframe, {
      attributes: true,
      attributeFilter: ["src"],
    });
  };

  const iframe = document.getElementById("iframe-embed");
  if (iframe) {
    console.log("[Traffic Router] iframe#iframe-embed found immediately.");
    updateIframeSrc(iframe);
    watchIframeSrc(iframe);
    return;
  }

  console.log(
    "[Traffic Router] iframe#iframe-embed not found yet, observing DOM.",
  );

  const observer = new MutationObserver(() => {
    const delayedIframe = document.getElementById("iframe-embed");
    if (!delayedIframe) {
      return;
    }

    console.log(
      "[Traffic Router] iframe#iframe-embed appeared later in the DOM.",
    );
    observer.disconnect();
    updateIframeSrc(delayedIframe);
    watchIframeSrc(delayedIframe);
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
});

async function replaceDomain(url) {
  const { oldDomain = "megacloud.blog", newDomain = "megacloud.tv" } =
    await browser.storage.sync.get(["oldDomain", "newDomain"]);

  console.log("[Traffic Router] Replacing iframe domain:", {
    oldDomain,
    newDomain,
    originalUrl: url,
  });

  return url.replace(oldDomain, newDomain);
}
