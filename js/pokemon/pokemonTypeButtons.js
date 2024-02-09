import {getCurrentTypeInfo, allTypeNames} from "./readTypeData.js";

const typeAmount = 18;
const effAmount = 6;


const effectGridIDs = ["4xPTC","2xPTC","1xPTC","1/2xPTC","1/4xPTC","0xPTC"];

const toggleButtonArray = [];
for (let i = 0; i < typeAmount; i++) {
  toggleButtonArray.push(document.getElementById("p" + i).shadowRoot.querySelector('[aria-pressed]'));
}
const effContainerElements = [];
for (let i = 0; i < effAmount; i++) {
  let element = document.getElementById("typeEff" + i);
  effContainerElements.push(element);
  //disable display by default
  setDisplayStatus(element, 'none');
}
//only 1.0x eff should be visible on default which is eff num 2
setDisplayStatus(effContainerElements[2], 'block');

/**
 * Updates the output of the type calculator with our current selected type information.
 * 
 * @param {Array of Array of Strings} typeDataArray - the data of the type we are outputing to the html. 
 *      Formated like the following: 
 *          ["Takes 4x From: ","Takes 2x From: ","Takes 1x From: ","Takes 1/2x From: ","Takes 1/4x From: ","Immune to: "]
 */
function updateTypeOutput(typeDataArray) {
  for (var i = 0; i < effAmount; i++) {
    removeGridPadding(effectGridIDs[i]);
    dealWithEff(i, effectGridIDs[i], typeDataArray);
  }

  manageGridPadding();
}

//method to add padding to calculator results
window.addEventListener('resize', function() {
  
  for (var i = 0; i < effAmount; i++) {
    removeGridPadding(effectGridIDs[i]);
  }
  manageGridPadding();
});

function manageGridPadding(){
  //intializes gridColumnNumbers with the number columns in each grid.
  const gridColumnNumbers = [];
  effectGridIDs.forEach((gridID) => {
    gridColumnNumbers.push(getGridColumnLength(gridID))
  });

  //find the largest number of columns
  const maxColLength = Math.max(...gridColumnNumbers);
  
  for (let i = 0; i < gridColumnNumbers.length ; i++) {
    //if any of the grids have a column with less than the largest number of columns we need to pad it
    let differenceFromMax = maxColLength - gridColumnNumbers[i];
    if (differenceFromMax > 0) {
      addGridPadding(effectGridIDs[i], differenceFromMax);
    }
  }
}

function removeGridPadding(locToRemoveFrom) {
  const elementToRemoveFrom = document.getElementById(locToRemoveFrom);
  var elementToRemove = elementToRemoveFrom.querySelector(".type-grid-padding");
  while (elementToRemove != null) {
    elementToRemove.remove();
    elementToRemove = elementToRemoveFrom.querySelector(".type-grid-padding");
  }
}

function addGridPadding(locToAddTo, amountToAdd) {
  const elementToAddTo = document.getElementById(locToAddTo);
  while (amountToAdd > 0){
    const paddingElement = document.createElement("div");
    paddingElement.classList.add("type-grid-padding");
    elementToAddTo.append(paddingElement);
    //setDisplayStatus(paddingElement, 'none');
    amountToAdd--;
  } 
  

}

function getGridColumnLength(gridID){
  // Get the grid container element
  const gridContainer = document.getElementById(gridID);

  // Get the computed styles of the grid container
  const gridStyles = window.getComputedStyle(gridContainer);

  // Get the value of the grid-template-columns property
  const gridColumnValue = gridStyles.getPropertyValue('grid-template-columns');

  // Split the value into an array of columns
  var gridColumnArray = gridColumnValue.split(' ');

  //remove from the array of columns all columns with size of 0px.
  gridColumnArray = gridColumnArray.filter((column) => column != '0px');

  // Get the number of columns
  return gridColumnArray.length;
}

function dealWithEff(effNum, locToMoveTo, typeDataArray){
  let typeInfo = typeDataArray[effNum];
  if(typeInfo.length == 0){
    setDisplayStatus(effContainerElements[effNum], 'none');
  } else{
    setDisplayStatus(effContainerElements[effNum], 'block');
    moveAllTypesToLoc(typeDataArray[effNum], locToMoveTo);
  }
}

function setDisplayStatus(element, status){
  element.style.display = status;
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
