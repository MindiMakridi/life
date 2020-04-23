import Figure from './Figure';

class Spaceship extends Figure {

    getCoordinates(): boolean[][]{
        return [
            [ false, true, true, true, true ],
            [ true, false, false, false, true ],
            [ false, false, false, false, true ],
            [ true, false, false, true, false ],
        ];
    }
}

export default Spaceship;