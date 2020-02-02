import {Simulator} from "./Simulator";

let $ = require("jquery");

$(function(){
    let canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("renderCanvas"); // Get the canvas element
    let sim: Simulator = new Simulator(48, 48, canvas);
});
