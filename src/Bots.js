import Coordinate from "./Coordinate.js";

export function simpleReactive(field, memory) {
    let [x, y] = field.getPlace();
    
    let lEdge = 0;
    let rEdge = field.getDimensions()[0] - 1;

    if (field.isDirty([x, y])) return {direction:[0, 0], memory};
    
    if (x == rEdge && y % 2 == 0) return {direction: [0, 1], memory};
    if (x == lEdge && y % 2 == 1) return {direction: [0, 1], memory};
    
    if (y % 2 == 0) return {direction: [1, 0], memory};
    if (y % 2 == 1) return {direction: [-1, 0], memory};

    //error case
    return {direction: null, memory};
}


export function statesBasedReactive(field, memory) {
    let [x, y] = field.getPlace();
    
    let lEdge = 0;
    let rEdge = field.getDimensions()[0] - 1;

    if (field.isDirty([x, y])) {
        memory = memory || [];
        memory.push([x, y]);
        return {direction:[0, 0], memory};
    }
    
    if (x == rEdge && y % 2 == 0) return {direction: [0, 1], memory};
    if (x == lEdge && y % 2 == 1) return {direction: [0, 1], memory};
    
    if (y % 2 == 0) return {direction: [1, 0], memory};
    if (y % 2 == 1) return {direction: [-1, 0], memory};

    //error case
    return {direction: null, memory};
}


export function goalBasedReactive(field, memory) {

    function getShortestDistance(position, garbage) {
        let shortestDist = garbage.reduce((min, garbPosition) => {
        
            let minDistance = Coordinate.distanceOfPoints(position, min);
            let newDistance = Coordinate.distanceOfPoints(position, garbPosition);
    
            return (minDistance > newDistance) ? garbPosition : min;
        }, [1000, 1000]);
    
        return shortestDist;
    }
    
    let [x, y] = field.getPlace();
    let garbagePosList = field.getGarbageList().map(e => e.getPosition());

    if (field.isDirty([x, y])) {
        return {direction: [0, 0], memory:null};
    }

    let nearestGarb = memory || getShortestDistance([x, y], garbagePosList);

    if (x < nearestGarb[0]) return {direction: [1, 0], nearestGarb};
    if (x > nearestGarb[0]) return {direction: [-1, 0], nearestGarb};
    if (y < nearestGarb[1]) return {direction: [0, 1], nearestGarb};
    if (y > nearestGarb[1]) return {direction: [0, -1], nearestGarb};

    return {direction: [0, 0], memory:null};
}

export function utilityBasedReactive(field, memory) {

    function getShortestDistance(position, garbage) {
        let shortestDist = garbage.reduce((min, garb) => {
            
            let minDistance = Coordinate.distanceOfPoints(position, min.getPosition());
            let newDistance = Coordinate.distanceOfPoints(position, garb.getPosition());
            
            if (min.getWeight() < garb.getWeight()) return garb
            return (minDistance > newDistance) ? garb : min;
        });
    
        return shortestDist;
    }

    let [x, y] = field.getPlace();
    let garbagePosList = field.getGarbageList()

    if (field.isDirty([x, y])) return {direction: [0, 0], memory:null};
    
    let nearestGarb = memory || getShortestDistance([x, y], garbagePosList);
    
    if (x < nearestGarb.getPosition()[0]) return {direction: [1, 0], nearestGarb};
    if (x > nearestGarb.getPosition()[0]) return {direction: [-1, 0], nearestGarb};
    if (y < nearestGarb.getPosition()[1]) return {direction: [0, 1], nearestGarb};
    if (y > nearestGarb.getPosition()[1]) return {direction: [0, -1], nearestGarb};

    return {direction: [0, 0], memory:null};
}
