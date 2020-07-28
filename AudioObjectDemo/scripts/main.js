const AudioObject = require("./sparkar-audio-object.js");

(async function () {
	// Create the audio objects
	const [startSFX, drumLoop, guitarLoop] = await Promise.all([
		AudioObject.new({
			speakerName: "start_sound_speaker",
			controllerName: "start_sound_controller",
		}),
		AudioObject.new({
			speakerName: "drum_loop_speaker",
			controllerName: "drum_loop_controller",
		}),
		AudioObject.new({
			speakerName: "guitar_loop_speaker",
			controllerName: "guitar_loop_controller",
		}),
	])

	// Play the startup sound
	startSFX.play();

	// Start the two loops in sync with each other at volume zero
	drumLoop.volume = 0;
	drumLoop.loop();
	guitarLoop.volume = 0;
	guitarLoop.loop();

	// Fade in the drum loop slowly, and then the guitar loop quickly
	drumLoop.fadeToVolume({
		target: 1,
		fadeTime: 4000,
		completion: () => {
			guitarLoop.fadeToVolume({ target: 1, fadeTime: 200 });
		},
	});
})();