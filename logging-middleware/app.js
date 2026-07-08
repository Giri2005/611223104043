import express from "express";
import dotenv from "dotenv";
import { writeLog } from "./log.js";

dotenv.config();

const app = express();
app.use(express.json());

const API_URL =
  "http://4.224.186.213/evaluation-service/notifications";

// Fetch all notifications
app.get("/notifications", async (req, res) => {
  await writeLog(
    "backend",
    "debug",
    "handler",
    "Notification endpoint invoked"
  );

  try {
    const apiResponse = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      },
    });

    if (!apiResponse.ok) {
      throw new Error(`Unable to fetch notifications (${apiResponse.status})`);
    }

    const notifications = await apiResponse.json();

    await writeLog(
      "backend",
      "info",
      "handler",
      "Notification list delivered"
    );

    res.status(200).json(notifications);
  } catch (err) {
    await writeLog(
      "backend",
      "error",
      "handler",
      err.message
    );

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Fetch unread notification count
app.get("/notifications/unread-count", async (req, res) => {
  await writeLog(
    "backend",
    "debug",
    "handler",
    "Unread count endpoint invoked"
  );

  try {
    const apiResponse = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      },
    });

    if (!apiResponse.ok) {
      throw new Error(`Unable to fetch notifications (${apiResponse.status})`);
    }

    const notifications = await apiResponse.json();

    const unread = notifications.reduce(
      (count, item) => count + (!item.isRead ? 1 : 0),
      0
    );

    await writeLog(
      "backend",
      "info",
      "handler",
      "Unread notification count calculated"
    );

    res.status(200).json({
      unreadCount: unread,
    });
  } catch (err) {
    await writeLog(
      "backend",
      "error",
      "handler",
      err.message
    );

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});