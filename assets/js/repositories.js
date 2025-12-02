document.addEventListener("DOMContentLoaded", function () {
  const repoCards = document.querySelectorAll(".repo-card");

  repoCards.forEach((card) => {
    const repoSlug = card.getAttribute("data-repo");
    if (!repoSlug) return;

    const url = `https://api.github.com/repos/${repoSlug}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Update description
        const descriptionEl = card.querySelector(".repo-card__description");
        if (descriptionEl) {
          descriptionEl.textContent = data.description || "No description provided.";
        }

        // Update stars
        const starsEl = card.querySelector(".repo-card__stars");
        if (starsEl) {
          starsEl.textContent = data.stargazers_count;
        }

        // Update forks
        const forksEl = card.querySelector(".repo-card__forks");
        if (forksEl) {
          forksEl.textContent = data.forks_count;
        }

        // Update language
        if (data.language) {
          const langContainer = card.querySelector(".repo-card__language");
          const langText = card.querySelector(".repo-card__language-text");
          if (langContainer && langText) {
            langText.textContent = data.language;
            langContainer.hidden = false;
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching repo data:", error);
        const descriptionEl = card.querySelector(".repo-card__description");
        if (descriptionEl) {
          descriptionEl.textContent = "Failed to load repository data.";
        }
      });
  });
});
