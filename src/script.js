import Field from "./Field.js"
import Coordinate from "./Coordinate.js"

let VIEW_SIZE = 500;
let DIMENSIONS = [20, 20];
let PIXEL_SIZE = Math.floor(VIEW_SIZE / DIMENSIONS[0]);

let WEIGHTS = [10, 20]
let NUMBER_OF_GARBAGE = 20;
let BASE_COLOR =   "white";
let BOT_COLOR =   "green";
let GARBAGE_COLOR = {10:"red", 20:"yellow"};


function renderField (field) {

    let view = document.querySelector(".view");  
    view.innerHTML = "";  
    
    let currentPosition = field.getPlace();
  
    for (let y = 0; y < DIMENSIONS[0]; y++) {
    for (let x = 0; x < DIMENSIONS[0]; x++) {
        let newPixel = createPixel(BASE_COLOR, PIXEL_SIZE);
        let garbage = field.getGarbage([x, y]);

        if (Coordinate.compare([x, y], currentPosition)){
            newPixel = createPixel(BOT_COLOR, PIXEL_SIZE);
        } else if (garbage) {
            let weight = [garbage.getWeight()];
            newPixel = createPixel(GARBAGE_COLOR[weight], PIXEL_SIZE);
        } 

        view.appendChild(newPixel)
    }}

}

function createPixel(cor, dimensions) {
    let pixel = document.createElement("div");
    
    pixel.style.backgroundColor = cor;
    pixel.style.width =  `${dimensions}px`;
    pixel.style.height = `${dimensions}px`;
    pixel.style.border = "1px solid gray";
    return pixel;
}

let garbage_list = Field.createField(
    DIMENSIONS[0],
    DIMENSIONS[1],
    NUMBER_OF_GARBAGE,
    WEIGHTS);

let f1 = new Field(DIMENSIONS, garbage_list);

// document.querySelectorAll(".in").forEach(e => e.addEventListener("click", () => {
//     if (e.innerText == "N") f1 = f1.takeAction([0, -1]);
//     if (e.innerText == "S") f1 = f1.takeAction([0, 1]);
//     if (e.innerText == "E") f1 = f1.takeAction([1, 0]);
//     if (e.innerText == "W") f1 = f1.takeAction([-1, 0]);
//     if (e.innerText == "C") f1 = f1.takeAction([0, 0]);
    
//     renderField(f1);
// }))

function simpleReactive(field, memory) {
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


function statesBasedReactive(field, memory) {
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


function goalBasedReactive(field, memory) {

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

function utilityBasedReactive(field, memory) {

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

function runBot (field, bot, memory) {
    let INTERVAL = .1 * 1000;
    let round = 0;

    let simulation = setInterval(() => {
        renderField(field);

        let action = bot(field, memory);
        field = field.takeAction(action.direction);
        memory = action.memory;

        if (!field.getGarbageList().length) {
            clearInterval(simulation);
            console.log(memory);
        }

    }, INTERVAL);
}

runBot(f1, utilityBasedReactive);