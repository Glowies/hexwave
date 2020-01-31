"use strict";
exports.__esModule = true;
var BABYLON = require("babylonjs");
var HexagonWrapper = /** @class */ (function () {
    function HexagonWrapper(hex, scene) {
        this.hex = hex;
        this.mesh = this.createMesh(scene);
        this.value = 0;
    }
    HexagonWrapper.prototype.createMesh = function (scene) {
        var mesh = BABYLON.MeshBuilder.CreateCylinder("gridHex", { height: 1, diameter: 1, tessellation: 6 }, scene);
        this.mesh = mesh;
        var material = new BABYLON.StandardMaterial("sibel", scene);
        material.alpha = 1;
        material.diffuseColor = new BABYLON.Color3(1.00, 0.08, 0.58);
        mesh.material = material;
        this.updateMesh();
        // Highlight the edges of the hexagon
        //mesh.enableEdgesRendering();
        mesh.edgesWidth = 1.0;
        mesh.edgesColor = new BABYLON.Color4(1.00, 0.72, 0.77, 1);
        return mesh;
    };
    HexagonWrapper.prototype.updateMesh = function () {
        this.updateMeshHeight();
        this.updateMeshRadius();
        this.updateMeshPosition();
        this.updateMeshRotation();
    };
    HexagonWrapper.prototype.updateMeshHeight = function () {
        this.mesh.scaling.y = this.hex.getHeight();
    };
    HexagonWrapper.prototype.updateMeshRadius = function () {
        this.mesh.scaling.x = this.hex.getRadius() * 2;
        this.mesh.scaling.z = this.hex.getRadius() * 2;
    };
    HexagonWrapper.prototype.updateMeshPosition = function () {
        this.mesh.position = this.hex.getPosition();
    };
    HexagonWrapper.prototype.updateMeshRotation = function () {
        var axis = new BABYLON.Vector3(0, 1, 0);
        this.mesh.rotationQuaternion = BABYLON.Quaternion.RotationAxis(axis, this.hex.getRotation() + Math.PI / 6);
    };
    HexagonWrapper.prototype.getHeight = function () {
        return this.hex.getHeight();
    };
    HexagonWrapper.prototype.setHeight = function (height) {
        this.hex.setHeight(height);
        this.updateMeshHeight();
    };
    HexagonWrapper.prototype.getRotation = function () {
        return this.hex.getRotation();
    };
    HexagonWrapper.prototype.setRotation = function (rot) {
        this.hex.setRotation(rot);
        this.updateMeshRotation();
    };
    HexagonWrapper.prototype.getRadius = function () {
        return this.hex.getRadius();
    };
    HexagonWrapper.prototype.setRadius = function (r) {
        this.hex.setRadius(r);
        this.updateMeshRadius();
    };
    HexagonWrapper.prototype.getPosition = function () {
        return this.hex.getPosition();
    };
    HexagonWrapper.prototype.setPosition = function (pos) {
        this.hex.setPosition(pos);
        this.updateMeshPosition();
    };
    HexagonWrapper.prototype.getValue = function () {
        return this.value;
    };
    HexagonWrapper.prototype.setValue = function (val) {
        this.value = val;
    };
    return HexagonWrapper;
}());
exports.HexagonWrapper = HexagonWrapper;
var Hexagon = /** @class */ (function () {
    function Hexagon(position, height, rotation, radius, value) {
        this.position = position;
        this.height = height;
        this.rotation = rotation;
        this.radius = radius;
        this.value = value;
    }
    Hexagon.ZeroHex = function () {
        return new Hexagon(BABYLON.Vector3.Zero(), 0.5, 0, 1, 0);
    };
    Hexagon.Copy = function (hex) {
        return new Hexagon(hex.getPosition(), hex.getHeight(), hex.getRotation(), hex.getRadius(), hex.getValue());
    };
    Hexagon.prototype.getPosition = function () {
        return this.position;
    };
    Hexagon.prototype.setPosition = function (val) {
        this.position = val;
    };
    Hexagon.prototype.getHeight = function () {
        return this.height;
    };
    Hexagon.prototype.setHeight = function (val) {
        this.height = val;
    };
    Hexagon.prototype.getRotation = function () {
        return this.rotation;
    };
    Hexagon.prototype.setRotation = function (val) {
        this.rotation = val;
    };
    Hexagon.prototype.getRadius = function () {
        return this.radius;
    };
    Hexagon.prototype.setRadius = function (val) {
        this.radius = val;
    };
    Hexagon.prototype.getValue = function () {
        return this.value;
    };
    Hexagon.prototype.setValue = function (val) {
        this.value = val;
    };
    return Hexagon;
}());
exports.Hexagon = Hexagon;
