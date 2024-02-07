import {getCurrentTypeInfo, allTypeNames} from "./readTypeData.js";

const typeAmount = 18;
const typeContainer = document.getElementById('TypeInfoContainer');

const toggleButtonArray = [];
for (let i = 0; i < typeAmount; i++) {
  toggleButtonArray.push(document.getElementById("p" + i).shadowRoot.querySelector('[aria-pressed]'));
}

/**
 * Updates the output of the type calculator with our current selected type information.
 * 
 * @param {Array of Array of Strings} typeDataArray - the data of the type we are outputing to the html. 
 *      Formated like the following: 
 *          ["Takes 4x From: ","Takes 2x From: ","Takes 1x From: ","Takes 1/2x From: ","Takes 1/4x From: ","Immune to: "]
 */
function updateTypeOutput(typeDataArray) {
  
  moveAllTypesToLoc(typeDataArray[0], "4xPTC");
  moveAllTypesToLoc(typeDataArray[1], "2xPTC");
  moveAllTypesToLoc(typeDataArray[2], "1xPTC");
  moveAllTypesToLoc(typeDataArray[3], "1/2xPTC");
  moveAllTypesToLoc(typeDataArray[4], "1/4xPTC");
  moveAllTypesToLoc(typeDataArray[5], "0xPTC");
  /*
  let htmlOutput = typeEff[0] + typeDataArray[0];
  
  for (let i = 1; i < typeDataArray.length; i++) {
    htmlOutput += "<br>" + typeEff[i] + typeDataArray[i];
  }
  typeContainer.innerHTML = htmlOutput;
  */
}

function moveAllTypesToLoc(effArray, locToMoveTo){
  effArray.forEach((typeName) => {
    document.getElementById(locToMoveTo).append(document.getElementById(getTypeCardIDFromString(typeName)));
  });
}

function getTypeCardIDFromString(typeName) {
  return "ptc"+[allTypeNames.indexOf(typeName)];
}
/**
 * Disables or enables all toggle buttons that are not currently pressed to true.
 * 
 * @param {bool} updatedStatus - State to set the currently unselected buttons as
 */
function setFalseButtonsDisabled(updatedStatus){
  toggleButtonArray.forEach((toggle) => {
    if (toggle.getAttribute('aria-pressed') === 'false') {
      toggle.disabled = updatedStatus;
    }
  });
}

var currentSelectedTypes = [];
(getCurrentTypeInfo(currentSelectedTypes));


var numTypesSelected = 0;

toggleButtonArray.forEach((toggle) => 
{
  toggle.addEventListener('click', (e) => {  
    var pressed = e.currentTarget.getAttribute('aria-pressed') === 'true';

    if(pressed && numTypesSelected > 0) {
      //enables all buttons if they are disabled because after this executes we no longer have 2 types selected
      if(numTypesSelected === 2) {
        setFalseButtonsDisabled(false);
      }

      numTypesSelected--;
      e.currentTarget.setAttribute('aria-pressed', String(!pressed));
      //remove type from selected types
      //this is done by accessing the slot of our shadow dom and getting its first node which is the text
      currentSelectedTypes.splice(currentSelectedTypes.indexOf(e.currentTarget.querySelector('slot').assignedNodes()[0].nodeValue.toLowerCase()), 1);

      
     
    } else if (numTypesSelected < 2) {
      numTypesSelected++;
      e.currentTarget.setAttribute('aria-pressed', String(!pressed));
      
      //we can only have upto 2 types selected at a time, so we disable all buttons not pressed
      if(numTypesSelected === 2) {
        setFalseButtonsDisabled(true);
      }
      //add type to selected types
      //this is done by accessing the slot of our shadow dom and getting its first node which is the text
      currentSelectedTypes.push(e.currentTarget.querySelector('slot').assignedNodes()[0].nodeValue.toLowerCase());
    }

    console.log(currentSelectedTypes);
    updateTypeOutput(getCurrentTypeInfo(currentSelectedTypes));
    

  });
});
