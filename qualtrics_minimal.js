Qualtrics.SurveyEngine.addOnReady(function() {
  var qel = this.getQuestionContainer();

  // Container for jsPsych
  var display = document.createElement('div');
  display.id = 'jspsych-target';
  qel.querySelector('.QuestionText').style.display = 'none';
  qel.appendChild(display);

  // Hide Next until task completes
  try { this.hideNextButton(); } catch(e) {}

  // Helpers to load external assets
  function loadScript(src) {
    return new Promise(function(resolve, reject) {
      var s = document.createElement('script');
      s.src = src; 
      s.onload = resolve; 
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  
  function loadCSS(href) {
    return new Promise(function(resolve, reject) {
      var l = document.createElement('link');
      l.rel = 'stylesheet'; 
      l.href = href; 
      l.onload = resolve; 
      l.onerror = reject;
      document.head.appendChild(l);
    });
  }

  // Load task from GitHub Pages
  (function() {
    var base = 'https://casgil.github.io/DelayDiscountingJS/';
    
    console.log('Starting to load task from:', base);
    
    // Load required files
    Promise.all([
      loadCSS(base + 'jspsych/jspsych.css'),
      loadScript(base + 'jspsych/jspsych.js'),
      loadScript(base + 'jspsych/plugin-html-button-response.js'),
      loadScript(base + 'main.js')
    ]).then(function() {
      console.log('All files loaded successfully');
      
      // Check if jsPsych is available
      if (typeof initJsPsych === 'undefined') {
        console.error('jsPsych not loaded');
        try { Qualtrics.SurveyEngine.setEmbeddedData('dd_error', 'jsPsych not loaded'); } catch(e) {}
        try { this.showNextButton(); } catch(e) {}
        return;
      }
      
      // Check if timeline was loaded
      if (typeof window.timeline === 'undefined' || !Array.isArray(window.timeline)) {
        console.error('Timeline not loaded from main.js. Available globals:', Object.keys(window).filter(k => k.includes('timeline') || k.includes('Trial')));
        try { Qualtrics.SurveyEngine.setEmbeddedData('dd_error', 'Timeline failed to load'); } catch(e) {}
        try { this.showNextButton(); } catch(e) {}
        return;
      }

      console.log('Timeline loaded with', window.timeline.length, 'trials');

      // Initialize jsPsych with custom on_finish
      var jsPsych = initJsPsych({
        display_element: 'jspsych-target',
        on_finish: function() {
          console.log('Task completed');
          // Save data to Qualtrics Embedded Data
          var trials = jsPsych.data.get().values().map(function(t) {
            return {
              index: t.index,
              delayChosen: !!t.delay,
              response: t.response
            };
          });

          try {
            Qualtrics.SurveyEngine.setEmbeddedData('dd_trials_json', JSON.stringify(trials));
            var lastTrial = trials[trials.length - 1];
            var finalIndex = lastTrial && lastTrial.index && lastTrial.index[0] ? lastTrial.index[0] : null;
            var finalLabel = lastTrial && lastTrial.index && lastTrial.index[1] ? lastTrial.index[1] : null;
            Qualtrics.SurveyEngine.setEmbeddedData('dd_final_index', finalIndex);
            Qualtrics.SurveyEngine.setEmbeddedData('dd_final_label', finalLabel);
            console.log('Data saved to Qualtrics');
          } catch(e) {
            console.error('Error saving data:', e);
          }

          // Advance survey
          try { Qualtrics.SurveyEngine.navClick('NextButton'); } catch(e) {}
        }
      });

      console.log('Starting jsPsych task');
      // Run the timeline from main.js
      jsPsych.run(window.timeline);
      
    }).catch(function(err) {
      console.error('Error loading task files:', err);
      try { Qualtrics.SurveyEngine.setEmbeddedData('dd_error', String(err)); } catch(e) {}
      try { this.showNextButton(); } catch(e) {}
    });
  })();
});
