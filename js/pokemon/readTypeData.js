import { getJson } from "../JSONreader.js";
import ArrayLogic from "../ArrayLogicModule.js";

class PokemonType {

    constructor(typeJson, typeTwo) {
        if (typeTwo == undefined)
        {
            for (const jsonName in typeJson){
                this.typeName = jsonName;
            }
            this.twiceSuperEff = [];
            this.twiceNotVeryEff  = [];
            this.superEff = typeJson[this.typeName].superEff;
            this.notVeryEff = typeJson[this.typeName].notVeryEff;
            this.immune = typeJson[this.typeName].immune;
        }
        else // constructor to build dual type pokemon when given two types
        {
            let typeOne = typeJson;

            this.typeName = typeOne.typeName + "." + typeTwo.typeName;
            this.twiceSuperEff = ArrayLogic.intersection(typeOne.superEff, typeTwo.superEff);
            this.superEff = ArrayLogic.setDifference(ArrayLogic.difference(typeOne.superEff, typeTwo.notVeryEff), (ArrayLogic.difference(typeTwo.superEff, typeOne.notVeryEff)));
            this.notVeryEff = ArrayLogic.setDifference(ArrayLogic.difference(typeOne.notVeryEff, typeTwo.superEff), (ArrayLogic.difference(typeTwo.notVeryEff, typeOne.superEff)));
            this.twiceNotVeryEff  = ArrayLogic.intersection(typeOne.notVeryEff, typeTwo.notVeryEff);
            this.immune = ArrayLogic.union(typeOne.immune, typeTwo.immune);
        }        

    }
}

export function getCurrentTypeInfo(typeOneName, typeTwoName) {
    //gets normal type effectivness by taking all of the other type effectivness and figuring out which of the remaining types are not included
    let abnormalEff = ArrayLogic.union(ArrayLogic.union(ArrayLogic.union(currentType.twiceSuperEff, currentType.superEff), ArrayLogic.union(currentType.notVeryEff, currentType.twiceNotVeryEff)), currentType.immune);
    let normalEff = ArrayLogic.difference(allTypeNames,abnormalEff)
    
    return [currentType.twiceSuperEff, currentType.superEff, normalEff, currentType.notVeryEff, currentType.twiceNotVeryEff, currentType.immune];
}

var allTypesData;
var currentType;
var allTypeNames;

getJson('assets/pokemon/typeData.json').then((json) => {
    console.log(json);
    console.log(json.types)
    allTypesData = [];
    allTypeNames = [];
    json.types.forEach((element) => {
        console.log(element);
        let pokeType = new PokemonType(element);
        console.log(pokeType.typeName);
        console.log(pokeType.superEff);
        console.log(pokeType.notVeryEff);
        console.log(pokeType.immune);
        allTypesData.push(pokeType);
        allTypeNames.push(pokeType.typeName);
        currentType = pokeType;
    });
    let testDualType = new PokemonType(allTypesData[4], allTypesData[2]);
    currentType = testDualType;
    console.log(testDualType.typeName);
    console.log(testDualType.twiceSuperEff);
    console.log(testDualType.superEff);
    console.log(testDualType.notVeryEff);
    console.log(testDualType.twiceNotVeryEff);
    console.log(testDualType.immune);

});