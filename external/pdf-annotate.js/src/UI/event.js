import EventEmitter from 'events';

const emitter = new EventEmitter();
export function fireEvent() { emitter.emit(...arguments); };
export function addEventListener() { emitter.on(...arguments); };
export function removeEventListener() { emitter.removeListener(...arguments); };
