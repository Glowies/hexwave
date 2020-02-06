import * as BABYLON from "babylonjs";
import {HexGrid, HeightGrid, ScaleGrid, RotationGrid, RadiusGrid} from "./HexGrid";
import {Hexagon} from "./Hexagon";
import {Propagator, SourcePropagator} from "./Propagator";
import {
    WaveSource,
    SinusoidSource,
    SquareSource,
    SawtoothSource,
    TriangleSource,
    MicSource,
    WaveProperties, MouseSource
} from "./WaveSource";

export class Simulator {
    private _width: number;
    private _height: number;
    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _hexGrid: HexGrid;
    private _propagator: Propagator;

    constructor(width: number, height: number, canvas: HTMLCanvasElement){
        this._width = width;
        this._height = height;
        this._canvas = canvas;
        this._engine = new BABYLON.Engine(canvas, true);
        this._scene = this.createScene();
        this._hexGrid = this.createGrid();
        this._propagator = new SourcePropagator(this._hexGrid);

        this.addDefaultSources();

        this._engine.runRenderLoop(this.update.bind(this));

        window.addEventListener("resize", this._engine.resize.bind(this._engine));
    }

    private update(): void{
        this._scene.render();
        this._propagator.update(this._engine.getDeltaTime() / 1000.0);
    }

    private addDefaultSources(): void{
        let centerPosition: BABYLON.Vector3 = this._hexGrid.getHex(12,24).getPosition();
        let properties: WaveProperties = new WaveProperties(centerPosition, 1, -1, 40);

        // this._propagator.addSource(new SawtoothSource(properties, 0, .5, 2));
        this._propagator.addSource(new MouseSource(properties, 2));
        // this._propagator.addSource(new MicSource(properties, 128));
        // propagator.addSource(new SinusoidSource(new BABYLON.Vector3(0, 0, 17), 1, -1, 0, .5, 0.5));
        //  propagator.addSource(new SinusoidSource(new BABYLON.Vector3(20, 0, 0), 1, -1,0, .5, 2));
        //  propagator.addSource(new SinusoidSource(new BABYLON.Vector3(-20, 0, 0), 1, -1, 0, .5, 2));
    }

    private createScene(): BABYLON.Scene{
        let scene = new BABYLON.Scene(this._engine);

        scene.clearColor = new BABYLON.Color4(17/255,17/255,17/255, 1);
        // scene.clearColor = new BABYLON.Color4(94/255,140/255,166/255, 1);
        // scene.clearColor = new BABYLON.Color4(0,0,0, 1); black

        let camera = new BABYLON.ArcRotateCamera("Camera", -1.7370507197243723, 0.8659740084092771, 100, new BABYLON.Vector3(0,-10,0), scene);
        //camera.attachControl(this._canvas, true);

        let keyLight = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(1, -2, 0.4), scene);
        keyLight.intensity = 0.7;
        let fillLight = new BABYLON.DirectionalLight("light2", new BABYLON.Vector3(-0.4, -1, 1), scene);
        fillLight.intensity = 0.3;
        let rimLight = new BABYLON.DirectionalLight("light3", new BABYLON.Vector3(0, -1, -1), scene);
        rimLight.intensity = 0.4;
        let ambientLight = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), scene);
        ambientLight.intensity = 0.3;


        return scene;
    }

    private createGrid(): HexGrid{
        let zeroHex = Hexagon.ZeroHex();
        return new ScaleGrid(this._width, this._height, 3, 1, zeroHex, this._scene);
    }

    // private showWorldAxis(size: number, scene: BABYLON.Scene): void{
    //     let axisX = BABYLON.Mesh.CreateLines("axisX", [
    //         BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
    //         new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
    //     ], scene);
    //     axisX.color = new BABYLON.Color3(1, 0, 0);
    //     let axisY = BABYLON.Mesh.CreateLines("axisY", [
    //         BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( -0.05 * size, size * 0.95, 0),
    //         new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( 0.05 * size, size * 0.95, 0)
    //     ], scene);
    //     axisY.color = new BABYLON.Color3(0, 1, 0);
    //     let axisZ = BABYLON.Mesh.CreateLines("axisZ", [
    //         BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
    //         new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
    //     ], scene);
    //     axisZ.color = new BABYLON.Color3(0, 0, 1);
    // }
}