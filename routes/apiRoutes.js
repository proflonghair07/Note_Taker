var noteContent = require("../db/noteContent");

const fs = require("fs");
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);

module.exports = function (app) {
  app.get("/api/notes", function (req, res) {
    res.json(noteContent);
  });

  app.post("/api/notes", function (req, res) {
    let newNote = req.body;

    let previousId = noteContent[noteContent.length - 1]["id"];
    let currentId = previousId + 1;
    newNote["id"] = currentId;

    console.log("req.body:", req.body);
    noteContent.push(newNote);

    writeFileAsync("./db/noteContent.json", JSON.stringify(noteContent)).then(
      function () {
        console.log("noteContent.json succesfully updated.");
      }
    );

    res.json(newNote);
  });

  app.delete("/api/notes/:id", function (req, res) {
    console.log("req.params:", req.params);
    let selectedId = parseInt(req.params.id);
    console.log(selectedId);

    for (let i = 0; i < noteContent.length; i++) {
      if (selectedId === noteContent[i].id) {
        noteContent.splice(i, 1);

        let noteJSON = JSON.stringify(noteContent, null, 2);

        writeFileAsync("./db/noteContent.json", noteJSON).then(function () {
          console.log("note succesfully deleted.");
        });
      }
    }
    res.json(noteContent);
  });
};
