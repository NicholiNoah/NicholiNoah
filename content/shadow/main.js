        // simplified version for geometries only because they don't require load.js
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
        // initialize MindAR 
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: '../../assets/targets/course-banner.mind',
    });
    const {renderer, scene, camera} = mindarThree;

        // create AR object
    const geometry = new THREE.PlaneGeometry(1, 1.25);
    const material = new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.5});
    const plane = new THREE.Mesh(geometry, material);

        // create anchor
    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(plane);

        // start AR
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});




        // import {loadGLTF} from "../../libs/loader.js";
// const THREE = window.MINDAR.IMAGE.THREE;

// document.addEventListener('DOMContentLoaded', () => {
//   const start = async() => {
//     const mindarThree = new window.MINDAR.IMAGE.MindARThree({
//       container: document.body,
//       imageTargetSrc: '../../assets/targets/musicband.mind'
//     });
//     const {renderer, scene, camera} = mindarThree;

//     const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
//     scene.add(light);

//     const raccoon = await loadGLTF('../../assets/models/musicband-raccoon/scene.gltf');
//     raccoon.scene.scale.set(0.1, 0.1, 0.1);
//     raccoon.scene.position.set(0, -0.4, 0);

//     const bear = await loadGLTF('../../assets/models/musicband-bear/scene.gltf');
//     bear.scene.scale.set(0.1, 0.1, 0.1);
//     bear.scene.position.set(0, -0.4, 0);

//     const raccoonAnchor = mindarThree.addAnchor(0);
//     raccoonAnchor.group.add(raccoon.scene);

//     const bearAnchor = mindarThree.addAnchor(1);
//     bearAnchor.group.add(bear.scene);

//     await mindarThree.start();
//     renderer.setAnimationLoop(() => {
//       renderer.render(scene, camera);
//     });
//   }
//   start();
// });
