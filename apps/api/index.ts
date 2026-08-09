import "dotenv/config";
import express from "express";
import { db } from "./config/db.ts";
import { authMiddleware } from "./middleware";
import cookieParser from "cookie-parser";
import cors from "cors";
import { MonitorCreateSchema } from "@repo/common";

const app = express();

const serializeWebsite = (website: {
  ticks: Array<{ status: "Good" | "Bad" }>;
}) => ({
  ...website,
  ticks: website.ticks.map((tick) => ({
    ...tick,
    status: tick.status === "Good" ? "up" : "down",
  })),
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.post("/api/v1/website", authMiddleware, async (req, res) => {
  const userId = req?.user?.id!;
  console.log(userId);
  console.log(req.body);
  const parsedBody = MonitorCreateSchema.safeParse(req.body);
  if (!parsedBody.success) {
    return res.status(400).json({ message: "Invalid monitor URL" });
  }
  const { url } = parsedBody.data;
  const data = await db.website.create({
    data: {
      userId,
      url,
    },
  });
  res.json({
    id: data.id,
  });
});

app.get("/api/v1/website/status", authMiddleware, async (req, res) => {
  const websiteId = req.query.websiteId! as unknown as string;
  const userId = req?.user?.id!;
  const data = await db.website.findFirst({
    where: {
      id: websiteId,
      userId: userId,
      disabled: false,
    },
    include: {
      ticks: true,
    },
  });

  res.json(data ? serializeWebsite(data) : null);
});

app.get("/api/v1/website", authMiddleware, async (req, res) => {
  const userId = req?.user?.id!;
  const websites = await db.website.findMany({
    where: {
      userId: userId,
      disabled: false,
    },
    include: {
      ticks: true,
    },
  });
  res.json(websites.map(serializeWebsite));
});

app.delete("/api/v1/website/:id", async (req, res) => {
  const websiteId = req.params.id! as unknown as string;
  const userId = req?.user?.id!;

  await db.website.update({
    where: {
      id: websiteId,
      userId: userId,
    },
    data: {
      disabled: true,
    },
  });
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
