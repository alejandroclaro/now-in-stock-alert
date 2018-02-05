const axios     = require("axios");
const DomParser = require('dom-parser');
const parser    = new DomParser();

function AmazonClient(configuration)
{
}

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
    func(error.message, {});
  });
};

module.exports = function(configuration)
{
  return new AmazonClient(configuration);
}