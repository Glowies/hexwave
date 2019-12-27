export abstract class WaveSource {
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

    constructor(phase: number, amplitude: number, frequency: number, startTime: number){
        super();
        this._phase = phase;
        this._amplitude = amplitude;
        this._frequency = frequency;
        this._startTime = startTime;
    }

    evaluate(totalTime: number): number {
        let frequencyComponent = 2 * Math.PI * this._frequency * (totalTime - this._startTime);
        return this._amplitude * Math.sin(frequencyComponent + this._phase);
    }
}