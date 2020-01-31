"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var WaveSource = /** @class */ (function () {
    function WaveSource(pos, start, end) {
        this._position = pos;
        this._posChanged = false;
        this._startTime = start;
        this._endTime = end;
    }
    Object.defineProperty(WaveSource.prototype, "endTime", {
        get: function () {
            return this._endTime;
        },
        set: function (value) {
            this._endTime = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WaveSource.prototype, "position", {
        get: function () {
            return this._position;
        },
        set: function (value) {
            this._position = value;
            this._posChanged = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WaveSource.prototype, "startTime", {
        get: function () {
            return this._startTime;
        },
        set: function (value) {
            this._startTime = value;
        },
        enumerable: true,
        configurable: true
    });
    WaveSource.prototype.positionUpdated = function () {
        this._posChanged = false;
    };
    return WaveSource;
}());
exports.WaveSource = WaveSource;
var PeriodicSource = /** @class */ (function (_super) {
    __extends(PeriodicSource, _super);
    function PeriodicSource(pos, start, end, phase, amplitude, frequency) {
        var _this = _super.call(this, pos, start, end) || this;
        _this._phase = phase;
        _this._amplitude = amplitude;
        _this._frequency = frequency;
        return _this;
    }
    Object.defineProperty(PeriodicSource.prototype, "amplitude", {
        get: function () {
            return this._amplitude;
        },
        set: function (value) {
            this._amplitude = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PeriodicSource.prototype, "frequency", {
        get: function () {
            return this._frequency;
        },
        set: function (value) {
            this._frequency = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PeriodicSource.prototype, "phase", {
        get: function () {
            return this._phase;
        },
        set: function (value) {
            this._phase = value;
        },
        enumerable: true,
        configurable: true
    });
    return PeriodicSource;
}(WaveSource));
exports.PeriodicSource = PeriodicSource;
var SinusoidSource = /** @class */ (function (_super) {
    __extends(SinusoidSource, _super);
    function SinusoidSource() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SinusoidSource.prototype.evaluate = function (totalTime) {
        if (totalTime < this.startTime)
            return 0;
        var frequencyComponent = 2 * Math.PI * this.frequency * (totalTime - this.startTime);
        return this.amplitude * Math.sin(frequencyComponent + this.phase);
    };
    return SinusoidSource;
}(PeriodicSource));
exports.SinusoidSource = SinusoidSource;
var SquareSource = /** @class */ (function (_super) {
    __extends(SquareSource, _super);
    function SquareSource() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SquareSource.prototype.evaluate = function (totalTime) {
        if (totalTime < this.startTime)
            return 0;
        var period = 1 / this.frequency;
        var phaseShift = period * this.phase / 2.0 / Math.PI;
        var remainder = (totalTime - this.startTime + phaseShift) % period;
        return (remainder < period / 2.0) ? this.amplitude : -this.amplitude;
    };
    return SquareSource;
}(PeriodicSource));
exports.SquareSource = SquareSource;
var SawtoothSource = /** @class */ (function (_super) {
    __extends(SawtoothSource, _super);
    function SawtoothSource() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SawtoothSource.prototype.evaluate = function (totalTime) {
        if (totalTime < this.startTime)
            return 0;
        var period = 1 / this.frequency;
        ;
        var phaseShift = period * this.phase / 2.0 / Math.PI;
        var remainder = (totalTime - this.startTime + phaseShift) % period;
        return (2 * remainder / period - 1) * this.amplitude;
    };
    return SawtoothSource;
}(PeriodicSource));
exports.SawtoothSource = SawtoothSource;
var TriangleSource = /** @class */ (function (_super) {
    __extends(TriangleSource, _super);
    function TriangleSource() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TriangleSource.prototype.evaluate = function (totalTime) {
        if (totalTime < this.startTime)
            return 0;
        var period = 1 / this.frequency;
        ;
        var phaseShift = period * this.phase / 2.0 / Math.PI;
        var remainder = (totalTime - this.startTime + period / 4.0 + phaseShift) % period;
        var subRemainder = remainder % (period / 2.0);
        return (4 * subRemainder / period - 1) * this.amplitude * (remainder > period / 2.0 ? 1 : -1);
    };
    return TriangleSource;
}(PeriodicSource));
exports.TriangleSource = TriangleSource;
