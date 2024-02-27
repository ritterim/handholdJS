// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';
import banner from 'vite-plugin-banner';
import pjson from './package.json';
const year = new Date().getFullYear();

const puiHeader = [
  '/*',
  '  HandholdJS v' + pjson.version + ' | ' + pjson.name + '\n',
  '  ' + pjson.description + ' (' + pjson.homepage + ')',
  '  ©' + year + ' ' + pjson.author,
  '  ' + pjson.bugs.url,
  '  Released under the ' + pjson.license + ' license.',
  '*/',
  '',
].join('\n');

export default defineConfig({
  plugins: [banner(puiHeader)],
  build: {
    minify: true,
    lib: {
      entry: resolve(__dirname, '/src/handhold.mjs'),
      name: 'HandholdJS',
      fileName: `handhold`,
      formats: ['es', 'cjs'],
    },
  },
});
