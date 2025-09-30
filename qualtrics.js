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

    // Load CSS and scripts from GitHub Pages
    await loadCSS(base + 'jspsych/jspsych.css');
    await loadScript(base + 'jspsych/jspsych.js');
    await loadScript(base + 'jspsych/plugin-html-button-response.js');
    await loadScript(base + 'main.js'); // defines global `timeline`

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
          Qualtrics.SurveyEngine.setEmbeddedData('dd_final_index', trials[trials.length - 1]?.index?.[0] ?? null);
          Qualtrics.SurveyEngine.setEmbeddedData('dd_final_label', trials[trials.length - 1]?.index?.[1] ?? null);
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


