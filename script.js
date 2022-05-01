class Coordinate {
    static sum (c1, c2) {
        let [x1, y1] = c1;
        let [x2, y2] = c2;
        return [x1 + x2, y1 + y2];
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
    constructor(_garbage, _place = [0, 0]) {
        this.place = _place;   // current possition
        this.garbage = _garbage; // list of garbage coordinates
    }

    takeAction(movement) {
        //colect carbage
        let collect = [0, 0];
        let garbage = this.garbage;
        let newCoordinate = Coordinate.sum(this.place, movement);

        if (Coordinate.compare(movement, collect)) {
            //remove garbage in the current position
            garbage = this.garbage.filter(e => !Coordinate.compare(e, this.place));
        }
        
        return new Field(garbage, newCoordinate);
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

let garbage_list = Field.createField(10,10,10);
let f1 = new Field(garbage_list);

f1.takeAction([0,0]);