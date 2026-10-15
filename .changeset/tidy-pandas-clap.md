---
"@hyperse/html-webpack-plugin-loader": patch
---

ci: pin GitHub Actions workflows to Node.js `lts/*` (test matrix and release job) and pass `YARN_NPM_AUTH_TOKEN` to `changesets/action` so Yarn Berry can authenticate when publishing. No runtime or API changes.
