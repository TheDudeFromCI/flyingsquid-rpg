const playerStats = require('./playerStats')

/**
 * Initializes all player related events and handlers.
 * 
 * @param {*} player - The player to initialize.
 */
module.exports.player = function (player) {
  playerStats(player)
}
