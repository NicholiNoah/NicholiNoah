import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';

document.addEventListener('DOMContentLoaded', () => {
  const start = async () => {
    // images
    const imagesTotal = 16;
    const imageNum = Array.from({ length: imagesTotal }, (value, index) => index.toString());

    const textureLoader = new THREE.TextureLoader();
    const textures = [];

    for (let i = 0; i < imageNum.length; i++) {
      const texture = textureLoader.load(`./assets/selects/image${imageNum[i]}.jpg`, (loadedTexture) => {
        loadedTexture.encoding = THREE.sRGBEncoding;
      });

      textures.push(texture);
    }

    // target
    const mindarThree = new MindARThree({
      container: document.body,
      imageTargetSrc: './assets/wintercard.mind',
      uiScanning: "#scanning",
    });
    const { renderer, scene, camera } = mindarThree;

    const geometry = new THREE.SphereGeometry(0.95, 32);
    const material = new THREE.MeshBasicMaterial({ map: textures[0], transparent: true, opacity: 0 });
    const plane = new THREE.Mesh(geometry, material);

    const geoCircle = new THREE.SphereGeometry(.75, 32);
    const matCircle = new THREE.MeshBasicMaterial({
      map: textures[imagesTotal / 2],
      transparent: false,
      opacity: 1,
      side: THREE.BackSide
    });
    const circle = new THREE.Mesh(geoCircle, matCircle);
    circle.rotation.y -= THREE.MathUtils.degToRad(65);
    circle.scale.x = -1;
    plane.add(circle);

    // interaction
    let isDragging = false;
    let previousX = 0;

    const rotationSpeed = 0.01;

    const dragStart = (event) => {
      isDragging = true;
      previousX = event.clientX || event.touches[0].clientX;
    };

    const dragEnd = () => {
      isDragging = false;
    };

    const dragMove = (event) => {
      if (isDragging) {
        const currentX = event.clientX || event.touches[0].clientX;
        const deltaX = currentX - previousX;

        circle.rotation.y += deltaX * rotationSpeed;

        previousX = currentX;

        renderer.render(scene, camera);
      }
    };

    document.body.addEventListener('mousedown', dragStart);
    document.body.addEventListener('mouseup', dragEnd);
    document.body.addEventListener('mousemove', dragMove);
    document.body.addEventListener('touchstart', dragStart);
    document.body.addEventListener('touchend', dragEnd);
    document.body.addEventListener('touchmove', dragMove);

    // target
    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(plane);

    anchor.onTargetFound = () => {
      console.log("target found");
      leftBtnImage.style.display = 'block';
      rightBtnImage.style.display = 'block';
      setTimeout(displayIconHand, 3000);
    };

    anchor.onTargetLost = () => {
      console.log("target lost");
      leftBtnImage.style.display = 'none';
      rightBtnImage.style.display = 'none'; // Added missing ".style"
    };

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      plane.lookAt(new THREE.Vector3());
      const axisY = plane.rotation.y;
      const axisX = -plane.rotation.x;

      const stepSize = Math.PI / 70;
      const numSteps = 16;
      const totalAngle = Math.PI * (65 / 180);

      if (axisY <= -totalAngle / 2) {
        circle.material.map = textures[0];
      } else if (axisY >= totalAngle / 2) {
        circle.material.map = textures[15];
      } else {
        const midpoint = 0;
        let distanceFromMidpoint = axisY - midpoint;
        let index = Math.round((distanceFromMidpoint / totalAngle) * 15) + 8;
        if (index < 0) {
          index = 0;
        } else if (index > 15) {
          index = 15;
        }
        circle.material.map = textures[index];
        circle.rotation.x = axisX;
      }
      renderer.render(scene, camera);
    });

    // buttons
    const leftBtnImage = document.createElement('img');
    leftBtnImage.src = './assets/buttons/btnOKContemp.png';
    leftBtnImage.alt = 'Click Here to PLAY Audio';
    leftBtnImage.classList.add('left-button');
    leftBtnImage.style.display = 'none';

    const toggleImage = document.createElement('img');
    toggleImage.src = './assets/buttons/voiceEva.png';
    toggleImage.style.display = 'none';

    const audio = new Audio('https://oklahomacontemporary.org/assets/files/Scheibe08.m4a');
    let isPlaying = false;

    leftBtnImage.addEventListener('click', () => {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      isPlaying = !isPlaying;
      toggleImage.style.display = isPlaying ? 'block' : 'none';
    });

    let audioPlaying = false;

    leftBtnImage.addEventListener('click', () => {
      if (!audioPlaying) {
        leftBtnImage.src = './assets/buttons/voiceEva.png';
        audio.play();
        audioPlaying = true;
        audio.addEventListener('ended', () => {
          leftBtnImage.src = './assets/buttons/btnOKContemp.png';
          audioPlaying = false;
        });
      } else {
        audio.pause();
        audio.currentTime = 0;
        leftBtnImage.src = './assets/buttons/btnOKContemp.png';
        audioPlaying = false;
      }
    });

    const rightBtnImage = document.createElement('img');
    rightBtnImage.src = './assets/buttons/initialsNNsunset.png';
    rightBtnImage.alt = 'Click Here for Another Action';
    rightBtnImage.classList.add('left-button', 'right-button');
    rightBtnImage.style.display = 'none';

    rightBtnImage.addEventListener('click', () => {
      const newWindow = window.open('https://nicholinoah.com/artwork', '_blank');
      newWindow.focus();
    });

    document.body.appendChild(leftBtnImage);
    document.body.appendChild(rightBtnImage);

// iconHand
const displayIconHand = () => {
	const iconHandTexture = textureLoader.load('./assets/accessible/handCard.png', (loadedTexture) => {
	  loadedTexture.encoding = THREE.sRGBEncoding;
	});

	// Create iconHand object
	const iconHandGEO = new THREE.PlaneGeometry(0.4, 0.25);
	const iconHandMAT = new THREE.MeshBasicMaterial({ map: iconHandTexture, side: THREE.DoubleSide, alphaTest: 0.5 });
	const iconHand = new THREE.Mesh(iconHandGEO, iconHandMAT);
	plane.add(iconHand);

	iconHand.position.set(0, 0, 0);

	// Rotation parameters
	const maxSwing = 60 * (Math.PI / 180); // Maximum swing in radians
	const duration = 3000; // 3 seconds for a full swing
	const startTime = Date.now();

	// Function to animate the iconHand
	function animateIconHand() {
	  const currentTime = Date.now();
	  const elapsedTime = currentTime - startTime;
	  const angle = (Math.sin((elapsedTime / duration) * Math.PI * 2) * 0.5 + 0.5) * maxSwing;

	  // Apply rotation to the iconHand
	  iconHand.rotation.y = angle;

	  // Render the scene
	  renderer.render(scene, camera);

	  // Request the next animation frame
	  requestAnimationFrame(animateIconHand);
	}

	// Start the animation
	animateIconHand();
  };

};

  start();
});
