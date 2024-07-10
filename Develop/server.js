const express = require('express');
const fs = require('fs');
const path = require('path');
const generateUniqueId = require('./public/helpers/idGenerator');
// --------------------------------------------------------
const app = express();
const port = 3001;
let db = require('./db/db.json');

// ---------------------------------------------------------

// Middleware for serving static files
app.use(express.static('public'));

// -----------------------------------------------------------

// Middleware for parsing application/json and x-www-form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------------------------------------------------

// GET request for notes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));  
});
// -----------------------------------------------------------

// GET request for db (sending back the data)
app.get('/api/notes', (req, res) => {    
      console.log('Fetching notes...');
    console.log(db); // Log the current state of db
    res.json(db);
});
// ----------------------------------------------------------

// wildcard route to handle other requests and serve the home page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ------------------------------------------------------------

// POST request for adding new notes

app.post('/api/notes', (req, res) => {
    // Logging the content of the body
    console.log(`The content of the body is: ${JSON.stringify(req.body)}`);
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
        //-----------------------------------------
            // // Generate a unique ID
            id: generateUniqueId(),
        // ----------------------------------------
            title,
            text,
        };

        // add new notes to the json file

        db.push(newNote);

        // Writting the file

        fs.writeFile('./db/db.json', JSON.stringify(db, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json('Error in posting notes');
            }

            const response = {
                status: "success",
                body: newNote,
            };

            console.log(response);
            res.status(200).json(response);
        });
    } else {
        res.status(500).json('Error in posting notes');
    }
});

// ---------------------------------------------------------------------------------------------------------------------

// DELETE THE NOTES

app.delete('/api/notes/:id', (req, res)=> {

const noteId = req.params.id;
const newDb = db.filter(note => note.id !== noteId);

if (newDb.length === db.length) {
        return res.status(404).json({ message: 'Note not found' });
    }

// Update the database
    db = newDb;

    // Save the new database to the file
    fs.writeFile('./db/db.json', JSON.stringify(db, null, 2), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error deleting note' });
        }

        res.status(200).json({ message: 'Note deleted successfully' });
    });

})
// ---------------------------------------------------------------------------
// Start the server
app.listen(port, () => {
    console.log(`The server is running at port ${port}`);
});
