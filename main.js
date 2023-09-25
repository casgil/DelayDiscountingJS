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
  [23, "1 years"],
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

var trial1 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: stim,
    choices: ['$1000 in ' + dMap.get(initialD) +' and $0 now', '$500 now and $0 in '+ dMap.get(initialD) + ''], //starts at 16
    button_html: '<button class="button">%choice%</button>',
    response_ends_trial: true,
    on_finish: function(data){
      data.index = [initialD, dMap.get(initialD)];
      console.log();
      if (data.response == 0) { //record the response for the current trial
        data.delay = true;
        
      }
      else {
        data.delay = false;
      }
    }
}

var trial2 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: stim,
    choices: function() {
      var last_trial_choice = jsPsych.data.get().last(1).values()[0].delay; //either true or false
      if (last_trial_choice) { //if last trial was true
        initialD = initialD + 8; 
        return ['$1000 in ' + dMap.get(initialD) + ' and $0 now', '$500 now and $0 in '+ dMap.get(initialD) + '']
      }
      else {
        initialD = initialD - 8;
        return ['$1000 in ' + dMap.get(initialD) + ' and $0 now', '$500 now and $0 in '+ dMap.get(initialD) + '']
      }
    },
    button_html: '<button class="button">%choice%</button>',
    response_ends_trial: true,
    on_finish: function(data){
      data.index = [initialD, dMap.get(initialD)];
      console.log();
      if (data.response == 0) {
        data.delay = true;
      }
      else {
        data.delay = false;
      }
    }
}

var trial3 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: stim,
    choices: function() {
      var last_trial_choice = jsPsych.data.get().last(1).values()[0].delay;
      if (last_trial_choice) {
        initialD = initialD + 4; //divides by 2 each trial (8 then 4 then 2 then 1)
        return ['$1000 in ' + dMap.get(initialD) + ' and $0 now', '$500 now and $0 in '+ dMap.get(initialD) + '']
      }
      else {
        initialD = initialD - 4;
        return ['$1000 in ' + dMap.get(initialD) + ' and $0 now', '$500 now and $0 in '+ dMap.get(initialD) + '']
      }
    },
    button_html: '<button class="button">%choice%</button>',
    response_ends_trial: true,
    on_finish: function(data){
      data.index =  [initialD, dMap.get(initialD)];
      console.log();
      if (data.response == 0) {
        data.delay = true;
      }
      else {
        data.delay = false;
      }
    }
}

var trial4 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: stim,
    choices: function() {
      var last_trial_choice = jsPsych.data.get().last(1).values()[0].delay;
      if (last_trial_choice) {
        initialD = initialD + 2;
        return ['$1000 in ' + dMap.get(initialD) + ' and $0 now', '$500 now and $0 in '+ dMap.get(initialD) + '']
      }
      else {
        initialD = initialD - 2;
        return ['$1000 in ' + dMap.get(initialD) + ' and $0 now', '$500 now and $0 in '+ dMap.get(initialD) + '']
      }
    },
    button_html: '<button class="button">%choice%</button>',
    response_ends_trial: true,
    on_finish: function(data){
      data.index =  [initialD, dMap.get(initialD)];
      console.log();
      if (data.response == 0) {
        data.delay = true;
      }
      else {
        data.delay = false;
      }
    }
  }

var trial5 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: stim,
    choices: function() {
      var last_trial_choice = jsPsych.data.get().last(1).values()[0].delay;
      if (last_trial_choice) {
        initialD = initialD + 1;
        return ['$1000 in ' + dMap.get(initialD) + ' and $0 now', '$500 now and $0 in '+ dMap.get(initialD) + '']
      }
      else {
        initialD = initialD - 1;
        return ['$1000 in ' + dMap.get(initialD) + ' and $0 now', '$500 now and $0 in '+ dMap.get(initialD) + '']
      }
    },
    button_html: '<button class="button">%choice%</button>',
    response_ends_trial: true,
    on_finish: function(data){
      data.index =  [initialD, dMap.get(initialD)];
      console.log();
      if (data.response == 0) {
        data.delay = true;
      }
      else {
        data.delay = false;
      }
    }
}

timeline.push(trial1);
timeline.push(trial2);
timeline.push(trial3);
timeline.push(trial4);
timeline.push(trial5);



