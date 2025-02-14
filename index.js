// index.js
const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const port = 3000;

app.use('/public', express.static(path.join(__dirname, 'public')));

const csvPath = './public/Cadastre.csv'

function readCsv() {
	const objectsList = [];

	// Lire le fichier CSV
	const csvData = fs.readFileSync(csvPath, { encoding: 'utf-8' });

	// Convertir les lignes du CSV en un tableau d'objets
	const csvRows = csvData.split('\n');
	const headers = csvRows[0].split(',').map(header => header.trim());

	for (let i = 1; i < csvRows.length -1; i++) {
		const row = csvRows[i].split(',').map(row => row.trim());;
		const object = {};

		for (let j = 0; j < headers.length; j++) {
			const value = row[j] ? row[j].trim() : 'PASDEFINI';
			object[headers[j]] = value;
		}

		objectsList.push(object);
	}

	return objectsList;
}
// Charger les données depuis le csv :
const locations = readCsv()

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

app.get('/search', async (req, res) => {
	const name = req.query.name?.toLowerCase();

	const normalizeString = (str) => {
		return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
	};

	const results = locations.filter(loc => normalizeString(loc.Name.toLowerCase().replace('+', ' ')).includes(normalizeString(name)) || loc.Number === name );
	res.json({ results });
});

app.get('/searchPlan', async (req, res) => {
	const planId = req.query.planId;

	const results = locations.filter(loc => loc.Plan_number === planId);
	res.json({ results });
});

app.use(express.static('public'));

app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});
