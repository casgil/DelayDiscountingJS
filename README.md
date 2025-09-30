# DelayDiscountingJS

This is a browser-based implementation of the 5-trial adjusting delay discounting task described in the 2014 paper "A 5-trial adjusting delay discounting task: Accurate discount rates in less than 60 seconds" by Mikhail Koffarnus and Warren Bickel.

Reference: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4461028/

## Overview
- Built with jsPsych (no build step; plain HTML/JS/CSS)
- Starts at an initial delay index of 16 ("3 weeks") and adjusts by 8, 4, 2, 1 across 5 trials
- Each trial presents two options:
  - Delayed: "$1000 in <delay>"
  - Immediate: "$500 now"
- Button order is randomized each trial to prevent side bias
- Mobile-friendly UI with consistent pressed-state feedback

## Current Behavior
- On completion of each trial, the following are recorded per trial:
  - `data.index`: `[currentDelayIndex, currentDelayLabel]`
  - `data.delay`: `true` if the delayed option was selected, else `false`
- At the end of the task, the data are displayed on-screen (`jsPsych.data.displayData()`)

## Files
- `index.html`
  - Loads jsPsych core and plugins
  - Injects responsive CSS for uniform, purple buttons (`#8c58db`) and mobile styles
  - Adds mobile touch handlers so buttons visually respond when pressed
  - Initializes jsPsych and runs the global `timeline`
- `main.js`
  - Defines the delay map (`1..31` → human-readable labels)
  - Implements 5 trials (individual objects) with randomized button order
  - Adjusts delay after each trial by step sizes: 8, 4, 2, 1
  - Stores `data.delay` and `data.index` per trial

## Run Locally
You can serve the project with any static server. Examples:

PowerShell (Python):
```
python -m http.server 8000
```
Then open `http://localhost:8000/` and navigate to the repository folder (the page uses `<base href="/DelayDiscountingJS/">`).

Or use any "Live Server" extension from your editor.

## Customization
- Change amounts (e.g., $1000, $500): edit the choice strings in `main.js`
- Change the starting delay: update `initialD` in `main.js`
- Update delay labels: edit the `dMap` in `main.js`
- Styling (size, colors, spacing): adjust the CSS rules in `index.html`

## Mobile Support
- Buttons scale responsively with viewport-based sizes on small screens
- High-contrast white text on purple background
- Touch feedback via `.pressed` class on touch devices

## Data Export
Currently, results are shown with `jsPsych.data.displayData()`. To export:
- Quick copy: copy from the results table
- Programmatic download: replace `displayData()` with `jsPsych.data.get().localSave('csv','results.csv')` or implement a custom save endpoint

## Notes
- Buttons carry both `button` and `jspsych-btn` classes to ensure CSS overrides jsPsych defaults
- A `<meta name="viewport" content="width=device-width, initial-scale=1" />` tag is included for consistent mobile scaling
