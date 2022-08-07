
import Handhold from './src/handhold';
import handholdData from './steps.json';

const handhold = new Handhold();
handhold.setup(handholdData);
handhold.init();