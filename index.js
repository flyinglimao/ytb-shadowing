const express = require("express");
const getVideo = require("./download");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use("/downloads", express.static("downloads"));

app.get("/video", (req, res) => {
  const url = req.query.url;
  res.send(getVideo(url));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
