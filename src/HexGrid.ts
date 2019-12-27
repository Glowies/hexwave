import * as BABYLON from "babylonjs";
import {Hexagon, HexagonWrapper} from "./Hexagon";

export abstract class HexGrid {
    private readonly _grid: HexagonWrapper[][];
    width: number;
    height: number;
    refHex: Hexagon; // Hexagon whose values will be taken as reference for other hexagons
    zero: number;
    range: number; // The range of values [zero - range, zero + range] that correspond to [-1,1]

    protected constructor(width: number, height: number, zero=1, range=1, refHex: Hexagon, scene: BABYLON.Scene){
        this.width = width;
        this.height = height;
        this.zero = zero;
        this.range = range;
        this.refHex = refHex;

        // Instantiate and position hexagons
        this._grid = [];
        let hexDistance = refHex.getRadius() * 1.1;

        for(let i=0; i<width; i++){
            this._grid[i] = [];
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

                this._grid[i][j] = new HexagonWrapper(gridHex, scene);
            }
        }
    }

    getHex(i: number, j: number): HexagonWrapper {
        return this._grid[i][j];
    }

    getHexValue(i: number, j: number): number {
        return this._grid[i][j].getValue();
    }
    setHexValue(i: number, j: number, val: number): void {
        this._grid[i][j].setValue(val);
        this.updateGridMesh(i,j);
    }

    zeroGrid(): void {
        for(let i=0; i<this.width; i++){
            for(let j=0; j<this.height; j++){
                this.setHexValue(i,j,0);
            }
        }
        this.updateMeshes();
    }

    updateMeshes(): void {
        for(let i=0; i<this.width; i++){
            for(let j=0; j<this.height; j++){
                this.updateGridMesh(i,j);
            }
        }
    }

    abstract updateGridMesh(i: number, j: number): void;
}

export class HeightGrid extends HexGrid {
    constructor(width: number, height: number, zero=3, range=2, refHex: Hexagon, scene: BABYLON.Scene){
        super(width, height, zero, range, refHex, scene);
    }

    updateGridMesh(i: number, j: number): void {
        let scaledValue = this.getHexValue(i,j) * this.range + this.zero;
        let hex = this.getHex(i,j);
        let currentPosition = hex.getPosition();
        let offset = new BABYLON.Vector3(0, scaledValue, 0);
        hex.setPosition(currentPosition.add(offset));
    }
}

export class ScaleGrid extends HexGrid {
    constructor(width: number, height: number, zero=3, range=2, refHex: Hexagon, scene: BABYLON.Scene){
        super(width, height, zero, range, refHex, scene);
    }

    updateGridMesh(i: number, j: number): void {
        let scaledValue = this.getHexValue(i,j) * this.range + this.zero;
        let hex = this.getHex(i,j);
        let currentPosition = hex.getPosition();
        let offset = new BABYLON.Vector3(0, scaledValue / 2, 0);
        hex.setPosition(currentPosition.add(offset));
        hex.setHeight(scaledValue);
    }
}

export class RotationGrid extends HexGrid { // Looks better with arrows instead of hexagons.
    constructor(width: number, height: number, zero=0, range=Math.PI/2, refHex: Hexagon, scene: BABYLON.Scene){
        super(width, height, zero, range, refHex, scene);
    }

    updateGridMesh(i: number, j: number): void {
        let scaledValue = this.getHexValue(i,j) * this.range + this.zero;
        let hex = this.getHex(i,j);
        hex.setRotation(scaledValue);
    }
}

export class RadiusGrid extends HexGrid {
    constructor(width: number, height: number, zero=1, range=1, refHex: Hexagon, scene: BABYLON.Scene){
        let defaultZero = refHex.getRadius()/2;
        let defaultRange = refHex.getRadius()/2;
        super(width, height, defaultZero, defaultRange, refHex, scene);
    }

    updateGridMesh(i: number, j: number): void {
        let scaledValue = this.getHexValue(i,j) * this.range + this.zero;
        let hex = this.getHex(i,j);
        hex.setRadius(scaledValue);
    }
}