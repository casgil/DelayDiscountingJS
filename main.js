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

// Instructions screen
const introStim = `
  <div style="font-size:24px;font-weight:bold;margin-bottom:12px;">Two Choice Task</div>
  <div style="font-size:18px;line-height:1.5;max-width:60ch;margin:0 auto;">
    You will see a series of choices between two options. Your task is to select the option you prefer for each choice presented. There are no right or wrong answers. We are interested in your personal preferences.
  </div>
`;

var instructions = {
  type: jsPsychHtmlButtonResponse,
  stimulus: introStim,
  choices: ['Begin']
};

timeline.push(instructions);

// Create individual trials to avoid closure issues
var trial1 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: stim,
  choices: function() {
    var choices = ['$1000 in ' + dMap.get(initialD), '$500 now '];
    var isReversed = Math.random() < 0.5;
    if (isReversed) {
      choices = choices.reverse();
    }
    // Store the order for this trial
    trial1._isReversed = isReversed;
    return choices;
  },
  button_html: '<button class="button jspsych-btn">%choice%</button>',
  response_ends_trial: true,
  on_finish: function(data){
    data.index = [initialD, dMap.get(initialD)];
    // Determine if delayed choice was selected based on randomization
    if (trial1._isReversed) {
      data.delay = (data.response == 1); // reversed: 0=immediate, 1=delayed
    } else {
      data.delay = (data.response == 0); // normal: 0=delayed, 1=immediate
    }
    console.log('Trial 1 - Delay chosen:', data.delay, 'Response:', data.response, 'Reversed:', trial1._isReversed);
  }
};

var trial2 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: stim,
  choices: function() {
    // Adjust delay based on previous trial
    var lastData = jsPsych.data.get().last(1).values()[0];
    if (lastData.delay) {
      initialD = initialD + 8;
    } else {
      initialD = initialD - 8;
    }
    if (initialD < 1) initialD = 1;
    if (initialD > 31) initialD = 31;
    
    var choices = ['$1000 in ' + dMap.get(initialD), '$500 now '];
    var isReversed = Math.random() < 0.5;
    if (isReversed) {
      choices = choices.reverse();
    }
    trial2._isReversed = isReversed;
    return choices;
  },
  button_html: '<button class="button jspsych-btn">%choice%</button>',
  response_ends_trial: true,
  on_finish: function(data){
    data.index = [initialD, dMap.get(initialD)];
    if (trial2._isReversed) {
      data.delay = (data.response == 1);
    } else {
      data.delay = (data.response == 0);
    }
    console.log('Trial 2 - Delay chosen:', data.delay, 'Response:', data.response, 'Reversed:', trial2._isReversed);
  }
};

var trial3 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: stim,
  choices: function() {
    var lastData = jsPsych.data.get().last(1).values()[0];
    if (lastData.delay) {
      initialD = initialD + 4;
    } else {
      initialD = initialD - 4;
    }
    if (initialD < 1) initialD = 1;
    if (initialD > 31) initialD = 31;
    
    var choices = ['$1000 in ' + dMap.get(initialD), '$500 now '];
    var isReversed = Math.random() < 0.5;
    if (isReversed) {
      choices = choices.reverse();
    }
    trial3._isReversed = isReversed;
    return choices;
  },
  button_html: '<button class="button jspsych-btn">%choice%</button>',
  response_ends_trial: true,
  on_finish: function(data){
    data.index = [initialD, dMap.get(initialD)];
    if (trial3._isReversed) {
      data.delay = (data.response == 1);
    } else {
      data.delay = (data.response == 0);
    }
    console.log('Trial 3 - Delay chosen:', data.delay, 'Response:', data.response, 'Reversed:', trial3._isReversed);
  }
};

var trial4 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: stim,
  choices: function() {
    var lastData = jsPsych.data.get().last(1).values()[0];
    if (lastData.delay) {
      initialD = initialD + 2;
    } else {
      initialD = initialD - 2;
    }
    if (initialD < 1) initialD = 1;
    if (initialD > 31) initialD = 31;
    
    var choices = ['$1000 in ' + dMap.get(initialD), '$500 now '];
    var isReversed = Math.random() < 0.5;
    if (isReversed) {
      choices = choices.reverse();
    }
    trial4._isReversed = isReversed;
    return choices;
  },
  button_html: '<button class="button jspsych-btn">%choice%</button>',
  response_ends_trial: true,
  on_finish: function(data){
    data.index = [initialD, dMap.get(initialD)];
    if (trial4._isReversed) {
      data.delay = (data.response == 1);
    } else {
      data.delay = (data.response == 0);
    }
    console.log('Trial 4 - Delay chosen:', data.delay, 'Response:', data.response, 'Reversed:', trial4._isReversed);
  }
};

var trial5 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: stim,
  choices: function() {
    var lastData = jsPsych.data.get().last(1).values()[0];
    if (lastData.delay) {
      initialD = initialD + 1;
    } else {
      initialD = initialD - 1;
    }
    if (initialD < 1) initialD = 1;
    if (initialD > 31) initialD = 31;
    
    var choices = ['$1000 in ' + dMap.get(initialD), '$500 now '];
    var isReversed = Math.random() < 0.5;
    if (isReversed) {
      choices = choices.reverse();
    }
    trial5._isReversed = isReversed;
    return choices;
  },
  button_html: '<button class="button jspsych-btn">%choice%</button>',
  response_ends_trial: true,
  on_finish: function(data){
    data.index = [initialD, dMap.get(initialD)];
    if (trial5._isReversed) {
      data.delay = (data.response == 1);
    } else {
      data.delay = (data.response == 0);
    }
    console.log('Trial 5 - Delay chosen:', data.delay, 'Response:', data.response, 'Reversed:', trial5._isReversed);
  }
};

timeline.push(trial1);
timeline.push(trial2);
timeline.push(trial3);
timeline.push(trial4);
timeline.push(trial5);



