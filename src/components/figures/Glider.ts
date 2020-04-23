import Figure from './Figure';

class Glider extends Figure {

    getCoordinates(): boolean[][]{
        return [
            [ false, false, true ],
            [ true, true, false ],
            [ false, true, true ],
        ];
    }
}

export default Glider;