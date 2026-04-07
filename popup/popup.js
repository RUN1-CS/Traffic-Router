document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("settings-form");
  const oldDomainInput = document.getElementById("old-domain");
  const newDomainInput = document.getElementById("new-domain");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const oldDomain = oldDomainInput.value.trim();
    const newDomain = newDomainInput.value.trim();

    await browser.storage.sync.set({
      oldDomain,
      newDomain,
    });
  });
});
