# Honest Mirror

Made by [SirStig](https://github.com/SirStig).

A free, private self-reflection site for people who keep being called a narcissist, manipulative, controlling, or selfish, and want something more careful than a 16-question quiz.

It is not a diagnosis. Only a licensed mental health professional can diagnose a personality disorder. The site says that plainly, on every page that could be mistaken for a verdict.

The live site is [https://sirstig.github.io/honest-mirror/](https://sirstig.github.io/honest-mirror/).

## What it includes

- A long reflection with scenarios, forced choices, recent-behavior questions, emotion-reading stories, comparison sliders, a timed word sort, and checks that make flattering answers harder to sustain.
- A plain-language guide to the words people throw around, and what those words do and don't mean.
- An optional friend or partner rating. Their answers stay on their device and come back as a short code you can paste into your own results. Nothing is stored on a server.

## Privacy

Everything runs in the browser. Answers are saved only in local storage on that device so someone can pause and come back. There is no account, no analytics, and no backend.

## Publishing

Pushes to `main` run [`.github/workflows/pages.yml`](.github/workflows/pages.yml), which deploys the static site to GitHub Pages. `tools/` is the artwork used to generate the social preview image and is not part of the published site.

To preview locally, from this folder:

```bash
python3 -m http.server 8765
```

Then open `http://127.0.0.1:8765/`. The canonical URLs assume the GitHub Pages project path `/honest-mirror/`, so a local preview is closest when the folder is served from a parent directory as `/honest-mirror/`.
