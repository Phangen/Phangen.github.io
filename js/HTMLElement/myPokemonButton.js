const buttTmp = document.createElement('template');
buttTmp.innerHTML = `
<style>
element.style{
    --type-color: white
}
[class*="pButton"] {
    border: 4px solid var(--type-color);
    background-color: transparent;
    color: black;
    padding: 10px 16px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    transition-duration: 0.4s;
    opacity: 0.75;
    border-radius: 12px;
    width: 100%;
    cursor: pointer;
    box-sizing: border-box;
}
.pButton[aria-pressed="true"] {
    border: none;
    background-color: var(--type-color);
    padding: 14px 16px;
    box-shadow:
        inset 0 0 2px 0 #ffffff66,
        inset 0 0 3px 0 #00000066,
        inset 0 0 3px 5px #0000000d;
    color: white;
}

.pButton:hover {
    opacity: 1;
}
.pButton:disabled {
    cursor: not-allowed;
    background-color: #37373780;
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

const typeCardTmp = document.createElement('template');
typeCardTmp.innerHTML = `
  <style>
  element.style{
      --type-color: white;
      --type-darker: black;
  }

  [class*="tCard"] {
    border: 5px solid var(--type-color);
    background-color: var(--type-darker);
    color: white;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    border-radius: 3px;
    width: 100%;
    box-sizing: border-box;
  }
  
  </style>
  <div class="tCard">  
      <slot></slot>
  </div>  
  `;

  class PokemonTypeCard extends HTMLElement {
    
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

      shadowRoot.appendChild(typeCardTmp.content.cloneNode(true));
    }
  
}

customElements.define('pokemon-button', PokemonButton);
customElements.define('pokemon-type-card', PokemonTypeCard);