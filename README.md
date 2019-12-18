# Spark AR - Audio Object

## Description

This AudioObject implementation helps to unify Audio Playback Controllers with the Speakers they are connected to. These AudioObjects offer playback controls, as well as a volume fading utility.

In order to use the AudioObject, the referenced Audio Playback Controller must already be linked to an imported audio asset, and connected to a Speaker SceneObject.

## Usage

```javascript
const AudioObject = require("sparkar-audio-object");

// Create the audio objects
const startSFX = AudioObject.new({
  speakerName: "start_sound_speaker",
  controllerName: "start_sound_controller",
});
const drumLoop = AudioObject.new({
  speakerName: "drum_loop_speaker",
  controllerName: "drum_loop_controller",
});
const guitarLoop = AudioObject.new({
  speakerName: "guitar_loop_speaker",
  controllerName: "guitar_loop_controller",
});

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
    guitarLoop.fadeToVolume({target: 1, fadeTime: 200});
  },
});
```