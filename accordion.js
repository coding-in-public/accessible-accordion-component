(function loadAccordionCSS() {
    document.body.insertAdjacentHTML(
        'beforeend',
        `
  <style>
      .accordion {
        display: grid;
        gap: 1rem;
      }
      .accordion-btn {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: .7rem 1.5rem;
        color: hsl(var(--text));
        background-color: hsl(var(--surface));
        border: 1px solid transparent;
        border-radius: .3rem;
        font-size: clamp(1.5rem, 3vw, 2rem);
        box-shadow: var(--shadow-elevation-medium);
        cursor: pointer;
        transition: background-color 250ms ease-in-out, border 250ms ease-in-out;
      }
      .accordion-btn:is(:hover, :focus) {
        background-color: hsl(var(--surface) / .2);
        border: 1px solid hsl(var(--text) / .34);
      }
      .accordion-btn:focus-within {
        outline: 2px solid hsl(var(--text) / .34);
      }
      .accordion-icon {
        pointer-events: none;
        transition: transform 180ms cubic-bezier(.4,-.49,.6,1.51);
      }
      [aria-expanded = "true"] .accordion-icon {
        transform: rotate(180deg);
        transition: transform 180ms cubic-bezier(.4,-.49,.6,1.51);
      }

      .accordion-panel {
        display: none;
        gap: .5rem;
        background-color: hsl(var(--surface));
        padding: clamp(1.5rem, 3vw, 2.5rem);
        border-radius: .3rem;
      }

      .accordion-panel:not([hidden="true"]) {
        display: grid;
      }
  </style>
  `
    );
})();

class Accordion {
    constructor(el, options) {
        this.acc = el;
        this.id = Math.random().toString(36).substring(2, 16);
        this.options = options || {};
        this.buttons = [...this.acc.querySelectorAll('.accordion-btn')];
        this.panels = [...this.acc.querySelectorAll('.accordion-panel')];
        this.addMetadata();
        this.attachEventListeners();
    }

    addMetadata() {
        this.buttons.forEach((btn, index) => {
            btn.id = `btn-${this.id}-${index}`;
            btn.setAttribute('aria-expanded', 'false');
            if (this.options.firstExpanded && index === 0) {
                btn.setAttribute('aria-expanded', 'true');
            }
            btn.setAttribute('aria-controls', `panel-${this.id}-${index}`);
            btn.insertAdjacentHTML(
                'beforeend',
                `
            <svg xmlns="http://www.w3.org/2000/svg" class="accordion-icon" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <polyline points="6 9 12 15 18 9" />
</svg>`
            );
        });
        this.panels.forEach((panel, index) => {
            panel.id = `panel-${this.id}-${index}`;
            panel.setAttribute('role', 'region');
            panel.setAttribute('aria-labelledby', `btn-${this.id}-${index}`);
            panel.setAttribute('hidden', 'true');
            if (this.options.firstExpanded && index === 0) {
                panel.removeAttribute('hidden');
            }
        });
    }

    attachEventListeners() {
        // click events
        this.acc.addEventListener('click', (e) => {
            if (!e.target.classList.contains('accordion-btn')) return;
            // info about the btn
            const isExpanded = e.target.getAttribute('aria-expanded') == 'true';
            const index = this.buttons.findIndex((btn) => btn.id === e.target.id);

            if (this.options.onePanelOnly) {
                this.panels.forEach((panel) => {
                    panel.setAttribute('hidden', 'true');
                });
            }

            if (isExpanded) {
                e.target.setAttribute('aria-expanded', 'false');
                this.panels[index].setAttribute('hidden', 'true');
            }
            if (!isExpanded) {
                e.target.setAttribute('aria-expanded', 'true');
                this.panels[index].removeAttribute('hidden');
            }
        });
        // keyboard Events
        this.acc.addEventListener('keydown', (e) => {
            if (!e.target.classList.contains('accordion-btn')) return;
            const index = this.buttons.findIndex((btn) => btn.id === e.target.id);
            switch (e.key) {
                case 'Home':
                    e.preventDefault();
                    this.buttons[0].focus();
                    break;
                case 'End':
                    e.preventDefault();
                    this.buttons[this.buttons.length - 1].focus();
                    break;

                case 'ArrowUp':
                    e.preventDefault();
                    if (index === 0) {
                        this.buttons[this.buttons.length - 1].focus();
                    } else {
                        this.buttons[index - 1].focus();
                    }
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    if (index === this.buttons.length - 1) {
                        this.buttons[0].focus();
                    } else {
                        this.buttons[index + 1].focus();
                    }
                    break;

                default:
                    break;
            }
        });
    }
}

export default function createAccordion(el, options) {
    document.querySelectorAll(el).forEach((accordion) => {
        new Accordion(accordion, options);
    });
}
