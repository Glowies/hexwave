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
var BABYLON = require("babylonjs");
var Hexagon_1 = require("./Hexagon");
var HexGrid = /** @class */ (function () {
    function HexGrid(width, height, zero, range, refHex, scene) {
        if (zero === void 0) { zero = 1; }
        if (range === void 0) { range = 1; }
        this._width = width;
        this._height = height;
        this._zero = zero;
        this._range = range;
        this._refHex = refHex;
        // Instantiate and position hexagons
        this._grid = [];
        var hexDistance = refHex.getRadius() * 1.1;
        for (var i = 0; i < width; i++) {
            this._grid[i] = [];
            for (var j = 0; j < height; j++) {
                var hexHeight = 1;
                var zero_1 = new BABYLON.Vector3(-hexDistance * Math.sqrt(3) * (2 * width + 1) / 4, 0, 3 * hexDistance * height / 4);
                var offset = new BABYLON.Vector3(((i + j / 2) % width) * hexDistance * Math.sqrt(3), 0, -j * hexDistance * 3 / 2);
                var gridHex = Hexagon_1.Hexagon.Copy(refHex);
                gridHex.setPosition(zero_1.add(offset));
                this._grid[i][j] = new Hexagon_1.HexagonWrapper(gridHex, scene);
            }
        }
    }
    Object.defineProperty(HexGrid.prototype, "refHex", {
        get: function () {
            return this._refHex;
        },
        set: function (value) {
            this._refHex = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HexGrid.prototype, "zero", {
        get: function () {
            return this._zero;
        },
        set: function (value) {
            this._zero = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HexGrid.prototype, "range", {
        get: function () {
            return this._range;
        },
        set: function (value) {
            this._range = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HexGrid.prototype, "width", {
        get: function () {
            return this._width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HexGrid.prototype, "height", {
        get: function () {
            return this._height;
        },
        enumerable: true,
        configurable: true
    });
    HexGrid.prototype.getDelayMatrix = function (src) {
        var result = [];
        for (var i = 0; i < this._width; i++) {
            result[i] = [];
            for (var j = 0; j < this._height; j++) {
                result[i][j] = BABYLON.Vector3.Distance(src.position, this._grid[i][j].getPosition());
            }
        }
        return result;
    };
    HexGrid.prototype.getHex = function (i, j) {
        return this._grid[i][j];
    };
    HexGrid.prototype.getHexValue = function (i, j) {
        return this._grid[i][j].getValue();
    };
    HexGrid.prototype.setHexValue = function (i, j, val) {
        this._grid[i][j].setValue(val);
        this.updateGridMesh(i, j);
    };
    HexGrid.prototype.zeroGrid = function () {
        for (var i = 0; i < this._width; i++) {
            for (var j = 0; j < this._height; j++) {
                this.setHexValue(i, j, 0);
            }
        }
        this.updateMeshes();
    };
    HexGrid.prototype.updateMeshes = function () {
        for (var i = 0; i < this._width; i++) {
            for (var j = 0; j < this._height; j++) {
                this.updateGridMesh(i, j);
            }
        }
    };
    return HexGrid;
}());
exports.HexGrid = HexGrid;
var HeightGrid = /** @class */ (function (_super) {
    __extends(HeightGrid, _super);
    function HeightGrid(width, height, zero, range, refHex, scene) {
        if (zero === void 0) { zero = 2; }
        if (range === void 0) { range = 1; }
        return _super.call(this, width, height, zero, range, refHex, scene) || this;
    }
    HeightGrid.prototype.updateGridMesh = function (i, j) {
        var scaledValue = this.getHexValue(i, j) * this.range + this.zero;
        var hex = this.getHex(i, j);
        var currentPosition = hex.getPosition();
        var newPos = new BABYLON.Vector3(currentPosition.x, scaledValue, currentPosition.z);
        hex.setPosition(newPos);
    };
    return HeightGrid;
}(HexGrid));
exports.HeightGrid = HeightGrid;
var ScaleGrid = /** @class */ (function (_super) {
    __extends(ScaleGrid, _super);
    function ScaleGrid(width, height, zero, range, refHex, scene) {
        if (zero === void 0) { zero = 2; }
        if (range === void 0) { range = 1; }
        return _super.call(this, width, height, zero, range, refHex, scene) || this;
    }
    ScaleGrid.prototype.updateGridMesh = function (i, j) {
        var scaledValue = this.getHexValue(i, j) * this.range + this.zero;
        var hex = this.getHex(i, j);
        var currentPosition = hex.getPosition();
        var newPos = new BABYLON.Vector3(currentPosition.x, scaledValue / 2, currentPosition.z);
        hex.setPosition(newPos);
        hex.setHeight(scaledValue);
    };
    return ScaleGrid;
}(HexGrid));
exports.ScaleGrid = ScaleGrid;
var RotationGrid = /** @class */ (function (_super) {
    __extends(RotationGrid, _super);
    function RotationGrid(width, height, zero, range, refHex, scene) {
        if (zero === void 0) { zero = 0; }
        if (range === void 0) { range = Math.PI / 2; }
        return _super.call(this, width, height, zero, range, refHex, scene) || this;
    }
    RotationGrid.prototype.updateGridMesh = function (i, j) {
        var scaledValue = this.getHexValue(i, j) * this.range + this.zero;
        var hex = this.getHex(i, j);
        hex.setRotation(scaledValue);
    };
    return RotationGrid;
}(HexGrid));
exports.RotationGrid = RotationGrid;
var RadiusGrid = /** @class */ (function (_super) {
    __extends(RadiusGrid, _super);
    function RadiusGrid(width, height, zero, range, refHex, scene) {
        if (zero === void 0) { zero = 1; }
        if (range === void 0) { range = 1; }
        var _this = this;
        var defaultZero = refHex.getRadius() / 2 * 1.5;
        var defaultRange = refHex.getRadius() / 2 * 1.3;
        _this = _super.call(this, width, height, defaultZero, defaultRange, refHex, scene) || this;
        return _this;
    }
    RadiusGrid.prototype.updateGridMesh = function (i, j) {
        var scaledValue = this.getHexValue(i, j) * this.range + this.zero;
        var hex = this.getHex(i, j);
        hex.setRadius(scaledValue);
    };
    return RadiusGrid;
}(HexGrid));
exports.RadiusGrid = RadiusGrid;
