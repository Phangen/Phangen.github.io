const buttTmp = document.createElement('template');
buttTmp.innerHTML = `
    <style>
        .pButton {
            border: none;
            background-color: #5e86dd;
            color: white;
            padding: 15px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            transition-duration: 0.4s;
        }
        .pButton[aria-pressed="true"] {
            background-color: #DDA15E;
        }
        .pButton:hover {
            background-color: #b78e5e;
            color: white;
        }
    </style>
    <button class="pButton" type="button" aria-pressed="true">  
    Test
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