document.addEventListener("DOMContentLoaded", function() {
  let boardData = null;         // Contiene il JSON del tabellone
  let currentQuestionPoints = 0;  // Punti della domanda attualmente aperta
  let currentOpenedCell = null;   // Riferimento alla cella attualmente aperta

  // Carica il tabellone quando viene premuto il pulsante "Load Board"
  const loadBoardBtn = document.getElementById("load-board-btn");
  loadBoardBtn.addEventListener("click", function() {
    const numPlayersInput = document.getElementById("num-players");
    const jsonFileInput = document.getElementById("json-file");
    const numPlayers = parseInt(numPlayersInput.value, 10) || 0;
    const file = jsonFileInput.files[0];
    if (!file || numPlayers <= 0) {
      alert("Please select a valid JSON file and enter a valid number of players.");
      return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        boardData = JSON.parse(e.target.result);
        // Nascondi la sezione di setup e mostra il tabellone e la scoreboard
        document.getElementById("setup-section").classList.add("d-none");
        buildBoard(boardData);
        buildScoreboard(numPlayers);
        document.getElementById("board-section").classList.remove("d-none");
        document.getElementById("scoreboard-section").classList.remove("d-none");
      } catch (error) {
        alert("Error parsing JSON file.");
      }
    };
    reader.readAsText(file);
  });

  // Crea il tabellone a partire dal JSON
  function buildBoard(data) {
    const boardTitle = document.getElementById("board-title");
    boardTitle.textContent = data.name || "Board";
    const boardContainer = document.getElementById("board-container");
    const table = document.createElement("table");
    table.classList.add("table", "table-bordered");

    // Header: prima cella vuota, poi le categorie
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const thEmpty = document.createElement("th");
    thEmpty.textContent = "";
    headerRow.appendChild(thEmpty);
    data.categories.forEach(function(category) {
      const th = document.createElement("th");
      th.textContent = category;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Corpo della tabella: per ogni riga di dati
    const tbody = document.createElement("tbody");
    data.rows.forEach(function(rowData, rowIndex) {
      const tr = document.createElement("tr");
      // Prima cella: il valore dei punti
      const tdPoints = document.createElement("td");
      tdPoints.textContent = rowData.points;
	  tdPoints.classList.add = "th-points";
      tr.appendChild(tdPoints);
      // Celle per le domande
      rowData.questions.forEach(function(qData, colIndex) {
        const td = document.createElement("td");
        td.textContent = "try this";
        // Memorizza i dati della cella (domanda e risposta in base64)
        td.dataset.question = qData.question;
        td.dataset.answer = qData.answer;
        // Estrae il valore numerico dei punti dalla stringa (es. "Points 100")
        const pointsMatch = rowData.points.match(/\d+/);
        td.dataset.points = pointsMatch ? pointsMatch[0] : "0";
        td.addEventListener("click", function() {
          openCell(td);
        });
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    boardContainer.innerHTML = "";
    boardContainer.appendChild(table);
  }

  // Quando una cella viene cliccata, mostra il question overlay in full screen
  function openCell(cell) {
    currentOpenedCell = cell;
    // Decodifica la domanda e la risposta
    const question = atob(cell.dataset.question);
    const answer = atob(cell.dataset.answer);
    currentQuestionPoints = parseInt(cell.dataset.points, 10) || 0;
    document.getElementById("question-text").innerHTML = question;
    const answerDiv = document.getElementById("answer-text");
    answerDiv.classList.add("d-none");
    answerDiv.innerHTML = answer;
    document.getElementById("question-overlay").classList.remove("d-none");
    document.getElementById("fact-check-btn").classList.remove("d-none");
    document.getElementById("fact-check-result").classList.add("d-none");
    // Se la cella è già stata aperta, cambia il testo in "show again"
    cell.textContent = "show again";
    cell.style.backgroundColor = "var(--leo-emrald-green)";
  }

  // Gestione dei pulsanti nell'overlay
  document.getElementById("show-answer-btn").addEventListener("click", function() {
    document.getElementById("answer-text").classList.remove("d-none");
	document.getElementById("hr-question").classList.remove("d-none");
  });
  document.getElementById("close-overlay-btn").addEventListener("click", function() {
    document.getElementById("question-overlay").classList.add("d-none");
	document.getElementById("hr-question").classList.add("d-none");
  });

  // Costruisce la scoreboard con il numero iniziale di giocatori
  function buildScoreboard(numPlayers) {
    const scoreboardDiv = document.getElementById("scoreboard");
    scoreboardDiv.innerHTML = "";
	if (numPlayers > 6){
		alert("Maximum of 6 players allowed.");
		numPlayers = 6;
	}
    for (let i = 1; i <= numPlayers; i++) {
      scoreboardDiv.appendChild(createPlayerBox(i));
    }
  }

  // Crea una casella per un giocatore
  function createPlayerBox(playerNumber) {
    const box = document.createElement("div");
    box.classList.add("player-box", "mr-2", "mb-2");
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = "Player " + playerNumber;
    nameInput.classList.add("player-name", "form-control", "mb-1");
    box.appendChild(nameInput);
    const scoreDisplay = document.createElement("div");
    scoreDisplay.classList.add("player-score", "mb-1");
    scoreDisplay.textContent = "0";
    box.appendChild(scoreDisplay);
    const btnGroup = document.createElement("div");
    btnGroup.classList.add("btn-group");
    const plusBtn = document.createElement("button");
    plusBtn.classList.add("btn", "btn-success");
    plusBtn.textContent = "+";
    plusBtn.addEventListener("click", function() {
      let currentScore = parseInt(scoreDisplay.textContent, 10) || 0;
      scoreDisplay.textContent = currentScore + currentQuestionPoints;
    });
    const minusBtn = document.createElement("button");
    minusBtn.classList.add("btn", "btn-danger");
    minusBtn.textContent = "-";
    minusBtn.addEventListener("click", function() {
      let currentScore = parseInt(scoreDisplay.textContent, 10) || 0;
      scoreDisplay.textContent = currentScore - currentQuestionPoints;
    });
    btnGroup.appendChild(plusBtn);
    btnGroup.appendChild(minusBtn);
    box.appendChild(btnGroup);
    return box;
  }

    // Add a new player to the scoreboard (max 6 players)
    document.getElementById("add-player-btn").addEventListener("click", function() {
      const scoreboardDiv = document.getElementById("scoreboard");
      const currentPlayers = scoreboardDiv.children.length;

      if (currentPlayers >= 6) {
        alert("Maximum of 6 players allowed.");
        return; // Prevent adding more players
      }

      const newPlayerNumber = currentPlayers + 1;
      scoreboardDiv.appendChild(createPlayerBox(newPlayerNumber));
    });
});

document.getElementById("fact-check-btn").addEventListener("click", async function() {
    const questionText = document.getElementById("question-text").textContent;

    if (!questionText) {
        alert("No question available for fact-checking.");
        return;
    }

    const resultBox = document.getElementById("fact-check-result");
    resultBox.value = "Checking facts...";
    resultBox.classList.remove("d-none");

    try {
        const response = await fetch("/api/fact-check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: questionText })
        });

        const data = await response.json();
        resultBox.value = data.factCheck || "No fact-check result available.";

    } catch (error) {
        console.error("Fact-checking error:", error);
        resultBox.value = "Error fetching fact-checking data.";
    }
});
