
export async function getJson (path) {
    let response = await fetch(path);
    let json = await response.json();
    return json;
}

/*
getJson('assets/pokemon/typeData.json').then((json) => {
    console.log(json)
});
*/

