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
	  if (!plane.children.includes(iconHand)) {
		plane.add(iconHand);
	  }

	  iconHand.visible = true;

	  // Rotation parameters
	  const swingStart = -1 * 45 * (Math.PI / 180);
	  const swingEnd = 1 * 45 * (Math.PI / 180);
	  const duration = 2000;
	  const startTime = Date.now();

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


  // Function to animate the iconHand
  function animateIconHand() {
	const currentTime = Date.now();
	const elapsedTime = currentTime - startTime;

	// Find the relevant keyframes
	let keyframe1, keyframe2;
	for (let i = 0; i < keyframes.length - 1; i++) {
		if (elapsedTime >= keyframes[i].time && elapsedTime < keyframes[i + 1].time) {
			keyframe1 = keyframes[i];
			keyframe2 = keyframes[i + 1];
			break;
		}
	}

	// Interpolate between keyframes
	const deltaTime = keyframe2.time - keyframe1.time;
	const progress = (elapsedTime - keyframe1.time) / deltaTime;
	const angle = lerp(keyframe1.angle, keyframe2.angle, progress);

	// Apply rotation to the iconHand
	iconHand.rotation.y = angle;

	// Render the scene
	renderer.render(scene, camera);

	// Request the next animation frame
	requestAnimationFrame(animateIconHand);

	// Check if the animation has completed and reset it
	if (elapsedTime >= duration + 1500) {
		startTime = currentTime;
	}
}

// Linear interpolation function
function lerp(a, b, t) {
	return a + (b - a) * t;
}

// Start the animation
animateIconHand();



	};