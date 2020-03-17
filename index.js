const request = require('request-promise');
const json2csv = require('json2csv');
const fs = require('fs').promises

request
	.get({
		url: 'https://sgregister.dibk.no/api/enterprises.json',
		json: true,
		headers: {
			'Accept': 'application/vnd.sgpub.v2'
		}
	})
	.then(data => data.enterprises)
	.then(enterprises => enterprises.reduce((acc, enterprise) => [
		...acc,
		...enterprise.valid_approval_areas.map(valid_approval_area => ({
			organizational_number: enterprise.organizational_number,
			name: enterprise.name,
			function: valid_approval_area.function,
			subject_area: valid_approval_area.subject_area,
			pbl: valid_approval_area.pbl,
			grade: valid_approval_area.grade
		}))
	], []))
	.then(valid_approval_areas => json2csv.parse(valid_approval_areas))
	.then(csv_output => fs.writeFile('./valid_approval_areas.csv', csv_output))


