import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';

document.addEventListener('DOMContentLoaded', () => {
const start = async() => {

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

	const mindarThree = new MindARThree({
	container: document.body,
	imageTargetSrc: './assets/demoQRlinkAR.mind',
	uiScanning: "#scanning",
	});
	const {renderer, scene, camera} = mindarThree;

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

	const rotationSpeed = 0.01;

	document.body.addEventListener('touchstart', (event) => {
		const touch = event.touches[0];
		touchStartX = touch.clientX;
	});

	document.body.addEventListener('touchmove', (event) => {
		const touch = event.touches[0];
		touchEndX = touch.clientX;

		const deltaX = touchEndX - touchStartX;

		circle.rotation.y += deltaX * rotationSpeed;

		touchStartX = touchEndX;

		renderer.render(scene, camera);

		event.preventDefault();
	});

	document.body.addEventListener('touchend', () => {
		// add additional logic here
	});


		const anchor = mindarThree.addAnchor(0);
		anchor.group.add(plane);

		await mindarThree.start();
		renderer.setAnimationLoop(() => {
		plane.lookAt(new THREE.Vector3());
		const axisY = plane.rotation.y;
		const axisX = - plane.rotation.x;

	const stepSize = Math.PI / 70;
	const numSteps = 16;

	const totalAngle = Math.PI * (160 / 180);

	if (axisY <= -totalAngle / 2) {
		circle.material.map = textures[0];
		console.log("Displayed image: image0.jpg");
	} else if (axisY >= totalAngle / 2) {
		circle.material.map = textures[15];
		console.log("Displayed image: image15.jpg");
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
		console.log(`Displayed image: image${index}.jpg`);
	}

		renderer.render(scene, camera);
		});


	const leftBtnImage = document.createElement('img');
	leftBtnImage.src = './assets/buttons/btnOKContemp.png';
	leftBtnImage.alt = 'Click Here to PLAY Audio';
	leftBtnImage.classList.add('left-button');

	const toggleImage = document.createElement('img');
	toggleImage.src = './assets/buttons/new.png';
	toggleImage.style.display = 'none';

	const audio = new Audio('https://oklahomacontemporary.org/assets/files/Scheibe-10-joy-Harjo.m4a');
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

	document.body.appendChild(leftBtnImage);

	const rightBtnImage = document.createElement('img');
	rightBtnImage.src = './assets/buttons/initialsNNsunset.png';
	rightBtnImage.alt = 'Click Here for Another Action';
	rightBtnImage.classList.add('left-button', 'right-button');

	rightBtnImage.addEventListener('click', () => {

	  const newWindow = window.open('https://nicholinoah.com/artwork', '_blank');
	  newWindow.focus();
	});

	document.body.appendChild(rightBtnImage);
  };
	start();
	});