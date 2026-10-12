# Lantern Homeschool

Self-paced grades 1–12 homeschool: video lessons, quizzes, progress tracking, family accounts and a parent portal.

- Live site: https://lantern-homeschool.netlify.app
- Family data: Firebase project `lantern-homeschool` (Firestore, rules in `firestore.rules`)

## Updating
Edit files in `src/`, run `python3 src/build.py`, commit and push. Netlify redeploys automatically.
Keep `firebase-config.js` in the repo root — it connects the site to family accounts.
When adding lessons, add new units at the end of a course so saved progress stays matched to the right unit.
