export default class ArrayLogic {

    static union(a, b) {
        return [...new Set([...a, ...b])];
    }
    
    static intersection(a, b) {
        return a.filter(x => b.includes(x));
    }
    
    static difference(a, b) {
        return a.filter(x => !b.includes(x));
    }
    
    static setDifference(a, b) {
        return a
        .filter(x => !b.includes(x))
        .concat(b.filter(x => !a.includes(x)));
    }
}