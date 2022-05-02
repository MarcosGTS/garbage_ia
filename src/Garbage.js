export default class Garbage {
    constructor (_position, _weight) {
        this.position = _position;
        this.weight = _weight;
    }

    getWeight() {
        return this.weight;
    }

    getPosition() {
        return this.position;
    }
}