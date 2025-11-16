# Qualtrics Integration - Quick Start Guide

## Quick Setup (5 minutes)

### 1. Create Embedded Data Fields

In Qualtrics **Survey Flow**, add these embedded data fields:

```
DD_Trial1_DelayIndex, DD_Trial1_DelayLabel, DD_Trial1_ChoseDelayed
DD_Trial2_DelayIndex, DD_Trial2_DelayLabel, DD_Trial2_ChoseDelayed
DD_Trial3_DelayIndex, DD_Trial3_DelayLabel, DD_Trial3_ChoseDelayed
DD_Trial4_DelayIndex, DD_Trial4_DelayLabel, DD_Trial4_ChoseDelayed
DD_Trial5_DelayIndex, DD_Trial5_DelayLabel, DD_Trial5_ChoseDelayed
DD_FinalDelayIndex, DD_FinalDelayLabel, DD_Completed
DD_CompletionTime, DD_RawData, DD_StartTime, DD_EndTime, DD_Error
```

### 2. Create the Question

1. Add a **Text/Graphic** question
2. In **JavaScript** section, paste the entire contents of `qualtrics_integration.js`
3. The script automatically creates the iframe and handles everything
4. Set question to **not require answer** and **not auto-advance**

### 3. Test

Preview the survey and complete the task. Data will be saved automatically.

## What Gets Saved

- **DelayIndex**: Number (1-31) representing the delay option shown
- **DelayLabel**: Text label (e.g., "3 weeks")
- **ChoseDelayed**: "1" if delayed option chosen, "0" if immediate chosen
- **FinalDelayIndex/Label**: The final indifference point after all 5 trials
- **CompletionTime**: Total time to complete task in seconds
- **RawData**: Complete JSON string of all trial data
- **StartTime/EndTime**: ISO timestamps for task start and completion

## File to Use

Copy the entire contents of: **`qualtrics_integration.js`**

This is a self-contained script that:
- Embeds the task in an iframe from your GitHub Pages deployment
- Shows loading and completion messages
- Handles data capture via postMessage communication
- Includes responsive CSS for mobile devices
- Saves data to Qualtrics automatically
- Enables next button when complete
- Includes timeout protection (10 minutes)

## Troubleshooting

**Task doesn't appear?**
- Check browser console (F12) for errors
- Verify container div is in question HTML
- Ensure JavaScript is pasted correctly

**Data not saving?**
- Verify embedded data fields are created (case-sensitive)
- Check field names match exactly
- Review console for JavaScript errors

**Doesn't advance?**
- Ensure question is set to not auto-advance
- Check that `clickNextButton()` is being called (see console)

