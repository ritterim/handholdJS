import './sass/handhold.scss';

/* 
  TODO - Setup listeners *properly* for esc key close, arrow key navigation
  TODO - Detect if modal near edges and adjust location to prevent overflow
  TODO - Scroll to highlighted UI element
  TODO - Make more responsive
  TODO - Implement accessibility features further
*/

export default class Handhold {
  constructor() {
    this._active = false;
    this._steps;
    this._config;
    this._startBtn = document.querySelector('[data-start-handhold]');
    this._stepEls;
    this._currentStep = 1;
    this._currentStepEl;
    this._mappedSteps;
  }

  // Imports steps from JSON or JS Object
  setup(data) {
    this.setStepElements();

    if (data.steps) {
      this._steps = data.steps;
      this.mapSteps();
    }
    if (data.config) {
      this._config = data.config;
    }

    return;
  }

  setStepElements() {
    const elements = Array.from(document.querySelectorAll('[data-step]'));

    if (elements.length) {
      this._stepEls = elements;
    } else this._stepEls = [];

    return;
  }

  // applies style configuration if available
  applyConfig() {
    if (this._config) {
      const elements = [
        {
          type: 'overlay',
          class: '.handhold-overlay',
        },
        {
          type: 'boundingBox',
          class: '.handhold-bounding-box',
        },
        {
          type: 'modal',
          class: '.handhold-modal',
        },
        {
          type: 'nextBtn',
          class: '.handhold-next-button',
        },
        {
          type: 'prevBtn',
          class: '.handhold-prev-button',
        },
        {
          type: 'finishBtn',
          class: '.handhold-finish-button',
        },
      ];

      elements.forEach((element) => {
        const el = document.querySelector(element.class);
        if (
          el &&
          this._config[element.type] &&
          this._config[element.type].style
        ) {
          const properties = Object.keys(this._config[element.type].style);
          properties.forEach((property) => {
            el.style[property] = this._config[element.type].style[property];
          });
        }

        if (
          el &&
          this._config[element.type] &&
          this._config[element.type].classList
        ) {
          el.classList = [
            ...el.classList,
            ...this._config[element.type].classList,
          ].join(' ');
        }
      });
    }

    return;
  }

  // Matches steps to the related element in the DOM,
  mapSteps() {
    if (this._stepEls.length) {
      this._mappedSteps = this._stepEls.map((el) => {
        const matchingStep = this._steps.find((step) => {
          return parseInt(step.number) === parseInt(el.dataset.step);
        });
        return {
          ...matchingStep,
          element: el,
        };
      });
    }

    if (this._mappedSteps && this._mappedSteps.length) {
      this._currentStepEl = this._mappedSteps.find((step) => {
        return step.number == this._currentStep;
      }).element;
    }

    return;
  }

  // Gets dimensions and location of the element inside the DOM
  getElementDimension() {
    const { top, left, height, width } =
      this._currentStepEl.getBoundingClientRect();
    return {
      top,
      left,
      height,
      width,
    };
  }

  createOverlay() {
    const overlay = document.createElement('div');
    overlay.classList.add('handhold-overlay');
    overlay.ariaHidden = true;

    document.body.appendChild(overlay);
    overlay.addEventListener('click', () => this.finishHandhold());

    return;
  }

  removeOverlay() {
    if (document.body.querySelector('.handhold-overlay')) {
      return document.body.querySelector('.handhold-overlay').remove();
    }

    return;
  }

  createBoundingBox() {
    const dimensions = this.getElementDimension(this._currentStepEl);
    const boundingBox = document.createElement('div');
    boundingBox.classList.add('handhold-bounding-box');

    boundingBox.style.setProperty(
      '--hh-boundingbox-height',
      `${dimensions.height}px`
    );
    boundingBox.style.setProperty(
      '--hh-boundingbox-width',
      `${dimensions.width}px`
    );
    boundingBox.style.setProperty(
      '--hh-boundingbox-top',
      `${dimensions.top}px`
    );
    boundingBox.style.setProperty(
      '--hh-boundingbox-left',
      `${dimensions.left}px`
    );

    boundingBox.role = 'presentation';

    boundingBox.appendChild(this._currentStepEl.cloneNode(true));

    return document.body.appendChild(boundingBox);
  }

  updateBoundingBox() {
    const boundingBox = document.querySelector('.handhold-bounding-box');
    const dimensions = this.getElementDimension(this._currentStepEl);
    boundingBox.style.setProperty(
      '--hh-boundingbox-height',
      `${dimensions.height}px`
    );
    boundingBox.style.setProperty(
      '--hh-boundingbox-width',
      `${dimensions.width}px`
    );
    boundingBox.style.setProperty(
      '--hh-boundingbox-top',
      `${dimensions.top}px`
    );
    boundingBox.style.setProperty(
      '--hh-boundingbox-left',
      `${dimensions.left}px`
    );
    boundingBox.innerHTML = '';
    boundingBox.appendChild(this._currentStepEl.cloneNode(true));

    return;
  }

  removeBoundingBox() {
    return document
      .querySelectorAll('.handhold-bounding-box')
      .forEach((el) => el.remove());
  }

