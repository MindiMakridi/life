import Figure from './Figure';

class Exploder extends Figure {

    getCoordinates(): boolean[][]{
        return [
            [ true, false, true, false, true ],
            [ true, false, false, false, true ],
            [ true, false, false, false, true ],
            [ true, false, false, false, true ],
            [ true, false, true, false, true ],
        ];
    }
}

export default Exploder;