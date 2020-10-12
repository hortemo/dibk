const request = require("request-promise");
const json2csv = require("json2csv");
const fs = require("fs").promises;

request
  .get({
    url: "https://sgregister.dibk.no/api/enterprises.json",
    json: true,
    headers: {
      Accept: "application/vnd.sgpub.v2",
    },
  })
  .then((data) => data.enterprises)
  .then((enterprises) =>
    json2csv.parse(enterprises, {
      fields: [
        "organizational_number",
        "name",
        "businessaddress.postal_code",
        "businessaddress.postal_town",
        "valid_approval_areas.subject_area",
        "valid_approval_areas.function",
        "valid_approval_areas.pbl",
        "valid_approval_areas.grade",
      ],
      transforms: [
        json2csv.transforms.unwind({ paths: ["valid_approval_areas"] }),
        json2csv.transforms.flatten({ separator: "." }),
      ],
    })
  )
  .then((csv_output) => fs.writeFile("./enterprises.csv", csv_output));
