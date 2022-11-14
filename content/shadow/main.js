const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    // initialize MindAR 
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: './shadow.mind',
    });
    const {renderer, scene, camera} = mindarThree;

    const raccoon = await loadGLTF('../../assets/models/circle-warp/circle-warp.gltf');
    raccoon.scene.scale.set(2.54, 2.54, 2.54);
    raccoon.scene.position.set(0, 0, 0);

    // // create AR object
    // const geoPlane = new THREE.PlaneGeometry(1, 1.25);
    // const matPlane = new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.5});
    // const plane = new THREE.Mesh(geoPlane, matPlane);
    
    
    // const geoCube = new THREE.BoxGeometry(1, 1.25, 2.5); 
    // const matCube = new THREE.MeshNormalMaterial({ wireframe: true }); 
    // const cube = new THREE.Mesh(geoCube, matCube);
    // cube.position.set(0, 0, -1.25);

    //     const quaternion = new THREE.Quaternion(); quaternion.setFromAxisAngle( 
    //     new THREE.Vector3(0, 1, 0), 
    //     Math.PI / 2 
    //   );  const vector = new THREE.Vector3(1, 0, 0); vector.applyQuaternion(quaternion);

    //   twist(cube) {
    //     const quaternion = new THREE.Quaternion();
      
    //     for (let i = 0; i < cube.vertices.length; i++) {
    //       // a single vertex Y position
    //       const yPos = cube.vertices[i].y;
    //       const twistAmount = 10;
    //       const upVec = new THREE.Vector3(0, 1, 0);
      
    //       quaternion.setFromAxisAngle(
    //         upVec, 
    //         (Math.PI / 180) * (yPos / twistAmount)
    //       );
      
    //       cube.vertices[i].applyQuaternion(quaternion);
    //     }
        
    //     // tells Three.js to re-render this mesh
    //     cube.verticesNeedUpdate = true;
    //   }


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
