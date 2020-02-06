import {Vector3} from "babylonjs";

export class WaveProperties {
    get speed(): number {
        return this._speed;
    }

    set speed(value: number) {
        this._speed = value;
    }

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

    get timeElapsed(): number {
        return this._timeElapsed;
    }

    private _position: Vector3;
    private _posChanged: boolean;
    private _startTime: number;
    private _endTime: number;
    private _speed: number;
    private _timeElapsed: number;

    constructor(pos: Vector3, start: number, end: number, speed: number) {
        this._position = pos;
        this._startTime = start;
        this._endTime = end;
        this._speed = speed;
        this._posChanged = false;
        this._timeElapsed = 0;
    }

    public positionUpdated(): void {
        this._posChanged = false;
    }

    public incrementTime(deltaTime: number){
        this._timeElapsed += deltaTime;
    }

    public isActive(): boolean{
        return this._timeElapsed > this._startTime && this._timeElapsed < this._endTime;
    }
}

export abstract class WaveSource {
    get properties(): WaveProperties {
        return this._properties;
    }

    private readonly _properties: WaveProperties;

    protected constructor(properties: WaveProperties) {
        this._properties = properties;
    }

    public update(deltaTime: number): void {
        this.properties.incrementTime(deltaTime);
    }

    abstract evaluate(distance: number): number;
}

export class MouseSource extends WaveSource {
    evaluate(distance: number): number{
        return 1;
    }
}

export class MicSource extends WaveSource {
    private _bufferSize: number;
    private _buffer: AudioBuffer;
    private _gain: number;
    private _maxDistance: number;
    private _triggerIndex: number;
    private _triggerValue: number;

    constructor(properties: WaveProperties, maxDistance: number) {
        super(properties);
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

    evaluate(distance: number): number{
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

    constructor(properties: WaveProperties, phase: number, amplitude: number, frequency: number){
        super(properties);
        this._phase = phase;
        this._amplitude = amplitude;
        this._frequency = frequency;
    }
}

export class SinusoidSource extends PeriodicSource {
    evaluate(distance: number): number {
        let timeToTarget: number = distance / this.properties.speed;
        let relativeTime: number = this.properties.timeElapsed - timeToTarget;
        if(relativeTime < this.properties.startTime)
            return 0;
        let frequencyComponent = 2 * Math.PI * this.frequency * (relativeTime - this.properties.startTime);
        return this.amplitude * Math.sin(frequencyComponent + this.phase);
    }
}

export class SquareSource extends PeriodicSource {
    evaluate(distance: number): number {
        let timeToTarget: number = distance / this.properties.speed;
        let relativeTime: number = this.properties.timeElapsed - timeToTarget;
        if(relativeTime < this.properties.startTime)
            return 0;
        let period = 1 / this.frequency;
        let phaseShift = period * this.phase / 2.0 / Math.PI;
        let remainder = (relativeTime - this.properties.startTime + phaseShift) % period;
        return (remainder < period/2.0) ? this.amplitude : -this.amplitude;
    }
}

export class SawtoothSource extends PeriodicSource {
    evaluate(distance: number): number {
        let relativeTime: number = this.properties.timeElapsed - distance / this.properties.speed;
        if(relativeTime < this.properties.startTime)
            return 0;
        let period = 1 / this.frequency;
        let phaseShift = period * this.phase / 2.0 / Math.PI;
        let remainder = (relativeTime - this.properties.startTime + phaseShift) % period;
        return (2 * remainder / period - 1) * this.amplitude;
    }
}

export class TriangleSource extends PeriodicSource {
    evaluate(distance: number): number {
        let timeToTarget: number = distance / this.properties.speed;
        let relativeTime: number = this.properties.timeElapsed - timeToTarget;
        if(relativeTime < this.properties.startTime)
            return 0;
        let period = 1 / this.frequency;
        let phaseShift = period * this.phase / 2.0 / Math.PI;
        let remainder = (relativeTime - this.properties.startTime + period / 4.0 + phaseShift) % period;
        let subRemainder = remainder % (period / 2.0);
        return (4 * subRemainder / period - 1) * this.amplitude * (remainder > period / 2.0 ? 1 : -1);
    }
}