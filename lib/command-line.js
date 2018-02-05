const commandLine = require('command-line-args')
const getUsage    = require('command-line-usage')

const helpDefinition = [
  {
    header: 'Products in stock tracker',
    content: 'A web client that monitors online retailer websites to see when products come in stock or up for pre-order.'
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'config',
        typeLabel: '[underline]{file}',
        description: 'The tracker configuration.'
      },
      {
        name: 'help',
        description: 'Print this usage guide.'
      }
    ]
  }
]

const commandLineDefinition =
[
  { name: 'config', type: String, defaultOption: true },
  { name: 'help' }
]

/**
 * @brief Parses the command line options.
 *
 * @return The command line options.
 */
module.exports.parseOptions = function()
{
  return commandLine(commandLineDefinition);
}

/**
 * @brief Prints the application help information.
 */
module.exports.printHelp = function()
{
  console.log(getUsage(helpDefinition));
}
