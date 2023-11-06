import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';

document.addEventListener('DOMContentLoaded', () => {

	const start = async () => {

// IMAGES
    const imagesTotal = 16;
    const imageNum = Array.from({ length: imagesTotal }, (value, index) => index.toString());

    const textureLoader = new THREE.TextureLoader();
    const textures = [];

    for (let i = 0; i < imageNum.length; i++) {
      const texture = textureLoader.load(`./assets/selects/image${imageNum[i]}.jpg`, (loadedTexture) => {
        loadedTexture.colorSpace = THREE.SRGBColorSpace;
      });

      textures.push(texture);
    }


// TARGET
    const mindarThree = new MindARThree({
      container: document.body,
      imageTargetSrc: './assets/wintercard.mind',
      uiScanning: "#scanning",
    });
    const { renderer, scene, camera } = mindarThree;

    const geometry = new THREE.PlaneGeometry(1, 1);
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


// INTERACTION
    let isDragging = false;
    let previousX = 0;

    const rotationSpeed = 0.01;

    const dragStart = (event) => {
      isDragging = true;
	  swipeCheck = true;
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

		if (activateAnimation){
			deactivateAnimation();
		}

      }
    };

    document.body.addEventListener('mousedown', dragStart);
    document.body.addEventListener('mouseup', dragEnd);
    document.body.addEventListener('mousemove', dragMove);
    document.body.addEventListener('touchstart', dragStart);
    document.body.addEventListener('touchend', dragEnd);
    document.body.addEventListener('touchmove', dragMove);


// ANCHOR

	let rotationCheck = false;
	let swipeCheck = false;

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(plane);

	anchor.onTargetFound = () => {
		console.log("target found");
		leftBtnImage.style.display = 'block';
		rightBtnImage.style.display = 'block';

		if (rotationCheck == false) {
		  iconHandDelay = setTimeout(displayIconHand, 3000);
		} else {
		  console.log("Rotation is true.");
			if (iconHandDelay) {
				console.log("Clearing iconHandDelay.");
				clearTimeout(iconHandDelay);
				iconHandDelay = null; // Clear the timeout and reset the variable
			}
		}

	  };



    anchor.onTargetLost = () => {
      console.log("target lost");
      leftBtnImage.style.display = 'none';
      rightBtnImage.style.display = 'none';
	  clearTimeout(iconHandDelay);
	  iconHand.visible = false;

    };

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      plane.lookAt(new THREE.Vector3());
      const axisY = plane.rotation.y;
      const axisX = -plane.rotation.x;

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

		if (circle.material.map === textures[3] || circle.material.map === textures[11]) {
			rotationCheck = true;
		  }
		  console.log(rotationCheck);

      }
      renderer.render(scene, camera);


    });


// BUTTONS
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

	  console.log('Toggling captions with isPlaying:', isPlaying);
	  toggleCaptions(isPlaying);
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


