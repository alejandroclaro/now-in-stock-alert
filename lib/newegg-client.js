const axios     = require("axios");
const DomParser = require('dom-parser');
const parser    = new DomParser();

module.exports = function(configuration)
{
  return new NeweggClient(configuration);
}

/**
 * @brief Newegg client contructor.
 *
 * @param {Object} configuration The client configuration.
 */
function NeweggClient(configuration)
{
}

/**
 * @brief Checks whether the given product is in stock or not.
 *
 * @param {String}   code The product code.
 * @param {Function} func The function to call when request ends.
 */
NeweggClient.prototype.check = function (code, func)
{
  const url = "http://www.newegg.com/Product/Product.aspx?Item=" + code;

  axios.get(url).then(function (response)
  {
    const doc     = parser.parseFromString(response.data);
    const name    = doc.getElementById("grpDescrip_h").getElementsByTagName("span").innerHTML;
    const instock = doc.getElementById("landingpage_stock").innerHTML.search("In Stock") !== -1;

    console.log(name);
    func(null, { "name": name, "instock" : instock, "url": url });
  })
  .catch(function (error)
  {
    console.log(error.message);
    func(error.message, {});
  });
};
