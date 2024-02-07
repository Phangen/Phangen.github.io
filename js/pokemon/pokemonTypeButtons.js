import {getCurrentTypeInfo} from "./readTypeData.js";

const typeEff = ["Takes 4x From: ","Takes 2x From: ","Takes 1x From: ","Takes 1/2x From: ","Takes 1/4x From: ","Immune to: "]
const typeAmount = 18;

const toggleButtonArray = [];
for (let i = 0; i < typeAmount; i++) {
  toggleButtonArray.push(document.getElementById("p" + i).shadowRoot.querySelector('[aria-pressed]'));
}

const typeContainer = document.getElementById('TypeInfoContainer');

function updateTypeOutput(typeDataArray) {
  let htmlOutput = typeEff[0] + typeDataArray[0];
  
  for (let i = 1; i < typeDataArray.length; i++) {
    htmlOutput += "<br>" + typeEff[i] + typeDataArray[i];
  }
  typeContainer.innerHTML = htmlOutput;
}

toggleButtonArray.forEach((toggle) => 
{
  toggle.addEventListener('click', (e) => {  
    let pressed = e.target.getAttribute('aria-pressed') === 'true';
    e.target.setAttribute('aria-pressed', String(!pressed));
    console.log(pressed);
    updateTypeOutput(getCurrentTypeInfo());
  });
});
