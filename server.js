const LegoData = require("./modules/legoSets");
const legoData = new LegoData();


const path = require('path');
const express = require('express'); // "require" the Express module
const app = express(); // obtain the "app" object
const HTTP_PORT = process.env.PORT || 8081; // assign a port


// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// start the server on the port and output a confirmation to the console
app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/home.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/about.html'));
});


app.get("/lego/sets", async (req, res) => {
  try {
    const theme = req.query.theme;
    const sets = theme
      ? await legoData.getSetsByTheme(theme)
      : await legoData.getAllSets();
    res.json(sets);
  } catch (err) {
    res.status(404).send(err);
  }
});
app.get("/lego/sets/:set_num", async (req, res) => {
  try {
    const set = await legoData.getSetByNum(req.params.set_num);
    res.json(set);
  } catch (err) {
    res.status(404).send(err);
  }
});

app.get("/lego/add-test", async (req, res) => {
  const testSet = {
    set_num: "123",
    name: "TestSet Name",
    year: "2024",
    theme_id: "366",
    num_parts: "123",
    img_url: "https://fakeimg.pl/375x375?text=[+Lego+]"
  };

  try {
    await legoData.addSet(testSet);
    res.redirect("/lego/sets");
  } catch (err) {
    res.status(422).send(err);
  }
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
});


legoData.initialize().then(() => {
  app.listen(HTTP_PORT, () => {
    console.log(`Server listening on: ${HTTP_PORT}`);
  });
}).catch(err => {
  console.log("Error initializing lego data:", err);
});

