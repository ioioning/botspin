        let tokenBalance = 11350;
        let tonBalance = 0.00;
        let isExpanded = false;
        let currentView = 'game';
        let ownedCars = [];
        let selectedMap = null;
        let fuelAmount = 3;
        // Garage variables
        let garageScene, garageCamera, garageRenderer, currentGarageCar, garagePlatform;
        let garageCars = {};
        let selectedGarageCar = 'sports';
        let garageInitialized = false;
        // Car data for garage
        const garageCarData = {
          sports: {
            title: "Sports Car",
            speed: 320,
            power: 480,
            rating: "★★★★★",
            price: "3.2M",
            color: 0xff4444
          },
          suv: {
            title: "SUV",
            speed: 180,
            power: 280,
            rating: "★★★★☆",
            price: "2.8M",
            color: 0x44ff44
          },
          sedan: {
            title: "Sedan",
            speed: 220,
            power: 250,
            rating: "★★★☆☆",
            price: "1.8M",
            color: 0x4444ff
          },
          truck: {
            title: "Pickup",
            speed: 160,
            power: 320,
            rating: "★★★★☆",
            price: "2.2M",
            color: 0xffaa44
          },
          electric: {
            title: "Electric",
            speed: 280,
            power: 400,
            rating: "★★★★★",
            price: "4.1M",
            color: 0x44ffff
          },
          classic: {
            title: "Classic",
            speed: 200,
            power: 220,
            rating: "★★★☆☆",
            price: "1.5M",
            color: 0x8844ff
          },
          race: {
            title: "Racing",
            speed: 380,
            power: 520,
            rating: "★★★★★",
            price: "5.8M",
            color: 0xff8844
          },
          luxury: {
            title: "Luxury",
            speed: 240,
            power: 350,
            rating: "★★★★☆",
            price: "6.2M",
            color: 0xff44ff
          }
        };

        function updateBalance() {
          document.getElementById('tokenBalance').textContent = tokenBalance.toLocaleString();
          document.getElementById('tonBalance').textContent = tonBalance.toFixed(2);
          document.getElementById('marketTokenBalance').textContent = tokenBalance.toLocaleString();
        }

        function updateFuelDisplay() {
          const fuelDisplay = document.getElementById('fuelDisplay');
          const mainFuelDisplay = document.getElementById('mainFuelDisplay');
          if (fuelDisplay) {
            fuelDisplay.textContent = fuelAmount;
          }
          if (mainFuelDisplay) {
            mainFuelDisplay.textContent = fuelAmount;
          }
        }

        function goToFuelMarket() {
          showView('market');
          showCategory('fuel');
        }

        function showDepositModal() {
          document.getElementById('depositModal').classList.add('show');
        }

        function hideDepositModal() {
          document.getElementById('depositModal').classList.remove('show');
        }

        function copyAddress() {
          const address = document.getElementById('depositAddress').textContent;
          navigator.clipboard.writeText(address).then(() => {
            alert('Address copied to clipboard!');
          }).catch(() => {
            const textArea = document.createElement('textarea');
            textArea.value = address;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Address copied to clipboard!');
          });
        }

        function toggleExpand() {
          const gameCard = document.getElementById('gameCard');
          const mapSelection = document.getElementById('mapSelection');
          const expandIcon = document.getElementById('expandIcon');
          isExpanded = !isExpanded;
          if (isExpanded) {
            gameCard.classList.add('expanded');
            mapSelection.classList.add('show');
            expandIcon.textContent = '↓';
          } else {
            gameCard.classList.remove('expanded');
            mapSelection.classList.remove('show');
            expandIcon.textContent = '↑';
          }
        }

        function selectMap(mapType,event) {
          const mapCards = document.querySelectorAll('.map-card');
          mapCards.forEach(card => card.classList.remove('selected'));
          event.target.classList.add('selected');
          selectedMap = mapType;
          const gameTitle = document.querySelector('.game-title');
          if (gameTitle) {
            gameTitle.textContent = `READY TO RACE - ${mapType.toUpperCase()}`;
          }
          setTimeout(() => {
            alert(`Map selected: ${mapType.toUpperCase()}`);
          }, 300);
        }

        function startDrift() {
          if (fuelAmount <= 0) {
            alert('Not enough fuel! Get more fuel first.');
            return;
          }
          if (!selectedMap) {
            alert('Please select a map first!');
            if (!isExpanded) {
              toggleExpand();
            }
            return;
          }
          fuelAmount -= 1;
          updateFuelDisplay();
          alert(`Starting drift race on ${selectedMap.toUpperCase()}! Fuel: ${fuelAmount}/10`);
        }

        function showView(viewName) {
          const gameView = document.getElementById('gameView');
          const marketView = document.getElementById('marketView');
          const garageView = document.getElementById('garageView');
          const navItems = document.querySelectorAll('.nav-item');
          navItems.forEach(item => item.classList.remove('active'));
          if (viewName === 'game') {
            gameView.style.display = 'block';
            marketView.classList.remove('active');
            garageView.classList.remove('active');
            navItems[0].classList.add('active');
          } else if (viewName === 'market') {
            gameView.style.display = 'none';
            marketView.classList.add('active');
            garageView.classList.remove('active');
            navItems[1].classList.add('active');
          } else if (viewName === 'garage') {
            gameView.style.display = 'none';
            marketView.classList.remove('active');
            garageView.classList.add('active');
            navItems[2].classList.add('active');
            if (!garageInitialized) {
              setTimeout(() => {
                initGarage();
              }, 100);
            } else {
              setTimeout(() => {
                onGarageWindowResize();
              }, 100);
            }
          }
          currentView = viewName;
        }

        function showCategory(category) {
          const categoryBtns = document.querySelectorAll('.category-btn');
          categoryBtns.forEach(btn => btn.classList.remove('active'));
          event.target.classList.add('active');
          const carsGrid = document.getElementById('carsGrid');
          if (category === 'cars') {
            showCarsGrid();
          } else if (category === 'fuel') {
            showFuelGrid();
          } else if (category === 'boosts') {
            alert('Boosts section - Coming soon!');
          }
        }

        function showCarsGrid() {
          const carsGrid = document.getElementById('carsGrid');
          carsGrid.innerHTML = `
                
							<!-- Car 1 -->
							<div class="car-card" style="background-image: url('https://i.imgur.com/8vHbP4K.jpg');">
								<div class="car-multiplier">X1.2</div>
								<div class="car-price">500 PTS</div>
								<div class="car-content">
									<div class="car-name">MSport-R34 • Uncommon</div>
									<div class="car-rarity">Balanced technology and control</div>
									<div class="car-description"></div>
								</div>
								<button class="buy-btn" onclick="buyCar('msp-r34', 500, 'tokens')">
                        GET
                    </button>
							</div>
							<!-- Car 2 -->
							<div class="car-card" style="background-image: url('https://i.imgur.com/Yz8RqPj.jpg');">
								<div class="car-multiplier">X1.5</div>
								<div class="car-price ton">0.5 TON</div>
								<div class="new-badge">NEW</div>
								<div class="car-content">
									<div class="car-name">Velocity-A146 • Rare</div>
									<div class="car-rarity">Precision handling master</div>
									<div class="car-description"></div>
								</div>
								<button class="buy-btn" onclick="buyCar('vel-a146', 0.5, 'ton')">
                        GET
                    </button>
							</div>
							<!-- Car 3 -->
							<div class="car-card" style="background-image: url('https://i.imgur.com/mKzL7aR.jpg');">
								<div class="car-multiplier">X2.0</div>
								<div class="car-price">2000 PTS</div>
								<div class="new-badge">NEW</div>
								<div class="car-content">
									<div class="car-name">Thunder-X9 • Epic</div>
									<div class="car-rarity">Ultimate racing machine</div>
									<div class="car-description"></div>
								</div>
								<button class="buy-btn" onclick="buyCar('thu-x9', 2000, 'tokens')">
                        GET
                    </button>
							</div>
							<!-- Car 4 -->
							<div class="car-card" style="background-image: url('https://i.imgur.com/3nBqYHr.jpg');">
								<div class="car-multiplier">X1.8</div>
								<div class="car-price ton">1.2 TON</div>
								<div class="car-content">
									<div class="car-name">Drift-K33 • Legendary</div>
									<div class="car-rarity">Street racing legend</div>
									<div class="car-description"></div>
								</div>
								<button class="buy-btn" onclick="buyCar('dri-k33', 1.2, 'ton')">
                        GET
                    </button>
							</div>
							<!-- Car 5 -->
							<div class="car-card" style="background-image: url('https://i.imgur.com/R7pKNwM.jpg');">
								<div class="car-multiplier">X1.3</div>
								<div class="car-price">800 PTS</div>
								<div class="car-content">
									<div class="car-name">Nitro-S15 • Rare</div>
									<div class="car-rarity">Speed demon</div>
									<div class="car-description"></div>
								</div>
								<button class="buy-btn" onclick="buyCar('nit-s15', 800, 'tokens')">
                        GET
                    </button>
							</div>
            `;
        }

        function showFuelGrid() {
          const carsGrid = document.getElementById('carsGrid');
          carsGrid.innerHTML = `
                
							<!-- Fuel Pack 1 -->
							<div class="car-card" style="background-image: url('https://i.imgur.com/OxUIvlq.jpg');">
								<div class="car-multiplier">+10</div>
								<div class="car-price">100 PTS</div>
								<div class="car-content">
									<div class="car-name">Basic Fuel Pack</div>
									<div class="car-rarity">Standard fuel for racing</div>
									<div class="car-description"></div>
								</div>
								<button class="buy-btn" onclick="buyFuel('basic-fuel', 100, 'tokens', 10)">
                        GET
                    </button>
							</div>
							<!-- Fuel Pack 2 -->
							<div class="car-card" style="background-image: url('https://i.imgur.com/OxUIvlq.jpg');">
								<div class="car-multiplier">+25</div>
								<div class="car-price">200 PTS</div>
								<div class="car-content">
									<div class="car-name">Premium Fuel Pack</div>
									<div class="car-rarity">High-performance fuel</div>
									<div class="car-description"></div>
								</div>
								<button class="buy-btn" onclick="buyFuel('premium-fuel', 200, 'tokens', 25)">
                        GET
                    </button>
							</div>
							<!-- Fuel Pack 3 -->
							<div class="car-card" style="background-image: url('https://i.imgur.com/5TU1oCg.jpg');">
								<div class="car-multiplier">+50</div>
								<div class="car-price ton">0.1 TON</div>
								<div class="new-badge">NEW</div>
								<div class="car-content">
									<div class="car-name">Super Fuel Pack</div>
									<div class="car-rarity">Professional grade fuel</div>
									<div class="car-description"></div>
								</div>
								<button class="buy-btn" onclick="buyFuel('super-fuel', 0.1, 'ton', 50)">
                        GET
                    </button>
							</div>
							<!-- Fuel Pack 4 -->
							<div class="car-card" style="background-image: url('https://i.imgur.com/5TU1oCg.jpg');">
								<div class="car-multiplier">+100</div>
								<div class="car-price">1000 PTS</div>
								<div class="car-content">
									<div class="car-name">Mega Fuel Pack</div>
									<div class="car-rarity">Ultimate fuel reserve</div>
									<div class="car-description"></div>
								</div>
								<button class="buy-btn" onclick="buyFuel('mega-fuel', 1000, 'tokens', 100)">
                        GET
                    </button>
							</div>
							<!-- Fuel Pack 5 -->
							<div class="car-card" style="background-image: url('https://i.imgur.com/5TU1oCg.jpg');">
								<div class="car-multiplier">+200</div>
								<div class="car-price ton">0.3 TON</div>
								<div class="new-badge">NEW</div>
								<div class="car-content">
									<div class="car-name">Ultra Fuel Pack</div>
									<div class="car-rarity">Legendary fuel reserve</div>
									<div class="car-description"></div>
								</div>
								<button class="buy-btn" onclick="buyFuel('ultra-fuel', 0.3, 'ton', 200)">
                        GET
                    </button>
							</div>
            `;
        }

        function buyFuel(fuelId, price, currency, amount) {
          let canAfford = false;
          if (currency === 'tokens') {
            canAfford = tokenBalance >= price;
            if (canAfford) {
              tokenBalance -= price;
              fuelAmount += amount;
              if (fuelAmount > 10) fuelAmount = 10; // Max fuel cap
              updateBalance();
              updateFuelDisplay();
              alert(`Successfully bought ${amount} fuel units!`);
            } else {
              alert('Insufficient tokens!');
            }
          } else if (currency === 'ton') {
            canAfford = tonBalance >= price;
            if (canAfford) {
              tonBalance -= price;
              fuelAmount += amount;
              if (fuelAmount > 10) fuelAmount = 10; // Max fuel cap
              updateBalance();
              updateFuelDisplay();
              alert(`Successfully bought ${amount} fuel units!`);
            } else {
              alert('Insufficient TON!');
            }
          }
        }

        function buyCar(carId, price, currency) {
          let canAfford = false;
          if (currency === 'tokens') {
            canAfford = tokenBalance >= price;
            if (canAfford) {
              tokenBalance -= price;
              ownedCars.push(carId);
              updateBalance();
              alert(`Successfully bought ${carId}!`);
              const buyButtons = document.querySelectorAll('.buy-btn');
              buyButtons.forEach(btn => {
                if (btn.getAttribute('onclick').includes(carId)) {
                  btn.disabled = true;
                  btn.textContent = 'OWNED';
                  btn.style.background = 'rgba(100, 100, 100, 0.3)';
                }
              });
            } else {
              alert('Insufficient tokens!');
            }
          } else if (currency === 'ton') {
            canAfford = tonBalance >= price;
            if (canAfford) {
              tonBalance -= price;
              ownedCars.push(carId);
              updateBalance();
              alert(`Successfully bought ${carId}!`);
              const buyButtons = document.querySelectorAll('.buy-btn');
              buyButtons.forEach(btn => {
                if (btn.getAttribute('onclick').includes(carId)) {
                  btn.disabled = true;
                  btn.textContent = 'OWNED';
                  btn.style.background = 'rgba(100, 100, 100, 0.3)';
                }
              });
            } else {
              alert('Insufficient TON!');
            }
          }
        }
        // 3D Garage Functions
        function initGarage() {
          if (garageInitialized) return;
          const container = document.getElementById('garage-canvas-container');
          garageScene = new THREE.Scene();
          garageScene.background = new THREE.Color(0x1a1a1a);
          garageCamera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
          garageCamera.position.set(5, 3, 6);
          garageCamera.lookAt(0, 0, 0);
          garageRenderer = new THREE.WebGLRenderer({
            antialias: true
          });
          garageRenderer.setSize(container.offsetWidth, container.offsetHeight);
          garageRenderer.shadowMap.enabled = true;
          garageRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
          container.appendChild(garageRenderer.domElement);
          setupGarageLighting();
          createGaragePlatform();
          createGarageCars();
          selectGarageCar('sports');
          setupGarageEventListeners();
          document.getElementById('garageLoading').style.display = 'none';
          garageInitialized = true;
          animateGarage();
        }

        function setupGarageLighting() {
          const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
          garageScene.add(ambientLight);
          const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
          directionalLight.position.set(8, 10, 5);
          directionalLight.castShadow = true;
          directionalLight.shadow.mapSize.width = 1024;
          directionalLight.shadow.mapSize.height = 1024;
          directionalLight.shadow.camera.near = 0.5;
          directionalLight.shadow.camera.far = 50;
          garageScene.add(directionalLight);
          const fillLight = new THREE.DirectionalLight(0xffcc00, 0.3);
          fillLight.position.set(-5, 5, -5);
          garageScene.add(fillLight);
          const spotLight = new THREE.SpotLight(0xffcc00, 0.6);
          spotLight.position.set(0, 8, 0);
          spotLight.angle = Math.PI / 4;
          spotLight.penumbra = 0.2;
          spotLight.castShadow = true;
          garageScene.add(spotLight);
        }

        function createGaragePlatform() {
          const geometry = new THREE.CylinderGeometry(2.5, 2.5, 0.15, 32);
          const material = new THREE.MeshLambertMaterial({
            color: 0x333333,
            transparent: true,
            opacity: 0.9
          });
          garagePlatform = new THREE.Mesh(geometry, material);
          garagePlatform.position.y = -0.08;
          garagePlatform.receiveShadow = true;
          garageScene.add(garagePlatform);
          const ringGeometry = new THREE.RingGeometry(2.2, 2.4, 32);
          const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0xffcc00,
            transparent: true,
            opacity: 0.8
          });
          const ring = new THREE.Mesh(ringGeometry, ringMaterial);
          ring.rotation.x = -Math.PI / 2;
          ring.position.y = 0.01;
          garagePlatform.add(ring);
          const innerRingGeometry = new THREE.RingGeometry(1.8, 2.0, 32);
          const innerRingMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.4
          });
          const innerRing = new THREE.Mesh(innerRingGeometry, innerRingMaterial);
          innerRing.rotation.x = -Math.PI / 2;
          innerRing.position.y = 0.005;
          garagePlatform.add(innerRing);
        }

        function createGarageCars() {
          Object.keys(garageCarData).forEach(carType => {
            garageCars[carType] = createGarageCar(garageCarData[carType].color, carType);
          });
        }

      function createGarageCar(color, type) {
  const car = new THREE.Group();
  
  // Основні параметри залежно від типу
  let bodyGeometry, bodyHeight, bodyWidth, bodyLength;
  let roofHeight, roofWidth, roofLength, roofOffsetZ;
  
  switch (type) {
    case 'sports':
      bodyWidth = 1.8; bodyHeight = 0.5; bodyLength = 3.8;
      roofHeight = 0.3; roofWidth = 1.4; roofLength = 1.8; roofOffsetZ = 0.2;
      break;
    case 'suv':
      bodyWidth = 2.0; bodyHeight = 1.0; bodyLength = 4.2;
      roofHeight = 0.5; roofWidth = 1.8; roofLength = 2.5; roofOffsetZ = 0.3;
      break;
    case 'sedan':
      bodyWidth = 1.9; bodyHeight = 0.7; bodyLength = 4.0;
      roofHeight = 0.4; roofWidth = 1.6; roofLength = 2.2; roofOffsetZ = 0.3;
      break;
    case 'truck':
      bodyWidth = 2.2; bodyHeight = 0.9; bodyLength = 3.5;
      roofHeight = 0.45; roofWidth = 1.7; roofLength = 2.0; roofOffsetZ = 0.5;
      break;
    default:
      bodyWidth = 1.8; bodyHeight = 0.6; bodyLength = 3.8;
      roofHeight = 0.4; roofWidth = 1.6; roofLength = 2.2; roofOffsetZ = 0.3;
  }
  
  bodyGeometry = new THREE.BoxGeometry(bodyWidth, bodyHeight, bodyLength);
  const bodyMaterial = new THREE.MeshPhongMaterial({
    color: color,
    shininess: 100,
    specular: 0x222222
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 0.4;
  body.castShadow = true;
  car.add(body);
  
  // Додаткові деталі кузова
  // Бічні панелі з рельєфом
  const sidePanelGeometry = new THREE.BoxGeometry(0.05, bodyHeight * 0.3, bodyLength * 0.6);
  const sidePanelMaterial = new THREE.MeshPhongMaterial({
    color: new THREE.Color(color).multiplyScalar(0.9),
    shininess: 120
  });
  
  const leftPanel = new THREE.Mesh(sidePanelGeometry, sidePanelMaterial);
  leftPanel.position.set(-bodyWidth / 2 - 0.02, 0.35, 0);
  car.add(leftPanel);
  
  const rightPanel = new THREE.Mesh(sidePanelGeometry, sidePanelMaterial);
  rightPanel.position.set(bodyWidth / 2 + 0.02, 0.35, 0);
  car.add(rightPanel);
  
  // Нижня частина бампера спереду
  const frontBumperGeometry = new THREE.BoxGeometry(bodyWidth * 0.9, 0.15, 0.3);
  const bumperMaterial = new THREE.MeshPhongMaterial({
    color: new THREE.Color(color).multiplyScalar(0.85),
    shininess: 90
  });
  const frontBumper = new THREE.Mesh(frontBumperGeometry, bumperMaterial);
  frontBumper.position.set(0, 0.15, bodyLength / 2 + 0.15);
  frontBumper.castShadow = true;
  car.add(frontBumper);
  
  // Задній бампер
  const rearBumper = new THREE.Mesh(frontBumperGeometry, bumperMaterial);
  rearBumper.position.set(0, 0.15, -bodyLength / 2 - 0.15);
  rearBumper.castShadow = true;
  car.add(rearBumper);
  
  // Решітка радіатора
  const grilleGeometry = new THREE.BoxGeometry(bodyWidth * 0.6, 0.25, 0.08);
  const grilleMaterial = new THREE.MeshPhongMaterial({
    color: 0x1a1a1a,
    shininess: 50
  });
  const grille = new THREE.Mesh(grilleGeometry, grilleMaterial);
  grille.position.set(0, 0.35, bodyLength / 2 + 0.04);
  car.add(grille);
  
  // Деталі решітки (горизонтальні лінії)
  for (let i = 0; i < 4; i++) {
    const lineGeometry = new THREE.BoxGeometry(bodyWidth * 0.55, 0.02, 0.01);
    const lineMaterial = new THREE.MeshPhongMaterial({
      color: 0x333333,
      shininess: 100
    });
    const line = new THREE.Mesh(lineGeometry, lineMaterial);
    line.position.set(0, 0.28 + i * 0.05, bodyLength / 2 + 0.09);
    car.add(line);
  }
  
  // Капот з рельєфом
  const hoodLineGeometry = new THREE.BoxGeometry(0.03, 0.02, bodyLength * 0.35);
  const hoodLineMaterial = new THREE.MeshPhongMaterial({
    color: new THREE.Color(color).multiplyScalar(0.95),
    shininess: 110
  });
  const hoodLineLeft = new THREE.Mesh(hoodLineGeometry, hoodLineMaterial);
  hoodLineLeft.position.set(-0.3, bodyHeight + 0.01, bodyLength * 0.25);
  car.add(hoodLineLeft);
  
  const hoodLineRight = new THREE.Mesh(hoodLineGeometry, hoodLineMaterial);
  hoodLineRight.position.set(0.3, bodyHeight + 0.01, bodyLength * 0.25);
  car.add(hoodLineRight);
  
  // Дах
  const roofGeometry = new THREE.BoxGeometry(roofWidth, roofHeight, roofLength);
  const roofMaterial = new THREE.MeshPhongMaterial({
    color: color,
    shininess: 80
  });
  const roof = new THREE.Mesh(roofGeometry, roofMaterial);
  roof.position.y = bodyHeight + roofHeight / 2;
  roof.position.z = roofOffsetZ;
  roof.castShadow = true;
  car.add(roof);
  
  // Антена на даху
  const antennaGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8);
  const antennaMaterial = new THREE.MeshPhongMaterial({
    color: 0x1a1a1a,
    shininess: 50
  });
  const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
  antenna.position.set(roofWidth / 2 - 0.1, bodyHeight + roofHeight + 0.15, roofOffsetZ - roofLength / 3);
  car.add(antenna);
  
  // Вікна
  const windowGeometry = new THREE.BoxGeometry(roofWidth - 0.1, roofHeight - 0.05, roofLength - 0.2);
  const windowMaterial = new THREE.MeshPhongMaterial({
    color: 0x87ceeb,
    transparent: true,
    opacity: 0.7,
    shininess: 200
  });
  const windows = new THREE.Mesh(windowGeometry, windowMaterial);
  windows.position.y = bodyHeight + roofHeight / 2;
  windows.position.z = roofOffsetZ;
  car.add(windows);
  
  // Рамки вікон
  const windowFrameGeometry = new THREE.BoxGeometry(roofWidth + 0.05, 0.03, roofLength + 0.05);
  const windowFrameMaterial = new THREE.MeshPhongMaterial({
    color: 0x1a1a1a,
    shininess: 100
  });
  const windowFrame = new THREE.Mesh(windowFrameGeometry, windowFrameMaterial);
  windowFrame.position.y = bodyHeight + roofHeight / 2;
  windowFrame.position.z = roofOffsetZ;
  car.add(windowFrame);
  
  // Дзеркала заднього виду
  const mirrorGeometry = new THREE.BoxGeometry(0.12, 0.08, 0.15);
  const mirrorMaterial = new THREE.MeshPhongMaterial({
    color: 0x1a1a1a,
    shininess: 80
  });
  
  const leftMirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
  leftMirror.position.set(-bodyWidth / 2 - 0.1, bodyHeight + 0.1, roofOffsetZ + roofLength / 2 - 0.3);
  car.add(leftMirror);
  
  const rightMirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
  rightMirror.position.set(bodyWidth / 2 + 0.1, bodyHeight + 0.1, roofOffsetZ + roofLength / 2 - 0.3);
  car.add(rightMirror);
  
  // Скло дзеркал
  const mirrorGlassGeometry = new THREE.BoxGeometry(0.1, 0.07, 0.02);
  const mirrorGlassMaterial = new THREE.MeshPhongMaterial({
    color: 0xaaaaff,
    shininess: 300,
    transparent: true,
    opacity: 0.8
  });
  
  const leftMirrorGlass = new THREE.Mesh(mirrorGlassGeometry, mirrorGlassMaterial);
  leftMirrorGlass.position.set(-bodyWidth / 2 - 0.15, bodyHeight + 0.1, roofOffsetZ + roofLength / 2 - 0.3);
  car.add(leftMirrorGlass);
  
  const rightMirrorGlass = new THREE.Mesh(mirrorGlassGeometry, mirrorGlassMaterial);
  rightMirrorGlass.position.set(bodyWidth / 2 + 0.15, bodyHeight + 0.1, roofOffsetZ + roofLength / 2 - 0.3);
  car.add(rightMirrorGlass);
  
  // Колеса з більшою деталізацією
  const wheelGeometry = new THREE.CylinderGeometry(0.28, 0.28, 0.18, 16);
  const wheelMaterial = new THREE.MeshPhongMaterial({
    color: 0x1a1a1a
  });
  
  const wheelPositions = [
    { x: -bodyWidth / 2 - 0.1, z: bodyLength / 2 - 0.5 },
    { x: bodyWidth / 2 + 0.1, z: bodyLength / 2 - 0.5 },
    { x: -bodyWidth / 2 - 0.1, z: -bodyLength / 2 + 0.5 },
    { x: bodyWidth / 2 + 0.1, z: -bodyLength / 2 + 0.5 }
  ];
  
  wheelPositions.forEach(pos => {
    // Шина
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(pos.x, 0.28, pos.z);
    wheel.castShadow = true;
    car.add(wheel);
    
    // Диск
    const rimGeometry = new THREE.CylinderGeometry(0.18, 0.18, 0.08, 8);
    const rimMaterial = new THREE.MeshPhongMaterial({
      color: 0xcccccc,
      shininess: 150
    });
    const rim = new THREE.Mesh(rimGeometry, rimMaterial);
    rim.rotation.z = Math.PI / 2;
    rim.position.set(pos.x, 0.28, pos.z);
    car.add(rim);
    
    // Спиці диска
    for (let i = 0; i < 5; i++) {
      const spokeGeometry = new THREE.BoxGeometry(0.03, 0.15, 0.05);
      const spokeMaterial = new THREE.MeshPhongMaterial({
        color: 0xaaaaaa,
        shininess: 180
      });
      const spoke = new THREE.Mesh(spokeGeometry, spokeMaterial);
      spoke.rotation.z = Math.PI / 2;
      spoke.rotation.y = (Math.PI * 2 / 5) * i;
      spoke.position.set(pos.x, 0.28, pos.z);
      car.add(spoke);
    }
    
    // Центральна частина диска
    const hubGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.04, 6);
    const hubMaterial = new THREE.MeshPhongMaterial({
      color: 0xffcc00,
      shininess: 200
    });
    const hub = new THREE.Mesh(hubGeometry, hubMaterial);
    hub.rotation.z = Math.PI / 2;
    hub.position.set(pos.x, 0.28, pos.z);
    car.add(hub);
    
    // Гальмівний диск
    const brakeGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.02, 16);
    const brakeMaterial = new THREE.MeshPhongMaterial({
      color: 0x444444,
      shininess: 100
    });
    const brake = new THREE.Mesh(brakeGeometry, brakeMaterial);
    brake.rotation.z = Math.PI / 2;
    brake.position.set(pos.x > 0 ? pos.x - 0.05 : pos.x + 0.05, 0.28, pos.z);
    car.add(brake);
  });
  
  // Фари з більшою деталізацією
  const headlightGeometry = new THREE.SphereGeometry(0.08, 12, 12);
  const headlightMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffaa,
    emissive: 0x444400,
    shininess: 300
  });
  
  // Корпус фар
  const headlightHousingGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 12);
  const headlightHousingMaterial = new THREE.MeshPhongMaterial({
    color: 0x333333,
    shininess: 100
  });
  
  const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
  leftHeadlight.position.set(-bodyWidth / 2 + 0.3, 0.35, bodyLength / 2);
  car.add(leftHeadlight);
  
  const leftHousing = new THREE.Mesh(headlightHousingGeometry, headlightHousingMaterial);
  leftHousing.rotation.x = Math.PI / 2;
  leftHousing.position.set(-bodyWidth / 2 + 0.3, 0.35, bodyLength / 2 - 0.05);
  car.add(leftHousing);
  
  const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
  rightHeadlight.position.set(bodyWidth / 2 - 0.3, 0.35, bodyLength / 2);
  car.add(rightHeadlight);
  
  const rightHousing = new THREE.Mesh(headlightHousingGeometry, headlightHousingMaterial);
  rightHousing.rotation.x = Math.PI / 2;
  rightHousing.position.set(bodyWidth / 2 - 0.3, 0.35, bodyLength / 2 - 0.05);
  car.add(rightHousing);
  
  // Задні ліхтарі
  const taillightMaterial = new THREE.MeshPhongMaterial({
    color: 0xff4444,
    emissive: 0x440000,
    shininess: 300
  });
  
  const taillightHousingMaterial = new THREE.MeshPhongMaterial({
    color: 0x330000,
    shininess: 100
  });
  
  const leftTaillight = new THREE.Mesh(headlightGeometry, taillightMaterial);
  leftTaillight.position.set(-bodyWidth / 2 + 0.3, 0.35, -bodyLength / 2);
  car.add(leftTaillight);
  
  const leftTailHousing = new THREE.Mesh(headlightHousingGeometry, taillightHousingMaterial);
  leftTailHousing.rotation.x = Math.PI / 2;
  leftTailHousing.position.set(-bodyWidth / 2 + 0.3, 0.35, -bodyLength / 2 + 0.05);
  car.add(leftTailHousing);
  
  const rightTaillight = new THREE.Mesh(headlightGeometry, taillightMaterial);
  rightTaillight.position.set(bodyWidth / 2 - 0.3, 0.35, -bodyLength / 2);
  car.add(rightTaillight);
  
  const rightTailHousing = new THREE.Mesh(headlightHousingGeometry, taillightHousingMaterial);
  rightTailHousing.rotation.x = Math.PI / 2;
  rightTailHousing.position.set(bodyWidth / 2 - 0.3, 0.35, -bodyLength / 2 + 0.05);
  car.add(rightTailHousing);
  
  // Вихлопна труба
  const exhaustGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.25, 12);
  const exhaustMaterial = new THREE.MeshPhongMaterial({
    color: 0x444444,
    shininess: 120
  });
  const exhaust = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
  exhaust.rotation.z = Math.PI / 2;
  exhaust.position.set(bodyWidth / 2 - 0.3, 0.2, -bodyLength / 2 - 0.1);
  car.add(exhaust);
  
  // Двері (контури)
  const doorLineGeometry = new THREE.BoxGeometry(0.02, bodyHeight * 0.7, bodyLength * 0.3);
  const doorLineMaterial = new THREE.MeshPhongMaterial({
    color: new THREE.Color(color).multiplyScalar(0.8),
    shininess: 90
  });
  
  // Ліва передня дверь
  const leftFrontDoor = new THREE.Mesh(doorLineGeometry, doorLineMaterial);
  leftFrontDoor.position.set(-bodyWidth / 2 - 0.01, 0.4, roofOffsetZ + 0.5);
  car.add(leftFrontDoor);
  
  // Права передня дверь
  const rightFrontDoor = new THREE.Mesh(doorLineGeometry, doorLineMaterial);
  rightFrontDoor.position.set(bodyWidth / 2 + 0.01, 0.4, roofOffsetZ + 0.5);
  car.add(rightFrontDoor);
  
  // Ручки дверей
  const handleGeometry = new THREE.BoxGeometry(0.08, 0.03, 0.2);
  const handleMaterial = new THREE.MeshPhongMaterial({
    color: 0x333333,
    shininess: 150
  });
  
  const leftHandle = new THREE.Mesh(handleGeometry, handleMaterial);
  leftHandle.position.set(-bodyWidth / 2 - 0.03, 0.45, roofOffsetZ + 0.5);
  car.add(leftHandle);
  
  const rightHandle = new THREE.Mesh(handleGeometry, handleMaterial);
  rightHandle.position.set(bodyWidth / 2 + 0.03, 0.45, roofOffsetZ + 0.5);
  car.add(rightHandle);
  
  // Спойлер для спортивного авто
  if (type === 'sports') {
    const spoilerBaseGeometry = new THREE.BoxGeometry(bodyWidth * 0.8, 0.08, 0.15);
    const spoilerMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color(color).multiplyScalar(0.9),
      shininess: 110
    });
    const spoilerBase = new THREE.Mesh(spoilerBaseGeometry, spoilerMaterial);
    spoilerBase.position.set(0, bodyHeight + roofHeight + 0.15, -bodyLength / 2 + 0.3);
    spoilerBase.rotation.x = -0.2;
    spoilerBase.castShadow = true;
    car.add(spoilerBase);
    
    // Стійки спойлера
    const spoilerLegGeometry = new THREE.BoxGeometry(0.05, 0.2, 0.05);
    const leftSpoilerLeg = new THREE.Mesh(spoilerLegGeometry, spoilerMaterial);
    leftSpoilerLeg.position.set(-bodyWidth / 3, bodyHeight + roofHeight + 0.05, -bodyLength / 2 + 0.3);
    car.add(leftSpoilerLeg);
    
    const rightSpoilerLeg = new THREE.Mesh(spoilerLegGeometry, spoilerMaterial);
    rightSpoilerLeg.position.set(bodyWidth / 3, bodyHeight + roofHeight + 0.05, -bodyLength / 2 + 0.3);
    car.add(rightSpoilerLeg);
  }
  
  // Кузов для пікапа
  if (type === 'truck') {
    const bedGeometry = new THREE.BoxGeometry(bodyWidth - 0.4, 0.3, bodyLength * 0.4);
    const bedMaterial = new THREE.MeshPhongMaterial({
      color: color,
      shininess: 60
    });
    const bed = new THREE.Mesh(bedGeometry, bedMaterial);
    bed.position.y = 0.5;
    bed.position.z = -bodyLength * 0.2;
    bed.castShadow = true;
    car.add(bed);
    
    // Борти кузова
    const sideWallGeometry = new THREE.BoxGeometry(0.08, 0.4, bodyLength * 0.4);
    const sideWallMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color(color).multiplyScalar(0.95),
      shininess: 70
    });
    
    const leftWall = new THREE.Mesh(sideWallGeometry, sideWallMaterial);
    leftWall.position.set(-bodyWidth / 2 + 0.3, 0.55, -bodyLength * 0.2);
    leftWall.castShadow = true;
    car.add(leftWall);
    
    const rightWall = new THREE.Mesh(sideWallGeometry, sideWallMaterial);
    rightWall.position.set(bodyWidth / 2 - 0.3, 0.55, -bodyLength * 0.2);
    rightWall.castShadow = true;
    car.add(rightWall);
    
    const backWallGeometry = new THREE.BoxGeometry(bodyWidth - 0.4, 0.4, 0.08);
    const backWall = new THREE.Mesh(backWallGeometry, sideWallMaterial);
    backWall.position.set(0, 0.55, -bodyLength * 0.4 - 0.04);
    backWall.castShadow = true;
    car.add(backWall);
  }
  
  // Номерний знак спереду
  const licensePlateGeometry = new THREE.BoxGeometry(0.35, 0.12, 0.02);
  const licensePlateMaterial = new THREE.MeshPhongMaterial({
    color: 0xeeeeee,
    shininess: 80
  });
  const frontPlate = new THREE.Mesh(licensePlateGeometry, licensePlateMaterial);
  frontPlate.position.set(0, 0.2, bodyLength / 2 + 0.31);
  car.add(frontPlate);
  
  // Номерний знак ззаду
  const rearPlate = new THREE.Mesh(licensePlateGeometry, licensePlateMaterial);
  rearPlate.position.set(0, 0.2, -bodyLength / 2 - 0.31);
  car.add(rearPlate);
  
  car.visible = false;
  garagePlatform.add(car);
  return car;
}

        function createGarageCarOption(carType, index) {
          const option = document.createElement('div');
          option.className = `garage-car-option ${index === 0 ? 'active' : ''}`;
          option.onclick = () => selectGarageCar(carType);
          const colorHex = `#${garageCarData[carType].color.toString(16).padStart(6, '0')}`;
          option.innerHTML = `
                
							<div class="garage-car-preview" style="background: ${colorHex}"></div>
							<div class="garage-car-name">${garageCarData[carType].title}</div>
            `;
          option.setAttribute('data-garage-car', carType);
          return option;
        }

        function selectGarageCar(carType) {
          if (currentGarageCar) {
            currentGarageCar.visible = false;
          }
          currentGarageCar = garageCars[carType];
          currentGarageCar.visible = true;
          selectedGarageCar = carType;
          updateGarageCarInfo(carType);
          updateGarageActivePreview(carType);
        }

        function updateGarageCarInfo(carType) {
          const data = garageCarData[carType];
          document.getElementById('carModel').textContent = data.title;
          document.getElementById('carSpeed').textContent = data.speed;
          document.getElementById('carPower').textContent = data.power;
          document.getElementById('carRating').textContent = data.rating;
          document.getElementById('carPrice').textContent = data.price;
        }

        function updateGarageActivePreview(carType) {
          document.querySelectorAll('.garage-car-option').forEach(option => {
            option.classList.remove('active');
          });
          document.querySelector(`[data-garage-car="${carType}"]`)?.classList.add('active');
        }

        function setupGarageEventListeners() {
          const garageCarsGrid = document.getElementById('garageCarsGrid');
          Object.keys(garageCarData).forEach((carType, index) => {
            const option = createGarageCarOption(carType, index);
            garageCarsGrid.appendChild(option);
          });
          let isDragging = false;
          let previousMousePosition = {
            x: 0,
            y: 0
          };
          const canvas = garageRenderer.domElement;
          canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            previousMousePosition = {
              x: e.clientX,
              y: e.clientY
            };
          });
          canvas.addEventListener('mouseup', () => {
            isDragging = false;
          });
          canvas.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;
            rotateGarageCamera(deltaX, deltaY);
            previousMousePosition = {
              x: e.clientX,
              y: e.clientY
            };
          });
          canvas.addEventListener('touchstart', (e) => {
            isDragging = true;
            const touch = e.touches[0];
            previousMousePosition = {
              x: touch.clientX,
              y: touch.clientY
            };
            e.preventDefault();
          });
          canvas.addEventListener('touchend', () => {
            isDragging = false;
          });
          canvas.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const touch = e.touches[0];
            const deltaX = touch.clientX - previousMousePosition.x;
            const deltaY = touch.clientY - previousMousePosition.y;
            rotateGarageCamera(deltaX, deltaY);
            previousMousePosition = {
              x: touch.clientX,
              y: touch.clientY
            };
            e.preventDefault();
          });
          canvas.addEventListener('wheel', (e) => {
            const distance = garageCamera.position.distanceTo(new THREE.Vector3(0, 0, 0));
            const newDistance = distance + e.deltaY * 0.01;
            if (newDistance > 2 && newDistance < 15) {
              garageCamera.position.multiplyScalar(newDistance / distance);
            }
            e.preventDefault();
          });
        }

        function rotateGarageCamera(deltaX, deltaY) {
          const spherical = new THREE.Spherical();
          spherical.setFromVector3(garageCamera.position);
          spherical.theta -= deltaX * 0.01;
          spherical.phi += deltaY * 0.01;
          spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
          garageCamera.position.setFromSpherical(spherical);
          garageCamera.lookAt(0, 0, 0);
        }

        function onGarageWindowResize() {
          if (!garageInitialized) return;
          const container = document.getElementById('garage-canvas-container');
          garageCamera.aspect = container.offsetWidth / container.offsetHeight;
          garageCamera.updateProjectionMatrix();
          garageRenderer.setSize(container.offsetWidth, container.offsetHeight);
        }

        function animateGarage() {
          if (!garageInitialized) return;
          requestAnimationFrame(animateGarage);
          if (garagePlatform) {
            garagePlatform.rotation.y += 0.003;
          }
          if (currentGarageCar) {
            currentGarageCar.position.y = Math.sin(Date.now() * 0.001) * 0.015;
          }
          garageRenderer.render(garageScene, garageCamera);
        }

        function showLoadingScreen() {
          const loadingScreen = document.getElementById('loadingScreen');
          let progress = 0;
          const loadingInterval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            if (progress >= 100) {
              progress = 100;
              clearInterval(loadingInterval);
              setTimeout(() => {
                hideLoadingScreen();
              }, 500);
            }
          }, 150);
        }

        function hideLoadingScreen() {
          const loadingScreen = document.getElementById('loadingScreen');
          loadingScreen.classList.add('hidden');
          setTimeout(() => {
            loadingScreen.style.display = 'none';
          }, 500);
        }
        // Initialize the game
        updateBalance();
        updateFuelDisplay();
        // Simulate earning tokens over time
        setInterval(() => {
          tokenBalance += Math.floor(Math.random() * 10) + 1;
          updateBalance();
        }, 30000);
        // Add floating particles effect
        document.addEventListener('DOMContentLoaded', function() {
          const container = document.querySelector('.container');
          for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '2px';
            particle.style.height = '2px';
            particle.style.background = 'rgba(255, 255, 255, 0.5)';
            particle.style.borderRadius = '50%';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animation = `float ${3 + Math.random() * 4}s ease-in-out infinite`;
            container.appendChild(particle);
          }
        });
        // Window resize handler
        window.addEventListener('resize', () => {
          onGarageWindowResize();
        });
        // Loading screen initialization
        window.addEventListener('load', function() {
          showLoadingScreen();
        });
