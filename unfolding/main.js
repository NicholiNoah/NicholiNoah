const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    // initialize MindAR 
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: './assets/textures/unfoldingQR.mind',
    });
    const {renderer, scene, camera} = mindarThree;

    // preload images
    const imagesTotal = 16;
    const imageNum = Array.from({length: imagesTotal}, (value, index) => index.toString());
    
    const textureLoader = new THREE.TextureLoader();
    const textures = [];
    
    for (let i = 0; i < imageNum.length; i++) {
      const texture = textureLoader.load(`./assets/textures/image${imageNum[i]}.jpg`);
      textures.push(texture);
    }
    
    // create AR object
    const geometry = new THREE.SphereGeometry(0.95, 32);
    const material = new THREE.MeshBasicMaterial({map: textures[0], transparent: true, opacity: 0});
    const plane = new THREE.Mesh(geometry, material);

const geoCircle = new THREE.SphereGeometry(1, 32);
const matCircle = new THREE.MeshBasicMaterial({
  map: textures[0],
  transparent: false,
  opacity: 1,
  side: THREE.BackSide
});
const circle = new THREE.Mesh(geoCircle, matCircle);
circle.rotation.y -= THREE.Math.degToRad(270);
// circle.position.y += .5;





    // create anchor
    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(plane);
    anchor.group.add(circle);
    
    // start AR
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      plane.lookAt(new THREE.Vector3());
      const axisY = plane.rotation.y;

const stepSize = 0.025; // size of each step between -0.3 and 0.3
const numSteps = 16; // number of steps between -0.3 and 0.3

// distribute and change images according to axisY rotation 
if (axisY <= -0.3) {
  circle.material.map = textures[0];
} else if (axisY > 0.3) {
  circle.material.map = textures[15];
} else {
  const index = Math.floor((axisY + 0.3) / stepSize);
  circle.material.map = textures[index];
}


    
      renderer.render(scene, camera);
    });
    

    
  }
  start();
});
