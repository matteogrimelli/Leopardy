// Inizializza Summernote per le textarea del modal
$(document).ready(function() {
  $('#summernote-question').summernote({
    height: 300,
    placeholder: 'Enter a question',
    toolbar: [
      ['style', ['style']],
      ['font', ['bold', 'underline', 'clear']],
      ['para', ['ul', 'ol']],
      ['insert', ['link', 'picture']],
      ['view', ['codeview']]
    ],
    styleTags: ['p', 'h1', 'h3', 'h5'],
  });
  $('#summernote-answer').summernote({
    height: 300,
    placeholder: 'Enter an answer',
    toolbar: [
      ['style', ['style']],
      ['font', ['bold', 'underline', 'clear']],
      ['para', ['ul', 'ol']],
      ['insert', ['link', 'picture']],
      ['view', ['codeview']]
    ],
    styleTags: ['p', 'h1', 'h3', 'h5'],
  });
});

document.addEventListener("DOMContentLoaded", function() {
  // Costanti per il numero massimo di righe (data rows) e colonne (inclusa la colonna dei punti)
  const maxDataRows = 7;
  const maxCols = 7;

  const tableContainer = document.getElementById("div-container-create-table");
  const addRowBtn = document.getElementById("add-row-btn");
  const addColBtn = document.getElementById("add-col-btn");
  const saveTableBtn = document.getElementById("save-table-btn");
  const modal = document.getElementById("modal-update-question");
  const modalTitle = document.getElementById("modal-title");
  const $summernoteQuestion = $('#summernote-question');
  const $summernoteAnswer = $('#summernote-answer');

  // Variabili globali per memorizzare i dati per ogni cella e la cella attualmente in editing
  let cellData = new Map();
  let currentCellKey = "";
  let modalSaved = false;

  // Se il modal viene chiuso con "Close" (senza salvare) le textarea vengono ripristinate vuote
  $('#modal-update-question').on('hidden.bs.modal', function() {
    if (!modalSaved) {
      $summernoteQuestion.summernote('code', '');
      $summernoteAnswer.summernote('code', '');
    }
    modalSaved = false;
  });

  // Apertura del modal per una cella specifica
  function openModal(event) {
    const btn = event.currentTarget;
    const rowIndex = parseInt(btn.getAttribute("data-row-index"), 10);
    const colIndex = parseInt(btn.getAttribute("data-col-index"), 10);

    // Recupera la categoria dalla riga header (prima riga) per la colonna corrispondente
    const headerRow = tableContainer.querySelector(".row");
    const headerCells = headerRow.getElementsByClassName("col");
    let category = "Category";
    if (headerCells[colIndex]) {
      const catInput = headerCells[colIndex].querySelector("input");
      if (catInput) {
        category = catInput.value;
      }
    }

    // Recupera il valore dei punti dalla cella della riga (la prima cella della riga dei dati)
    const dataRow = tableContainer.querySelector(`.row:nth-child(${rowIndex + 1})`);
    let points = "100";
    if (dataRow) {
      const pointInput = dataRow.querySelector(".col:first-child input");
      if (pointInput) {
        points = pointInput.value;
      }
    }

    modalTitle.textContent = `Setup: ${category} for ${points} points`;
    currentCellKey = `${rowIndex}-${colIndex}`;
    // Carica i dati salvati per questa cella (se presenti)
    if (cellData.has(currentCellKey)) {
      const saved = cellData.get(currentCellKey);
      $summernoteQuestion.summernote('code', saved.question);
      $summernoteAnswer.summernote('code', saved.answer);
    } else {
      $summernoteQuestion.summernote('code', '');
      $summernoteAnswer.summernote('code', '');
    }
  }

	window.save = function() {
		const questionContent = $summernoteQuestion.summernote('code').trim();
		const answerContent = $summernoteAnswer.summernote('code').trim();

		if (!questionContent || !answerContent) {
			alert("Both question and answer must be filled out.");
			return;
		}

		// Save question and answer in the cellData map
		cellData.set(currentCellKey, {
			question: questionContent,
			answer: answerContent
		});

		// Cerca il bottone usando `data-row-index` e `data-col-index`
		const [rowIndex, colIndex] = currentCellKey.split('-');
		const btn = document.querySelector(`[data-row-index="${rowIndex}"][data-col-index="${colIndex}"]`);

		if (btn) {
			btn.textContent = "Edit Question";
            btn.style.backgroundColor = "var(--leo-emrald-green)";
		} else {
			console.error(`Button not found for cell: ${currentCellKey}`);
		}

		modalSaved = true;
		$('#modal-update-question').modal('hide');
	};

  // Crea un pulsante "Enter Question" per una cella (con rowIndex e colIndex specifici)
  function createQuestionButton(parentDiv, rowIndex, colIndex) {
    const btn = document.createElement("a");
    btn.classList.add("btn", "btn-warning", "btn-question");
    btn.setAttribute("data-toggle", "modal");
    btn.href = "#modal-update-question";
    btn.id = "C" + colIndex + "-P" + rowIndex; 
    btn.textContent = "Enter question";
    btn.setAttribute("data-row-index", rowIndex);
    btn.setAttribute("data-col-index", colIndex);
    btn.addEventListener("click", openModal);
    parentDiv.appendChild(btn);
  }

  // Aggiunge una nuova riga di dati (non conta l'header)
  function addRow() {
    const allRows = tableContainer.getElementsByClassName("row");
    const currentDataRows = allRows.length - 1;
    if (currentDataRows >= maxDataRows) return;
    const headerRow = allRows[0];
    const numCols = headerRow.getElementsByClassName("col").length;
    const newRowIndex = allRows.length; // header è la riga 0
    const newRow = document.createElement("div");
    newRow.classList.add("row");
    for (let i = 0; i < numCols; i++) {
      const colDiv = document.createElement("div");
      colDiv.classList.add("col");
      if (i === 0) {
        const input = document.createElement("input");
        input.type = "number";
        input.classList.add("input-point");
        input.value = "100";
        input.id = "P" + newRowIndex;
        input.title = "Insert point value for this row of questions"
        input.required = true;
        colDiv.appendChild(input);
      } else {
        createQuestionButton(colDiv, newRowIndex, i);
      }
      newRow.appendChild(colDiv);
    }
    tableContainer.appendChild(newRow);
  }

  // Aggiunge una nuova colonna a tutte le righe
  function addCol() {
    const rows = tableContainer.getElementsByClassName("row");
    const headerRow = rows[0];
    const currentCols = headerRow.getElementsByClassName("col").length;
    if (currentCols >= maxCols) return;
    for (let r = 0; r < rows.length; r++) {
      const colDiv = document.createElement("div");
      colDiv.classList.add("col");
      if (r === 0) {
        // Header: aggiunge input per categoria
        const input = document.createElement("input");
        input.type = "text";
        input.classList.add("input-category");
        input.value = "Enter category";
        input.id = "C" + currentCols;
        input.title = "Insert a category name for this column of questions";
        input.required = true;
        colDiv.appendChild(input);
      } else {
        // Data row: aggiunge pulsante "Enter Question" con colIndex = currentCols
        createQuestionButton(colDiv, r, currentCols);
      }
      rows[r].appendChild(colDiv);
    }
  }

  // Salva il tabellone come file JSON
  function saveTable() {
    const boardName = document.getElementById("table-title").value || "Board";
    const boardDescription = document.getElementById("table-description").value || "No description";
    
    // Legge le categorie dalla riga header
    const headerRow = tableContainer.querySelector(".row");
    const headerCells = headerRow.getElementsByClassName("col");
    let categories = [];
    for (let i = 1; i < headerCells.length; i++) {
        const input = headerCells[i].querySelector("input");
        categories.push(input ? input.value : "");
    }

    // Legge le righe di dati (escludendo l'header)
    const dataRows = Array.from(tableContainer.getElementsByClassName("row")).slice(1);
    let rowsArray = [];
    dataRows.forEach((row, idx) => {
        const actualRowIndex = idx + 1;
        const pointInput = row.querySelector(".col:first-child input");
        const pointsValue = pointInput ? pointInput.value : "100";  // Senza "Points"

        let questions = [];
        const cells = row.querySelectorAll(".col");
        for (let i = 1; i < cells.length; i++) {
            const key = `${actualRowIndex}-${i}`;
            const cellEntry = cellData.get(key) || { question: "", answer: "" };
            questions.push({
                question: btoa(cellEntry.question),
                answer: btoa(cellEntry.answer)
            });
        }

        rowsArray.push({
            points: pointsValue,  // Senza "Points"
            questions: questions
        });
    });

    // Nuovo formato JSON con version e encryption
    const board = {
        version: "2.0",
        encryption: "base64",
        name: boardName,
        description: boardDescription,  // Nuovo campo
        categories: categories,
        rows: rowsArray
    };

    const jsonStr = JSON.stringify(board, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = boardName + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}


  // Assegna gli event listener ai pulsanti principali
  //addRowBtn.addEventListener("click", addRow);
  //addColBtn.addEventListener("click", addCol);
  //saveTableBtn.addEventListener("click", saveTable);
  document.addEventListener("DOMContentLoaded", function() {
    const someElement = document.getElementById("your-element-id"); // Replace with actual element ID
    if (someElement) {
        someElement.addEventListener("click", function() {
            console.log("Element clicked!");
        });
    } else {
        console.warn("Element with ID 'your-element-id' not found.");
    }
});

  // Per il pulsante "Enter Question" iniziale già presente, aggiunge l'evento
  const initialQuestionBtn = document.querySelector(".btn-question");
  if (initialQuestionBtn) {
    initialQuestionBtn.addEventListener("click", openModal);
  }
});

$('textarea').keyup(function() {
    
  var characterCount = $(this).val().length,
      current = $('#current'),
      maximum = $('#maximum'),
      theCount = $('#the-count');
    
  current.text(characterCount);
  if (characterCount > 100 && characterCount <200) {
    current.css('color', 'yellow');
  }
  else if (characterCount >= 200) {
    current.css('color', 'red');
  } 
  else {
    current.css('color','#ffffff');
  }
  
});