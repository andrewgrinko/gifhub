const axios = require("axios");
const key = process.env.GIPHY_KEY;

module.exports.getGif = async function(message, is_mobile) {
  const query = message.split(" ").join("+"); // todo replace this with below transform func
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

/* eslint-disable */ // is not happy because func is not used
function transformCommitMessage(message) {
  let split = message.split(" ");
  if (split.length < 5) {
    return split.join("+");
  }

  let transformed = [];
  let withoutDuplicates = [];
  let wordCount = {};

  transformed = split.map(s => s.replace(/[^\w\s]/gi, ""));
  transformed = transformed.map(s => s.replace("\n", ""));
  transformed = transformed.map(s => s.trim());
  transformed = transformed.filter(s => s.length);

  transformed.forEach(s => {
    if (withoutDuplicates.indexOf(s) === -1) {
      withoutDuplicates.push(s);
      wordCount[s] = 1;
    } else {
      wordCount[s]++;
    }
  });

  // todo get keys with maximum count values and make a new message with max 3-4 words
}
