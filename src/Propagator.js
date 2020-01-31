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
var Propagator = /** @class */ (function () {
    function Propagator(grid) {
        this._grid = grid;
        this._timeElapsed = 0;
        this._sources = [];
    }
    Propagator.prototype.addSource = function (src) {
        this._sources.push(src);
    };
    Propagator.prototype.removeSource = function (src) {
        var index = this._sources.indexOf(src);
        if (index < 0)
            return index;
        this._sources.splice(index, 1);
        return index;
    };
    Propagator.prototype.update = function (deltaTime) {
        this._timeElapsed += deltaTime;
    };
    return Propagator;
}());
exports.Propagator = Propagator;
var SourcePropagator = /** @class */ (function (_super) {
    __extends(SourcePropagator, _super);
    function SourcePropagator(grid) {
        var _this = _super.call(this, grid) || this;
        _this._delayMatrices = [];
        _this._waveSpeed = 0.1;
        return _this;
    }
    SourcePropagator.prototype.addSource = function (src) {
        _super.prototype.addSource.call(this, src);
        this._delayMatrices.push(this._grid.getDelayMatrix(src));
    };
    SourcePropagator.prototype.removeSource = function (src) {
        var index = _super.prototype.removeSource.call(this, src);
        if (index < 0)
            return index;
        this._delayMatrices.splice(index, 1);
        return index;
    };
    SourcePropagator.prototype.update = function (deltaTime) {
        _super.prototype.update.call(this, deltaTime);
        for (var i = 0; i < this._grid.width; i++) {
            for (var j = 0; j < this._grid.height; j++) {
                var sum = 0;
                for (var srcIndex in this._sources) {
                    var relativeTime = this._timeElapsed - this._delayMatrices[srcIndex][i][j] * this._waveSpeed;
                    sum += this._sources[srcIndex].evaluate(relativeTime);
                }
                this._grid.setHexValue(i, j, sum);
            }
        }
    };
    return SourcePropagator;
}(Propagator));
exports.SourcePropagator = SourcePropagator;
