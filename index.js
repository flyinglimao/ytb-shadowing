const express = require("express");
const getVideo = require("./download");

const app = express();

app.use(express.static("public"));
app.use("/downloads", express.static("downloads"));

app.get("/video", (req, res) => {
  const url = req.query.url;
  res.send(getVideo(url));
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
