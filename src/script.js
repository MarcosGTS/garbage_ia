import Field from "./Field.js"
import Coordinate from "./Coordinate.js"
import {simpleReactive, statesBasedReactive, goalBasedReactive, utilityBasedReactive} from "./Bots.js"

let VIEW_SIZE = 500;
let DIMENSIONS = [20, 20];
let PIXEL_SIZE = Math.floor(VIEW_SIZE / DIMENSIONS[0]);

let WEIGHTS = [10, 20]
let NUMBER_OF_GARBAGE = 20;
let BASE_COLOR =  "white";
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

let SIMULATION_LOOP;
let SELECTED_BOT = simpleReactive;

let START_BTN = document.querySelector("#play");
START_BTN.addEventListener("click", () => startGame(SELECTED_BOT));

let BOT_LIST = document.querySelector("#bots");
BOT_LIST.addEventListener("change", changeBot);

function changeBot() {
    let {selectedIndex}= this.options;
    let selectedItem = this.options[selectedIndex].value;

    if (selectedItem == "sr") SELECTED_BOT = simpleReactive
    if (selectedItem == "sbr") SELECTED_BOT = statesBasedReactive
    if (selectedItem == "gbr") SELECTED_BOT = goalBasedReactive
    if (selectedItem == "ubr") SELECTED_BOT = utilityBasedReactive
}

function startGame(bot) {
 
    //Generate a random list of garbage
    let garbage_list = Field.createField(
        DIMENSIONS[0],
        DIMENSIONS[1],
        NUMBER_OF_GARBAGE,
        WEIGHTS);
    
    let field= new Field(DIMENSIONS, garbage_list);
    
    runBot(field, bot, renderField);
}

function runBot (field, bot, renderFunc = console.log) {
    let INTERVAL = .1 * 1000;
    let memory = null;

    clearInterval(SIMULATION_LOOP);
    SIMULATION_LOOP = setInterval(() => {
        renderFunc(field);

        let action = bot(field, memory);
        field = field.takeAction(action.direction);
        memory = action.memory;

        if (!field.getGarbageList().length) {
            console.log(memory);
            clearInterval(simulation); 
        }
    }, INTERVAL);
}
