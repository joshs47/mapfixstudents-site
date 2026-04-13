(() => {
  const button = document.querySelector(".dev-mode-toggle");
  const storageKey = "devMode";

  if (!button) {
    return;
  }

  const updateButton = () => {
    if (document.body.classList.contains("dev-mode")) {
      button.textContent = "User View";
      button.setAttribute("aria-label", "Disable developer mode");
    } else {
      button.textContent = "⚙️";
      button.setAttribute("aria-label", "Enable developer mode");
    }
  };

  button.addEventListener("click", () => {
    if (document.body.classList.contains("dev-mode")) {
      document.body.classList.remove("dev-mode");
      window.localStorage.removeItem(storageKey);
      updateButton();
      return;
    }

    const password = window.prompt("Enter developer mode password:");

    if (password === "kenya") {
      document.body.classList.add("dev-mode");
      window.localStorage.setItem(storageKey, "true");
      updateButton();
    }
  });

  if (window.localStorage.getItem(storageKey) === "true") {
    document.body.classList.add("dev-mode");
  }

  updateButton();
})();
