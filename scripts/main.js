// main.js

// Takes in name of csv and populates necessary data in table
function readFromCSV(path) {
  fetch(path)
    .then(function (response) {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.text();
    })
    .then(function (allText) {
      let out = CSV.parse(allText);
      let traineesLocal = convertCSVArrayToTraineeData(out);
      populateTable(traineesLocal);
    })
    .catch(function (err) {
      console.error("Failed to load CSV:", err);
    });
}

function convertCSVArrayToTraineeData(csvArrays) {
  trainees = csvArrays.map(function (traineeArray, index) {
    const trainee = {};
    trainee.name_romanized = traineeArray[0];
    if (traineeArray[2] === "-") {
      // trainee only has hangul
      trainee.name_hangul = traineeArray[1];
    } else {
      trainee.name_japanese = traineeArray[1];
      trainee.name_hangul = traineeArray[2];
    }
    trainee.company = traineeArray[3];
    trainee.grade = traineeArray[4];
    trainee.birthyear = traineeArray[5];
    trainee.eliminated = traineeArray[6] === "e";
    trainee.top12 = traineeArray[6] === "t";
    trainee.id = parseInt(traineeArray[7], 10) - 1;
    trainee.image =
      trainee.name_romanized.replace(/[\s-]/g, "") + ".jpg"; // remove spaces/dashes globally
    return trainee;
  });
  filteredTrainees = trainees;
  return trainees;
}

function populateTable(traineesLocal) {
  const table = document.getElementById("trainee-table");
  const exampleEntry = table.children[0];

  traineesLocal.forEach(function (trainee) {
    const insertedEntry = exampleEntry.cloneNode(true);
    insertedEntry.style.display = "block";

    const nameBox = insertedEntry.querySelector(".trainee-name");
    nameBox.textContent = trainee.name_romanized;

    const companyBox = insertedEntry.querySelector(".trainee-company");
    companyBox.textContent = trainee.company;

    const img = insertedEntry.querySelector(".trainee-img");
    img.src = "assets/trainees/" + trainee.image;

    table.appendChild(insertedEntry);
  });

  exampleEntry.style.display = "none";
}

function rerenderRanking() {
  const rankRow = document.getElementById("rank-row");
  const exampleEntry = rankRow.children[0];

  // Clear existing except example
  while (rankRow.children.length > 1) {
    rankRow.removeChild(rankRow.lastChild);
  }

  ranking.forEach(function (trainee, index) {
    const insertedEntry = exampleEntry.cloneNode(true);
    insertedEntry.style.display = "block";
    insertedEntry.setAttribute("data-rankid", index);

    const nameBox = insertedEntry.querySelector(".trainee-rank-name");
    nameBox.textContent = trainee.name_romanized;

    const img = insertedEntry.querySelector(".trainee-rank-img");
    img.src = "assets/trainees/" + trainee.image;

    const dragIcon = insertedEntry.children[0].children[0];
    const iconBorder = dragIcon.children[1];

    dragIcon.addEventListener("dragstart", createDragStartListener(index));
    insertedEntry.addEventListener("dragover", (e) => e.preventDefault());
    insertedEntry.addEventListener("drop", createDropListener());

    rankRow.appendChild(insertedEntry);
  });

  exampleEntry.style.display = "none";
}

function swapTrainees(index1, index2) {
  const tempTrainee = ranking[index1];
  ranking[index1] = ranking[index2];
  ranking[index2] = tempTrainee;
  rerenderRanking();
}