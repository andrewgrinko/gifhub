const axios = require("axios");
const key = "dc6zaTOxFJmzC";

module.exports.getGif = async function(message, is_mobile) {
  const query = message.split(" ").join("+");
  const params = {
    s: query,
    api_key: key
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
  const url = is_mobile
    ? responseData.images.fixed_width_downsampled.url
    : responseData.images.downsized.url;

  return { url };
}
