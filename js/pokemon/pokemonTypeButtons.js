const toggle = document.querySelector('pokemon-button').shadowRoot.querySelector('[aria-pressed]');

toggle.addEventListener('click', (e) => {  
  let pressed = e.target.getAttribute('aria-pressed') === 'true';
  e.target.setAttribute('aria-pressed', String(!pressed));
  console.log(pressed);
});