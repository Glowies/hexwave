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

    abstract evaluate(totalTime: number, distance: number): number;
}

export class MicSource extends WaveSource {
    private _bufferSize: number;
    private _buffer: AudioBuffer;
    private _gain: number;
    private _maxDistance: number;
    private _triggerIndex: number;
    private _triggerValue: number;

    constructor(pos: Vector3, start: number, end: number, maxDistance: number) {
        super(pos, start, end);
        this._maxDistance = maxDistance;
        this._bufferSize = 512;
        this._buffer = new AudioBuffer({length: this._bufferSize, numberOfChannels: 1, sampleRate: 48000});
        this._gain = 10;
        this._triggerIndex = 0;
        this._triggerValue = 0;

        navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(this.mediaCallback.bind(this));
    }

    mediaCallback(stream: MediaStream): void{
        let context = new AudioContext();
        const source = context.createMediaStreamSource(stream);
        const compressor = new DynamicsCompressorNode(context, {
            attack: 0.001,
            knee: 20,
            ratio: 14,
            release: .125,
            threshold: -32
        });
        const processor = context.createScriptProcessor(this._bufferSize, 1, 1);

        source.connect(compressor);
        compressor.connect(processor);
        processor.connect(context.destination);

        processor.onaudioprocess = this.onAudioProcess.bind(this);
    }

    onAudioProcess(e: AudioProcessingEvent): void{
        this._buffer = e.inputBuffer;

        let triggerWindow = 4;
        // Find trigger index
        outer: for(let i=this._bufferSize - triggerWindow; i > triggerWindow - 1; i--){
            for(let j=0; j<triggerWindow; j++){
                if(this._buffer.getChannelData(0)[i - j - 1] > this._triggerValue ||
                    this._buffer.getChannelData(0)[i + j] < this._triggerValue){
                    continue outer;
                }
            }
            this._triggerIndex = i;
            break;
        }
    }

    evaluate(totalTime: number, distance: number): number{
        let n = this._bufferSize - 1;
        let index = Math.max(0, (this._triggerIndex - Math.floor(distance / this._maxDistance * n)) % n);
        return this._buffer.getChannelData(0)[index] * this._gain;
    }
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
    evaluate(totalTime: number, distance: number): number {
        if(totalTime < this.startTime)
            return 0;
        let frequencyComponent = 2 * Math.PI * this.frequency * (totalTime - this.startTime);
        return this.amplitude * Math.sin(frequencyComponent + this.phase);
    }
}

export class SquareSource extends PeriodicSource {
    evaluate(totalTime: number, distance: number): number {
        if(totalTime < this.startTime)
            return 0;
        let period = 1 / this.frequency;
        let phaseShift = period * this.phase / 2.0 / Math.PI;
        let remainder = (totalTime - this.startTime + phaseShift) % period;
        return (remainder < period/2.0) ? this.amplitude : -this.amplitude;
    }
}

export class SawtoothSource extends PeriodicSource {
    evaluate(totalTime: number, distance: number): number {
        if(totalTime < this.startTime)
            return 0;
        let period = 1 / this.frequency;
        let phaseShift = period * this.phase / 2.0 / Math.PI;
        let remainder = (totalTime - this.startTime + phaseShift) % period;
        return (2 * remainder / period - 1) * this.amplitude;
    }
}

export class TriangleSource extends PeriodicSource {
    evaluate(totalTime: number, distance: number): number {
        if(totalTime < this.startTime)
            return 0;
        let period = 1 / this.frequency;
        let phaseShift = period * this.phase / 2.0 / Math.PI;
        let remainder = (totalTime - this.startTime + period / 4.0 + phaseShift) % period;
        let subRemainder = remainder % (period / 2.0);
        return (4 * subRemainder / period - 1) * this.amplitude * (remainder > period / 2.0 ? 1 : -1);
    }
}