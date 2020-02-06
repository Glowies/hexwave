import {HexGrid} from "./HexGrid";
import {WaveSource} from "./WaveSource";

export abstract class Propagator {
    protected _grid: HexGrid;
    protected _timeElapsed: number;
    protected _sources: WaveSource[];

    protected constructor(grid: HexGrid) {
        this._grid = grid;
        this._timeElapsed = 0;
        this._sources = [];
    }

    public addSource(src: WaveSource): void {
        this._sources.push(src);
    }

    public removeSource(src: WaveSource): number {
        let index = this._sources.indexOf(src);
        if(index < 0)
            return index;
        this._sources.splice(index, 1);
        return index;
    }

    public update(deltaTime: number): void {
        this._timeElapsed += deltaTime;
    }
}

export class SourcePropagator extends Propagator {
    private _delayMatrices: number[][][];

    constructor(grid: HexGrid) {
        super(grid);
        this._delayMatrices = [];
    }

    public addSource(src: WaveSource): void {
        super.addSource(src);
        this._delayMatrices.push(this._grid.getDelayMatrix(src));
    }

    public removeSource(src: WaveSource): number {
        let index = super.removeSource(src);
        if(index < 0)
            return index;
        this._delayMatrices.splice(index, 1);
        return index;
    }

    public update(deltaTime: number): void {
        super.update(deltaTime);

        for(let srcIndex in this._sources){
            this._sources[srcIndex].update(deltaTime);
        }

        for(let i=0; i<this._grid.width; i++){
            for(let j=0; j<this._grid.height; j++){
                let sum = 0;
                for(let srcIndex in this._sources){
                    let distance = this._delayMatrices[srcIndex][i][j];
                    sum += this._sources[srcIndex].evaluate(distance);
                }
                this._grid.setHexValue(i, j, sum);
            }
        }
    }
}