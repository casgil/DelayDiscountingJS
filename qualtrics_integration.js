/**
 * Qualtrics Integration for 5-Trial Delay Discounting Task
 * 
 * This code embeds the Delay Discounting task into a Qualtrics survey and automatically captures behavioral data.
 * Copy and paste this entire code into a Text/Graphic question's JavaScript section.
 * 
 * Based on the approach used in TCIPJS integration for reliability and compatibility.
 * 
 * EMBEDDED DATA FIELDS CREATED:
 * - DD_Trial1_DelayIndex, DD_Trial1_DelayLabel, DD_Trial1_ChoseDelayed
 * - DD_Trial2_DelayIndex, DD_Trial2_DelayLabel, DD_Trial2_ChoseDelayed
 * - DD_Trial3_DelayIndex, DD_Trial3_DelayLabel, DD_Trial3_ChoseDelayed
 * - DD_Trial4_DelayIndex, DD_Trial4_DelayLabel, DD_Trial4_ChoseDelayed
 * - DD_Trial5_DelayIndex, DD_Trial5_DelayLabel, DD_Trial5_ChoseDelayed
 * - DD_FinalDelayIndex, DD_FinalDelayLabel
 * - DD_CompletionTime: Total time to complete task (seconds)
 * - DD_RawData: Complete trial-by-trial data (JSON string)
 * - DD_Completed: Task completion status
 * - DD_StartTime, DD_EndTime: ISO timestamp strings
 */

