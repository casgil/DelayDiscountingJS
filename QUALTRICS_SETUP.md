# Qualtrics Integration Guide for Delay Discounting Task

This guide provides step-by-step instructions for integrating the 5-Trial Delay Discounting Task into Qualtrics.

## Integration Method: Iframe with PostMessage (Recommended)

This method embeds the task in an iframe and uses postMessage for reliable data communication. This approach is more reliable than direct JavaScript integration and follows the same pattern used in other successful Qualtrics integrations.

### Step 1: Create Embedded Data Fields

In Qualtrics, go to **Survey Flow** and add **Embedded Data** fields for each trial:

- `DD_Trial1_DelayIndex` (Number)
- `DD_Trial1_DelayLabel` (Text)
- `DD_Trial1_ChoseDelayed` (Text: "0" or "1")
- `DD_Trial2_DelayIndex` (Number)
- `DD_Trial2_DelayLabel` (Text)
- `DD_Trial2_ChoseDelayed` (Text: "0" or "1")
- `DD_Trial3_DelayIndex` (Number)
- `DD_Trial3_DelayLabel` (Text)
- `DD_Trial3_ChoseDelayed` (Text: "0" or "1")
- `DD_Trial4_DelayIndex` (Number)
- `DD_Trial4_DelayLabel` (Text)
- `DD_Trial4_ChoseDelayed` (Text: "0" or "1")
- `DD_Trial5_DelayIndex` (Number)
- `DD_Trial5_DelayLabel` (Text)
- `DD_Trial5_ChoseDelayed` (Text: "0" or "1")
- `DD_FinalDelayIndex` (Number)
- `DD_FinalDelayLabel` (Text)
- `DD_CompletionTime` (Number: seconds)
- `DD_RawData` (Text: JSON string of all trial data)
- `DD_Completed` (Text: "Yes", "Error", or "Timeout")
- `DD_StartTime` (Text: ISO timestamp)
- `DD_EndTime` (Text: ISO timestamp)
- `DD_Error` (Text: error message if applicable)

### Step 2: Create the Question

1. Add a new **Text/Graphic** question to your survey
2. Click on the question to edit it, then go to **JavaScript** section
3. Paste the entire contents of `qualtrics_integration.js` into the JavaScript editor
4. The script will automatically:
   - Create the iframe container
   - Load the task from GitHub Pages
   - Handle data capture via postMessage
   - Show loading and completion messages
   - Disable/enable the next button appropriately
5. In **Question Options**, set:
   - **Question Type**: Text/Graphic
   - **Require Answer**: No (the script handles completion)
   - **Auto-advance**: No

### Step 3: Test the Integration

1. Preview your survey
2. Complete the task
3. Check that embedded data fields are populated correctly
4. Verify the survey advances to the next question automatically

## How It Works

The integration uses an iframe to embed the task from GitHub Pages (`https://casgil.github.io/DelayDiscountingJS/`). When the task completes:

1. The task detects it's running in an iframe
2. It collects all trial data and sends it via `postMessage` to the parent window (Qualtrics)
3. The Qualtrics script receives the message and saves data to embedded data fields
4. A completion message is displayed and the next button is enabled

This approach is more reliable than loading jsPsych directly in Qualtrics because:
- No dependency on external CDN loading within Qualtrics
- Better error handling and loading states
- Works consistently across different Qualtrics configurations
- Follows the same pattern as other successful integrations

## Data Structure

Each trial records:
- **DelayIndex**: The numeric index (1-31) of the delay option shown
- **DelayLabel**: Human-readable delay label (e.g., "3 weeks")
- **ChoseDelayed**: Whether the participant chose the delayed option (1) or immediate option (0)

The final delay values represent the participant's indifference point after all 5 trials.

## Troubleshooting

### Task doesn't load
- Check browser console for JavaScript errors
- Verify the GitHub Pages URL is accessible: `https://casgil.github.io/DelayDiscountingJS/`
- Ensure internet connection is available
- Check iframe is not blocked by browser security settings

### Data not saving
- Verify all embedded data fields are created in Survey Flow
- Check that field names match exactly (case-sensitive)
- Review browser console for JavaScript errors

### Task doesn't advance
- Ensure the `clickNextButton()` function is being called
- Check that question is set to not auto-advance
- Verify Qualtrics.SurveyEngine is available

### Styling issues
- The CSS is embedded in the JavaScript - check that styles are being applied
- Mobile responsiveness may vary in Qualtrics - test on target devices

## Notes

- The task requires an internet connection to load from GitHub Pages
- All data is saved to Qualtrics embedded data fields automatically
- The next button is automatically enabled when the task completes
- Mobile-friendly design with responsive CSS
- Includes timeout protection (10 minutes) to prevent users from getting stuck
- Loading and completion messages provide clear feedback to participants

## Reference

Task based on: Koffarnus, M. N., & Bickel, W. K. (2014). A 5-trial adjusting delay discounting task: Accurate discount rates in less than 60 seconds. *Experimental and Clinical Psychopharmacology*, 22(3), 222-228.

