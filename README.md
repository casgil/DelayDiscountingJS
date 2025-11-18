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
- **Qualtrics integration**: Can be embedded in Qualtrics surveys with automatic data capture
- **Dual mode operation**: Automatically detects standalone vs. embedded (iframe) mode

## Current Behavior

### Task Flow
1. Instructions screen with "Begin" button
2. Five choice trials with adaptive delay adjustment
3. Completion screen (standalone) or automatic data save (Qualtrics)

### Data Recording
- On completion of each trial, the following are recorded per trial:
  - `data.index`: `[currentDelayIndex, currentDelayLabel]`
  - `data.delay`: `true` if the delayed option was selected, else `false`
  - Response time and button selection

### Standalone Mode
- Data file is automatically downloaded as a CSV file
- Completion screen is displayed confirming the download
- CSV format matches Qualtrics embedded data structure

### Qualtrics Mode (iframe)
- Automatically detects when running in an iframe
- Sends trial data to parent window via postMessage
- Data is captured by Qualtrics integration script
- No download or completion screen (handled by Qualtrics)

## Files

### Core Task Files
- `index.html`
  - Loads jsPsych core and plugins
  - Injects responsive CSS for uniform, purple buttons (`#8c58db`) and mobile styles
  - Adds mobile touch handlers so buttons visually respond when pressed
  - Initializes jsPsych and runs the global `timeline`
  - Handles dual-mode operation (standalone vs. iframe/Qualtrics)
  - Processes and exports data in Qualtrics-compatible format
  - Displays completion screen in standalone mode
- `main.js`
  - Defines the delay map (`1..31` → human-readable labels)
  - Implements 5 trials (individual objects) with randomized button order
  - Adjusts delay after each trial by step sizes: 8, 4, 2, 1
  - Stores `data.delay` and `data.index` per trial

### Qualtrics Integration Files
- `qualtrics_integration.js`
  - Complete Qualtrics integration script (copy into Qualtrics question)
  - Embeds task in iframe from GitHub Pages
  - Handles data capture via postMessage
  - Shows loading and completion messages
  - Automatically manages next button state
- `QUALTRICS_SETUP.md`
  - Detailed step-by-step setup instructions
  - Embedded data field requirements
  - Troubleshooting guide
- `QUALTRICS_QUICK_START.md`
  - Quick reference for setup
  - Minimal setup steps

### Dependencies
- `jspsych/` - jsPsych library files (core, plugins, CSS)

## Deployment

### GitHub Pages (Live)
The task is deployed at: **https://casgil.github.io/DelayDiscountingJS/**

This is the URL used for Qualtrics integration.

### Run Locally
You can serve the project with any static server. Examples:

**PowerShell (Python):**
```bash
python -m http.server 8000
```
Then open `http://localhost:8000/` and navigate to the repository folder (the page uses `<base href="/DelayDiscountingJS/">`).

**Or use any "Live Server" extension from your editor.**

### Qualtrics Integration
See `QUALTRICS_SETUP.md` for detailed instructions or `QUALTRICS_QUICK_START.md` for a quick setup guide.

**Quick steps:**
1. Create embedded data fields in Qualtrics Survey Flow
2. Add a Text/Graphic question
3. Paste `qualtrics_integration.js` into the question's JavaScript section
4. The script handles everything automatically

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

### Standalone Mode (GitHub Pages / index.html)
- Data is automatically downloaded as a CSV file with timestamp (e.g., `delay_discounting_data_2024-01-15T10-30-45.csv`)
- **CSV format matches Qualtrics embedded data structure** for easy data merging
- Includes the following fields:
  - **Trial data** (for each of 5 trials):
    - `DD_Trial[N]_DelayIndex`: Numeric delay index (1-31)
    - `DD_Trial[N]_DelayLabel`: Human-readable delay label (e.g., "3 weeks")
    - `DD_Trial[N]_ChoseDelayed`: 1 if delayed option chosen, 0 if immediate chosen
  - **Summary fields**:
    - `DD_FinalDelayIndex`: Final delay index (indifference point)
    - `DD_FinalDelayLabel`: Final delay label
    - `DD_CompletionTime`: Total task completion time in seconds
    - `DD_RawData`: JSON string containing all trial data
    - `DD_Completed`: Completion status ("Yes")
    - `DD_StartTime`: ISO timestamp of task start
    - `DD_EndTime`: ISO timestamp of task completion

### Qualtrics Integration
- Data is automatically saved to Qualtrics embedded data fields via postMessage
- Uses the same field names and structure as the standalone CSV export
- This ensures data from both sources can be easily combined or compared

## Features

### Dual-Mode Operation
- **Standalone mode**: Runs independently, downloads CSV data file
- **Qualtrics mode**: Automatically detected when in iframe, sends data via postMessage
- Seamless switching between modes based on context

### Data Compatibility
- Standalone CSV export uses identical field names as Qualtrics embedded data
- Easy data merging and comparison between standalone and Qualtrics data
- All fields documented in Data Export section

### User Experience
- Clear instructions screen before task begins
- Responsive design works on desktop, tablet, and mobile
- Visual feedback on button presses (especially for touch devices)
- Completion screen with download confirmation (standalone mode)
- Loading states and error handling (Qualtrics mode)

## Technical Notes
- Buttons carry both `button` and `jspsych-btn` classes to ensure CSS overrides jsPsych defaults
- A `<meta name="viewport" content="width=device-width, initial-scale=1" />` tag is included for consistent mobile scaling
- Task automatically detects iframe context using `window.self !== window.top`
- Data export uses custom CSV generation to match Qualtrics field structure exactly
- postMessage communication follows security best practices (origin checking in Qualtrics script)
