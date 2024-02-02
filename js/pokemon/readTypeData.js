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
        else 
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

getJson('assets/pokemon/typeData.json').then((json) => {
    console.log(json);
    console.log(json.types)
    let typeArray = [];
    json.types.forEach((element) => {
        console.log(element);
        let pokeType = new PokemonType(element);
        console.log(pokeType.typeName);
        console.log(pokeType.superEff);
        console.log(pokeType.notVeryEff);
        console.log(pokeType.immune);
        typeArray.push(pokeType);
    });
    let testDualType = new PokemonType(typeArray[4], typeArray[2]);
    console.log(testDualType.typeName);
    console.log(testDualType.twiceSuperEff);
    console.log(testDualType.superEff);
    console.log(testDualType.notVeryEff);
    console.log(testDualType.twiceNotVeryEff);
    console.log(testDualType.immune);

});