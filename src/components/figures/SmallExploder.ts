import Figure from './Figure';

class SmallExploder extends Figure {

    getCoordinates(): boolean[][]{
        return [
            [ false, true, false ],
            [ true, true, true ],
            [ true, false, true ],
            [ false, true, false ],
        ];
    }
}

export default SmallExploder;