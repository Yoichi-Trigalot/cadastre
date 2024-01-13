// index.js
const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const port = 3000;

app.use('/static', express.static(path.join(__dirname, 'static')));

const csvPath = './static/Cadastre.csv'

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
	res.sendFile(__dirname + '/static/index.html');
});

app.get('/search', (req, res) => {
	const name = req.query.name?.toLowerCase();
	const results = locations.filter(loc => loc.Name.toLowerCase().replace('+', ' ').includes(name));
	res.json({ results });
});

app.use(express.static('static'));

app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});
