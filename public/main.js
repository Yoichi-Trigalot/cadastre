// Accéder aux éléments du DOM
const locationInput = document.getElementById('locationInput');
const resultsDiv = document.getElementById('results');
const planSection = document.getElementById('planSection');
const planImage = document.getElementById('planImage');
const fireCode = document.getElementById('fireCode');
const key = document.getElementById('key');
let isHidden = true

// Écouter les événements sur l'input
locationInput.addEventListener('input', handleInput);

// Écouter les événements sur le bouton de recherche
document.getElementById('searchButton').addEventListener('click', handleInput);

// Écouter les événements sur le bouton de nettoyage
document.getElementById('clearButton').addEventListener('click', clearInput);

// Écouter le bouton code pompier
document.getElementById('fireCodeButton').addEventListener('click', toggleFireCode);

// Fonction principale pour gérer l'input
function handleInput() {
	const input = locationInput.value.trim();
	if (input.length >= 3) {
		searchLocation(input);
	} else {
		clearResults();
	}
}

// Fonction pour effectuer la recherche
async function searchLocation(input) {


	const response = await fetch(`/search?name=${input}`);

	const data = await response.json();

	resultsDiv.innerHTML = "<h2>Resultats:</h2>";

	if (data.results.length === 0) {
		resultsDiv.innerHTML += "<p>Aucun résultats.</p>";
	} else {
		const planNumbers = new Set(data.results.map(result => result.Plan_number));
		if (planNumbers.size === 1) {
			const planNumber = planNumbers.values().next().value;
			showPlan(planNumber);
		} else {
			planSection.style.display = 'none';
		}

		data.results.forEach(result => {
			const place = {
				placeNumber: result.Plan_number,
				name: result.Name,
				number: result.Number,
				type: result.Type,
				street: result.Street,
				quarter: result.Quarter,
				code: result.Code,
			};
			const placeJSON = JSON.stringify(place).replace(/\n/g, ' ');


			resultsDiv.innerHTML += generateResultHTML(place);
		});
	}
}

// Fonction pour générer le HTML d'un résultat
function generateResultHTML(place) {
	return `<p class="m-3 text-md sm:text-xl"><a href="#" onclick="handleResultClick('${place.placeNumber}','${place.name}','${place.number}','${place.type}','${place.street}','${place.quarter}','${place.code}')">
      <span class="bg-slate-600 px-2 py-1 rounded text-white text-center w-12 inline-block">${place.number}</span> - <span class="font-bold">${place.name}</span>
      <span class="text-gray-500 text-sm">(${place.type}) 📍 ${place.street}, ${place.quarter} - 🗺️ Plan n° ${place.placeNumber} ${place.code == 'PASDEFINI' ? '' : ' - <span class="font-bold"> 🔐 ' + place.code + '</span>'} </span></a></p>`;
}

// Fonction pour gérer le clic sur un résultat
function handleResultClick(placeNumber, name, number, type, street, quarter, code) {
	const place = { placeNumber, name, number, type, street, quarter, code };
	locationInput.value = place.name;
	// const placeJSON = JSON.stringify(place).replace(/\n/g, ' ');
	resultsDiv.innerHTML = generateResultHTML(place);
	showPlan(place.placeNumber);
}

// Fonction pour afficher un plan
function showPlan(planNumber) {
	const planImagePath = `./plans/plan${planNumber}.jpeg`;
	planImage.src = planImagePath;
	planSection.style.display = 'block';
}

// Fonction pour effacer l'input et les résultats
function clearInput() {
	locationInput.value = '';
	clearResults();
}

// Fonction pour effacer les résultats
function clearResults() {
	resultsDiv.innerHTML = '';
	planSection.style.display = 'none';
}
// Fonction pour Montrer/cacher le code pompier
function toggleFireCode() {
	console.log(isHidden)
	key.style.display = isHidden ? 'none' : 'block'
	fireCode.style.display = isHidden ? 'block' : 'none'
	isHidden = !isHidden;
}

// Fonction pour afficher la liste de plans
function populatePlanNumberList(planCount) {
	const planNumberList = document.getElementById('planNumberList');
	planNumberList.innerHTML = '';

	for (let i = 1; i <= planCount; i++) {
		const listItem = document.createElement('li');
		listItem.textContent = `${i}`;
		listItem.classList.add('inline', 'text-white', 'list-none', 'py-1', 'sm:py-2', 'bg-green-600', 'text-center', 'rounded-lg', 'cursor-pointer');

		listItem.addEventListener('click', () => showPlan(i));

		planNumberList.appendChild(listItem);
	}
}

populatePlanNumberList(15);

// // handle plan zoom

// // Initialise Hammer.js sur l'image
// const hammer = new Hammer(planImage);

// // Active le support du zoom sur l'image
// hammer.get('pinch').set({ enable: true });

// // Gère l'événement de zoom
// hammer.on('pinch', function (event) {
// 	const currentZoom = event.scale;
// 	planImage.style.transform = `scale(${currentZoom})`;
// });
