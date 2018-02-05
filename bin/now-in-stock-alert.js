const commandLine   = require("../lib/command-line.js");
const clientFactory = require("../lib/client-factory.js");
const fs            = require("fs");
const opn           = require("opn");
const soundplayer   = require("sound-player")
const player        = new soundplayer({ filename: "../media/alert.ogg" });

/**
 * @brief Occurs when a error occurs playing an audio.
 *
 * @param error The error description.
 */
player.on('error', function(error)
{
  console.log('Error occurred:', error);
});

/**
 * @brief Gets an object property if it's present; otherwise, the default value.
 *
 * @param {Object} object       The object instance.
 * @param {String} name         The property name.
 * @param {Object} defaultValue The default value.
 *
 * @return {Object} The object property if it's present; otherwise, the default value.
 */
function getValue(object, name, defaultValue)
{
  return name in object ? object[name] : defaultValue;
}

/**
 * @brief Handles the retailer webservice response.
 *
 * @param {Object} product  The product configuration.
 * @param {Object} response The retailer webservice response.
 */
function handleResponse(product, response)
{
  if (response.instock)
  {
    player.play();

    if (!product.instock)
    {
      opn(response.url);
      product.instock = true;
    }
  }
  else
  {
    product.instock = false;
  }
}

/**
 * @brief Checks whether the given product/item is in stock or not.
 *
 * @param {Object} product The product configuration.
 */
function checkItemStock(product)
{
  if (getValue(product, "enabled", true))
  {
    const client   = clientFactory.create(product.retailer);

    client.check(product.code, function(error, response)
    {
      if (error)
      {
        console.log("[%s] Error checking %s: %s.", new Date().toISOString(), product.code, error);
      }
      else
      {
        handleResponse(product, response);
        console.log("[%s] %s (%s) is %s in %s.", new Date().toISOString(), response.name, product.code, response.instock ? "in-stock" : "unavailable", product.retailer);
      }
    });
  }
}

/**
 * @brief Checks whether the given list of products are in stock or not.
 *
 * @param {Array} products The product configuration collection.
 */
function checkProducts(products)
{
  try
  {
    products.forEach(checkItemStock);
  }
  catch (error)
  {
    console.log(error.message);
  }
}

/**
 * @brief Starts the monitor that check the producs availability.
 *
 * @param {String} filename The configuration file path.
 */
function startMonitor(filename)
{
  const config   = JSON.parse(fs.readFileSync(filename));
  const products = getValue(config, "products", []);

  checkProducts(products);
  setInterval(function () { checkProducts(products); }, getValue(config, "interval", 30000));
}

/**
 * @brief The application entry point.
 */
function main()
{
  try
  {
    const options = commandLine.parseOptions();

    if ("help" in options)
      commandLine.printHelp();
    else if ("config" in options)
      startMonitor(options.config);
    else
      startMonitor("config.json");
  }
  catch (error)
  {
    console.log(error.message);
  }
}

main();
