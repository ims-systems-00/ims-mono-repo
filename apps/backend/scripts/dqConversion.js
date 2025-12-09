const fs = require("fs");

// Load JSON data from file (you can replace this with your actual data)
const jsonData = require("./data/defraFactorsBase.json");

// Modify the grades based on your conditions
const modifyGrades = (data) => {
  data.forEach((item) => {
    switch (item.Grade) {
      case "A+":
      case "A":
        item.Grade = "Very Good Data Quality";
        break;
      case "B+":
      case "B":
        item.Grade = "Good Data Quality";
        break;
      case "C+":
      case "C":
        item.Grade = "Fair Data Quality";
        break;
      case "D+":
      case "D":
        item.Grade = "Basic Data Quality";
        break;
      default:
        // Leave the grade unchanged if it doesn't match any condition
        break;
    }
  });
  return data;
};

// Modify grades
const modifiedData = modifyGrades(jsonData.data);

// Save the modified data to a new JSON file
fs.writeFile(
  "modified_data.json",
  JSON.stringify({ data: modifiedData }, null, 2),
  (err) => {
    if (err) {
      console.error("Error writing file:", err);
    } else {
      console.log("Modified data saved to modified_data.json");
    }
  }
);
