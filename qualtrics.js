Qualtrics.SurveyEngine.addOnReady(function() {
  const qel = this.getQuestionContainer();

  // Container for jsPsych
  const display = document.createElement('div');
  display.id = 'jspsych-target';
  qel.querySelector('.QuestionText').style.display = 'none';
  qel.appendChild(display);

  // Hide Next until task completes
  try { this.hideNextButton(); } catch(e) {}

  // Helpers to load external assets
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src; s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  function loadCSS(href) {
    return new Promise((resolve, reject) => {
      const l = document.createElement('link');
      l.rel = 'stylesheet'; l.href = href; l.onload = resolve; l.onerror = reject;
      document.head.appendChild(l);
    });
  }

  (async () => {
    const base = 'https://casgil.github.io/DelayDiscountingJS/';

    // Add custom CSS for button styling
    const style = document.createElement('style');
    style.textContent = `
      .jspsych-btn {
        width: 320px !important; height: 200px !important; min-width: 320px !important; min-height: 200px !important;
        max-width: 320px !important; max-height: 200px !important; font-size: 22px !important; font-weight: 700 !important;
        line-height: 1.35 !important; margin: 10px !important; padding: 22px !important; box-sizing: border-box !important;
        background: #8c58db !important; color: #fff !important; border: 2px solid #ccc !important; border-radius: 8px !important;
        cursor: pointer !important; text-align: center !important; display: inline-block !important; vertical-align: top !important;
        word-wrap: break-word !important; overflow-wrap: break-word !important;
      }
      .jspsych-btn:hover { background: #8c58db !important; }
      .jspsych-btn:active, .jspsych-btn.pressed {
        background: #7a49cb !important; border-color: #666 !important; box-shadow: inset 0 2px 6px rgba(0,0,0,0.25) !important;
        transform: scale(0.98) !important;
      }
      .begin-btn {
        width: 200px !important; height: 60px !important; min-width: 200px !important; min-height: 60px !important;
        max-width: 200px !important; max-height: 60px !important; font-size: 18px !important; padding: 10px !important;
      }
      @media (max-width: 768px) {
        .jspsych-btn { width: 48vw !important; height: 28vw !important; min-width: 220px !important; min-height: 150px !important;
          max-width: 320px !important; max-height: 200px !important; font-size: 22px !important; padding: 18px !important; }
      }
      @media (max-width: 480px) {
        .jspsych-btn { width: 88vw !important; height: 18vh !important; min-width: 280px !important; min-height: 110px !important;
          max-width: 92vw !important; max-height: 22vh !important; font-size: 20px !important; padding: 16px !important;
          display: block !important; margin: 10px auto !important; }
      }
    `;
    document.head.appendChild(style);

    // Load CSS and scripts from GitHub Pages
    await loadCSS(base + 'jspsych/jspsych.css');
    await loadScript(base + 'jspsych/jspsych.js');
    await loadScript(base + 'jspsych/plugin-html-button-response.js');

    // Create timeline directly (self-contained)
    let initialD = 16;
    const dMap = new Map([
      [1,"1 hour"],[2,"2 hours"],[3,"3 hours"],[4,"4 hours"],[5,"6 hours"],[6,"9 hours"],
      [7,"12 hours"],[8,"1 day"],[9,"1 and a half days"],[10,"2 days"],[11,"3 days"],[12,"4 days"],
      [13,"1 week"],[14,"1 and a half weeks"],[15,"2 weeks"],[16,"3 weeks"],[17,"1 month"],
      [18,"2 months"],[19,"3 months"],[20,"4 months"],[21,"6 months"],[22,"8 months"],[23,"1 year"],
      [24,"2 years"],[25,"3 years"],[26,"4 years"],[27,"5 years"],[28,"8 years"],[29,"12 years"],
      [30,"18 years"],[31,"25 years"]
    ]);

    const stim = '<div style="font-size:20px;font-weight:bold;">Which would you rather get?</div>';
    const introStim = `
      <div style="font-size:24px;font-weight:bold;margin-bottom:12px;">Two Choice Task</div>
      <div style="font-size:18px;line-height:1.5;max-width:60ch;margin:0 auto;">
        You will see a series of choices between two options.<br><br>
        Your task is to select the option you prefer for each choice presented.<br><br>
        There are no right or wrong answers. We are interested in your personal preferences.
      </div>
    `;

    const timeline = [];

    // Instructions
    timeline.push({
      type: jsPsychHtmlButtonResponse,
      stimulus: introStim,
      choices: ['Begin'],
      button_html: '<button class="jspsych-btn begin-btn">%choice%</button>'
    });

    // Create 5 trials individually to avoid closure issues
    const stepSizes = [0, 8, 4, 2, 1];
    
    // Trial 1 (no adjustment)
    timeline.push({
      type: jsPsychHtmlButtonResponse,
      stimulus: stim,
      choices: function() {
        let choices = ['$1000 in ' + dMap.get(initialD), '$500 now '];
        var isReversed = Math.random() < 0.5;
        if (isReversed) choices.reverse();
        this._isReversed = isReversed;
        return choices;
      },
      button_html: '<button class="jspsych-btn">%choice%</button>',
      on_finish: function(data) {
        const delayedChosen = (data.response === this._delayedIndex);
        data.delay = delayedChosen;
        data.index = [initialD, dMap.get(initialD)];
      }
    });

    // Trial 2 (adjust by 8)
    timeline.push({
      type: jsPsychHtmlButtonResponse,
      stimulus: stim,
      choices: function() {
        let choices = ['$1000 in ' + dMap.get(initialD), '$500 now '];
        var isReversed = Math.random() < 0.5;
        if (isReversed) choices.reverse();
        this._isReversed = isReversed;
        return choices;
      },
      button_html: '<button class="jspsych-btn">%choice%</button>',
      on_finish: function(data) {
        // Determine if delayed choice was selected based on randomization
        if (this._isReversed) {
          data.delay = (data.response == 1); // reversed: 0=immediate, 1=delayed
        } else {
          data.delay = (data.response == 0); // normal: 0=delayed, 1=immediate
        }
        data.index = [initialD, dMap.get(initialD)];
        
        // Adjust for next trial
        if (data.delay) {
          initialD = initialD + 8; // Choose delayed -> make delay longer (harder)
        } else {
          initialD = initialD - 8; // Choose immediate -> make delay shorter (easier)
        }
        if (initialD < 1) initialD = 1;
        if (initialD > 31) initialD = 31;
      }
    });

    // Trial 3 (adjust by 4)
    timeline.push({
      type: jsPsychHtmlButtonResponse,
      stimulus: stim,
      choices: function() {
        let choices = ['$1000 in ' + dMap.get(initialD), '$500 now '];
        var isReversed = Math.random() < 0.5;
        if (isReversed) choices.reverse();
        this._isReversed = isReversed;
        return choices;
      },
      button_html: '<button class="jspsych-btn">%choice%</button>',
      on_finish: function(data) {
        // Determine if delayed choice was selected based on randomization
        if (this._isReversed) {
          data.delay = (data.response == 1); // reversed: 0=immediate, 1=delayed
        } else {
          data.delay = (data.response == 0); // normal: 0=delayed, 1=immediate
        }
        data.index = [initialD, dMap.get(initialD)];
        
        // Adjust for next trial
        if (data.delay) {
          initialD = initialD + 4; // Choose delayed -> make delay longer (harder)
        } else {
          initialD = initialD - 4; // Choose immediate -> make delay shorter (easier)
        }
        if (initialD < 1) initialD = 1;
        if (initialD > 31) initialD = 31;
      }
    });

    // Trial 4 (adjust by 2)
    timeline.push({
      type: jsPsychHtmlButtonResponse,
      stimulus: stim,
      choices: function() {
        let choices = ['$1000 in ' + dMap.get(initialD), '$500 now '];
        var isReversed = Math.random() < 0.5;
        if (isReversed) choices.reverse();
        this._isReversed = isReversed;
        return choices;
      },
      button_html: '<button class="jspsych-btn">%choice%</button>',
      on_finish: function(data) {
        // Determine if delayed choice was selected based on randomization
        if (this._isReversed) {
          data.delay = (data.response == 1); // reversed: 0=immediate, 1=delayed
        } else {
          data.delay = (data.response == 0); // normal: 0=delayed, 1=immediate
        }
        data.index = [initialD, dMap.get(initialD)];
        
        // Adjust for next trial
        if (data.delay) {
          initialD = initialD + 2; // Choose delayed -> make delay longer (harder)
        } else {
          initialD = initialD - 2; // Choose immediate -> make delay shorter (easier)
        }
        if (initialD < 1) initialD = 1;
        if (initialD > 31) initialD = 31;
      }
    });

    // Trial 5 (adjust by 1)
    timeline.push({
      type: jsPsychHtmlButtonResponse,
      stimulus: stim,
      choices: function() {
        let choices = ['$1000 in ' + dMap.get(initialD), '$500 now '];
        var isReversed = Math.random() < 0.5;
        if (isReversed) choices.reverse();
        this._isReversed = isReversed;
        return choices;
      },
      button_html: '<button class="jspsych-btn">%choice%</button>',
      on_finish: function(data) {
        // Determine if delayed choice was selected based on randomization
        if (this._isReversed) {
          data.delay = (data.response == 1); // reversed: 0=immediate, 1=delayed
        } else {
          data.delay = (data.response == 0); // normal: 0=delayed, 1=immediate
        }
        data.index = [initialD, dMap.get(initialD)];
        
        // No adjustment needed for last trial
      }
    });

    console.log('Timeline created with', timeline.length, 'trials');

    // Initialize and run
    const jsPsych = initJsPsych({
      display_element: 'jspsych-target',
      on_finish: () => {
        // Compact per-trial payload
        const trials = jsPsych.data.get().values().map(t => ({
          index: t.index,               // [idx, label]
          delayChosen: !!t.delay,       // boolean
          response: t.response          // 0/1
        }));

        // Save to Embedded Data
        try {
          Qualtrics.SurveyEngine.setEmbeddedData('dd_trials_json', JSON.stringify(trials));
          var lastTrial = trials[trials.length - 1];
          var finalIndex = lastTrial && lastTrial.index && lastTrial.index[0] ? lastTrial.index[0] : null;
          var finalLabel = lastTrial && lastTrial.index && lastTrial.index[1] ? lastTrial.index[1] : null;
          Qualtrics.SurveyEngine.setEmbeddedData('dd_final_index', finalIndex);
          Qualtrics.SurveyEngine.setEmbeddedData('dd_final_label', finalLabel);
        } catch(e) {}

        // Advance survey
        try { Qualtrics.SurveyEngine.navClick('NextButton'); } catch(e) {}
      }
    });

    jsPsych.run(timeline);
  })().catch(err => {
    console.error('Error loading/running task:', err);
    try { Qualtrics.SurveyEngine.setEmbeddedData('dd_error', String(err)); } catch(e) {}
    try { this.showNextButton(); } catch(e) {}
  });
});


