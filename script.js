class Coordinate {
    constructor (_x, _y) {
        this.x = _x;
        this.y = _y; 
    }

    getCoordinate() {
        return [this.x, this.y];
    }

    setCoordinate(_x, _y) {
        this.x = _x;
        this.y = _y;
    }

    static compare(c1, c2) {
        return JSON.stringify(c1) === JSON.stringify(c2);
    }

    static randomCoordinate(max1, max2) {
        let x = Coordinate.randomNumber(max1);
        let y = Coordinate.randomNumber(max2);

        return [x, y];
    }

    static randomNumber(max, min = 0) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}

class Field {
    constructor(garbage) {
        this.place;   // current possition
        this.field;   //matrix
        this.garbage; // list of garbage coordinates
    }

    takeAction(movement) {
        //colect carbage
        if (Coordinate.compare(movement, [0,0])) {
            console.log("success")
        }
    }

    static createField(width, height, numberOfGarbage) {
        let garbage = [];

        while (garbage.length < numberOfGarbage) {
            let newGarbage = Coordinate.randomCoordinate(width, height);

            // Coordinate already selected
            if (garbage.some(e => Coordinate.compare(e, newGarbage))) continue;
            garbage.push(newGarbage);
        }

        return garbage;
    }
}

function runBot (state, bot, memory) {

}

let c1 = new Coordinate(1, 2);
console.log(Field.createField(10, 10, 10));