Qualtrics.SurveyEngine.addOnload(function() {
    // Get question container and clear it
    var questionContainer = this.getQuestionContainer();
    questionContainer.innerHTML = '';
    
    // Create main container
    var mainContainer = document.createElement('div');
    mainContainer.id = 'dd-main-container';
    mainContainer.style.cssText = 'width: 100%; margin: 0; padding: 10px; background-color: #ffffff;';
    
    // Add task container with loading message
    mainContainer.innerHTML = `
        <div id="iframe-container" style="border: 2px solid #e0e0e0; border-radius: 8px; background-color: #ffffff; min-height: 600px; position: relative; overflow: hidden;">
            <div id="loading-message" style="text-align: center; padding: 30px 15px; font-family: Arial, sans-serif;">
                <h3 style="font-size: clamp(18px, 4vw, 24px); margin: 15px 0;">Loading Delay Discounting Task...</h3>
                <p style="font-size: clamp(14px, 3vw, 18px); margin: 10px 0;">Please wait while the task loads.</p>
                <div style="width: 50px; height: 50px; border: 3px solid #f3f3f3; border-top: 3px solid #8c58db; border-radius: 50%; animation: spin 1s linear infinite; margin: 20px auto;"></div>
            </div>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            /* Full width responsive design */
            #dd-main-container {
                width: 100% !important;
                max-width: none !important;
                margin: 0 !important;
                padding: 5px !important;
            }
            
            #iframe-container {
                position: relative;
                padding-bottom: 80vh; /* Responsive aspect ratio */
            }
            
            #dd-iframe {
                width: 100% !important;
                height: 100% !important;
                max-width: none !important;
                box-sizing: border-box;
                position: absolute;
                top: 0;
                left: 0;
            }
            
            /* Mobile devices */
            @media (max-width: 768px) {
                #iframe-container {
                    min-height: 600px !important;
                    padding-bottom: 0 !important;
                }
                
                #dd-iframe {
                    position: relative !important;
                    height: 600px !important;
                }
                
                #loading-message h3 {
                    font-size: 20px;
                }
                
                #loading-message p {
                    font-size: 14px;
                }
            }
            
            /* Tablet devices */
            @media (min-width: 769px) and (max-width: 1024px) {
                #iframe-container {
                    min-height: 700px !important;
                    padding-bottom: 0 !important;
                }
                
                #dd-iframe {
                    position: relative !important;
                    height: 700px !important;
                }
            }
            
            /* Desktop devices */
            @media (min-width: 1025px) {
                #iframe-container {
                    min-height: 800px !important;
                    padding-bottom: 0 !important;
                }
                
                #dd-iframe {
                    position: relative !important;
                    height: 800px !important;
                }
            }
        </style>
    `;
    
    // Add to question container
    questionContainer.appendChild(mainContainer);
    
    // Create iframe
    var iframe = document.createElement('iframe');
    iframe.src = 'https://casgil.github.io/DelayDiscountingJS/';
    iframe.id = 'dd-iframe';
    iframe.style.cssText = 'width: 100%; border: none; background-color: white;';
    
    // Variables
    var taskStartTime = null;
    var taskEndTime = null;
    var dataReceived = false;
    var self = this;
    
    // Iframe load handler
    iframe.onload = function() {
        taskStartTime = Date.now();
        
        // Hide loading message
        var loadingMsg = document.getElementById('loading-message');
        if (loadingMsg) {
            loadingMsg.style.display = 'none';
        }
        
        // Inject responsive CSS into iframe
        try {
            setTimeout(function() {
                var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                if (iframeDoc) {
                    // Create responsive stylesheet
                    var style = iframeDoc.createElement('style');
                    style.textContent = `
                        /* Responsive styles for Delay Discounting task */
                        html, body {
                            overflow-x: hidden !important;
                            max-width: 100vw !important;
                        }
                        
                        #jspsych-content {
                            max-width: 100% !important;
                            margin: 10px auto !important;
                            padding: 10px;
                            box-sizing: border-box;
                            overflow-x: hidden !important;
                        }
                        
                        /* Responsive buttons and elements */
                        .jspsych-btn, .button {
                            box-sizing: border-box !important;
                            max-width: 100% !important;
                        }
                        
                        /* Responsive text */
                        p, div {
                            font-size: clamp(14px, 2.5vw, 18px);
                            max-width: 100%;
                            box-sizing: border-box;
                        }
                        
                        /* Ensure all elements prevent overflow */
                        * {
                            max-width: 100%;
                            box-sizing: border-box;
                        }
                        
                        /* Mobile-specific adjustments */
                        @media (max-width: 768px) {
                            .jspsych-btn, .button {
                                margin: 5px !important;
                            }
                            
                            #jspsych-content {
                                margin: 5px auto !important;
                                padding: 5px;
                            }
                        }
                    `;
                    iframeDoc.head.appendChild(style);
                    console.log('Responsive CSS injected into iframe');
                }
            }, 100);
        } catch (error) {
            console.warn('Could not inject responsive CSS:', error);
        }
    };
    
    // Iframe error handler
    iframe.onerror = function() {
        var iframeContainer = document.getElementById('iframe-container');
        if (iframeContainer) {
            iframeContainer.innerHTML = `
                <div style="text-align: center; padding: 30px 15px; color: red; background-color: #f8d7da; border-radius: 5px;">
                    <h3 style="font-size: clamp(18px, 4vw, 22px); margin: 10px 0;">⚠️ Task Loading Error</h3>
                    <p style="font-size: clamp(14px, 3vw, 16px); margin: 10px 0;">There was an error loading the task.</p>
                    <p style="font-size: clamp(14px, 3vw, 16px); margin: 10px 0;">Please refresh the page or contact the researcher.</p>
                </div>
            `;
        }
        self.enableNextButton();
    };
    
    // Message listener for task completion
    window.addEventListener('message', function(event) {
        // Security check - accept messages from task domain or any origin (for development)
        // In production, you may want to restrict to: if (event.origin !== 'https://casgil.github.io')
        
        // Check for task completion message
        if (event.data && event.data.type === 'DELAY_DISCOUNTING_COMPLETE') {
            taskEndTime = Date.now();
            dataReceived = true;
            
            var trialData = event.data.data;
            
            // Process the behavioral data
            try {
                // Calculate final delay index (indifference point)
                var finalDelayIndex = null;
                var finalDelayLabel = null;
                
                if (trialData.length > 0) {
                    var lastTrial = trialData[trialData.length - 1];
                    // The final delay is the last one shown, adjusted based on choice
                    // If they chose delayed, the indifference point is slightly higher
                    // If they chose immediate, the indifference point is slightly lower
                    finalDelayIndex = lastTrial.delayIndex;
                    finalDelayLabel = lastTrial.delayLabel;
                }
                
                // Calculate completion time
                var completionTime = taskStartTime ? (taskEndTime - taskStartTime) / 1000 : 0;
                
                // Store individual trial data
                for (var i = 0; i < trialData.length; i++) {
                    var trial = trialData[i];
                    var trialNum = trial.trialNum;
                    
                    Qualtrics.SurveyEngine.setEmbeddedData('DD_Trial' + trialNum + '_DelayIndex', trial.delayIndex);
                    Qualtrics.SurveyEngine.setEmbeddedData('DD_Trial' + trialNum + '_DelayLabel', trial.delayLabel);
                    Qualtrics.SurveyEngine.setEmbeddedData('DD_Trial' + trialNum + '_ChoseDelayed', trial.choseDelayed);
                }
                
                // Store summary data
                if (finalDelayIndex !== null) {
                    Qualtrics.SurveyEngine.setEmbeddedData('DD_FinalDelayIndex', finalDelayIndex);
                    Qualtrics.SurveyEngine.setEmbeddedData('DD_FinalDelayLabel', finalDelayLabel);
                }
                
                Qualtrics.SurveyEngine.setEmbeddedData('DD_CompletionTime', completionTime.toFixed(1));
                Qualtrics.SurveyEngine.setEmbeddedData('DD_RawData', JSON.stringify(trialData));
                Qualtrics.SurveyEngine.setEmbeddedData('DD_Completed', 'Yes');
                Qualtrics.SurveyEngine.setEmbeddedData('DD_StartTime', new Date(taskStartTime).toISOString());
                Qualtrics.SurveyEngine.setEmbeddedData('DD_EndTime', new Date(taskEndTime).toISOString());
                
                // Show completion message
                var summaryHtml = '<div style="margin-top: 20px; padding: 15px; background-color: #e7d4f8; border-radius: 5px; max-width: 500px; margin-left: auto; margin-right: auto;">';
                summaryHtml += '<p style="margin: 5px 0; font-size: clamp(12px, 2.5vw, 16px);"><strong>Task Completed</strong></p>';
                if (finalDelayLabel) {
                    summaryHtml += '<p style="margin: 5px 0; font-size: clamp(12px, 2.5vw, 16px);"><strong>Final Delay:</strong> ' + finalDelayLabel + '</p>';
                }
                summaryHtml += '<p style="margin: 5px 0; font-size: clamp(12px, 2.5vw, 16px);"><strong>Completion Time:</strong> ' + completionTime.toFixed(1) + ' seconds</p>';
                summaryHtml += '</div>';
                
                mainContainer.innerHTML = `
                    <div style="text-align: center; padding: 30px 15px; color: green; background-color: #d4edda; border-radius: 8px;">
                        <h3 style="font-size: clamp(18px, 4vw, 24px); margin: 10px 0;">✅ Task Completed Successfully!</h3>
                        <p style="font-size: clamp(14px, 3vw, 18px); margin: 10px 0;">Thank you for completing the delay discounting task.</p>
                        <p style="font-size: clamp(14px, 3vw, 18px); margin: 10px 0;">Your responses have been recorded.</p>
                        ${summaryHtml}
                    </div>
                `;
                
                // Enable next button
                self.enableNextButton();
                
            } catch (error) {
                console.error('Error processing task data:', error);
                Qualtrics.SurveyEngine.setEmbeddedData('DD_Error', 'Data processing failed: ' + error.message);
                Qualtrics.SurveyEngine.setEmbeddedData('DD_Completed', 'Error');
                self.enableNextButton();
            }
        }
    });
    
    // Add iframe to container
    var iframeContainer = document.getElementById('iframe-container');
    iframeContainer.appendChild(iframe);
    
    // Disable next button until task is completed
    this.disableNextButton();
    
    // Timeout after 10 minutes
    setTimeout(function() {
        if (!dataReceived) {
            mainContainer.innerHTML = `
                <div style="text-align: center; padding: 30px 15px; color: orange; background-color: #fff3cd; border-radius: 8px;">
                    <h3 style="font-size: clamp(18px, 4vw, 22px); margin: 10px 0;">⏰ Task Timeout</h3>
                    <p style="font-size: clamp(14px, 3vw, 16px); margin: 10px 0;">The task has taken longer than expected (10 minutes).</p>
                    <p style="font-size: clamp(14px, 3vw, 16px); margin: 10px 0;">Please continue with the survey.</p>
                </div>
            `;
            Qualtrics.SurveyEngine.setEmbeddedData('DD_Error', 'Timeout after 10 minutes');
            Qualtrics.SurveyEngine.setEmbeddedData('DD_Completed', 'Timeout');
            self.enableNextButton();
        }
    }, 600000); // 10 minutes
});
