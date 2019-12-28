import {Vector3} from "babylonjs";

export abstract class WaveSource {

    get position(): Vector3 {
        return this._position;
    }

    set position(value: Vector3) {
        this._position = value;
        this._posChanged = true;
    }

    private _position: Vector3;
    private _posChanged: boolean;

    protected constructor(pos: Vector3) {
        this._position = pos;
        this._posChanged = false;
    }

    public positionUpdated(): void {
        this._posChanged = false;
    }

    abstract evaluate(totalTime: number): number;
}

export class SinusoidSource extends WaveSource {
    get amplitude(): number {
        return this._amplitude;
    }

    set amplitude(value: number) {
        this._amplitude = value;
    }

    get frequency(): number {
        return this._frequency;
    }

    set frequency(value: number) {
        this._frequency = value;
    }

    get startTime(): number {
        return this._startTime;
    }

    set startTime(value: number) {
        this._startTime = value;
    }
    get phase(): number {
        return this._phase;
    }

    set phase(value: number) {
        this._phase = value;
    }
    private _phase: number;
    private _amplitude: number;
    private _frequency: number;
    private _startTime: number;

    constructor(pos: Vector3, phase: number, amplitude: number, frequency: number, startTime: number){
        super(pos);
        this._phase = phase;
        this._amplitude = amplitude;
        this._frequency = frequency;
        this._startTime = startTime;
    }

    evaluate(totalTime: number): number {
        if(totalTime < 0)
            return 0;
        let frequencyComponent = 2 * Math.PI * this._frequency * (totalTime - this._startTime);
        return this._amplitude * Math.sin(frequencyComponent + this._phase);
    }
}