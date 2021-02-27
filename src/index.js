module.exports.player = function (player) {
  player.on('spawned', () => {
    player.chat('RPG Server spawned.')
  })
}
