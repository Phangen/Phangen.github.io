import {getCurrentTypeInfo} from "./readTypeData.js";

const typeEff = ["Takes 4x From: ","Takes 2x From: ","Takes 1x From: ","Takes 1/2x From: ","Takes 1/4x From: ","Immune to: "]
const typeAmount = 18;
const typeContainer = document.getElementById('TypeInfoContainer');

const toggleButtonArray = [];
for (let i = 0; i < typeAmount; i++) {
  toggleButtonArray.push(document.getElementById("p" + i).shadowRoot.querySelector('[aria-pressed]'));
}

function updateTypeOutput(typeDataArray) {
  let htmlOutput = typeEff[0] + typeDataArray[0];
  
  for (let i = 1; i < typeDataArray.length; i++) {
    htmlOutput += "<br>" + typeEff[i] + typeDataArray[i];
  }
  typeContainer.innerHTML = htmlOutput;
}

function setFalseButtonsDisabled(updatedStatus){
  toggleButtonArray.forEach((toggle) => {
    if (toggle.getAttribute('aria-pressed') === 'false') {
      toggle.disabled = updatedStatus;
    }
  });
}

var numTypesSelected = 0;

toggleButtonArray.forEach((toggle) => 
{
  toggle.addEventListener('click', (e) => {  
    var pressed = e.currentTarget.getAttribute('aria-pressed') === 'true';

    if(pressed && numTypesSelected > 0) {
      numTypesSelected--;
      e.currentTarget.setAttribute('aria-pressed', String(!pressed));
      updateTypeOutput(getCurrentTypeInfo());
      setFalseButtonsDisabled(false);
    } else if (numTypesSelected < 2) {
      numTypesSelected++;
      e.currentTarget.setAttribute('aria-pressed', String(!pressed));
      updateTypeOutput(getCurrentTypeInfo());
      if(numTypesSelected === 2) {
        setFalseButtonsDisabled(true);
      }    
    }
    

  });
});
