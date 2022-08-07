
import Handhold from './src/handhold';
import handholdData from './steps.json';

console.log('hello world!')

const handhold = new Handhold();
console.log(handhold)
handhold.setup(handholdData);
handhold.init();