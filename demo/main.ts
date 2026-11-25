import '../src/component/index.js';
import { COMPOSER_CONTROL_CHANGE } from '../src/events.js';
import { presetFromHash, presetToHash } from './preset.js';

// The page URL holds the selected settings, so a link reproduces the same music.
const composer = document.querySelector('audiobus-composer');
if (composer) {
  try {
    const preset = presetFromHash(location.hash);
    if (preset) composer.options = preset;
  } catch { /* An edited or outdated link falls back to the defaults. */ }
  composer.addEventListener(COMPOSER_CONTROL_CHANGE, () => {
    history.replaceState(null, '', presetToHash(composer.options));
  });
}
