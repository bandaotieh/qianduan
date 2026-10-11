import * as THREE from "three";
export default class MeshLine{
         public mesh: any; 
         public geometry: any; 
         public material: any; 
    
    constructor(geometry : any ){

     const edges = new THREE.EdgesGeometry(geometry)
     const material = new THREE.LineBasicMaterial({ color: 0xffffff });
    const line = new THREE.LineSegments(edges, material);
  this.material = material;

  this.geometry = edges;
    this.mesh = line;
    }
}