import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';

document.addEventListener('DOMContentLoaded', () => {
const start = async() => {

	// preload images
	const imagesTotal = 16;
	const imageNum = Array.from({length: imagesTotal}, (value, index) => index.toString());

	const textureLoader = new THREE.TextureLoader();
	const textures = [];

	for (let i = 0; i < imageNum.length; i++) {
		const texture = textureLoader.load(`./assets/demoImages/image${imageNum[i]}.jpg`, (loadedTexture) => {
			console.log(`Image ${imageNum[i]} loaded successfully.`);
		});
	textures.push(texture);
	}

	// initialize MindAR
	const mindarThree = new MindARThree({
	container: document.body,
	imageTargetSrc: './assets/demoQRlinkAR.mind',
	uiScanning: "#scanning",
	});
	const {renderer, scene, camera} = mindarThree;

	// create AR object
	const geometry = new THREE.SphereGeometry(0.95, 32);
	const material = new THREE.MeshBasicMaterial({map: textures[0], transparent: true, opacity: 0});
	const plane = new THREE.Mesh(geometry, material);

	const geoCircle = new THREE.SphereGeometry(.75, 32);
	const matCircle = new THREE.MeshBasicMaterial({
	map: textures[ imagesTotal / 2 ],
	transparent: false,
	opacity: 1,
	side: THREE.BackSide
	});
	const circle = new THREE.Mesh(geoCircle, matCircle);
	circle.rotation.y -= THREE.MathUtils.degToRad(100);
	circle.scale.x = - 1;
	plane.add(circle);

	let touchStartX = 0;
	let touchEndX = 0;

	// Variables to control rotation speed
	const rotationSpeed = 0.01;

	// Event listeners for touch events on the document body
	document.body.addEventListener('touchstart', (event) => {
		const touch = event.touches[0];
		touchStartX = touch.clientX;
	});

	document.body.addEventListener('touchmove', (event) => {
		const touch = event.touches[0];
		touchEndX = touch.clientX;

		const deltaX = touchEndX - touchStartX;

		// Rotate the 'circle' mesh based on touch movement
		circle.rotation.y += deltaX * rotationSpeed;

		touchStartX = touchEndX;

		renderer.render(scene, camera);

		// Prevent default touchmove behavior
		event.preventDefault();
	});

	document.body.addEventListener('touchend', () => {
		// You can add any cleanup or additional logic here if needed
	});



		// create anchor
		const anchor = mindarThree.addAnchor(0);
		anchor.group.add(plane);
		// anchor.group.add(circle);

		// start AR
		await mindarThree.start();
		renderer.setAnimationLoop(() => {
		plane.lookAt(new THREE.Vector3());
		const axisY = plane.rotation.y;
		const axisX = - plane.rotation.x;

	const stepSize = Math.PI / 70;
	const numSteps = 16; // number of steps between -0.3 and 0.3

	// Adjusted view angle to 160 degrees
	const totalAngle = Math.PI * (160 / 180); // 160 degrees converted to radians

	// distribute and change images according to axisY rotation
	if (axisY <= -totalAngle / 2) {
		circle.material.map = textures[0];
		console.log("Displayed image: image0.jpg");
	} else if (axisY >= totalAngle / 2) {
		circle.material.map = textures[15];
		console.log("Displayed image: image15.jpg");
	} else {
		// Define a midpoint where image8.jpg should be displayed
		const midpoint = 0; // You can adjust this value as needed

		// Calculate the index based on the distance from the midpoint
		let distanceFromMidpoint = axisY - midpoint;

		// Calculate the index relative to the total angle and the number of images
		let index = Math.round((distanceFromMidpoint / totalAngle) * 15) + 8; // Add 8 to set image8.jpg as the midpoint

		// Ensure that the index stays within the valid range (0 to 15)
		if (index < 0) {
			index = 0;
		} else if (index > 15) {
			index = 15;
		}

		circle.material.map = textures[index];
		circle.rotation.x = axisX;
		console.log(`Displayed image: image${index}.jpg`);
	}

		renderer.render(scene, camera);
		});


	// Create an image element for the left button
	const leftBtnImage = document.createElement('img');
	leftBtnImage.src = './assets/buttons/btnOKContemp.png'; // Set the image source to your 'btn1.png' location
	leftBtnImage.alt = 'Click Here to PLAY Audio';
	leftBtnImage.classList.add('left-button'); // Add the responsive-button class

	// Create a new image element for the toggle indicator
	const toggleImage = document.createElement('img');
	toggleImage.src = './assets/buttons/new.png'; // Set the source for the new image
	toggleImage.style.display = 'none'; // Hide the new image by default

	// Reference the audio element and set the source
	const audio = new Audio('https://oklahomacontemporary.org/assets/files/Scheibe-10-joy-Harjo.m4a');
	let isPlaying = false; // Keep track of audio state

	// Add a click event listener to toggle play/stop
	leftBtnImage.addEventListener('click', () => {
		if (isPlaying) {
		// Stop the audio
		audio.pause();
		} else {
		// Play the audio
		audio.play();
		}
		isPlaying = !isPlaying; // Toggle the audio state
		toggleImage.style.display = isPlaying ? 'block' : 'none'; // Toggle the visibility of the indicator
	});

	// Define a variable to track whether the audio is playing
	let audioPlaying = false;

	// Add a click event listener to toggle the audio and change the image
	leftBtnImage.addEventListener('click', () => {
	// If the audio is not playing, start playing it
	if (!audioPlaying) {
		// Change the image source to 'new.png'
		leftBtnImage.src = './assets/buttons/voiceEva.png';

		// Play the audio
		audio.play();

		// Set the audioPlaying flag to true
		audioPlaying = true;

		// Add an event listener to reset the image when audio ends
		audio.addEventListener('ended', () => {
			// Change the image source back to 'btnOKContemp.png'
			leftBtnImage.src = './assets/buttons/btnOKContemp.png';

			// Set the audioPlaying flag to false
			audioPlaying = false;
		  });
	} else {
		// If the audio is already playing, stop it
		audio.pause();
		audio.currentTime = 0; // Reset the audio to the beginning

		// Change the image source back to 'logoOKContemp.png'
		leftBtnImage.src = './assets/buttons/btnOKContemp.png';

		// Set the audioPlaying flag to false
		audioPlaying = false;
	}
	});

	// Append the image element to the body
	document.body.appendChild(leftBtnImage);

	// Create an image element for the right button
	const rightBtnImage = document.createElement('img');
	rightBtnImage.src = './assets/buttons/initialsNNsunset.png'; // Set the image source for the right button
	rightBtnImage.alt = 'Click Here for Another Action';
	rightBtnImage.classList.add('left-button', 'right-button'); // Add classes for positioning

	// Add a click event listener for the right button (you can update the URL or action as needed)
	rightBtnImage.addEventListener('click', () => {
	  // Replace 'example.com/another-url' with the actual URL or action for the right button
	  const newWindow = window.open('https://nicholinoah.com/artwork', '_blank');
	  newWindow.focus();
	});

	// Append the right button element to the body
	document.body.appendChild(rightBtnImage);
  };
	start();
	});