"use strict";
exports.__esModule = true;
var $ = require("jquery");
var BABYLON = require("babylonjs");
var HexGrid_1 = require("./HexGrid");
var Hexagon_1 = require("./Hexagon");
var Propagator_1 = require("./Propagator");
var WaveSource_1 = require("./WaveSource");
$(function () {
    var canvas = document.getElementById("renderCanvas"); // Get the canvas element
    var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
    var propagator;
    var createScene = function () {
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);
        var camera = new BABYLON.ArcRotateCamera("Camera", -1.780818897873594, 0.7163083210065703, 100, new BABYLON.Vector3(0, -10, 0), scene);
        camera.attachControl(canvas, true);
        var keyLight = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(1, -2, 0.4), scene);
        keyLight.intensity = 0.7;
        var fillLight = new BABYLON.DirectionalLight("light2", new BABYLON.Vector3(-0.4, -1, 1), scene);
        fillLight.intensity = 0.3;
        var rimLight = new BABYLON.DirectionalLight("light3", new BABYLON.Vector3(0, -1, -1), scene);
        rimLight.intensity = 0.4;
        var ambientLight = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), scene);
        ambientLight.intensity = 0.3;
        //showWorldAxis(10, scene);
        var zeroHex = Hexagon_1.Hexagon.ZeroHex();
        var hexes = new HexGrid_1.HeightGrid(48, 48, undefined, undefined, zeroHex, scene);
        propagator = new Propagator_1.SourcePropagator(hexes);
        propagator.addSource(new WaveSource_1.SawtoothSource(new BABYLON.Vector3(0, 0, 0), 1, -1, 0, -1, 0.4));
        //propagator.addSource(new SinusoidSource(new BABYLON.Vector3(20, 0, 0), 0, -1,0, .5, 1));
        //propagator.addSource(new SinusoidSource(new BABYLON.Vector3(-20, 0, 0), 0, -1, 0, .5, 1));
        return scene;
    };
    var scene = createScene();
    engine.runRenderLoop(function () {
        scene.render();
        propagator.update(engine.getDeltaTime() / 1000.0);
        //console.log(engine.getFps());
    });
    window.addEventListener("resize", function () {
        engine.resize();
    });
});
function showWorldAxis(size, scene) {
    var axisX = BABYLON.Mesh.CreateLines("axisX", [
        BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
        new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
    ], scene);
    axisX.color = new BABYLON.Color3(1, 0, 0);
    var axisY = BABYLON.Mesh.CreateLines("axisY", [
        BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
        new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
    ], scene);
    axisY.color = new BABYLON.Color3(0, 1, 0);
    var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
        BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
        new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, 0.05 * size, size * 0.95)
    ], scene);
    axisZ.color = new BABYLON.Color3(0, 0, 1);
}
