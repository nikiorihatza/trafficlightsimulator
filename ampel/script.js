// Get DOM elements
const trafficLightEl = document.querySelector('.traffic-light');
const pedestrianSignalEl = document.querySelector('.pedestrian-signal');
const manualBtn = document.getElementById('manual-btn');
const simulatedBtn = document.getElementById('simulated-btn');
const pauseResumeBtn = document.getElementById('pause-resume-btn');

// Traffic light and pedestrian signal states
const states = ['red', 'yellow', 'green'];
let trafficLightState = 0;
let pedestrianState = 0;

// Timing settings (in milliseconds)
const trafficLightTiming = {
  red: 5000,
  yellow: 500,
  green: 5000,
};

const pedestrianTiming = {
  red: 5000,
  green: 5000,
  flashing: 1000,
};

// ... (previous code)

let greenLightFlashes = 0;
const maxGreenLightFlashes = 4;
let flashingInterval = null;

// Function to update the traffic light and pedestrian signal states
function updateSignals() {
  const trafficLightLights = trafficLightEl.querySelectorAll('.light');
  const pedestrianSignalLights = pedestrianSignalEl.querySelectorAll('.light');

  // Update traffic light
  trafficLightLights.forEach((light, index) => {
    light.classList.remove(...states);
    if (index === trafficLightState) {
      light.classList.add(states[index]);
    }
  });

  // Update pedestrian signal
  pedestrianSignalLights.forEach((light, index) => {
    light.classList.remove(...states);
    if (trafficLightState === 0) {
      light.classList.add(index === 2 ? states[2] : states[0]); // Green for "Walk" when the traffic light is red, red for "Don't Walk" when the traffic light is red
    } else if (pedestrianState === 1 && trafficLightState !== 2) {
      light.classList.add('flashing');
    } else if (pedestrianState === 2) {
      light.classList.add(states[2]); // Green for "Walk" when the traffic light is not red
    }
  });

  // Update the states for the next iteration
  const nextTrafficLightState = (trafficLightState + 1) % states.length;

  if (trafficLightState === 2 && nextTrafficLightState === 0) {
    setTimeout(6000);
    blinking(); // Adjust the interval duration (milliseconds) to control the flashing speed
  }

  if (nextTrafficLightState === 0) {
    pedestrianState = (pedestrianState + 1) % states.length; // Increment pedestrian state only when the traffic light is red
  }

  trafficLightState = nextTrafficLightState;

  function blinking() {
    
    greenLightFlashes = 0;
    flashingInterval = setInterval(() => {
      trafficLightLights[2].classList.toggle('flashing');
      greenLightFlashes++;
      if (greenLightFlashes >= maxGreenLightFlashes * 2) {
        clearInterval(flashingInterval);
        trafficLightLights[2].classList.remove('flashing');
        flashingInterval = null;
      }
    }, 500);
  }
}


// ... (remaining code)
// Function to start the simulation
function startSimulation() {
  simulatedBtn.disabled = true;
  manualBtn.disabled = true;
  pauseResumeBtn.disabled = false;

  intervalId = setInterval(updateSignals, trafficLightTiming.red + trafficLightTiming.yellow + trafficLightTiming.green);
}

// Function to pause/resume the simulation
let intervalId;

function pauseResumeSimulation() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    pauseResumeBtn.textContent = 'Resume';
  } else {
    intervalId = setInterval(updateSignals, trafficLightTiming.red + trafficLightTiming.yellow + trafficLightTiming.green);
    pauseResumeBtn.textContent = 'Pause';
  }
}

// Add event listeners
manualBtn.addEventListener('click', () => {
  clearInterval(intervalId);
  intervalId = null;
  updateSignals();
  simulatedBtn.disabled = false;
  pauseResumeBtn.disabled = true;
});

simulatedBtn.addEventListener('click', () => {
  startSimulation();
});

pauseResumeBtn.addEventListener('click', () => {
  pauseResumeSimulation();
});
