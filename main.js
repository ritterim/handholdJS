import Handhold from './src/handhold';
import handholdData from './steps.json';

const startBtn = document.getElementById('start-button');
console.log({ startBtn });

const handhold = new Handhold(startBtn);
handhold.setup(handholdData);
handhold.init();