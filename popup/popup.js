document.addEventListener("DOMContentLoaded", () => {
  console.log("[Traffic Router] Popup opened.");

  const form = document.getElementById("settings-form");
  const oldDomainInput = document.getElementById("old-domain");
  const newDomainInput = document.getElementById("new-domain");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const oldDomain = oldDomainInput.value.trim();
    const newDomain = newDomainInput.value.trim();

    console.log("[Traffic Router] Saving popup settings:", {
      oldDomain,
      newDomain,
    });

    await browser.storage.sync.set({
      oldDomain,
      newDomain,
    });

    console.log("[Traffic Router] Popup settings saved successfully.");
  });
});
