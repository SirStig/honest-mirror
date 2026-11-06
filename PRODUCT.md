# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

People who keep being called a narcissist, manipulative, controlling, or selfish, usually by someone close to them, and want a real answer. They often arrive privately, on a phone, soon after a conflict, and may be hurt, defensive, or doubting themselves. Secondary: the friend, partner, or relative who receives an invite link and has about three minutes.

## Product Purpose

A free self-reflection test plus a plain-language guide. It shows which of eight traits came through in someone's answers, and how far those answers can be trusted. Success is a person seeing themselves more clearly and, where it fits, taking that to a therapist or to the person who used the word.

## Positioning

The test audits its own answers. Scenarios, forced choices, recent-behaviour questions, and hidden checks make flattering answers harder to sustain, results report answer quality next to the scores, and an optional private rating from someone who knows you can be compared against your own view.

## Operating Context

A 15 to 20 minute, nine-part test that can be paused and resumed in the same browser. Keyboard shortcuts and read-aloud are supported. Results can be printed or saved as PDF. Friend answers come back as a short code pasted into results.

## Capabilities and Constraints

- Static site on GitHub Pages at the project path `/honest-mirror/`. No build step, no framework, no backend.
- Everything runs in the browser and is saved only in local storage. No accounts, no analytics, no cookies, no server. Privacy claims on the site must stay literally true.
- Test questions, scoring, and friend codes (`assets/js/questions.js`, scoring in `engine.js`) do not change during visual or copy work.
- The honesty checks must not be spoiled before the test. The made-up terms are revealed only on the results page.

## Brand Commitments

- Name: Honest Mirror. Made by SirStig, an individual, not a company.
- Voice: plain, short, and humane. Acknowledges that being called this hurts, without flattering the reader or praising them for taking the test. Describes traits, never people. Never says "you are a narcissist".
- Feel: calm and considered. The owner rejected loud or comic-like treatments and also rejected clean-but-cold ones. It has to feel safe for someone who is hurting, as well as professional.
- Dark mode first: the site is designed dark and opens dark by default. Light is the alternative, available through the theme toggle.

## Evidence on Hand

- Published research behind the method, listed in full on `about/index.html`. These informed the design and are not endorsements.
- The test is not clinically validated. No testimonials, user counts, or expert endorsements exist, and none may be invented.

## Product Principles

- State the limits as plainly as the claims: not a diagnosis, not validated, scores are not percentiles.
- Say it once. Every line has to give the reader something they did not already have.
- Treat the person as an adult who can hear the truth; neither reassure nor accuse.
- Keep safety resources reachable: crisis lines and domestic violence support stay wherever they appear today.
- Never help someone label another person.

## Accessibility & Inclusion

Readers may be distressed. Keyboard operation, read-aloud, reduced motion, light and dark themes, and print must keep working. The reading section's results must stay explained without blame, since neurodivergence, fatigue, and culture affect them.
