const fs = require("fs");
const ytdl = require("ytdl-core");

// clean up temp files
fs.readdir("./downloads", (err, files) => {
  if (err) {
    console.error("Error reading directory:", err);
    return;
  }

  files.forEach((file) => {
    if (file.endsWith("temp")) {
      fs.unlink(`./downloads/${file}`, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        }
      });
    }
  });
});

function getVideo(url) {
  const id = ytdl.getURLVideoID(url);

  const downloading = fs.existsSync(`./downloads/${id}.mp4.temp`);
  const downloaded = fs.existsSync(`./downloads/${id}.mp4`);

  if (downloaded) {
    return {
      status: "downloaded",
      path: `./downloads/${id}.mp4`,
    };
  }

  if (downloading) {
    return {
      status: "downloading",
    };
  }

  const downloadStream = ytdl(url, {
    filter: (format) =>
      format.container === "mp4" &&
      format.videoCodec !== null &&
      format.audioCodec !== null,
  });
  downloadStream.pipe(fs.createWriteStream(`./downloads/${id}.mp4.temp`));
  downloadStream.on("progress", console.log);
  downloadStream.on("end", () => {
    fs.renameSync(`./downloads/${id}.mp4.temp`, `./downloads/${id}.mp4`);
  });
  downloadStream.on("error", () => {
    fs.unlinkSync(`./downloads/${id}.mp4.temp`);
  });

  return {
    status: "downloading",
  };
}

module.exports = getVideo;
