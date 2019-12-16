const Animation = require("Animation");
const Reactive = require("Reactive");
const Scene = require("Scene");
const Audio = require("Audio");

/**
 * Generate an AudioObject from a connected Speaker and Audio Playback Controller
 * @param {string} speakerObjectName      The name of the Speaker SceneObject
 * @param {string} playbackControllerName The name of the Audio Playback Controller
 * @return {Object}                       An AudioObject referencing the specified Speaker and Playback Controller
 */
function AudioObject(speakerObjectName, playbackControllerName) {
  var audioObject = {
    _volume: Reactive.val(Scene.root.find(speakerObjectName).volume.pinLastValue()),
    _speaker: Scene.root.find(speakerObjectName),
    _controller: Audio.getPlaybackController(playbackControllerName),
    _volumeMultiplier: Reactive.val(1.0),

    /**
     * Playback volume for this AudioObject
     * @type {ScalarSignal}
     */
    get volume() {
      return this._volume;
    },

    /**
     * Playback volume for this AudioObject
     * @type {ScalarSignal}
     */
    set volume(vol) {
    	// Allow setting either a primitive or a ScalarSignal
      const volSignal = vol.pinLastValue ? vol : Reactive.val(vol);
      this._volume = volSignal;
      this._speaker.volume = volSignal.mul(this._volumeMultiplier);
    },
  };

  /**
   * Play the audio sample from the beginning of the file
   */
  audioObject.play = () => {
    audioObject._controller.reset();
    audioObject._controller.setPlaying(true);
  };

  /**
   * Begin looping the audio sample from the beginning of the file
   */
  audioObject.loop = () => {
    audioObject._controller.reset();
    audioObject._controller.setPlaying(true);
    audioObject._controller.setLooping(true);
  };

  /**
   * Stop playing or looping the audio sample
   */
  audioObject.stop = () => {
    audioObject._controller.stop();
  };

  /**
   * Fade the connected speaker's volume to a target value over a period of time
   * @param {ScalarSignal} targetSignal The target playback volume
   * @param {number}       fadeTime     The duration of the fade (milliseconds)
   * @param {Function=}    completion   Function to be called when the fade completes (optional)
   */
  audioObject.fadeToVolume = (targetSignal, fadeTime, completion) => {
    var driver = Animation.timeDriver({durationMilliseconds: fadeTime});
    var crossfadeA = Animation.animate(driver, Animation.samplers.linear(0, 1));
    var crossfadeB = Reactive.val(1.0).sub(crossfadeA);
    var signal = crossfadeA.mul(targetSignal).add(crossfadeB.mul(audioObject.volume));
    audioObject.volume = signal;
    driver.start();

    if (audioObject._existingFade) {
      audioObject._existingFade.stop();
    }
    audioObject._existingFade = driver;

    driver.onCompleted().subscribe(() => {
      if (completion) {
        completion();
      }
    });
  };

  return audioObject;
}

module.exports = {
  /**
   * Generate an AudioObject from a connected Speaker and Audio Playback Controller
   * @param {string} speakerObjectName      The name of the Speaker SceneObject
   * @param {string} playbackControllerName The name of the Audio Playback Controller
   * @return {Object}                       An AudioObject referencing the specified Speaker and Playback Controller
   */
	new: (speakerObjectName, playbackControllerName) => {
		return AudioObject(speakerObjectName, playbackControllerName);
	}
};
