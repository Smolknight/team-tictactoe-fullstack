// server/src/services/playerService.js
import { v4 as uuidv4 } from "uuid";
import db from "../config/database.js";

// add wins, losses, ties, total games
export function createPlayer(name) {
  const playerId = uuidv4();
  const createdAt = Date.now();

  try {
    db.prepare(
      `INSERT INTO players(id, name, wins, losses, ties, total_games, created_at) VALUES (?, ?, 0, 0, 0, 0, ?)`
    ).run(playerId, name, createdAt);
    return {
      id: playerId,
      name,
      wins: 0,
      losses: 0,
      ties: 0,
      totalGames: 0,
      createdAt,
    };
  } catch (err) {
    if (err.message.includes("UNIQUE constraint failed")) {
      return {
        error: "Player name exists",
        status: 400,
      };
    }
    throw err;
  }
}
// sort by wins descending, name ascending
export function getAllPlayers() {
  const players = db
    .prepare(
      `
        SELECT id, name, wins, losses, ties, total_games, created_at
        FROM players
        ORDER BY wins DESC, name ASC
        `
    )
    .all();

  return players;
}

export function getPlayer(id) {
  const player = db.prepare(`SELECT * FROM players WHERE id = ?`).get(id);
  if (!player) {
    return {
      error: "Player not found",
      status: 404,
    };
  }
  return player;
}

export function getPlayerByName(name) {
  const player = db
    .prepare(
      `
        SELECT id, name, wins, losses, ties, total_games, created_at
        FROM players
        WHERE name = ?
        `
    )
    .get(name);
  if (!player) {
    return { error: "Player not found", status: 404 };
  }
  return player;
}

/**
 * @param {number} limit - How many players to return (default 10)
 */
export function getLeaderboard(limit = 10) {
  const players = db
    .prepare(
      `
        SELECT *
        FROM players
        WHERE total_games > 0
        ORDER BY wins DESC, (wins * 1.0 /total_games) DESC
        LIMIT ?
        `
    )
    .all(limit);
  return players.map((p) => ({
    ...p,
    win_rate:
      p.total_games > 0 ? ((p.wins / p.total_games) * 100).toFixed(1) : "0.0",
  }));
}

/**
 * @param {string} playerId
 * @param {string} result - 'win', 'loss', or 'tie'
 */
export function updatePlayerStats(playerId, result) { 
  try {
    if (!['win', 'loss', 'tie'].includes(result)) { 
      return {
        error: 'Invalid result. Must be win, loss, or tie', 
        status: 400
      }
    }

    let updateColumn;
    if (result === 'win') {
      updateColumn = 'wins';
    } else if (result === 'loss') {
      updateColumn = 'losses';
    } else { 
      updateColumn = 'ties';
    }

    db.prepare(`
      UPDATE players
      SET ${updateColumn} = ${updateColumn} + 1,
        total_games = total_games + 1
      WHERE id = ?
      `).run(playerId)

    return getPlayer(playerId);
  } catch (err) { 
    throw err;
  }
}