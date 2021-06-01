var raceButton = document.getElementById("race_button");
var controlsButton = document.getElementById("controls_button");
var creditsButton = document.getElementById("credits_button");

var closeControlsButton = document.getElementById("close-controls");
var closeCreditsButton = document.getElementById("close-credits");

var backButton = document.getElementById("back_button");
var musicButton = document.getElementById("music_button");
var soundsButton = document.getElementById("sounds_button");

var track1 = document.getElementById("track-1");
var track2 = document.getElementById("track-2");
var track3 = document.getElementById("track-3");
var track4 = document.getElementById("track-4");

var car1 = document.getElementById("car-1");
var car2 = document.getElementById("car-2");

var start = document.getElementById("start_race_button");
var selectTrack = document.getElementById("select_track_button");

var selectedTrack = 0;
var selectedCar = 0;

var backgroundMusic = document.getElementById("background_music");

var state = 0;

var music = true;
var sounds = true;

// Toggle Music
musicButton.addEventListener("click", function (event) {
  // Turn music off
  if (music == true) {
    document.querySelector("#music_off ").style.display = "block";
    document.querySelector("#music_on ").style.display = "none";
    backgroundMusic.muted = true;
    music = false;
  }

  // Turn music on
  else if (music == false) {
    document.querySelector("#music_off ").style.display = "none";
    document.querySelector("#music_on ").style.display = "block";
    backgroundMusic.muted = false;
    music = true;
  }
});

// Toggle Sounds
soundsButton.addEventListener("click", function (event) {
  // Turn sounds off
  if (sounds == true) {
    document.querySelector("#sounds_off ").style.display = "block";
    document.querySelector("#sounds_on ").style.display = "none";
    sounds = false;
  }

  // Turn sounds on
  else if (sounds == false) {
    document.querySelector("#sounds_off ").style.display = "none";
    document.querySelector("#sounds_on ").style.display = "block";
    sounds = true;
  }
});

// Race Pressed
raceButton.addEventListener("click", function (event) {
  state = 1;

  document.querySelector(".buttons").style.display = "none";
  document.querySelector("#back_button").style.display = "flex";
  document.querySelector(".race-container").style.display = "flex";
});

// Track 1
track1.addEventListener("click", function (event) {
  selectedTrack = 1;

  document.querySelector("#track-1").style.background = "#fff";
  document.querySelector("#track-1 p").style.color = "#000";
  document.querySelector("#track-2").style.background = "transparent";
  document.querySelector("#track-2 p").style.color = "#fff";
  document.querySelector("#track-3").style.background = "transparent";
  document.querySelector("#track-3 p").style.color = "#fff";
  document.querySelector("#track-4").style.background = "transparent";
  document.querySelector("#track-4 p").style.color = "#fff";
});

// Car 1
car1.addEventListener("click", function (event) {
  selectedCar = 1;

  document.querySelector("#car-1").style.background = "#fff";
  document.querySelector("#car-1 p").style.color = "#000";
  document.querySelector("#car-2").style.background = "transparent";
  document.querySelector("#car-2 p").style.color = "#fff";
});

car2.addEventListener("click", function (event) {
  selectedCar = 2;

  document.querySelector("#car-2").style.background = "#fff";
  document.querySelector("#car-2 p").style.color = "#000";
  document.querySelector("#car-1").style.background = "transparent";
  document.querySelector("#car-1 p").style.color = "#fff";
});

// Select Track Button
selectTrack.addEventListener("click", function (event) {
  state = 2;
  document.querySelector("#track-1").style.background = "transparent";
  document.querySelector("#track-1 p").style.color = "#fff";

  document.querySelector(".race-container").style.display = "none";
  document.querySelector(".car-container").style.display = "flex";
});

// Start Button
start.addEventListener("click", function (event) {
  state = 0;

  document.querySelector(".car-container").style.display = "none";
  document.querySelector(".race-container").style.display = "none";

  document.querySelector("#car-1").style.background = "transparent";
  document.querySelector("#car-1 p").style.color = "#fff";
  document.querySelector("#car-2").style.background = "transparent";
  document.querySelector("#car-2 p").style.color = "#fff";
});

// Back Button
backButton.addEventListener("click", function (event) {
  // Reset choices
  selectedCar = 1;
  selectedTrack = 1;

  // We are on the track selection menu
  if (state == 1) {
    state = 0

    document.querySelector(".buttons").style.display = "flex";
    document.querySelector("#back_button").style.display = "none";
    document.querySelector(".race-container").style.display = "none";
  
  
    document.querySelector("#track-1").style.background = "transparent";
    document.querySelector("#track-1 p").style.color = "#fff";
  }

  // We are on the car selection menu
  else if (state == 2) {
    document.querySelector(".car-container").style.display = "none";
    document.querySelector(".race-container").style.display = "flex";
    
    state = 1

    document.querySelector("#car-1").style.background = "transparent";
    document.querySelector("#car-1 p").style.color = "#fff";
    document.querySelector("#car-2").style.background = "transparent";
    document.querySelector("#car-2 p").style.color = "#fff";
  }
});

// Show Controls
// Open Controls
controlsButton.addEventListener("click", function (event) {
  document.querySelector(".controls-container").style.display = "flex";console.log(state);
});

// Close Controls
closeControlsButton.addEventListener("click", function (event) {
  document.querySelector(".controls-container").style.display = "none";
});

// Show Credits
// Open Credits
creditsButton.addEventListener("click", function (event) {
  document.querySelector(".credits-container").style.display = "flex";
});

// Close Credits
closeCreditsButton.addEventListener("click", function (event) {
  document.querySelector(".credits-container").style.display = "none";
});
