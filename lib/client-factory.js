const amazonClient = require('./amazon-client.js')

var types = {};

module.exports.register = function(name, constructor)
{
  if (typeof constructor !== "function")
    throw new TypeError("The 'constructor' argument is not a valid contructor.");

  types[name] = constructor;
}

module.exports.create = function(name, configuration)
{
  if (name in types)
  {
    var constructor = types[name];
    return constructor ? constructor(configuration) : null;
  }
  else
  {
    throw new TypeError("The '" + name + "' retailer is not supported.");
  }
}

module.exports.register("amazon", amazonClient);