  createModal() {
    const step = this._mappedSteps.find(
      (step) => step.number == this._currentStep
    );
    const modal = document.createElement('div');
    modal.classList.add('handhold-modal');

    const dimensions = this.getElementDimension(this._currentStepEl);

    modal.style.setProperty(
      '--hh-modal-top',
      `${dimensions.height + dimensions.top}px`
    );
    modal.style.setProperty('--hh-modal-left', `${dimensions.left}px`);

    const modalTitle = document.createElement('h3');
    modalTitle.classList.add('handhold-modal-title');
    modalTitle.innerText = step.title;
    modal.appendChild(modalTitle);

    const modalContent = document.createElement('div');
    modalContent.classList.add('handhold-modal-content');
    modalContent.innerHTML = step.content;
    modal.appendChild(modalContent);

    const modalActions = document.createElement('div');
    modalActions.classList.add('handhold-modal-actions');
    modal.appendChild(modalActions);

    document.body.appendChild(modal);
    this.updateButtons();

    return;
  }

  updateModal() {
    const step = this._mappedSteps.find(
      (step) => step.number == this._currentStep
    );

    const modal = document.querySelector('.handhold-modal');
    const modalTitle = document.querySelector('.handhold-modal-title');
    const modalContent = document.querySelector('.handhold-modal-content');

    if (this._currentStepEl) {
      const dimensions = this.getElementDimension(step);

      modal.style.setProperty(
        '--hh-modal-top',
        `${dimensions.height + dimensions.top}px`
      );
      modal.style.setProperty('--hh-modal-left', `${dimensions.left}px`);

      modalTitle.innerText = step.title;
      modalContent.innerHTML = step.content;
    }

    this.updateButtons();

    return;
  }

  updateButtons() {
    const modalActions = document.querySelector('.handhold-modal-actions');
    let nextBtn = modalActions.querySelector('.handhold-next-button');
    let prevBtn = modalActions.querySelector('.handhold-prev-button');
    let finishBtn = modalActions.querySelector('.handhold-finish-button');

    if (!prevBtn) {
      prevBtn = document.createElement('button');
      prevBtn.classList.add('handhold-prev-button');
      prevBtn.type = 'button';
      prevBtn.innerText = 'Previous';
      modalActions.insertBefore(prevBtn, nextBtn);
      prevBtn.addEventListener('click', () => this.prevStep());
    }
    if (!nextBtn) {
      nextBtn = document.createElement('button');
      nextBtn.classList.add('handhold-next-button');
      nextBtn.type = 'button';
      nextBtn.innerText = 'Next';
      modalActions.appendChild(nextBtn);
      nextBtn.focus();
      nextBtn.addEventListener('click', () => this.nextStep());
    }

    if (finishBtn) finishBtn.remove();

    const nextStep = this._mappedSteps.find((step) => {
      return parseInt(step.number) == this._currentStep + 1;
    });

    const prevStep = this._mappedSteps.find((step) => {
      return parseInt(step.number) == this._currentStep - 1;
    });

    if (!nextStep) {
      nextBtn.remove();
      const finishBtn = document.createElement('button');
      finishBtn.type = 'button';
      finishBtn.classList.add('handhold-finish-button');
      finishBtn.innerText = 'Finish';
      modalActions.appendChild(finishBtn);
      finishBtn.focus();
      finishBtn.addEventListener('click', () => this.finishHandhold());
    }
    if (!prevStep) {
      nextBtn.focus();
      prevBtn.remove();
    }

    this.applyConfig();

    return;
  }

  removeModal() {
    return document
      .querySelectorAll('.handhold-modal')
      .forEach((el) => el.remove());
  }

  createElements() {
    if (
      this._config &&
      this._config.overlay &&
      this._config.overlay.hasOwnProperty('dimBackground')
    ) {
      this._config.overlay.dimBackground ? this.createOverlay() : null;
    } else {
      this.createOverlay();
    }

    this.createBoundingBox();
    this.createModal();

    this.applyConfig();

    return;
  }

  updateElements() {
    this.updateBoundingBox();
    this.updateModal();

    return;
  }

  removeElements() {
    this.removeOverlay();
    this.removeBoundingBox();
    this.removeModal();

    return;
  }

  nextStep() {
    this._currentStep++;
    this._currentStepEl = this._mappedSteps.find((step) => {
      return parseInt(step.number) == this._currentStep;
    }).element;

    this.updateElements();

    return;
  }

  prevStep() {
    this._currentStep--;
    this._currentStepEl = this._mappedSteps.find((step) => {
      return parseInt(step.number) == this._currentStep;
    }).element;

    this.updateElements();

    return;
  }

  startHandhold() {
    this._active = true;
    document.body.classList.add('handhold');
    this.createElements();
    this.setListeners();

    return;
  }

  finishHandhold() {
    this._active = false;
    this._currentStep = 1;
    this._currentStepEl = this._mappedSteps.find((step) => {
      return parseInt(step.number) == this._currentStep;
    }).element;
    this.removeElements();
    document.body.classList.remove('handhold');
    document.body.removeEventListener('keyup', this.keyPressEvents());

    return;
  }

  keyPressEvents(event) {
    const key = event.keyCode;
    switch (key) {
      // Escape key to close
      case 27:
        const modal = document.querySelector('.handhold-modal');
        if (modal && this._active) {
          this.finishHandhold();
        }
        break;
      // left arrow to go to previous step
      case 37:
        const prevBtn = document.querySelector('.handhold-prev-button');
        if (prevBtn && this._active) this.prevStep();
        break;
      // right arrow to go to next step
      case 39:
        const nextBtn = document.querySelector('.handhold-next-button');
        if (nextBtn && this._active) this.nextStep();
        break;
      default:
        break;
    }
  }

  setListeners() {
    if (this._active) {
      document.body.addEventListener('keyup', (event) =>
        this.keyPressEvents(event)
      );
    }

    return;
  }

  init() {
    if (this._startBtn) {
      return this._startBtn.addEventListener('click', () => {
        if (this._active) return;
        if (this._currentStepEl) {
          this.startHandhold();
        }
      });
    }

    return;
  }
}
