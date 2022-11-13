const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    // initialize MindAR 
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: './shadow.mind',
    });
    const {renderer, scene, camera} = mindarThree;

    // create AR object
    const geoPlane = new THREE.PlaneGeometry(1, 1.25);
    const matPlane = new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.5});
    const plane = new THREE.Mesh(geoPlane, matPlane);
    
    
    const geoCube = new THREE.BoxGeometry(1, 1.25, 2.5); 
    const matCube = new THREE.MeshNormalMaterial({ wireframe: true }); 
    const cube = new THREE.Mesh(geoCube, matCube);
    cube.position.set(0, 0, -1.25);


    // create anchor
    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(plane, cube);

    // start AR
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});
