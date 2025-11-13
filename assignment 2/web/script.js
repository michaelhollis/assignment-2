export const businesses = {
  "bella-bistro": {
    name: "Bella Bistro",
    category: "Restaurant",
    summary:
      "Guests rave about the candle-lit ambiance, seasonal pasta specials, and staff who remember regulars by name.",
    average: 4.6,
    reviewCount: 128,
    reviews: [
      {
        author: "Ava M.",
        rating: 5,
        text: "Best date-night spot downtown. The truffle ravioli is unreal and they always have great wine pairings!",
      },
      {
        author: "Marcus L.",
        rating: 4,
        text: "Service was attentive and friendly. Portion sizes are generous—come hungry!",
      },
    ],
  },
  "green-garden": {
    name: "Green Garden",
    category: "Plant Shop",
    summary:
      "Beloved by plant parents for curated greenery, Saturday workshops, and troubleshooting help that actually works.",
    average: 4.8,
    reviewCount: 86,
    reviews: [
      {
        author: "Sasha W.",
        rating: 5,
        text: "They helped me nurse my fiddle-leaf fig back to health. Amazing knowledge and lovely vibe!",
      },
      {
        author: "Ian R.",
        rating: 4,
        text: "Great selection of rare plants and the staff will literally repot for you if you ask nicely.",
      },
    ],
  },
  "sparkle-cleaners": {
    name: "Sparkle Cleaners",
    category: "Home Services",
    summary:
      "Customers mention spotless kitchens, flexible scheduling, and the reusable products they leave behind for you.",
    average: 4.4,
    reviewCount: 54,
    reviews: [
      {
        author: "Priya K.",
        rating: 4,
        text: "Booked a move-out clean and the place looked brand new. Appreciate the eco-friendly supplies!",
      },
      {
        author: "Jackson P.",
        rating: 5,
        text: "Team was fast, thorough, and professional. They even left a personalized checklist for maintenance.",
      },
    ],
  },
  "sunrise-fitness": {
    name: "Sunrise Fitness",
    category: "Wellness Studio",
    summary:
      "Praised for upbeat trainers, playlists that energize early mornings, and small group classes that feel personal.",
    average: 4.7,
    reviewCount: 112,
    reviews: [
      {
        author: "Linh D.",
        rating: 5,
        text: "Love the sunrise HIIT sessions. Trainers know everyone's name and keep things fun!",
      },
      {
        author: "Caroline S.",
        rating: 4,
        text: "Clean facilities, easy parking, and they offer great nutrition tips after class.",
      },
    ],
  },
};

export function setupReviewBot(rootDocument = document) {
  const overlay = rootDocument.getElementById("review-bot");
  if (!overlay) {
    throw new Error("Review bot overlay element not found");
  }

  const closeButtons = overlay.querySelectorAll(".bot-close");
  const heading = rootDocument.getElementById("bot-heading");
  const subheading = rootDocument.getElementById("bot-subheading");
  const summary = rootDocument.getElementById("bot-summary");
  const average = rootDocument.getElementById("bot-average");
  const count = rootDocument.getElementById("bot-count");
  const reviewsList = rootDocument.getElementById("bot-reviews");
  let previousFocus = null;

  function renderReviews(reviews) {
    reviewsList.innerHTML = "";
    reviews.forEach((review) => {
      const item = rootDocument.createElement("li");
      item.innerHTML = `
        <h3>${review.author} • ${review.rating.toFixed(1)}★</h3>
        <p>${review.text}</p>
      `;
      reviewsList.appendChild(item);
    });
  }

  function openBot(businessId) {
    const business = businesses[businessId];
    if (!business) return;

    previousFocus = rootDocument.activeElement;
    overlay.hidden = false;
    overlay.dataset.activeBusiness = businessId;
    heading.textContent = `${business.name} reviews`;
    subheading.textContent = business.category;
    summary.textContent = business.summary;
    average.textContent = `${business.average.toFixed(1)} ★`;
    count.textContent = `${business.reviewCount} verified reviews`;
    renderReviews(business.reviews);
    const windowEl = overlay.querySelector(".bot-window");
    windowEl?.focus?.({ preventScroll: true });
  }

  function closeBot() {
    overlay.hidden = true;
    overlay.removeAttribute("data-active-business");
    if (previousFocus?.focus) {
      previousFocus.focus();
    }
    previousFocus = null;
  }

  function handleCardActivation(event) {
    const card = event.currentTarget;
    const businessId = card.dataset.businessId;
    openBot(businessId);
  }

  const cards = rootDocument.querySelectorAll(".business-card");
  cards.forEach((card) => {
    card.addEventListener("click", handleCardActivation);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleCardActivation(event);
      }
    });
  });

  closeButtons.forEach((button) => button.addEventListener("click", closeBot));

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeBot();
    }
  });

  rootDocument.addEventListener("keydown", (event) => {
    if (!overlay.hidden && event.key === "Escape") {
      closeBot();
    }
  });

  return {
    openBot,
    closeBot,
    renderReviews,
  };
}

if (typeof window !== "undefined") {
  const activate = () => {
    try {
      setupReviewBot();
    } catch (error) {
      console.error(error);
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", activate, { once: true });
  } else {
    activate();
  }
}
