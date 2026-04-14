document.addEventListener("DOMContentLoaded", () => {
  const isDev = true;
  const openButton = document.querySelector("[data-open-assignment-modal]");
  const overlay = document.querySelector("[data-assignment-modal-overlay]");
  const closeButton = document.querySelector("[data-close-assignment-modal]");
  const form = document.querySelector("[data-assignment-form]");
  const assignmentsGrid = document.querySelector("[data-assignments-grid]");

  if (!openButton || !overlay || !closeButton || !form || !assignmentsGrid) {
    return;
  }

  const closeModal = () => {
    overlay.classList.remove("is-open");
    window.setTimeout(() => {
      overlay.hidden = true;
    }, 180);
    document.body.classList.remove("modal-open");
  };

  const openModal = () => {
    overlay.hidden = false;
    document.body.classList.add("modal-open");
    window.requestAnimationFrame(() => {
      overlay.classList.add("is-open");
    });
  };

  const readImageAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const createAssignmentCard = ({ title, link, image, imageUrl }) => {
    const card = document.createElement("article");
    card.className = "assignment-card";
    const imageSrc = imageUrl || image;

    const status = document.createElement("span");
    status.className = "assignment-card-status";
    status.textContent = "✓ Completed";

    if (isDev) {
      const menu = document.createElement("div");
      menu.className = "assignment-card-menu";

      const trigger = document.createElement("button");
      trigger.className = "assignment-card-menu-trigger";
      trigger.type = "button";
      trigger.setAttribute("aria-label", "Assignment actions");
      trigger.textContent = "⋮";

      const dropdown = document.createElement("div");
      dropdown.className = "assignment-card-menu-dropdown";

      const renameButton = document.createElement("button");
      renameButton.className = "assignment-card-menu-item";
      renameButton.type = "button";
      renameButton.textContent = "Rename Title";

      const completeButton = document.createElement("button");
      completeButton.className = "assignment-card-menu-item";
      completeButton.type = "button";
      completeButton.textContent = "Mark as Complete";

      const deleteButton = document.createElement("button");
      deleteButton.className = "assignment-card-menu-item";
      deleteButton.type = "button";
      deleteButton.textContent = "Delete Task";

      trigger.addEventListener("click", (event) => {
        event.stopPropagation();
        document
          .querySelectorAll(".assignment-card-menu.is-open")
          .forEach((openMenu) => {
            if (openMenu !== menu) {
              openMenu.classList.remove("is-open");
            }
          });
        menu.classList.toggle("is-open");
      });

      renameButton.addEventListener("click", () => {
        menu.classList.remove("is-open");
        const nextTitle = window.prompt("Enter a new title for this assignment:", heading.textContent);

        if (nextTitle && nextTitle.trim()) {
          const trimmedTitle = nextTitle.trim();
          heading.textContent = trimmedTitle;
          imageElement.alt = trimmedTitle;
        }
      });

      completeButton.addEventListener("click", () => {
        menu.classList.remove("is-open");
        if (window.confirm("Are you sure you want to mark this assignment as complete?")) {
          card.classList.add("is-complete");
        }
      });

      deleteButton.addEventListener("click", () => {
        menu.classList.remove("is-open");
        if (window.confirm("Are you sure you want to delete this assignment?")) {
          card.remove();
        }
      });

      dropdown.append(renameButton, completeButton, deleteButton);
      menu.append(trigger, dropdown);
      card.append(menu);
    }

    const imageElement = document.createElement("img");
    imageElement.className = "assignment-card-image";
    imageElement.src = imageSrc;
    imageElement.alt = title;

    const body = document.createElement("div");
    body.className = "assignment-card-body";

    const heading = document.createElement("h2");
    heading.className = "assignment-card-title";
    heading.textContent = title;

    const action = document.createElement("a");
    action.className = "assignment-card-link";
    action.href = link;
    action.target = "_blank";
    action.rel = "noopener noreferrer";
    action.textContent = "Get Mapping";

    card.append(status);
    body.append(heading, action);
    card.append(imageElement, body);
    assignmentsGrid.append(card);
  };

  openButton.addEventListener("click", openModal);
  closeButton.addEventListener("click", closeModal);

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !overlay.hidden) {
      closeModal();
    }
  });

  document.addEventListener("click", (event) => {
    document.querySelectorAll(".assignment-card-menu.is-open").forEach((menu) => {
      if (!menu.contains(event.target)) {
        menu.classList.remove("is-open");
      }
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const imageFile = formData.get("image");
    const title = String(formData.get("title") || "").trim();
    const link = String(formData.get("link") || "").trim();

    if (!(imageFile instanceof File) || !imageFile.size || !title || !link) {
      return;
    }

    try {
      const image = await readImageAsDataUrl(imageFile);
      const data = { title, link, image };

      createAssignmentCard(data);
      form.reset();
      closeModal();
    } catch (error) {
      console.error("Error creating assignment:", error);
    }
  });
});
