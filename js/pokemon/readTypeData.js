import { getJson } from "../JSONreader.js";

class PokemonType {

    constructor(){

    }
}

getJson('assets/pokemon/typeData.json').then((json) => {
    console.log(json);
    console.log(json.types)
    for (const pokeType in json.types) {
        console.log(pokeType);
    }
});