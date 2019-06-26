const request = require("request");
const cheerio = require("cheerio");
const uuid = require("uuid");
const fs = require("fs");

const url = "YOUR URL";

request(url, function(error, response, body) {
  if (!error) {
    const $ = cheerio.load(body);
    const wrapHotels = $("#hotellist_inner .sr_item");
    let hotels = [];
    wrapHotels.each((i, wh) => {
      const description = $(wh)
        .find(".hotel_desc")
        .text()
        .trim();
      const imagePreview = $(wh)
        .find(".sr_item_photo .hotel_image")
        .attr("src")
        .trim();
      const stars = +$(wh).attr("data-class");
      const city = $(wh)
        .find(".address .visited_link")
        .text()
        .trim()
        .replace("\n", "")
        .replace("-", "");
      const name = $(wh)
        .find(".sr-hotel__name")
        .text()
        .trim();
      const id = uuid();
      hotels.push({
        id,
        name,
        stars,
        city,
        description,
        imagePreview
      });
    });
    hotels = JSON.stringify(hotels);
    fs.appendFile("./hotels.json", hotels, "utf-8", err => {
      if (err) {
        console.log("Error", err);
      }
    });
  } else {
    console.log("Something went wrong" + error);
  }
});
