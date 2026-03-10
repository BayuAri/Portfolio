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
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
