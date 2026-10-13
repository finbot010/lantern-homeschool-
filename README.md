# Lantern Homeschool

Self-paced grades 1–12 homeschool: video lessons, quizzes, progress tracking, family accounts and a parent portal.

- Live site: https://lantern-homeschool.netlify.app
- Family data: Firebase project `lantern-homeschool` (Firestore, rules in `firestore.rules`)

## Updating
Edit files in `src/`, run `python3 src/build.py`, commit and push. Netlify redeploys automatically.
Keep `firebase-config.js` in the repo root — it connects the site to family accounts.
When adding lessons, add new units at the end of a course so saved progress stays matched to the right unit.

## Lumi, the AI tutor

`netlify/functions/lumi.mjs` is a small server function that passes learners' questions to the Claude API. The API key stays on Netlify and never reaches the browser.

1. In Netlify, open **Site configuration → Environment variables → Add a variable**.
2. Key: `ANTHROPIC_API_KEY`. Value: your Claude API key. Scope: **Functions**. Mark it as a secret.
3. Redeploy (Deploys → Trigger deploy → Deploy site).
4. Parents turn Lumi on in **Parent portal → AI tutor**. It is off by default.

Optional variables: `LUMI_MODEL` (default `claude-haiku-5-5`) and `LUMI_FAMILY_DAILY_LIMIT` (default 80 messages per family per day).
Lumi only works on the Netlify site with family (email) accounts; the Firebase-hosted copy calls the Netlify function.
