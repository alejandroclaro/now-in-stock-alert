const axios     = require("axios");
const DomParser = require('dom-parser');
const parser    = new DomParser();

module.exports = function(configuration)
{
  return new AmazonClient(configuration);
}

/**
 * @brief Amazon client contructor.
 *
 * @param {Object} configuration The client configuration.
 */
function AmazonClient(configuration)
{
}

/**
 * @brief Checks whether the given product is in stock or not.
 *
 * @param {String}   code The product code.
 * @param {Function} func The function to call when request ends.
 */
AmazonClient.prototype.check = function (code, func)
{
  const url = "http://www.amazon.com/dp/" + code;

  axios.get(url).then(function (response)
  {
    const doc     = parser.parseFromString(response.data);
    const name    = doc.getElementById('productTitle').innerHTML.trim();
    const instock = doc.getElementById('availability').innerHTML.search("In Stock") !== -1;

    func(null, { "name": name, "instock" : instock, "url": url });
  })
  .catch(function (error)
  {
    console.log(error.message);
    func(error.message, {});
  });
};
