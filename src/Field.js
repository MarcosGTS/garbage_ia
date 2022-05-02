import Coordinate from "./Coordinate.js";
import Garbage from "./Garbage.js";

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

    getGarbageList() {
        return [...this.garbage];
    }

    getGarbage(position) {
        return this.garbage.find(e => Coordinate.compare(position, e.getPosition()));
    }

    isDirty(position) {
        return this.garbage.some(e => Coordinate.compare(position, e.getPosition()));
    }
    
    takeAction(movement) {
        //colect carbage
        let collect = [0, 0];
        let garbage = this.garbage;
        let newCoordinate = Coordinate.sum(this.place, movement);

        if (Coordinate.compare(movement, collect)) {
            //remove garbage in the current position
            garbage = this.garbage.filter(garb => 
                !Coordinate.compare(garb.getPosition(), this.place)
            );
        }
        
        return new Field(this.dimensions, garbage, newCoordinate);
    }

    static createField(width, height, numberOfGarbage, weights = [10, 20]) {
        let garbage = [];

        while (garbage.length < numberOfGarbage) {
            let type = Math.floor(garbage.length / (numberOfGarbage / weights.length))
            let garbCoordinate = Coordinate.randomCoordinate(width, height);
            let newGarbage = new Garbage(garbCoordinate, weights[type]);
            
            // Coordinate already selected
            if (garbage.find(crrGarb => Coordinate.compare(
                crrGarb.getPosition(), 
                newGarbage.getPosition()
            ))) continue;

            garbage.push(newGarbage);
        }

        return garbage;
    }
}