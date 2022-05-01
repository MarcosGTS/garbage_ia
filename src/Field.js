import Coordinate from "./Coordinate.js";

export default class Field {
    constructor(_dimensions, _garbage, _place = [0, 0]) {
        this.place = _place;   // current possition
        this.dimensions = _dimensions;
        this.garbage = _garbage; // list of garbage coordinates
    }

    getPlace() {
        return this.place;
    }
    
    getDimensions() {
        return this.dimensions;
    }

    getGarbage() {
        return [...this.garbage];
    }

    isDirty(position) {
        return this.garbage.some(e => Coordinate.compare(e, position));
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
        
        return new Field(this.dimensions, garbage, newCoordinate);
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