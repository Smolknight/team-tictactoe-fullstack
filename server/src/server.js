// src/server.js
import express from "express";
import "dotenv/config";
import {
  createPlayer,
  getAllPlayers,
  getPlayer,
  getPlayerByName,
  updatePlayerStats,
  getLeaderboard,
} from "./services/playerService.js";
const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Welcome Home!");
});

app.get("/api/leaderboard", (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const leaderboard = getLeaderboard(limit);
    res.json({
      success: true,
      leaderboard,
      count: leaderboard.length,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to get leaderboard",
    });
  }
});

app.get("/api/players", (req, res) => {
  const players = getAllPlayers();
  res.status(200).json({
    success: true,
    players,
  });
});

app.get("/api/players/:id", (req, res) => {
  const player = getPlayer(req.params.id);
  if (player.error) {
    return res.status(player.status).json({ error: player.error });
  }
  res.status(200).json({
    success: true,
    player,
  });
});

app.get("/api/players/name/:name", (req, res) => {
  const player = getPlayerByName(req.params.name);
  if (player.error) {
    return res.status(player.status).json({ error: player.error });
  }
  res.status(200).json({
    success: true,
    player,
  });
});

app.get("/about", (req, res) => {
  res.status(200).send("My name is Ryan");
});

app.get("/error", (req, res) => {
  throw new Error("error from /error route");
});

// POST ROUTES

app.post("/api/players", (req, res) => {
  try {
    const { name, age } = req.body;
    const trimmedName = name?.trim();
    if (!name) {
      return res.status(400).json({
        error: "Name is required",
      });
    }
    const player = createPlayer(trimmedName, age);
    if (player.error) {
      return res.status(player.status).json({ error: player.error });
    }
    res.status(201).json({
      success: true,
      player,
    });
    // throw new Error('sup 3pm');
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

app.post("/api/players/:id/stats", (req, res) => {
  try {
    const { result } = req.body;
    if (!result || !["win", "loss", "tie"].includes(result)) {
      return res.status(400).json({
        success: false,
        error: "Result must be 'win', 'loss', or 'tie ",
      });
    }

    const player = updatePlayerStats(req.params.id, result);

    if (player.error) {
      return res.status(player.status).json({
        success: false,
        error: player.error,
      });
    }

    res.status(200).json({
      success: true,
      player,
      message: `Player stats updated: ${result}`
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to update player stats",
    });
  }
});

app.use((req, res) => {
  res.status(404).send("The page you're looking for does not exist");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Internal Server Error! ERror!",
    msg: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
