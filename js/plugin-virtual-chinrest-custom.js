var jsPsychVirtualChinrest = (function (jspsych) {
  'use strict';

  const info = {
      name: "virtual-chinrest",
      parameters: {
          /** What units to resize to? ["none"/"cm"/"inch"/"deg"]. If "none", no resizing will be done to the jsPsych content after this trial. */
          resize_units: {
              type: jspsych.ParameterType.SELECT,
              pretty_name: "Resize units",
              options: ["none", "cm", "inch", "deg"],
              default: "none",
          },
          /** After the scaling factor is applied, this many pixels will equal one unit of measurement. */
          pixels_per_unit: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Pixels per unit",
              default: 100,
          },
          // mouse_adjustment: {
          //   type: ParameterType.BOOL,
          //   pretty_name: "Adjust Using Mouse?",
          //   default: true,
          // },
          /** Any content here will be displayed above the card stimulus. */
          adjustment_prompt: {
              type: jspsych.ParameterType.HTML_STRING,
              pretty_name: "Adjustment prompt",
              default: `
          <div style="text-align: left;">
          <p>Click and drag the lower right corner of the image until it is the same size as a real credit card held up to the screen.</p>
          <p>You can use any card that is the same size as a credit card, like a membership card or driver's license.</p>
          <p>If you do not have access to a real card you can use a ruler to measure the image width to 3.37 inches or 85.6 mm.</p>
          </div>`,
          },
          /** Content of the button displayed below the card stimulus. */
          adjustment_button_prompt: {
              type: jspsych.ParameterType.HTML_STRING,
              pretty_name: "Adjustment button prompt",
              default: "Click here when the image is the correct size",
          },
          /** Path to an image to be shown in the resizable item div. */
          item_path: {
              type: jspsych.ParameterType.IMAGE,
              pretty_name: "Item path",
              default: null,
              preload: false,
          },
          /** The height of the item to be measured, in mm. */
          item_height_mm: {
              type: jspsych.ParameterType.FLOAT,
              pretty_name: "Item height (mm)",
              default: 53.98,
          },
          /** The width of the item to be measured, in mm. */
          item_width_mm: {
              type: jspsych.ParameterType.FLOAT,
              pretty_name: "Item width (mm)",
              default: 85.6,
          },
          /** The initial size of the card, in pixels, along the largest dimension. */
          item_init_size: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Initial Size",
              default: 250,
          },
          /** How many times to measure the blindspot location? If 0, blindspot will not be detected, and viewing distance and degree data not computed. */
          blindspot_reps: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Blindspot measurement repetitions",
              default: 5,
          },
          /** HTML-formatted prompt to be shown on the screen during blindspot estimates. */
          blindspot_prompt: {
              type: jspsych.ParameterType.HTML_STRING,
              pretty_name: "Blindspot prompt",
              default: `
          <p>Now we will quickly measure how far away you are sitting.</p>
          <p>Please follow these instruction very carefully:</p>
          <div style="text-align: left">
            <ol>
              <li>Sit in a straight, relaxed and comfortable position.</li>
              <li>Extend your arm towards the screen. Adjust your position so that your fingertips are between 0 and 10cm away the screen.</li>
              <li>Put your left hand on the <b>space bar</b>.</li>
              <li>Cover your right eye with your right hand.</li>
              <li>Using your left eye, focus on the black square. Keep your focus on the black square.</li>
              <li>The <span style="color: red; font-weight: bold;">red ball</span> will disappear as it moves from right to left. Press the space bar as soon as the ball disappears.</li>
            </ol>
          </div>
          <p>Press the space bar when you are ready to begin.</p>
          `,
          },
          /** Content of the start button for the blindspot tasks. */
          // blindspot_start_prompt: {
          //   type: ParameterType.HTML_STRING,
          //   pretty_name: "Blindspot start prompt",
          //   default: "Start"
          // },
          /** Text accompanying the remaining measurements counter. */
          blindspot_measurements_prompt: {
              type: jspsych.ParameterType.HTML_STRING,
              pretty_name: "Blindspot measurements prompt",
              default: "Remaining measurements: ",
          },
          /** HTML-formatted string for reporting the distance estimate. It can contain a span with ID 'distance-estimate', which will be replaced with the distance estimate. If "none" is given, viewing distance will not be reported to the participant. */
          viewing_distance_report: {
              type: jspsych.ParameterType.HTML_STRING,
              pretty_name: "Viewing distance report",
              default: "<p>Based on your responses, you are sitting about <span id='distance-estimate' style='font-weight: bold;'></span> from the screen.</p><p>Does that seem about right?</p>",
          },
          /** Label for the button that can be clicked on the viewing distance report screen to re-do the blindspot estimate(s). */
          redo_measurement_button_label: {
              type: jspsych.ParameterType.HTML_STRING,
              pretty_name: "Re-do measurement button label",
              default: "No, that is not close. Try again.",
          },
          /** Label for the button that can be clicked on the viewing distance report screen to accept the viewing distance estimate. */
          blindspot_done_prompt: {
              type: jspsych.ParameterType.HTML_STRING,
              pretty_name: "Blindspot done prompt",
              default: "Yes",
          },
          /** The minumum allowed sitting distance, in mm. */
          min_distance_mm: {
              type: jspsych.ParameterType.FLOAT,
              pretty_name: "Minumum sitting distance (mm)",
              default: 350,
          },
          /** The maximum allowed sitting distance, in mm.  */
          max_distance_mm: {
              type: jspsych.ParameterType.FLOAT,
              pretty_name: "Maximum sitting distance (mm)",
              default: 900,
          },
          /** How many times the final calculated distance has failed to be within the allowed range */
          max_failures: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Maximum number of failures",
              default: 2,
          },
          /** HTML-formatted prompt to be shown when asking participant to re-do test after a distance failure. */
          do_again_prompt: {
              type: jspsych.ParameterType.HTML_STRING,
              pretty_name: "Do-again prompt",
              default: `<p><b>Unfortunately you are not sitting in a position as required for this study</b></p><br>
                <p>We will re-do the tests to calculate your position.</p>
                <p><b>Please follow the instructions very carefully!</b></br>
                If the test fails again, the study will terminate and you will be asked to return your Prolific submission. Unfortunately, we will not be able to compensate your participation.<p>
                <div style='text-align: left;'>
                <p>Please remember:</p>
                  <ol>
                  <li>Make sure you have a card with you, and follow the re-sizing instructions with the card.</li>
                  <li>Make sure you are in a quiet environment and please don't listen to any music during the experiment.</li>
                  <li>Sit in a straight, relaxed and comfortable position.</li> 
                  <li>Extend your arm towards the screen. Your fingertips should either touch the screen, or be at a maximum of 10cm away from it.</li> 
                  <li>Keep the same sitting position during the whole experiment. Try not to lean forwards or backwards</li>  
                   </ol></br>
                </div>
                <p>Press the button below to confirm you agree with these requirements and continue</p>`,
          },
      },
  };
  /**
   * **virtual-chinrest**
   *
   * jsPsych plugin for estimating physical distance from monitor and optionally resizing experiment content, based on Qisheng Li 11/2019. /// https://github.com/QishengLi/virtual_chinrest
   *
   * @author Gustavo Juantorena
   * 08/2020 // https://github.com/GEJ1
   * Contributions from Peter J. Kohler: https://github.com/pjkohler
   * @see {@link https://www.jspsych.org/plugins/jspsych-virtual-chinrest/ virtual-chinrest plugin documentation on jspsych.org}
   */
  class VirtualChinrestPlugin {
      constructor(jsPsych) {
          this.jsPsych = jsPsych;
          this.ball_size = 30;
          this.ball = null;
          this.container = null;
          this.reps_remaining = 0;
          this.ball_animation_frame_id = null;
          this.failures = 0;
      }
      trial(display_element, trial) {
          /** check parameter compatibility */
          if (
            !(trial.blindspot_reps > 0) &&
            (trial.resize_units == "deg" || trial.resize_units == "degrees")
            ) {
              console.error("Blindspot repetitions set to 0, so resizing to degrees of visual angle is not possible!");
              return;
          }
          this.reps_remaining = trial.blindspot_reps;

          /** some additional parameter configuration */
          let trial_data = {
              item_width_mm: trial.item_width_mm,
              item_height_mm: trial.item_height_mm, //card dimension: 85.60 × 53.98 mm (3.370 × 2.125 in)
          };
          let blindspot_config_data = {
              ball_pos: [],
              slider_clck: false,
          };
          let aspect_ratio = trial.item_width_mm / trial.item_height_mm;
          const start_div_height = aspect_ratio < 1 ? trial.item_init_size : Math.round(trial.item_init_size / aspect_ratio);
          const start_div_width = aspect_ratio < 1 ? Math.round(trial.item_init_size * aspect_ratio) : trial.item_init_size;
          const adjust_size = Math.round(start_div_width * 0.1);
          
          /** create content for first screen, resizing card */
          let pagesize_content = `
            <div id="page-size">
              <div id="item" style="border: none; height: ${start_div_height}px; width: ${start_div_width}px; margin: 5px auto; background-color: #ddd; position: relative; ${trial.item_path === null
                ? ""
                : `background-image: url(${trial.item_path}); background-size: 100% auto; background-repeat: no-repeat;`}">
                <div id="jspsych-resize-handle" style="cursor: nwse-resize; background-color: none; width: ${adjust_size}px; height: ${adjust_size}px; border: 5px solid red; border-left: 0; border-top: 0; position: absolute; bottom: 0; right: 0;">
                </div>
              </div>
              ${trial.adjustment_prompt}
              <button id="end_resize_phase" class="jspsych-btn">
                ${trial.adjustment_button_prompt}
              </button>
            </div>`;
          
          /** create content for second screen, blind spot */
          let blindspot_content = `
              <div id="blind-spot">
                ${trial.blindspot_prompt}
                <div id="svgDiv" style="height:100px; position:relative;"></div>
                <button class="btn btn-primary" id="proceed" style="display:none;"> +
                  ${trial.blindspot_done_prompt} +
                </button>
                ${trial.blindspot_measurements_prompt} 
                <div id="click" style="display:inline; color: red"> ${trial.blindspot_reps} </div>
              </div>`;
          
          /** create content for final report screen */
          let report_content = `
              <div id="distance-report">
                <div id="info-h">
                  ${trial.viewing_distance_report}
                </div>
                <button id="redo_blindspot" class="jspsych-btn">${trial.redo_measurement_button_label}</button>
                <button id="proceed" class="jspsych-btn">${trial.blindspot_done_prompt}</button>
              </div>`;

          /** create content for redo screen after a distance failure */
          let do_again_content = `
              <div id="do-again">
                <div id="info-h">
                  ${trial.do_again_prompt}
                </div>
                <button id="restart_button" class="jspsych-btn">Continue</button>
              </div>`;

          display_element.innerHTML = `<div id="content" style="width: 900px; margin: 0 auto;"></div>`;
          
          const start_time = performance.now();
          
          startResizePhase();
          
          function startResizePhase() {
              display_element.querySelector("#content").innerHTML = pagesize_content;
              // Event listeners for mouse-based resize
              let dragging = false;
              let origin_x, origin_y;
              let cx, cy;
              const scale_div = display_element.querySelector("#item");

              //add extra check if user resizes the card, otherwise don't allow to continue
              display_element.querySelector("#end_resize_phase").disabled = true; 
              
              function mouseupevent() {
                  dragging = false;
              }
              document.addEventListener("mouseup", mouseupevent);
              
              function mousedownevent(e) {
                  e.preventDefault();
                  dragging = true;
                  origin_x = e.pageX;
                  origin_y = e.pageY;
                  cx = parseInt(scale_div.style.width);
                  cy = parseInt(scale_div.style.height);
                  display_element.querySelector("#end_resize_phase").disabled = false; 
              }

              display_element
                  .querySelector("#jspsych-resize-handle")
                  .addEventListener("mousedown", mousedownevent);
              
              function resizeevent(e) {
                  if (dragging) {
                      let dx = e.pageX - origin_x;
                      let dy = e.pageY - origin_y;
                      if (Math.abs(dx) >= Math.abs(dy)) {
                          scale_div.style.width = Math.round(Math.max(20, cx + dx * 2)) + "px";
                          scale_div.style.height = Math.round(Math.max(20, cx + dx * 2) / aspect_ratio) + "px";
                      }
                      else {
                          scale_div.style.height = Math.round(Math.max(20, cy + dy * 2)) + "px";
                          scale_div.style.width = Math.round(aspect_ratio * Math.max(20, cy + dy * 2)) + "px";
                      }
                  }
              }
              
              display_element.addEventListener("mousemove", resizeevent);
              display_element
                  .querySelector("#end_resize_phase")
                  .addEventListener("click", finishResizePhase);
          }

          function finishResizePhase() {
              // add item width info to data
              const item_width_px = document.querySelector("#item").getBoundingClientRect().width;
              trial_data["item_width_px"] = Math.round(item_width_px);
              const px2mm = convertPixelsToMM(item_width_px);
              trial_data["px2mm"] = accurateRound(px2mm, 2);
              // check what to do next
              if (trial.blindspot_reps > 0) {
                  startBlindSpotPhase();
              }
              else {
                  endTrial();
              }
          }

          const startBlindSpotPhase = () => {
              // reset the config data in case we are redoing the measurement
              blindspot_config_data = {
                  ball_pos: [],
                  slider_clck: false,
              };
              // add the content to the page
              display_element.querySelector("#content").innerHTML = blindspot_content;
              this.container = display_element.querySelector("#svgDiv");
              // draw the ball and fixation square
              drawBall();
              resetAndWaitForBallStart();
          };

          const resetAndWaitForBallStart = () => {
              const rectX = this.container.getBoundingClientRect().width - this.ball_size;
              const ballX = rectX * 0.85; // define where the ball is
              this.ball.style.left = `${ballX}px`;
              // wait for a spacebar to begin the animations
              this.jsPsych.pluginAPI.getKeyboardResponse({
                  callback_function: startBall,
                  valid_responses: [" "],
                  rt_method: "performance",
                  allow_held_key: false,
                  persist: false,
              });
          };

          const startBall = () => {
              this.jsPsych.pluginAPI.getKeyboardResponse({
                  callback_function: recordPosition,
                  valid_responses: [" "],
                  rt_method: "performance",
                  allow_held_key: false,
                  persist: false,
              });
              this.ball_animation_frame_id = requestAnimationFrame(animateBall);
          };

          const finishBlindSpotPhase = () => {
              const angle = 13.5;
              // calculate average ball position
              const sum = blindspot_config_data["ball_pos"].reduce((a, b) => a + b, 0);
              const ballPosLen = blindspot_config_data["ball_pos"].length;
              blindspot_config_data["avg_ball_pos"] = accurateRound(sum / ballPosLen, 2);
              // calculate distance between avg ball position and square
              const ball_sqr_distance = (blindspot_config_data["square_pos"] - blindspot_config_data["avg_ball_pos"]) /
                  trial_data["px2mm"];
              // calculate viewing distance in mm
              const viewDistance = ball_sqr_distance / Math.tan(deg_to_radians(angle));
              trial_data["view_dist_mm"] = accurateRound(viewDistance, 2);
              if (trial.viewing_distance_report == "none") {
                  endTrial();
              }
              else { 
                  showReport();
              }
          };

          // restartAll: reinitiate all values
          const restartAll = () => {
            // reinitialize all values
            this.reps_remaining = trial.blindspot_reps;
            /** some additional parameter configuration */
            trial_data = {
                item_width_mm: trial.item_width_mm,
                item_height_mm: trial.item_height_mm, //card dimension: 85.60 × 53.98 mm (3.370 × 2.125 in)
            };
            blindspot_config_data = {
                ball_pos: [],
                slider_clck: false,
            };
            startResizePhase();

          };
          
          const distanceCheck = () => {
            // console.log("Running custom distance check");
            let distance = trial_data["view_dist_mm"];
            
            if (distance < trial.min_distance_mm || distance > trial.max_distance_mm) {
              // position estimation failed / participant did not follow instructions correctly
              this.failures++;
              // console.log("fails: " + this.failures);
              
              if (this.failures >= trial.max_failures) {
                // Final time estimation fails
                // Ending chinrest trial with no resizing
              endTrial(0);
              } else {
                // Display message
                display_element.querySelector("#content").innerHTML = do_again_content;
                display_element
                    .querySelector("#restart_button")
                    .addEventListener("click", restartAll);
                }
            } else {
              // position estimation successful!
              endTrial();
            };
          };

          function showReport() {
              // Display data
              display_element.querySelector("#content").innerHTML = report_content;
              display_element.querySelector("#distance-estimate").innerHTML = `
          ${Math.round(trial_data["view_dist_mm"] / 10)} cm (${Math.round(trial_data["view_dist_mm"] * 0.0393701)} inches)
        `;
              display_element
                  .querySelector("#redo_blindspot")
                  .addEventListener("click", restartAll);

              //perform extra custom distance check before ending
              display_element.querySelector("#proceed").addEventListener("click", distanceCheck);
              // display_element.querySelector("#proceed").addEventListener("click", endTrial);
          };

          function computeTransformation(resize_screen) {
              trial_data.item_width_deg =
                  (2 * Math.atan(trial_data["item_width_mm"] / 2 / trial_data["view_dist_mm"]) * 180) /
                      Math.PI;
              trial_data.px2deg = trial_data["item_width_px"] / trial_data.item_width_deg; // size of item in pixels divided by size of item in degrees of visual angle
              let px2unit_scr = 0;
              switch (trial.resize_units) {
                  case "cm":
                  case "centimeters":
                      px2unit_scr = trial_data["px2mm"] * 10; // pixels per centimeter
                      break;
                  case "inch":
                  case "inches":
                      px2unit_scr = trial_data["px2mm"] * 25.4; // pixels per inch
                      break;
                  case "deg":
                  case "degrees":
                      px2unit_scr = trial_data["px2deg"]; // pixels per degree of visual angle
                      break;
              }
              px2unit_scr = px2unit_scr * resize_screen;
              if (px2unit_scr > 0) {
                  // scale the window
                  let scale_factor = px2unit_scr / trial.pixels_per_unit;
                  document.getElementById("jspsych-content").style.transform = "scale(" + scale_factor + ")";
                  // pixels have been scaled, so pixels per degree, pixels per mm and pixels per item_width needs to be updated
                  trial_data.px2deg = trial_data.px2deg / scale_factor;
                  trial_data.px2mm = trial_data.px2mm / scale_factor;
                  trial_data.item_width_px = trial_data.item_width_px / scale_factor;
                  trial_data.scale_factor = scale_factor;
              }
              if (trial.blindspot_reps > 0) {
                  trial_data.win_width_deg = window.innerWidth / trial_data.px2deg;
                  trial_data.win_height_deg = window.innerHeight / trial_data.px2deg;
              }
              else {
                  // delete degree related properties
                  delete trial_data.px2deg;
                  delete trial_data.item_width_deg;
              }
          }

          const endTrial = (resize_screen = 1) => {
              // finish trial
              trial_data.rt = Math.round(performance.now() - start_time);
              
              // remove lingering event listeners, just in case
              this.jsPsych.pluginAPI.cancelAllKeyboardResponses();
              
              // compute final data
              computeTransformation(resize_screen);
              
              // clear the display
              display_element.innerHTML = "";
              
              // finish the trial
              trial_data.failures = this.failures;
              this.jsPsych.finishTrial(trial_data);
          };

          const drawBall = () => {
              this.container.innerHTML = `
        <div id="virtual-chinrest-circle" style="position: absolute; background-color: #f00; width: ${this.ball_size}px; height: ${this.ball_size}px; border-radius:${this.ball_size}px;"></div>
        <div id="virtual-chinrest-square" style="position: absolute; background-color: #000; width: ${this.ball_size}px; height: ${this.ball_size}px;"></div>
      `;
              const ball = this.container.querySelector("#virtual-chinrest-circle");
              const square = this.container.querySelector("#virtual-chinrest-square");
              const rectX = this.container.getBoundingClientRect().width - this.ball_size;
              const ballX = rectX * 0.85; // define where the ball is
              ball.style.left = `${ballX}px`;
              square.style.left = `${rectX}px`;
              this.ball = ball;
              blindspot_config_data["square_pos"] = accurateRound(getElementCenter(square).x, 2);
          };
          const animateBall = () => {
              const dx = -2;
              const x = parseInt(this.ball.style.left);
              this.ball.style.left = `${x + dx}px`;
              this.ball_animation_frame_id = requestAnimationFrame(animateBall);
          };
          const recordPosition = () => {
              cancelAnimationFrame(this.ball_animation_frame_id);
              blindspot_config_data["ball_pos"].push(accurateRound(getElementCenter(this.ball).x, 2));
              //counter and stop
              this.reps_remaining--;
              document.querySelector("#click").textContent = Math.max(this.reps_remaining, 0).toString();
              if (this.reps_remaining <= 0) {
                  finishBlindSpotPhase();
              }
              else {
                  resetAndWaitForBallStart();
              }
          };
          function convertPixelsToMM(item_width_px) {
              const px2mm = item_width_px / trial_data["item_width_mm"];
              return px2mm;
          }
          function accurateRound(value, decimals) {
              return Number(Math.round(Number(value + "e" + decimals)) + "e-" + decimals);
          }
          function getElementCenter(el) {
              const box = el.getBoundingClientRect();
              return {
                  x: box.left + box.width / 2,
                  y: box.top + box.height / 2,
              };
          }
          //helper function for radians
          // Converts from degrees to radians.
          const deg_to_radians = (degrees) => {
              return (degrees * Math.PI) / 180;
          };
      }
  }
  VirtualChinrestPlugin.info = info;

  return VirtualChinrestPlugin;

})(jsPsychModule);
