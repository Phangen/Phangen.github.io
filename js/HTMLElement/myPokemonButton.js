const buttTmp = document.createElement('template');
buttTmp.innerHTML = `
  <style>
  element.style{
      --type-color: white
  }
  .pButton {
      border: 2px solid var(--type-color);
      background-color: transparent;
      color: black;
      padding: 15px 32px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      transition-duration: 0.4s;
      opacity: 0.75;
  }
  .pButton[aria-pressed="true"] {
      background-color: var(--type-color);
      border: none;
      color: white;
  }
  .pButton:hover {
      opacity: 1;
  }
  </style>
  <button class="pButton" type="button" aria-pressed="false">  
  <slot></slot>
  </button> 
  `;



class PokemonButton extends HTMLElement {
    
    constructor() {
      super();
    }

    attributeChangedCallback(name, oldValue, newValue) {
      this.render();
    }

    connectedCallback() {
      if (!this.rendered) {
        this.render();
        this.rendered = true;
      }
    }

    static get observedAttributes() {
      return [];
    }

    render() {
      const shadowRoot = this.attachShadow({ mode: 'open' });

      shadowRoot.appendChild(buttTmp.content.cloneNode(true));
    }
  
}

customElements.define('pokemon-button', PokemonButton);