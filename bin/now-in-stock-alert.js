const commandLine   = require("../lib/command-line.js");
const clientFactory = require("../lib/client-factory.js");
const fs            = require("fs");
const opn           = require("opn");
const soundplayer   = require("sound-player")
const player        = new soundplayer({ filename: "../media/message.ogg" });

player.on('error', function(error)
{
  console.log('Error occurred:', error);
});

function getValue(object, name, defaultValue)
{
  return name in object ? object[name] : defaultValue;
}

function handleResult(result, product)
{
  if (result.instock)
  {
    player.play();

    if (!product.instock)
    {
      opn(result.url);
      product.instock = true;
    }
  }
  else
  {
    product.instock = false;
  }
}

function checkItemStock(product)
{
  if (getValue(product, "enabled", true))
  {
    const client = clientFactory.create(product.retailer);
    const result = client.check(product.code, function(error, result)
    {
      if (error)
      {
        console.log("[%s] Error checking %s: %s.", new Date().toISOString(), product.code, error);
      }
      else
      {
        handleResult(result, product);
        console.log("[%s] %s (%s) is %s in %s.", new Date().toISOString(), result.name, product.code, result.instock ? "in-stock" : "unavailable", product.retailer);
      }
    });
  }
}

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

function startMonitor(filename)
{
  const config   = JSON.parse(fs.readFileSync(filename));
  const products = getValue(config, "products", []);

  checkProducts(products);
  setInterval(function () { checkProducts(products); }, getValue(config, "interval", 30000));
}

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
