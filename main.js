/* 
 This task is modeled after the 5-Trial Delay Discounting Task described in the 2014 paper
 "A 5-trial adjusting delay discounting task: Accurate discount rates in less than 60 seconds"
 by Mikhail Koffarnus and Warren Bickel.
*/

//TODO: 
//get to work on qualtrics

let initialD = 16; 
//this is the initial delay which is set to 16 as per Koffarnus and Bickel's papers
//this corresponds to the key 16 on the map below
const dMap = new Map([
  [1, "1 hour"],
  [2, "2 hours"],
  [3, "3 hours"],
  [4, "4 hours"],
  [5, "6 hours"],
  [6, "9 hours"],
  [7, "12 hours"],
  [8, "1 day",],
  [9, "1 and a half days"],
  [10, "2 days"],
  [11, "3 days"],
  [12, "4 days"],
  [13, "1 week"],
  [14, "1 and a half weeks"],
  [15, "2 weeks"],
  [16, "3 weeks"], //always the first option
  [17, "1 month"],
  [18, "2 months"],
  [19, "3 months"],
  [20, "4 months"],
  [21, "6 months"],
  [22, "8 months"],
  [23, "1 year"],
  [24, "2 years"],
  [25, "3 years"],
  [26, "4 years"],
  [27, "5 years"],
  [28, "8 years"],
  [29, "12 years"],
  [30, "18 years"],
  [31, "25 years"],
]);

const stim = '<div style="font-size:20px;font-weight:bold;">Which would you rather get?</div>';

var timeline = [];
//todo: change buttons

// Step sizes for trials: first trial shows initialD without adjustment, then +/-8, +/-4, +/-2, +/-1
var stepSizes = [0, 8, 4, 2, 1];

stepSizes.forEach(function(step, idx) {
  var trial = {
    type: jsPsychHtmlButtonResponse,
    stimulus: stim,
    choices: function() {
      var choices = ['$1000 in ' + dMap.get(initialD), '$500 now '];
      // Randomize order of choices
      var isReversed = Math.random() < 0.5;
      if (isReversed) {
        choices = choices.reverse();
      }
      // Store the order information for later use
      trial._isReversed = isReversed;
      return choices;
    },
    button_html: '<button class="button">%choice%</button>',
    response_ends_trial: true,
    on_finish: function(data){
      data.index = [initialD, dMap.get(initialD)];
      console.log();
      
      // Determine if delayed choice was selected
      // If choices were reversed, response 0 = immediate, response 1 = delayed
      // If choices were not reversed, response 0 = delayed, response 1 = immediate
      if (trial._isReversed) {
        data.delay = (data.response == 1);
      } else {
        data.delay = (data.response == 0);
      }
      
      // Adjust delay for next trial (except for the last trial)
      if (idx < stepSizes.length - 1) {
        if (data.delay) {
          initialD = initialD + stepSizes[idx + 1];
        } else {
          initialD = initialD - stepSizes[idx + 1];
        }
        // clamp within bounds
        if (initialD < 1) initialD = 1;
        if (initialD > 31) initialD = 31;
      }
    }
  };
  timeline.push(trial);
});



