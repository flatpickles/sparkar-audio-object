const AudioObject = require("./sparkar-audio-object.js");

// Create the audio objects
const startSFX = AudioObject.new("start_sound_speaker", "start_sound_controller");
const drumLoop = AudioObject.new("drum_loop_speaker", "drum_loop_controller");
const guitarLoop = AudioObject.new("guitar_loop_speaker", "guitar_loop_controller");

// Play the startup sound
startSFX.play();

// Start the two loops in sync with each other at volume zero
drumLoop.volume = 0;
drumLoop.loop();
guitarLoop.volume = 0;
guitarLoop.loop();

// Fade in the drum loop slowly, and then the guitar loop quickly
drumLoop.fadeToVolume(1, 4000, () => {
	guitarLoop.fadeToVolume(1, 200);
});
