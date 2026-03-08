# Portfolio

Static personal portfolio site for Bayu Ari, built from structured Upwork profile data.

## Current focus

- Senior QA Tester positioning for iOS, Android, and web apps
- Real profile metrics such as hours, jobs, rating, hire-again rate, and availability
- Device lab, tooling, and employment-history sections for stronger credibility
- GitHub Pages deployment via workflow on push to `main`
- Hidden browser-side photo editor enabled only with `?edit=1`
- Optional Google Analytics 4 hook for demographic reporting

## Files

- `index.html`: main portfolio page
- `styles.css`: visual system and responsive layout
- `config.js`: local settings for analytics and edit-mode behavior
- `script.js`: reveal animation and footer year

## Local preview

Open `index.html` directly in a browser, or serve the folder with any static file server.

## GitHub Pages

This repo includes `.github/workflows/deploy-pages.yml`.

To publish:

1. Push the repo to `main`
2. In GitHub repository settings, enable Pages and choose `GitHub Actions` as the source
3. Let the workflow deploy the root static site

## Edit Mode

Visitor-facing upload controls are hidden by default.

To edit the profile photo in your browser:

1. Open the site with `?edit=1`
2. Use `Upload new photo`
3. The selected photo is stored only in that browser via `localStorage`
4. Use `Reset` to return to the repo default photo

## Visitor Analytics

The site is prepared for Google Analytics 4.

To enable it:

1. Open `config.js`
2. Set `ga4MeasurementId` to your GA4 measurement ID, for example `G-XXXXXXXXXX`
3. In Google Analytics, enable Google signals if you want demographic details reports

Google’s official docs indicate that GA4 demographic details come from Google signals for websites.
