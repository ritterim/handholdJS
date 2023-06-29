# handholdJS
A configurable JavaScript hand held walk-through for user interfaces.
## Table of Contents
- [handholdJS](#handholdjs)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Adding to project](#adding-to-project)
  - [Creating steps](#creating-steps)
  - [Customization](#customization)
    - [Full Example](#full-example)
  - [Adding steps](#adding-steps)
  - [Initiate Handhold](#initiate-handhold)
  - [Matching steps to DOM elements](#matching-steps-to-dom-elements)
  - [Developer Notes](#developer-notes)
    - [Project setup](#project-setup)
    - [Dependencies](#dependencies)
## Installation
Install package via NPM.

`npm install @ritterim/handholdJS`

## Adding to project
Import handholdJS into your project and instantiate it to a new variable.

main.js:
```JavaScript
import Handhold from '@ritterim/handholdJS';
import '../path/to/node_modules/@ritterim/handholdJS/dist/style.css';

const handhold = new Handhold();
```
## Creating steps
Create either a JSON file or JavaScript object and include the steps in an array:

handhold-config.json:
```JSON
{
  "steps": [
    {
      "number": "1",
      "title": "Step 1",
      "description": "Lorem ipsum dolor sit amet"
    },
    {
      "number": "2",
      "title": "Step 2",
      "description": "Lorem ipsum dolor sit amet"
    },
    {
      "number": "3",
      "title": "Step 3",
      "description": "Lorem ipsum dolor sit amet"
    }
  ]
}
```

## Customization
Inside your created JSON or JavaScript object, create a `config` property to include directions for customization:

handhold-config.json:
```JSON
{
  "config": {
    // Config...
  },
  "steps": [
    // Steps...
  ]
}
```

You can customize the following Handhold elements:
- `boundingBox` - Box that wraps around the highlighted element.
- `modal` - Modal element where steps will be displayed.
- `nextButton` - Button that moves to the next step.
- `previousButton` - Button that moves to the next step.
- `finishBtn` - Button that moves to the next step.

Each Handhold element can be customized using the following properties:

- `classList` - An array of classes to be applied to the element.
- `style` - An object containing CSS properties and values to apply to the element.

### Full Example
handhold-config.json:
```JSON
{
  "config": {
    "boundingBox": {
      "style": {
        "outlineStyle": "solid",
        "outlineColor": "var(--navy)"
      }
    },
    "finishBtn": {
      "classList": ["button", "button--orange", "text--white"]
    },
    "nextButton": {
      "classList": ["button"]
    },
    "previousButton": {
      "classList": ["button"]
    }
  },
  "steps": [
    {
      "number": "1",
      "title": "Step 1",
      "description": "Lorem ipsum dolor sit amet"
    },
    {
      "number": "2",
      "title": "Step 2",
      "description": "Lorem ipsum dolor sit amet"
    },
    {
      "number": "3",
      "title": "Step 3",
      "description": "Lorem ipsum dolor sit amet"
    }
  ]
}
```

## Adding steps
Import the JSON file into your JavaScript and pass it into the `.setup()` method.

main.js:
```JavaScript
import Handhold from '@ritterim/handholdJS';
import '../path/to/node_modules/@ritterim/handholdJS/dist/style.css';
import handholdConfig from '../path/to/handhold-config.json'

const handhold = new Handhold();
handhold.setup(handholdConfig);
```

## Initiate Handhold
Call the `.init()` method.

main.js:
```JavaScript
import Handhold from '@ritterim/handholdJS';
import '../path/to/node_modules/@ritterim/handholdJS/dist/style.css';
import handholdConfig from '../path/to/handhold-config.json'

const handhold = new Handhold();
handhold.setup(handholdConfig);
handhold.init();
```

## Matching steps to DOM elements
Inside your HTML you must include a clickable "start" element and pair the steps to relevant HTML elements.

On the start element, apply the `data-handhold-start` data attribute.

On related HTML elements add the `data-step` attribute and give it the value of the corresponding step number you want to display.

index.html:
```HTML
<!-- On start button: -->
<button type="button" data-start-handhold>
  Start Product Tour
</button>

<!-- On elements: -->
<div class="element" data-step="1">
  <p>Lorem Ipsum</p>
</div>
<div class="element" data-step="2">
  <p>Lorem Ipsum</p>
</div>
<div class="element" data-step="3">
  <p>Lorem Ipsum</p>
</div>
```

## Developer Notes

### Project setup
- Fork repo and clone to local machine
- Inside the project, run `npm install` to install all dependencies
- Start the project by running `npm run dev`

### Dependencies
- Autoprefixer
- PostCSS
- PostCSS CLI
- Sass
- Vite
- Vite Plugin Banner