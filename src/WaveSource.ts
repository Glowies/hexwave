import {Vector3} from "babylonjs";

export abstract class WaveSource {
    get endTime(): number {
        return this._endTime;
    }

    set endTime(value: number) {
        this._endTime = value;
    }

    get position(): Vector3 {
        return this._position;
    }

    set position(value: Vector3) {
        this._position = value;
        this._posChanged = true;
    }
    get startTime(): number {
        return this._startTime;
    }

    set startTime(value: number) {
        this._startTime = value;
    }

    private _position: Vector3;
    private _posChanged: boolean;
    private _startTime: number;
    private _endTime: number;

    protected constructor(pos: Vector3, start: number, end: number) {
        this._position = pos;
        this._posChanged = false;
        this._startTime = start;
        this._endTime = end;
    }

    public positionUpdated(): void {
        this._posChanged = false;
    }

    abstract evaluate(totalTime: number): number;
}

export abstract class PeriodicSource extends WaveSource {
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

    get phase(): number {
        return this._phase;
    }

    set phase(value: number) {
        this._phase = value;
    }
    private _phase: number;
    private _amplitude: number;
    private _frequency: number;

    constructor(pos: Vector3, start: number, end: number, phase: number, amplitude: number, frequency: number){
        super(pos, start, end);
        this._phase = phase;
        this._amplitude = amplitude;
        this._frequency = frequency;
    }
}

export class SinusoidSource extends PeriodicSource {
    evaluate(totalTime: number): number {
        if(totalTime < 0)
            return 0;
        let frequencyComponent = 2 * Math.PI * this.frequency * (totalTime - this.startTime);
        return this.amplitude * Math.sin(frequencyComponent + this.phase);
    }
}