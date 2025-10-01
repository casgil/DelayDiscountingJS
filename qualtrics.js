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
    await loadScript(base + 'main.js'); // defines global `timeline`

    // Ensure timeline exists and has all trials
    if (!window.timeline || !Array.isArray(window.timeline)) {
      console.error('Timeline not loaded properly');
      try { Qualtrics.SurveyEngine.setEmbeddedData('dd_error', 'Timeline failed to load'); } catch(e) {}
      try { this.showNextButton(); } catch(e) {}
      return;
    }

    console.log('Timeline loaded with', window.timeline.length, 'trials');

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


