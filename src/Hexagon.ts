import * as BABYLON from "babylonjs";

export class HexagonWrapper {
    hex: Hexagon;
    mesh: BABYLON.Mesh;

    constructor(hex: Hexagon, scene: BABYLON.Scene) {
        this.hex = hex;
        this.mesh = this.createMesh(scene);
    }

    createMesh(scene: BABYLON.Scene): BABYLON.Mesh {
        let mesh = BABYLON.MeshBuilder.CreateCylinder("gridHex",
            {height: 1, diameter: 1, tessellation: 6},
            scene);
        this.mesh = mesh;

        this.updateMesh();

        // Highlight the edges of the hexagon
        mesh.enableEdgesRendering();
        mesh.edgesWidth = 1.0;
        mesh.edgesColor = new BABYLON.Color4(1.00, 0.72, 0.77, 1);

        return mesh;
    }

    updateMesh(): void {
        this.updateMeshHeight();
        this.updateMeshRadius();
        this.updateMeshPosition();
        this.updateMeshRotation();
    }

    updateMeshHeight(): void {
        this.mesh.scaling.y = this.hex.getHeight();
    }

    updateMeshRadius(): void {
        this.mesh.scaling.x = this.hex.getRadius() * 2;
        this.mesh.scaling.z = this.hex.getRadius() * 2;
    }

    updateMeshPosition(): void {
        this.mesh.position = this.hex.getPosition();
    }

    updateMeshRotation(): void {
        let axis = new BABYLON.Vector3(0, 1, 0);
        let quaternion = BABYLON.Quaternion.RotationAxis(axis, this.hex.getRotation() + Math.PI/6);
        this.mesh.rotationQuaternion = quaternion;
    }

    setHeight(height: number): void {
        this.hex.setHeight(height);
        this.updateMeshHeight();
    }

    setRotation(rot: number): void {
        this.hex.setRotation(rot);
        this.updateMeshRotation();
    }

    setRadius(r: number): void {
        this.hex.setRadius(r);
        this.updateMeshRadius();
    }

    setPosition(pos: BABYLON.Vector3): void {
        this.hex.setPosition(pos);
        this.updateMeshPosition();
    }
}

export class Hexagon {
    position: BABYLON.Vector3;
    height: number;
    rotation: number;
    radius: number;
    value: number;

    static ZeroHex(): Hexagon {
        return new Hexagon(BABYLON.Vector3.Zero(), 1, 0, 0.1, 0);
    }

    static Copy(hex: Hexagon): Hexagon {
        return new Hexagon(
            hex.getPosition(),
            hex.getHeight(),
            hex.getRotation(),
            hex.getRadius(),
            hex.getValue()
        );
    }

    constructor(position: BABYLON.Vector3, height: number, rotation: number, radius: number, value: number) {
        this.position = position;
        this.height = height;
        this.rotation = rotation;
        this.radius = radius;
        this.value = value;
    }

    getPosition(): BABYLON.Vector3 {
        return this.position;
    }
    setPosition(val: BABYLON.Vector3): void {
        this.position = val;
    }

    getHeight(): number {
        return this.height;
    }
    setHeight(val: number): void {
        this.height = val;
    }

    getRotation(): number {
        return this.rotation;
    }
    setRotation(val: number): void {
        this.rotation = val;
    }

    getRadius(): number {
        return this.radius;
    }
    setRadius(val: number): void {
        this.radius = val;
    }

    getValue(): number {
        return this.value;
    }
    setValue(val: number): void {
        this.value = val;
    }
}