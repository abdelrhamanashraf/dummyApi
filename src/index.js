const url = "http://localhost:3000/notes";
const addNote = document.getElementById("add");
const noteSections = document.getElementById("noteSections");
const inputBox = document.getElementById("inputBox");
const showMsg = (msg, stat) => {
  const div = document.querySelector("#massege");
  div.appendChild(document.createTextNode(msg));
  if (stat === "success") {
    div.classList.add("success");
    setTimeout(() => {
      div.classList.remove();
      div.innerText = "";
    }, 1000);
  } else if (stat === "error") {
    div.classList.add("error");
    setTimeout(() => {
      div.classList.remove();
      div.innerText = "";
    }, 1000);
  }
};
let output = "";
const renderNotes = (posts) => {
  posts.forEach((post) => {
    output += `<div class="note" id="${post.id}">
<p>${post.title}</p>
<img src="assets/delete.png" alt="delete" class="del">
<img src="assets/add-notes.png" alt="edit" class="edit">
</div>`;
  });
  noteSections.innerHTML = output;
};
//get notes
fetch(url)
  .then((response) => response.json())
  .then((data) => renderNotes(data));
// post notes
addNote.addEventListener("click", (e) => {
  e.preventDefault();
  const valueBx = inputBox.value;
  if (valueBx !== "") {
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: valueBx }),
    })
      .then((response) => response.json())
      .catch((error) => console.error("Error:", error));
    showMsg("created successfully", "success");
  } else {
    showMsg("Please enter a note", "error");
  }
});

// delete notes
noteSections.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.classList.contains("del")) {
    const id = e.target.parentElement.id;
    fetch(`${url}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
    showMsg("deleted successfully", "success");
  }
});
// update notes
noteSections.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.classList.contains("edit")) {
    const id = e.target.parentElement.id;
    const parent = e.target.parentElement;
    let title = parent.querySelector("p").innerText;
    inputBox.value = title;
    console.log(parent);
    noteSections.innerHTML =
      output +
      `<button id="updatenote"><img src="assets/edit.png" alt="update">Updatenote</button>`;
    const updateNote = document.getElementById("updatenote");
    updateNote.addEventListener("click", (e) => {
      e.preventDefault();
      const valueBx = inputBox.value;
      fetch(`${url}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id, title: valueBx }),
      })
        .then((data) => console.log(data))
        .catch((error) => console.error("Error:", error));
      showMsg("updated successfully", "success");
    });
  }
});
