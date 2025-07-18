const LegoData = require("./modules/legoSets");
const legoData = new LegoData();

const express = require('express');
const path = require('path');
const app = express();
const HTTP_PORT = process.env.PORT || 8081;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Home page
app.get('/', (req, res) => {
  res.render("home");
});

// About page
app.get('/about', (req, res) => {
  res.render("about");
});

// Sets listing
app.get("/lego/sets", async (req, res) => {
  try {
    const theme = req.query.theme;
    const sets = theme
      ? await legoData.getSetsByTheme(theme)
      : await legoData.getAllSets();
    res.render("sets", { sets });
  } catch (err) {
    res.status(404).send(err);
  }
});

// Individual set
app.get("/lego/sets/:set_num", async (req, res) => {
  try {
    const set = await legoData.getSetByNum(req.params.set_num);
    res.render("set", { set });
  } catch (err) {
    res.status(404).send(err);
  }
});

// Add set form
app.get("/lego/addSet", async (req, res) => {
  try {
    const themes = await legoData.getAllThemes();
    res.render("addSet", { themes });
  } catch (err) {
    res.status(500).send("Unable to load themes");
  }
});

// Add set POST
app.post("/lego/addSet", async (req, res) => {
  try {
    const foundTheme = await legoData.getThemeById(req.body.theme_id);
    req.body.theme = foundTheme.name;
    await legoData.addSet(req.body);
    res.redirect("/lego/sets");
  } catch (err) {
    res.status(422).send(err);
  }
});

// Delete set
app.get("/lego/deleteSet/:set_num", async (req, res) => {
  try {
    await legoData.deleteSetByNum(req.params.set_num);
    res.redirect("/lego/sets");
  } catch (err) {
    res.status(404).send(err);
  }
});

// 404 Page
app.use((req, res) => {
  res.status(404).render("404", { page: "" });
});

// Init data + start server
legoData.initialize().then(() => {
  app.listen(HTTP_PORT, () => {
    console.log(`Server listening on: ${HTTP_PORT}`);
  });
}).catch(err => {
  console.log("Error initializing lego data:", err);
});