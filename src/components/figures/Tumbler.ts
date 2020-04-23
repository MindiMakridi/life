import Figure from './Figure';

class Tumbler extends Figure {

    getCoordinates(): boolean[][]{
        return [
            [ false, true, true, false, true, true, false ],
            [ false, true, true, false, true, true, false ],
            [ false, false, true, false, true, false, false ],
            [ true, false, true, false, true, false, true ],
            [ true, false, true, false, true, false, true ],
            [ true, true, false, false, false, true, true ],
        ];
    }
}

export default Tumbler;