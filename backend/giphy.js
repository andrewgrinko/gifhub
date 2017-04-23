const axios = require("axios");
const key = "dc6zaTOxFJmzC";

module.exports.getGif = async function(message) {
  const query = message.split(" ").join("+");
  const params = {
    s: query,
    api_key: key
  };

  const response = await axios.get("http://api.giphy.com/v1/gifs/translate", {
    params
  });
  const parsedGif = parseGiphyResponse(response);

  return {
    url: parsedGif.originalSizeGif,
    message
  };
};

function parseGiphyResponse(response) {
  if (!response.data || !response.data.data) {
    return;
  }
  const responseData = response.data.data;
  const originalSizeGif = responseData.images.original.url;

  return { originalSizeGif };
}
