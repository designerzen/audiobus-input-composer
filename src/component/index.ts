export { AudioBusComposer } from './composer-element.js';
import { AudioBusComposer } from './composer-element.js';

export function defineComposer(): void {
  if (!customElements.get('audiobus-composer')) customElements.define('audiobus-composer', AudioBusComposer);
}
defineComposer();
