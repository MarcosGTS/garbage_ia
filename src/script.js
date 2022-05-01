import Field from "./Field.js"
import Coordinate from "./Coordinate.js"

let VIEW_SIZE = 500;
let DIMENSIONS = [20, 20];
let PIXEL_SIZE = Math.floor(VIEW_SIZE / DIMENSIONS[0]);

let NUMBER_OF_GARBAGE = 20;
let BASE_COLOR =   "white";
let BOT_COLOR =   "green";
let GARBAGE_COLOR = "red";

function runBot (state, bot, memory) {

}

function renderField (field) {

    let view = document.querySelector(".view");  
    view.innerHTML = "";  
    
    let garbageList = field.getGarbage();
    let currentPosition = field.getPlace();
  
    for (let y = 0; y < DIMENSIONS[0]; y++) {
    for (let x = 0; x < DIMENSIONS[0]; x++) {
        let newPixel = createPixel(BASE_COLOR, PIXEL_SIZE);
        
        if (Coordinate.compare([x, y], currentPosition)){
            newPixel = createPixel(BOT_COLOR, PIXEL_SIZE);
        } else if (garbageList.some(garbage => Coordinate.compare([x, y], garbage))) {
            newPixel = createPixel(GARBAGE_COLOR, PIXEL_SIZE);
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
    NUMBER_OF_GARBAGE);

let f1 = new Field(DIMENSIONS, garbage_list);

document.querySelectorAll(".in").forEach(e => e.addEventListener("click", () => {
    if (e.innerText == "N") f1 = f1.takeAction([0, -1]);
    if (e.innerText == "S") f1 = f1.takeAction([0, 1]);
    if (e.innerText == "E") f1 = f1.takeAction([1, 0]);
    if (e.innerText == "W") f1 = f1.takeAction([-1, 0]);
    if (e.innerText == "C") f1 = f1.takeAction([0, 0]);
    
    renderField(f1);
}))

renderField(f1)