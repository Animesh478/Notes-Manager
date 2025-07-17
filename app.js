const addBtn = document.querySelector("#add-note");
const title = document.querySelector("#note-title");
const description = document.querySelector("#description");
const notesList = document.querySelector("ul");
const form = document.querySelector("#form");
const totalNumberOfNotes = document.querySelector(".total-notes");
const notesDisplayed = document.querySelector(".showing");
const searchNoteEl = document.querySelector(".search-note");

// Adding note to the database
async function addNotes(e) {
  e.preventDefault();

  // creating the object to store the data
  const obj = {
    title: title.value,
    description: description.value,
  };
  try {
    // making a post request to the server
    const result = await axios.post(
      "https://crudcrud.com/api/345fab5ff96c4027a0e022ef5776de8b/notes",
      obj
    );
    showNotes();
  } catch (error) {
    console.log(error);
  }
  title.value = "";
  description.value = "";
}

// fetch all notes from server
async function fetchAllNotes() {
  const response = await axios.get(
    "https://crudcrud.com/api/345fab5ff96c4027a0e022ef5776de8b/notes"
  );
  const data = response.data;

  totalNumberOfNotes.textContent = `Total Notes: ${data.length}`;
  notesDisplayed.textContent = `Showing: ${data.length}`;

  return data;
}

// Displaying all the notes
async function showNotes() {
  notesList.innerHTML = "";

  const data = await fetchAllNotes();

  data.forEach((note) => {
    const li = document.createElement("li");
    li.classList.add("note");
    li.dataset.noteId = note._id; // setting the data attribute using the id of each note, so as to uniquely identify them

    const titleEl = document.createElement("h2");
    const descriptionEl = document.createElement("p");
    const deleteBtn = document.createElement("button");

    titleEl.appendChild(document.createTextNode(note.title));
    descriptionEl.appendChild(document.createTextNode(note.description));
    deleteBtn.appendChild(document.createTextNode("Delete"));
    deleteBtn.id = "delete";

    li.appendChild(titleEl);
    li.appendChild(descriptionEl);
    li.appendChild(deleteBtn);

    notesList.appendChild(li);
  });
}

// Delete notes
async function deleteNote(e) {
  try {
    if (
      (e.target.tagName === "BUTTON" &&
        e.target.parentElement.tagName === "LI") ||
      e.target.id === "delete"
    ) {
      const id = e.target.parentElement.dataset.noteId;
      console.log(id);
      const response = await axios.delete(
        `https://crudcrud.com/api/345fab5ff96c4027a0e022ef5776de8b/notes/${id}`
      );
      console.log(response);
    }
  } catch (error) {
    console.log(error);
  }
  e.target.parentElement.remove();
  fetchAllNotes();
}

// searching functionality
function searchForNote(e) {
  const inputText = e.target.value.toLowerCase();
  const notes = notesList.querySelectorAll("li");
  let notesCount = 0;

  for (const note of notes) {
    const noteTitle = note.querySelector("h2").textContent.toLowerCase();
    console.log(noteTitle);
    if (noteTitle.indexOf(inputText) !== -1) {
      note.classList.remove("hidden");
      notesCount++;
    } else {
      note.classList.add("hidden");
    }
  }
  notesDisplayed.textContent = `Showing: ${notesCount}`;
}

searchNoteEl.addEventListener("keyup", searchForNote);
form.addEventListener("submit", addNotes);
notesList.addEventListener("click", deleteNote);
document.addEventListener("DOMContentLoaded", showNotes);
