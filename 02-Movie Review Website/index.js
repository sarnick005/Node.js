const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require('uuid');


app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use('/public', express.static('public'));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'movieApp',
    password : 'MySQL@12345#'
});
//HOME ROUTE
app.get("/", (req, res)=>{
    let q = `SELECT * FROM movieList`;
    try {
        connection.query(q, (err, result) => {
            if (err) {
                console.error(err);
                res.send("Some error occurred in DB");
            }
            res.render("home", {result});
        });
    } catch (err) {
        console.log(err);
        res.send("Some error occurred in DB");
    }
});


//MOVIE DETAILS ROUTE

app.get("/movie/:movieName", (req, res)=>{
    let {movieName: movie} = req.params;
    let q = `SELECT * FROM movieList WHERE movieName = "${movie}"`;
    try {
        connection.query(q, (err, movieDetails) => {
            if (err) {
                console.error(err);
                res.send("Some error occurred in DB");
            }
            res.render("movieDetails", {movieDetails});
        });
    } catch (err) {
        console.log(err);
        res.send("Some error occurred in DB");
    }
    
});

app.post("/movie/:movieName/review", (req, res) => {
    const movieName = req.params.movieName;
    const reviewText = req.body.textArea;

    console.log("Movie Name:", movieName);
    console.log("Review Text:", reviewText);

    let q1 = `SELECT id FROM movieList WHERE movieName = ?`;

    connection.query(q1, [movieName], (err, result1) => {
        if (err) {
            console.error("Error in Step 1:", err);
            return res.status(500).send("Error occurred while retrieving movie ID from the database.");
        }

        if (result1.length === 0) {
            return res.status(404).send("Movie not found.");
        }

        const movie_id = result1[0].id;
        console.log("Movie ID:", movie_id);
        let q2 = `INSERT INTO reviewList (movieName, review, movie_id) VALUES (?, ?, ?)`;

        connection.query(q2, [movieName, reviewText, movie_id], (err, result2) => {
            if (err) {
                console.error("Error in Step 2:", err);
                return res.status(500).send("Error occurred while saving the review to the database.");
            }

            console.log("Review added successfully.");
            res.redirect(`/movie/${movieName}`);
        });
    });
});



//RETURN HOME ROUTE
app.get("/movie", (req, res)=>{
    res.redirect("/");
});



//RATINGS

app.get('/movie/:movieName/rating', (req, res) => {
    try {
        const movie = req.params.movieName;
        const rating = req.query.rating;
        const movieName = movie.replace(/:/g, '');

        let q1 = `UPDATE movieList SET ratingsCount = ratingsCount + 1 WHERE movieName = "${movieName}"`;
        let q = `SELECT ratingsCount FROM movieList WHERE movieName = "${movieName}"`;

        connection.query(q, (err, ratingsArray) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Some error occurred in DB");
            }

            if (ratingsArray[0].ratingsCount !== 0) {
                let q2 = `UPDATE movieList SET ratings = (ratings + ${rating})/2 WHERE movieName = "${movieName}"`;

                connection.query(q2, (err, updatedCount) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send("Some error occurred in DB");
                    }
                    res.redirect("/");
                });
            } else {
                let q2 = `UPDATE movieList SET ratings = ${rating} WHERE movieName = "${movieName}"`;

                connection.query(q2, (err, updatedCount) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send("Some error occurred in DB");
                    }
                    res.redirect("/");
                });
            }
        });

        connection.query(q1, (err, updatedCount) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Some error occurred in DB");
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Some error occurred in DB");
    }
});

app.listen(8080, ()=>{
    console.log("Listening to port : 8080");
});