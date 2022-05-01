export default class Coordinate {
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