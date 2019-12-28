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
    //TODO: Maybe move waveSpeed to superclass.
    private _waveSpeed: number;

    constructor(grid: HexGrid) {
        super(grid);
        this._delayMatrices = [];
        this._waveSpeed = 0.1;
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

        for(let i=0; i<this._grid.width; i++){
            for(let j=0; j<this._grid.height; j++){
                let sum = 0;
                for(let srcIndex in this._sources){
                    let relativeTime = this._timeElapsed - this._delayMatrices[srcIndex][i][j] * this._waveSpeed;
                    sum += this._sources[srcIndex].evaluate(relativeTime);
                }
                this._grid.setHexValue(i, j, sum);
            }
        }
    }
}