// HAND ICON
	const iconHandTexture = textureLoader.load('./assets/accessible/handCard.png', (loadedTexture) => {
		console.log(iconHandTexture);
	});

	let iconHandDelay = null;
	// Create iconHand object
	const iconHandGEO = new THREE.PlaneGeometry(0.4, 0.25);
	const iconHandMAT = new THREE.MeshBasicMaterial({ map: iconHandTexture, side: THREE.DoubleSide, alphaTest: 0.5 });
	const iconHand = new THREE.Mesh(iconHandGEO, iconHandMAT);
	iconHand.visible = false;

	const displayIconHand = () => {

		  // Create a variable to keep track of the iconHand animation request
		  let animationRequestId = null;

	  if (!plane.children.includes(iconHand)) {
		plane.add(iconHand);
	  }

	  iconHand.visible = true;

	  // Rotation parameters
	  const swingStart = -1 * 45 * (Math.PI / 180);
	  const swingEnd = 1 * 45 * (Math.PI / 180);
	  const duration = 3000;
	  let startTime = Date.now();

	  // Function to animate the iconHand
		// Define the midSwingCenter
		const swingCenter = swingStart + ((swingEnd - swingStart) / 2);

		// Define keyframes for the motion pattern with midSwingCenter
		const segment = duration / 10;
		const keyframes = [
			{ time: 0, angle: swingCenter },
			{ time: segment, angle: swingCenter },
			{ time: 2 * segment, angle: swingStart },
			{ time: 4 * segment, angle: swingEnd },
			{ time: 6 * segment, angle: swingStart },
			{ time: 8 * segment, angle: swingEnd },
			{ time: 9 * segment, angle: swingCenter },
			{ time: duration + 1000, angle: swingCenter },
		];


		// Linear interpolation function
		function lerp(a, b, t) {
		return a + (b - a) * t;
  }

  // Function to animate the iconHand
  function animateIconHand() {
	const currentTime = Date.now();
	const elapsedTime = currentTime - startTime;

    if (rotationCheck) {
      // If rotationCheck is true, stop the animation and remove the iconHand
      cancelAnimationFrame(animationRequestId); // Stop the animation
      iconHand.visible = false; // Hide the iconHand

	  if (!swipeCheck) {
		console.log("swipeCheck OFF");
		iconSwipeDelay = setTimeout(activateAnimation, 5000);
	}
      return;
    }

	// Check if animation duration is completed, then reset
	if (elapsedTime >= duration + 1500) {
		startTime = currentTime;
	  } else {
		// Find the relevant keyframes based on elapsed time
		let keyframe1, keyframe2;
		for (let i = 0; i < keyframes.length - 1; i++) {
		  if (elapsedTime >= keyframes[i].time && elapsedTime < keyframes[i + 1].time) {
			keyframe1 = keyframes[i];
			keyframe2 = keyframes[i + 1];
			break;
		  }
		}

		if (keyframe1 && keyframe2) { // Check if keyframes are defined
		  // Interpolate between keyframes
		  const deltaTime = keyframe2.time - keyframe1.time;
		  const progress = (elapsedTime - keyframe1.time) / deltaTime;
		  const angle = lerp(keyframe1.angle, keyframe2.angle, progress);

		  // Apply rotation to the iconHand
		  iconHand.rotation.y = angle;
		}
	  }

	  // Render the scene
	  renderer.render(scene, camera);

	  // Request the next animation frame
	  requestAnimationFrame(animateIconHand);
	}

	// Start the animation
	animateIconHand();
	};


// SWIPE
let iconSwipeDelay = null;
let isAnimationActive = false;

function activateAnimation() {
    // Add the necessary CSS properties to start the animation
    swipeContainer.style.opacity = 1;
    swipeContainer.style.animationPlayState = "running";
    cssAnimationActive = true; // Activate the CSS animation
}

function deactivateAnimation() {
    // Reset the CSS properties to stop the animation
    swipeContainer.style.opacity = 0;
    swipeContainer.style.animationPlayState = "paused";
    cssAnimationActive = false; // Deactivate the CSS animation
}


const swipeContainer = document.querySelector(".swipe-container-styles");

function activateAnimation() {
    // Add the necessary CSS properties to start the animation
    swipeContainer.style.opacity = 1;
    swipeContainer.style.animationPlayState = "running";
}

function deactivateAnimation() {
    // Reset the CSS properties to stop the animation
    swipeContainer.style.opacity = 0;
    swipeContainer.style.animationPlayState = "paused";
}

// Activate the animation when isAnimationActive is true
if (isAnimationActive) {
    activateAnimation();
}


    // Function to activate and deactivate captions
    function toggleCaptions(isPlaying) {
		const captions = document.querySelectorAll('.captions p');

		if (isPlaying) {
		  audio.addEventListener('timeupdate', function () {
			const currentTime = Math.floor(audio.currentTime);
			captions.forEach(caption => {
			  const captionTime = parseInt(caption.dataset.time);
			  if (currentTime === captionTime) {
				hideCaptions();
				caption.style.display = 'block';
			  }
			});
		  });
		} else {
		  hideCaptions();
		}
	  }

	  // Event listener for audio play/pause
	  audio.addEventListener('play', function () {
		isPlaying = true;
		toggleCaptions(isPlaying);
	  });

	  audio.addEventListener('pause', function () {
		isPlaying = false;
		toggleCaptions(isPlaying);
	  });


};

  start();
});
