const yearNode = document.getElementById("year");
const githubPanel = document.querySelector(".github-live-panel");
const githubGraphImage = document.querySelector(".github-graph-image");

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (githubGraphImage) {
  githubGraphImage.addEventListener("error", () => {
    const fallbackSrc = githubGraphImage.dataset.fallbackSrc;
    if (fallbackSrc && githubGraphImage.src !== fallbackSrc) {
      githubGraphImage.src = fallbackSrc;
    }
  });
}

if (githubPanel) {
  const githubUser = githubPanel.dataset.githubUser;
  const eventsNode = githubPanel.querySelector("[data-github-events]");
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const eventLabels = {
    PushEvent: "Pushed commits",
    PullRequestEvent: "Worked on a pull request",
    IssuesEvent: "Updated an issue",
    IssueCommentEvent: "Commented on an issue",
    WatchEvent: "Starred a repository",
    CreateEvent: "Created content",
    ForkEvent: "Forked a repository",
    ReleaseEvent: "Published a release",
  };

  const renderGithubEvents = (events) => {
    if (!eventsNode) {
      return;
    }

    if (!events.length) {
      eventsNode.innerHTML = "<li>No recent public activity found.</li>";
      return;
    }

    eventsNode.innerHTML = events
      .slice(0, 4)
      .map((event) => {
        const repoName = event.repo?.name || "GitHub";
        const action = eventLabels[event.type] || "Updated a repository";
        const when = event.created_at
          ? dateFormatter.format(new Date(event.created_at))
          : "";

        return "<li><strong>" + action + "</strong><span>" + repoName + (when ? " · " + when : "") + "</span></li>";
      })
      .join("");
  };

  const renderGithubFallback = () => {
    if (!eventsNode) {
      return;
    }

    eventsNode.innerHTML =
      '<li><strong>Live public activity is temporarily unavailable</strong><span>Open <a href="https://github.com/' +
      githubUser +
      '" target="_blank" rel="noreferrer">github.com/' +
      githubUser +
      "</a> for the latest activity and repository history.</span></li>";
  };

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 4500);

  fetch("https://api.github.com/users/" + githubUser + "/events/public?per_page=4", {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    signal: controller.signal,
  })
    .then(async (eventsResponse) => {
      window.clearTimeout(timeoutId);

      if (!eventsResponse.ok) {
        throw new Error("GitHub activity request failed");
      }

      const events = await eventsResponse.json();
      renderGithubEvents(Array.isArray(events) ? events : []);
    })
    .catch(() => {
      window.clearTimeout(timeoutId);
      renderGithubFallback();
    });
}

const ga4MeasurementId =
  window.PORTFOLIO_CONFIG?.analytics?.ga4MeasurementId || "";

if (ga4MeasurementId) {
  const analyticsScript = document.createElement("script");
  analyticsScript.async = true;
  analyticsScript.src =
    "https://www.googletagmanager.com/gtag/js?id=" + ga4MeasurementId;
  document.head.appendChild(analyticsScript);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", ga4MeasurementId);
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    // Trigger once any part of the section is 10% above the bottom of the
    // viewport. A ratio threshold would never fire for sections taller than
    // the viewport divided by that ratio (e.g. Case Studies on phones).
    { threshold: 0, rootMargin: "0px 0px -10% 0px" }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

// mailto: depends on the visitor's mail handler, which is often missing or
// broken (e.g. a webmail handler that times out). So the first click always
// reveals and copies the address on the button and shows webmail compose
// links (Gmail, Outlook, Yahoo); clicking the button again opens mailto.
document.querySelectorAll("a[data-email]").forEach((link) => {
  const email = link.dataset.email;

  link.addEventListener("click", (event) => {
    if (link.dataset.revealed === "true") return;

    event.preventDefault();
    link.dataset.revealed = "true";
    link.textContent = email;

    const options = document.querySelector("[data-email-options]");
    if (options) options.hidden = false;

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(email)
        .then(() => {
          link.textContent = email + " (copied)";
        })
        .catch(() => {});
    }
  });
});

// GA4 click events for the ways a visitor can get in touch. Runs alongside
// the Email Inquiry handler above without changing it. Nothing is sent when
// GA4 is not configured (window.gtag is only defined when it is).
const clickEventFor = (link) => {
  const href = link.getAttribute("href") || "";

  if (link.matches("a[data-email]")) {
    return link.dataset.revealed === "true" ? "click_email_mailto" : "click_email_inquiry";
  }
  if (link.closest("[data-email-options]")) return "click_email_compose";
  if (href.includes("upwork.com")) return "click_upwork";
  if (href.includes("linkedin.com")) return "click_linkedin";
  if (href.includes("github.com")) return "click_github";
  return "";
};

const sectionFor = (link) => {
  const section = link.closest("section");
  if (!section) return "header";
  if (section.id) return section.id;
  if (section.classList.contains("hero")) return "hero";
  const eyebrow = section.querySelector(".eyebrow");
  return eyebrow ? eyebrow.textContent.trim().toLowerCase().replace(/\s+/g, "-") : "page";
};

// Capture phase, so the Email Inquiry button is reported before its own
// click handler marks it as revealed.
document.addEventListener(
  "click",
  (event) => {
    if (typeof window.gtag !== "function") return;

    const link = event.target.closest("a");
    if (!link) return;

    const eventName = clickEventFor(link);
    if (!eventName) return;

    // The Email Inquiry button's text becomes the address once revealed,
    // so it gets a fixed label instead of its text.
    const params = {
      link_location: sectionFor(link),
      link_text: link.matches("a[data-email]")
        ? "Email Inquiry"
        : link.textContent.trim().slice(0, 100),
    };
    if (eventName === "click_email_compose") {
      params.email_provider = link.textContent.trim();
    }

    window.gtag("event", eventName, params);
  },
  true
);
