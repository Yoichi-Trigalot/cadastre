// Fetch User input and trigger search function

document.getElementById('locationInput').addEventListener('input', function () {
	const input = this.value.trim();

	// Perform the search only if the input has at least 3 characters
	if (input.length >= 3) {
		searchLocation(input);
	} else {
		// Clear results if input is less than 3 characters
		document.getElementById('results').innerHTML = '';
		document.getElementById('planSection').style.display = 'none';
	}
});

// Handle Search Button Click

document.getElementById('searchButton').addEventListener('click', function () {
	const input = document.getElementById('locationInput').value.trim();

	// Perform the search only if the input has at least 3 characters
	if (input.length >= 3) {
		searchLocation(input);
	} else {
		// Clear results if input is less than 3 characters
		document.getElementById('results').innerHTML = '';
		document.getElementById('planSection').style.display = 'none';
	}
});


// Search Function

async function searchLocation(input) {
	const response = await fetch(`http://localhost:3000/search?name=${input}`);
	const data = await response.json();

	const resultsDiv = document.getElementById("results");
	resultsDiv.innerHTML = "<h2>Search Results:</h2>";

	if (data.results.length === 0) {
		resultsDiv.innerHTML += "<p>No results found.</p>";
	} else {
		const planNumbers = new Set(data.results.map(result => result.Plan_number));

		if (planNumbers.size === 1) {
			// Tous les résultats partagent le même numéro de plan, afficher le plan directement
			const planNumber = planNumbers.values().next().value;
			showPlan(planNumber);
			// resultsDiv.innerHTML += "<p>Results share the same plan. Plan is displayed above.</p>";
		} else {
			document.getElementById('planSection').style.display = 'none';
		}

		// Afficher les numéros de plan comme des liens
		data.results.forEach(result => {
			resultsDiv.innerHTML += `<p>${result.Name} - ${result.Type} - ${result.Street}, ${result.Quarter} - Plan: <a href="#" onclick="showPlan('${result.Plan_number}')">${result.Plan_number}</a></p>`;
		});

	}
}

// Handle Plan Click and display it

function showPlan(planNumber) {
	// Fetch and display the plan image (replace 'path/to/plan/images/' with the actual path)
	const planImagePath = `./plans/plan${planNumber}.jpeg`;
	document.getElementById('planImage').src = planImagePath;
	document.getElementById('planSection').style.display = 'block';
}

// Clear input field

function clearInput() {
	document.getElementById('locationInput').value = '';
	document.getElementById('results').innerHTML = '';
}

// Handle clear Trigger event

document.getElementById('clearButton').addEventListener('click', clearInput);

// Display all Plans list

function populatePlanNumberList(planCount) {
	const planNumberList = document.getElementById('planNumberList');

	planNumberList.innerHTML = '';

	for (let i = 1; i <= planCount; i++) {
		const listItem = document.createElement('li');
		listItem.textContent = `Plan ${i}`;

		listItem.addEventListener('click', function () {
			showPlan(i);
		});

		planNumberList.appendChild(listItem);
	}
}

populatePlanNumberList(15)

