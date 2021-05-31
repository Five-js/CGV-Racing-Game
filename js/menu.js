var raceButton = document.getElementById("race_button");
var controlsButton = document.getElementById("controls_button");
var creditsButton = document.getElementById("credits_button");
var closeControlsButton = document.getElementById("close-controls");
var closeCreditsButton = document.getElementById("close-credits");
var musicButton = document.getElementById("music_button");
var soundsButton = document.getElementById("sounds_button");
var backgroundMusic = document.getElementById("background_music");

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

// Show Controls
// Open Controls
controlsButton.addEventListener("click", function (event) {
  document.querySelector(".controls-container").style.display = "flex";
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