import * as BABYLON from "babylonjs";

export class HexagonWrapper {
    hex: Hexagon;
    mesh: BABYLON.Mesh;
    value: number;

    constructor(hex: Hexagon, scene: BABYLON.Scene) {
        this.hex = hex;
        this.mesh = this.createMesh(scene);
        this.value = 0;
    }

    createMesh(scene: BABYLON.Scene): BABYLON.Mesh {
        let mesh = BABYLON.MeshBuilder.CreateCylinder("gridHex",
            {height: 1, diameter: 1, tessellation: 6},
            scene);
        this.mesh = mesh;

        var material = new BABYLON.StandardMaterial("sibel", scene);
        material.alpha = 1;

        material.diffuseColor = new BABYLON.Color3(190/255,190/255,190/255);
        // material.diffuseColor = new BABYLON.Color3(255/255,158/255,161/255);
        // material.diffuseColor = new BABYLON.Color3(1.00,0.08,0.58);
        // material.diffuseColor = new BABYLON.Color3(207/255,127/255,130/255);
        material.specularColor = new BABYLON.Color3(0,0,0);
        mesh.material = material;

        this.updateMesh();

        // Highlight the edges of the hexagon
        //mesh.enableEdgesRendering();
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
        this.mesh.rotationQuaternion = BABYLON.Quaternion.RotationAxis(axis, this.hex.getRotation() + Math.PI/6);
    }

    getHeight(): number {
        return this.hex.getHeight();
    }
    setHeight(height: number): void {
        this.hex.setHeight(height);
        this.updateMeshHeight();
    }

    getRotation(): number {
        return this.hex.getRotation();
    }
    setRotation(rot: number): void {
        this.hex.setRotation(rot);
        this.updateMeshRotation();
    }

    getRadius(): number {
        return this.hex.getRadius();
    }
    setRadius(r: number): void {
        this.hex.setRadius(r);
        this.updateMeshRadius();
    }

    getPosition(): BABYLON.Vector3 {
        return this.hex.getPosition();
    }
    setPosition(pos: BABYLON.Vector3): void {
        this.hex.setPosition(pos);
        this.updateMeshPosition();
    }

    getValue(): number {
        return this.value;
    }
    setValue(val: number): void {
        this.value = val;
    }
}

export class Hexagon {
    position: BABYLON.Vector3;
    height: number;
    rotation: number;
    radius: number;
    value: number;

    static ZeroHex(): Hexagon {
        return new Hexagon(BABYLON.Vector3.Zero(), 0.5, 0, 1, 0);
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
