let $ = require("jquery");
import * as BABYLON from "babylonjs";
import {HexGrid, HeightGrid, ScaleGrid, RotationGrid, RadiusGrid} from "./HexGrid";
import {Hexagon} from "./Hexagon";

$(function(){
    let canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("renderCanvas"); // Get the canvas element
    let engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

    let createScene = function () {
        let scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);
        let camera = new BABYLON.ArcRotateCamera("Camera", -1.780818897873594, 0.7163083210065703, 100, new BABYLON.Vector3(0,-10,0), scene);
        camera.attachControl(canvas, true);

        let keyLight = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(1, -2, 0.4), scene);
        keyLight.intensity = 0.7;
        let fillLight = new BABYLON.DirectionalLight("light2", new BABYLON.Vector3(-0.4, -1, 1), scene);
        fillLight.intensity = 0.3;
        let rimLight = new BABYLON.DirectionalLight("light3", new BABYLON.Vector3(0, -1, -1), scene);
        rimLight.intensity = 0.4;
        let ambientLight = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), scene);
        ambientLight.intensity = 0.3;

        showWorldAxis(10, scene);

        let zeroHex = Hexagon.ZeroHex();
        let hexes: HexGrid = new RadiusGrid(32, 32, undefined, undefined, zeroHex, scene);

        for(let i=0; i<32; i++){
            for(let j=0; j<32; j++){
                hexes.setHexValue(i, j, Math.sin(i+j/5));
            }
        }

        return scene;
    };

    let scene = createScene();

    engine.runRenderLoop(function () {
        scene.render();
    });

    window.addEventListener("resize", function () {
        engine.resize();
    });
})

function showWorldAxis(size: number, scene: BABYLON.Scene) {
    let axisX = BABYLON.Mesh.CreateLines("axisX", [
        BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
        new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
    ], scene);
    axisX.color = new BABYLON.Color3(1, 0, 0);
    let axisY = BABYLON.Mesh.CreateLines("axisY", [
        BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( -0.05 * size, size * 0.95, 0),
        new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( 0.05 * size, size * 0.95, 0)
    ], scene);
    axisY.color = new BABYLON.Color3(0, 1, 0);
    var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
        BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
        new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
    ], scene);
    axisZ.color = new BABYLON.Color3(0, 0, 1);
};