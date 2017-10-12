const randomWords = require("random-words");
const axios = require("axios");
const key = process.env.GIPHY_KEY;

// generate same/bad results from giphy
const badKeywords = [
  "yarn",
  "changelog",
  "link",
  "links",
  "publish",
  "style tweak",
  "script",
  "install",
  "test"
];

module.exports.getGif = async function(message, is_mobile) {
  const query = transformCommitMessage(message);
  const params = {
    s: query,
    api_key: key,
    rating: "g"
  };

  const response = await axios.get("http://api.giphy.com/v1/gifs/translate", {
    params
  });
  const parsedGif = parseGiphyResponse(response, is_mobile);

  return {
    url: parsedGif.url,
    message
  };
};

function parseGiphyResponse(response, is_mobile) {
  if (!response.data || !response.data.data) {
    return;
  }
  const responseData = response.data.data;
  const gif = is_mobile
    ? responseData.images.fixed_width_downsampled
    : responseData.images.downsized;

  return { url: gif.url };
}

function transformCommitMessage(message) {
  let withoutBadKeywords = message;

  badKeywords.forEach(keyword => {
    let badIndex = withoutBadKeywords.indexOf(keyword);
    if (badIndex !== -1) {
      withoutBadKeywords =
        withoutBadKeywords.slice(0, badIndex) +
        withoutBadKeywords.slice(badIndex + keyword.length);
    }
  });

  let split = message.split(" ");

  if (split.length < 5) {
    split.join(randomWords(5));
  }

  let transformed = [];
  let withoutDuplicates = [];

  transformed = split.map(s => s.replace(/[^\w\s]/gi, ""));
  transformed = transformed.map(s => s.replace("\n", ""));
  transformed = transformed.map(s => s.trim());
  transformed = transformed.filter(s => s.length);

  transformed.forEach(s => {
    if (withoutDuplicates.indexOf(s) === -1) {
      withoutDuplicates.push(s);
    }
  });

  return withoutDuplicates.slice(0, 5).join("+");
}
