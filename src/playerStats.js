/**
 * Initializes the player stats for the given player upon spawning.
 * 
 * @param {*} player - The player to initialize.
 */
module.exports = function (player) {
  let hp = 10
  let maxHp = 10
  let stamina = 10
  let maxStamina = 10
  let level = 1
  let xp = 0
  let xpToNext = 100

  // Initialize player stats
  player.on('spawned', () => {
    player.rpg = {}

    /**
     * Sets the player's current hp value.
     * 
     * @param {number} value - The new hp value.
     */
    player.rpg.setHp = function (value) {
      hp = Math.max(0, Math.min(maxHp, value))
      player.updateHealth(hp / maxHp * 20)
    }

    /**
     * Sets the player's maximum hp value. If the new maximum value is less than the player's current
     * hp, the player's hp is assigned to this value.
     * 
     * @param {number} value - The new maximum hp value.
     * @param {boolean} fillCurrent - Whether or not to set the player's current hp to the max hp. Defaults to true.
     */
    player.rpg.setMaxHp = function(value, fillCurrent = true) {
      maxHp = Math.max(1, value)
      if (fillCurrent || hp > maxHp) hp = maxHp
      player.updateHealth(hp / maxHp * 20)
    }

    /**
     * Sets the player's current stamina value.
     * 
     * @param {number} value - The new stamina value.
     */
    player.rpg.setStamina = function(value) {
      stamina = Math.max(0, Math.min(maxStamina, value))
      player.food = stamina / maxStamina * 20
      player.foodSaturation = 20
      player.updateHealth()
    }

    /**
     * Sets the player's maximum stamina value. If the new maximum value is less than the player's current
     * stamina, the player's stamina is assigned to this value.
     * 
     * @param {number} value - The new maximum stamina value.
     * @param {boolean} fillCurrent - Whether or not to set the player's current stamina to the max stamina. Defaults to true.
     */
    player.rpg.setMaxStamina = function (value, fillCurrent = true) {
      maxStamina = Math.max(1, value)
      if (fillCurrent || stamina > maxStamina) stamina = maxStamina
      player.updateHealth(stamina / maxStamina * 20)
    }

    /**
     * Sets the player's current level.
     * 
     * @param {number} value - The new level.
     */
    player.rpg.setLevel = function (value) {
      level = Math.max(1, value)
      player.setXpLevel(level)
    }

    /**
     * Sets the player's current xp value.
     * 
     * @param {number} value - The new xp value.
     */
    player.rpg.setXp = function (value) {
      xp = Math.max(0, Math.min(xpToNext - 1, value))
      player.setDisplayXp(xp / xpToNext)
    }

    /**
     * Sets the required xp to reach the next level. If the required xp is less than or equal to the player's current
     * xp amount, the player's xp is assigned to xpToNext - 1.
     * 
     * @param {number} value - The xp required to level up.
     */
    player.rpg.setXpToNext = function (value) {
      xpToNext = Math.max(1, value)
      xp = Math.min(xp, xpToNext - 1)
      player.setDisplayXp(xp / xpToNext)
    }

    /**
     * Gets the player's current hp.
     * 
     * @returns The player's hp.
     */
    player.rpg.getHp = () => hp

    /**
     * Gets the player's maximum hp.
     * 
     * @returns The player's max hp.
     */
    player.rpg.getMaxHp = () => maxHp

    /**
     * Gets the player's current stamina.
     * 
     * @returns The player's stamina.
     */
    player.rpg.getStamina = () => stamina

    /**
     * Gets the player's maximum stamina.
     * 
     * @returns The player's stamina.
     */
    player.rpg.getMaxStamina = () => maxStamina

    /**
     * Gets the player's current level.
     * 
     * @returns The player's level.
     */
    player.rpg.getLevel = () => level

    /**
     * Gets the player's current xp.
     * 
     * @returns The player's xp.
     */
    player.rpg.getXp = () => xp

    /**
     * Gets the xp required for the player to level up.
     * 
     * @returns The xp target.
     */
    player.rpg.getXpToNext = () => xpToNext

    /**
     * Adds the given amount of xp to the player, leveling them as needed.
     * 
     * @param {number} amount - The xp to give the player.
     */
    player.rpg.addXp = (amount) => {
      amount = Math.max(0, amount)
      xp += amount

      while (xp >= xpToNext) {
        xp -= xpToNext
        level += 1
        xpToNext = player.rpg.xpCurve(level)
      }

      player.setXpLevel(level)
      player.setDisplayXp(xp / xpToNext)
    }

    /**
     * Sets the default `xpToNext` value to use for each level up. The value is a function that can be overridden
     * to define a custom xp curve function.
     * 
     * @param {number} lvl - The player's current level.
     * @returns The xp required to level up.
     */
    player.rpg.xpCurve = (lvl) => lvl * lvl + 100 * lvl - 1
  })
}