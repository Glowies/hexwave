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
        if(totalTime < this.startTime)
            return 0;
        let frequencyComponent = 2 * Math.PI * this.frequency * (totalTime - this.startTime);
        return this.amplitude * Math.sin(frequencyComponent + this.phase);
    }
}

export class SquareSource extends PeriodicSource {
    evaluate(totalTime: number): number {
        if(totalTime < this.startTime)
            return 0;
        let period = 1 / this.frequency;
        let phaseShift = period * this.phase / 2.0 / Math.PI;
        let remainder = (totalTime - this.startTime + phaseShift) % period;
        return (remainder < period/2.0) ? this.amplitude : -this.amplitude;
    }
}

export class SawtoothSource extends PeriodicSource {
    evaluate(totalTime: number): number {
        if(totalTime < this.startTime)
            return 0;
        let period = 1 / this.frequency;;
        let phaseShift = period * this.phase / 2.0 / Math.PI;
        let remainder = (totalTime - this.startTime + phaseShift) % period;
        return (2 * remainder / period - 1) * this.amplitude;
    }
}

export class TriangleSource extends PeriodicSource {
    evaluate(totalTime: number): number {
        if(totalTime < this.startTime)
            return 0;
        let period = 1 / this.frequency;;
        let phaseShift = period * this.phase / 2.0 / Math.PI;
        let remainder = (totalTime - this.startTime + period / 4.0 + phaseShift) % period;
        let subRemainder = remainder % (period / 2.0);
        return (4 * subRemainder / period - 1) * this.amplitude * (remainder > period / 2.0 ? 1 : -1);
    }
}