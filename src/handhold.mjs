import './sass/handhold.scss';

export default class Handhold {
  constructor(startElement) {
    this._active = false;
    this._config;
    this._currentStep = 1;
    this._currentStepElement;
    this._mappedSteps;
    this._startBtn = startElement || document.querySelector('[data-start-handhold]');
    this._stepElements;
    this._steps;
    this._listeners;
    this._root;
  }

  // Imports steps from JSON or JS Object
  setup(data) {
    this.setStepElements();

    if (data.steps) {
      this._steps = data.steps;
      this.mapSteps();
    }
    if (data.config) this._config = data.config;

    return;
  }

  setStepElements() {
    const elements = Array.from(document.querySelectorAll('[data-step]'));
    this._stepElements = elements.length ? elements : [];

    return;
  }

  // applies style configuration if available
  applyConfig() {
    if (this._config) {
      const elements = [
        {
          type: 'boundingBox',
          class: '.handhold-bounding-box',
        },
        {
          type: 'modal',
          class: '.handhold-modal',
        },
        {
          type: 'nextButton',
          class: '.handhold-next-button',
        },
        {
          type: 'previousButton',
          class: '.handhold-prev-button',
        },
        {
          type: 'finishButton',
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
    if (this._stepElements.length) {
      this._mappedSteps = this._stepElements.map((el) => {
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
      this._currentStepElement = this._mappedSteps.find((step) => {
        return step.number == this._currentStep;
      }).element;
    }

    return;
  }

  // Gets dimensions and location of the element inside the DOM
  getElementDimension(element) {
    const { top, left, height, width } = element.getBoundingClientRect();
    return {
      top,
      left,
      height,
      width,
    };
  }

  // Bounding Box Methods
  createBoundingBox() {
    const dimensions = this.getElementDimension(this._currentStepElement);
    const boundingBox = Object.assign(document.createElement('div'), {
      classList: ['handhold-bounding-box'],
      style: [
        `--hh-boundingbox-height: ${dimensions.height}px`,
        `--hh-boundingbox-width: ${dimensions.width}px`,
        `--hh-boundingbox-top: ${dimensions.top}px`,
        `--hh-boundingbox-left: ${dimensions.left}px`,
      ].join(';'),
      role: 'presentation',
    });

    return this._root.appendChild(boundingBox);
  }

  updateBoundingBox() {
    const boundingBox = document.querySelector('.handhold-bounding-box');
    boundingBox.innerHTML = '';
    const dimensions = this.getElementDimension(this._currentStepElement);
    const currentStepPos = this._currentStepElement.offsetTop;
    boundingBox.style = [
      `--hh-boundingbox-height: ${dimensions.height}px`,
      `--hh-boundingbox-width: ${dimensions.width}px`,
      `--hh-boundingbox-top: ${currentStepPos}px`,
      `--hh-boundingbox-left: ${dimensions.left}px`,
    ].join(';');

    return;
  }

  removeBoundingBox() {
    return document
      .querySelectorAll('.handhold-bounding-box')
      .forEach((el) => el.remove());
  }

  // Modal Methods
  createModal() {
    const step = this._mappedSteps.find(
      (step) => step.number == this._currentStep
    );

    const dimensions = this.getElementDimension(this._currentStepElement);

    const modal = Object.assign(document.createElement('dialog'), {
      classList: ['handhold-modal'].join(' '),
      style: [
        `--hh-modal-top: ${dimensions.height + dimensions.top}px`,
        `--hh-modal-left: ${dimensions.left}px`,
      ].join(';'),
    });

    const modalTitle = Object.assign(document.createElement('h3'), {
      classList: ['handhold-modal-title'].join(' '),
      innerText: step.title,
    });

    const modalContent = Object.assign(document.createElement('div'), {
      classList: ['handhold-modal-content'].join(' '),
      innerHTML: step.content,
    });

    const modalActions = Object.assign(document.createElement('div'), {
      classList: ['handhold-modal-actions'].join(' '),
    });

    [modalTitle, modalContent, modalActions].map((element) =>
      modal.appendChild(element)
    );

    this._root.appendChild(modal);
    this.updateButtons();

    modal.showModal();

    return;
  }

  updateModal() {
    const step = this._mappedSteps.find(
      (step) => step.number == this._currentStep
    );

    const modal = document.querySelector('.handhold-modal');
    const modalTitle = modal.querySelector('.handhold-modal-title');
    const modalContent = modal.querySelector('.handhold-modal-content');
    const currentStepPos = this._currentStepElement.offsetTop;

    if (this._currentStepElement) {
      const dimensions = this.getElementDimension(step.element);
      const modalDimensions = this.getElementDimension(modal);
      const rootDimensions = this.getElementDimension(this._root);

      if (dimensions.left + modalDimensions.width > rootDimensions.width) {
        const offset =
          rootDimensions.width - (dimensions.left + modalDimensions.width + 16);
        dimensions.left += offset;
      }

      modal.style = [
        `--hh-modal-top: ${dimensions.height + currentStepPos}px`,
        `--hh-modal-left: ${dimensions.left}px`,
      ].join(';');

      modalTitle.innerText = step.title;
      modalContent.innerHTML = step.content;
    }

    this.updateButtons();

    return;
  }

  removeModal() {
    return document.querySelectorAll('.handhold-modal').forEach((element) => {
      element.close();
      element.remove();
    });
  }

  // Button methods
  updateButtons() {
    const modalActions = document.querySelector('.handhold-modal-actions');
    let nextButton = modalActions.querySelector('.handhold-next-button');
    let previousButton = modalActions.querySelector('.handhold-prev-button');
    let finishButton = modalActions.querySelector('.handhold-finish-button');

    if (!previousButton) {
      previousButton = Object.assign(document.createElement('button'), {
        classList: ['handhold-prev-button'].join(' '),
        type: 'button',
        innerText: 'Previous',
      });

      modalActions.insertBefore(previousButton, nextButton);
      previousButton.addEventListener('click', () => this.prevStep());
    }
    if (!nextButton) {
      nextButton = Object.assign(document.createElement('button'), {
        classList: ['handhold-next-button'].join(' '),
        type: 'button',
        innerText: 'Next',
      });

      modalActions.appendChild(nextButton);
      nextButton.focus();
      nextButton.addEventListener('click', () => this.nextStep());
    }

    if (finishButton) finishButton.remove();

    const nextStep = this._mappedSteps.find(
      (step) => parseInt(step.number) == this._currentStep + 1
    );

    const prevStep = this._mappedSteps.find(
      (step) => parseInt(step.number) == this._currentStep - 1
    );

    if (!nextStep) {
      nextButton.remove();
      const finishButton = Object.assign(document.createElement('button'), {
        classList: ['handhold-finish-button'].join(' '),
        type: 'button',
        innerText: 'Finish',
      });

      modalActions.appendChild(finishButton);
      finishButton.focus();
      finishButton.addEventListener('click', () => this.finishHandhold());
    }
    if (!prevStep) {
      nextButton.focus();
      previousButton.remove();
    }

    this.applyConfig();

    return;
  }

  // Element Methods
  createElements() {
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
    this.removeBoundingBox();
    this.removeModal();

    return;
  }

  nextStep() {
    this._currentStep++;
    this._currentStepElement = this._mappedSteps.find(
      (step) => parseInt(step.number) == this._currentStep
    ).element;

    this._currentStepElement.scrollIntoView({behavior: "smooth"});

    this.updateElements();

    return;
  }

  prevStep() {
    this._currentStep--;
    this._currentStepElement = this._mappedSteps.find(
      (step) => parseInt(step.number) == this._currentStep
    ).element;

    this._currentStepElement.scrollIntoView({behavior: "smooth"});

    this.updateElements();

    return;
  }

  startHandhold() {
    this._active = true;

    document.body.classList.add('handhold');
    this._root = document.querySelector('.handhold');

    this.createElements();
    this.setListeners();
    this.updateElements();

    return;
  }

  finishHandhold() {
    this._active = false;
    this._currentStep = 1;
    this._currentStepElement = this._mappedSteps.find(
      (step) => parseInt(step.number) == this._currentStep
    ).element;
    this.removeElements();
    this.clearListeners();
    this._root.classList.remove('handhold');
    window.scrollTo({top: 0, left: 0, behavior: "smooth"});
    return;
  }

  keyPressEvents(event) {
    if (event && event.keyCode) {
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
          const previousButton = document.querySelector(
            '.handhold-prev-button'
          );
          if (previousButton && this._active) this.prevStep();
          break;
        // right arrow to go to next step
        case 39:
          const nextButton = document.querySelector('.handhold-next-button');
          if (nextButton && this._active) this.nextStep();
          break;
        default:
          break;
      }
    }

    return;
  }

  setListeners() {
    if (this._active) {
      const root = this;

      this._listeners = {
        keyboard: function () {
          root.keyPressEvents(event);
        },
        resize: new ResizeObserver((entries) => {
          for (const entry of entries) {
            this.updateElements();
          }
        }),
      };

      this._root.addEventListener('keydown', this._listeners.keyboard);
      this._listeners.resize.observe(this._root);
    }

    return;
  }

  clearListeners() {
    this._listeners.resize.unobserve(this._root);
    this._root.removeEventListener('keydown', this._listeners.keyboard);
  }

  init() {
    if (this._startBtn) {
      return this._startBtn.addEventListener('click', () => {
        if (this._active) return;
        if (this._currentStepElement) this.startHandhold();
      });
    }

    return;
  }
}
