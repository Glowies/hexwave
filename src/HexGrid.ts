import * as BABYLON from "babylonjs";

export class HexGrid {
    grid: Hexagon[][];
    hexRadius: number;
    coefficient: number;

    constructor(width: number, height: number, hexRadius: number, coef: number, scene: BABYLON.Scene){
        this.coefficient = coef;
        this.hexRadius = hexRadius;
        this.grid = [];
        for(let i=0; i<width; i++){
            this.grid[i] = [];
            for(let j=0; j<height; j++){
                let hexHeight = 1;
                let zero: [number, number] = [
                    -hexRadius*Math.sqrt(3)*(2*width + 1)/4,
                    3*hexRadius*height/4
                ];
                let offset: [number, number] = [
                    ((i + j/2) % width) * hexRadius*Math.sqrt(3),
                    -j*hexRadius*3/2
                ];
                let position: [number, number] = [
                    zero[0] + offset[0],
                    zero[1] + offset[1]
                ]
                this.grid[i][j] = new Hexagon(position, hexRadius, 0.5 + hexHeight * (Math.cos(i*Math.PI / height * 4) + Math.sin(j*Math.PI / height * 4)), scene);
            }
        }
    }

}

export class Hexagon {
    position: [number, number];
    radius: number;
    height: number;
    mesh: BABYLON.Mesh;

    constructor(position: [number, number], radius: number, height: number, scene: BABYLON.Scene){
        this.position = position;
        this.radius = radius;
        this.height = height;
        this.mesh = this.createMesh(scene);
    }

    createMesh(scene: BABYLON.Scene): BABYLON.Mesh{
        let mesh = BABYLON.MeshBuilder.CreateCylinder("gridHex",
            {height: this.height, diameter: this.radius * 1.8, tessellation: 6},
            scene);
        mesh.position = new BABYLON.Vector3(this.position[0], 0, this.position[1]);

        // Rotate hexagon prism by 30 degrees around the y axis
        let axis = new BABYLON.Vector3(0, 1, 0);
        let angle = Math.PI / 6;
        let quaternion = BABYLON.Quaternion.RotationAxis(axis, angle);
        mesh.rotationQuaternion = quaternion;

        // Highlight the edges of the hexagon
        mesh.enableEdgesRendering();
        mesh.edgesWidth = 1.0;
        mesh.edgesColor = new BABYLON.Color4(1.00, 0.72, 0.77, 1);

        return mesh;
    }
}