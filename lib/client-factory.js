const amazonClient = require('./amazon-client.js')

var types = {};

/**
 * @brief Registers the given client contructor into the factory.
 *
 * @param {String}   name        The retailer name.
 * @param {Function} constructor The client factory method.
 */
module.exports.register = function(name, constructor)
{
  if (typeof constructor !== "function")
    throw new TypeError("The 'constructor' argument is not a valid contructor.");

  types[name] = constructor;
}

/**
 * @brief Creates a new instance of the given retailer client.
 *
 * @param {String} name        The retailer name.
 * @param {Object} configuration The client configuration.
 */
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