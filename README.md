# Portfolio

Static portfolio site for **Bayu Ari**, a Senior Manual QA Consultant for iOS, Android, and web apps.

Live site: https://bayuari.github.io/Portfolio/

> The most valuable bugs are the ones your customers never see.

## Profile at a glance

| | |
|---|---|
| Upwork standing | Top Rated Plus (top 3%) |
| Hours delivered | 27,800+ across 90 jobs |
| Client rating | 4.98 / 5 from 77 reviews |
| Hire-again rate | 94.6% |
| Serving since | 2013 |
| Rate | $66.67/hr |
| Availability | 30–45 hrs/week, contract-to-hire open |
| Location | Bekasi, Indonesia (UTC+07), async-first with overlap hours |

## What the site covers

The design is a dark "QA console" theme: a terminal-style run summary in the hero, test-case cards with pass chips, bug-report case studies, and a device matrix.

1. **Hero:** role, availability, and a `qa run` summary of the profile metrics
2. **About:** QA approach, AI-assisted development validation, and working from UTC+07 (autonomous, async work with overlap hours for coordination)
3. **Achievements:** Top Rated Plus, hire-again rate, hours, longevity, and rating, shown as test cases
4. **Services:** release preparation, ongoing QA, product-focused testing, pull request validation, AI-assisted development validation, and how I work
5. **Case studies:** EM (Cybersemics), Swift Medical, Evolve Global, and Showcase Workshop
6. **Core skills and tooling:** GitHub, Jira, Azure DevOps, TestRail, BrowserStack, Charles Proxy, Xcode, Android Studio, and more
7. **Experience:** EM (Cybersemics), Evolve Global, Swift Medical, Showcase Workshop, DoubleMap, Tokii, Safety Culture, and Quiet Riots
8. **Device lab:** 15 real devices (8 iOS, 5 Android, 2 macOS) with OS versions
9. **Professional presence:** LinkedIn, GitHub, and a live GitHub activity panel
10. **Contact:** Upwork, LinkedIn, GitHub, and Email Inquiry

## Project structure

```
index.html      Page content and sections
styles.css      Dark QA console theme and responsive layout
script.js       GitHub activity feed, reveal animations, Email Inquiry, GA4 events
config.js       Site config (GA4 measurement ID)
assets/images/  Profile picture
```

The site is plain HTML, CSS, and JavaScript, with no build step and no dependencies.

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Analytics

GA4 loads only when `ga4MeasurementId` is set in `config.js`. Along with page views, `script.js` sends these click events:

| Event | When |
|---|---|
| `click_upwork` | Upwork profile or hire buttons |
| `click_linkedin` / `click_github` | LinkedIn or GitHub links |
| `click_email_inquiry` | First click on Email Inquiry (reveals and copies the address) |
| `click_email_compose` | Gmail, Outlook, Yahoo, or Mail app compose link (`email_provider`) |
| `click_email_mailto` | Second click on Email Inquiry (opens mailto) |

Each event includes `link_location` (the page section) and `link_text`.

## Deployment

Every push to `main` deploys to GitHub Pages through `.github/workflows/deploy-pages.yml`.
