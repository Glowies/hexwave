import * as BABYLON from "babylonjs";
import {Hexagon, HexagonWrapper} from "./Hexagon";

export abstract class HexGrid {
    grid: HexagonWrapper[][];
    width: number;
    height: number;
    refHex: Hexagon; // Hexagon whose values will be taken as reference for other hexagons
    zero: number;
    range: number; // The range of values that correspond to [-1,1]

    constructor(width: number, height: number, zero: number, range: number, refHex: Hexagon, scene: BABYLON.Scene){
        this.width = width;
        this.height = height;
        this.zero = zero;
        this.range = range;
        this.refHex = refHex;

        // Instantiate and position hexagons
        this.grid = [];
        let hexDistance = refHex.getRadius() * 1.1;

        for(let i=0; i<width; i++){
            this.grid[i] = [];
            for(let j=0; j<height; j++){
                let hexHeight = 1;
                let zero = new BABYLON.Vector3(
                    -hexDistance*Math.sqrt(3)*(2*width + 1)/4,
                    0,
                    3*hexDistance*height/4
                );
                let offset = new BABYLON.Vector3(
                    ((i + j/2) % width) * hexDistance*Math.sqrt(3),
                    0,
                    -j*hexDistance*3/2
                );

                let gridHex = Hexagon.Copy(refHex);
                gridHex.setPosition(zero.add(offset));

                this.grid[i][j] = new HexagonWrapper(gridHex, scene);
            }
        }
    }
}

export class HeightGrid extends HexGrid {

}