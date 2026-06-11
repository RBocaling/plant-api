import express from 'express';
import dotenv from 'dotenv';
import { json } from 'body-parser';
import authRoutes from './routes/auth.routes';
import otp from './routes/otp.routes';
import supportRouter  from './routes/support.routes';
import notif  from './routes/notification.routes';
import historyRoutes  from './routes/history.routes';
import userRoute  from './routes/user.routes';
import contactUs  from './routes/contact_us.routes';
import plantAdvisory  from './routes/plant_advisory.routes';
import userFeedback  from './routes/feedback.routes';
import diseases from "./routes/diseases.routes";
import plants from "./routes/plants.routes";
import activityLogs from "./routes/activity_logs.routes";
import categoryRoutes from "./routes/categories.routes";
import cors from "cors";
import path from "path";
import multer from "multer";
import plantRoutes from "./routes/plant_identification.routes";
import explorePlantRoutes from "./routes/explore_plant.routes";
import contactSupportRoutes from "./routes/contactSupport.routes";
import supportRoutes from "./routes/support.routes";
dotenv.config();

const app = express();

const upload = multer({ dest: "uploads/" });

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(json());
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(
  "/images",
  express.static(path.join(__dirname, "..", "assets", "images"))
);
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/plants/", plants);
app.use("/api/forgot-password/", otp);
app.use("/api/supports/", supportRouter);
app.use("/api/notification/", notif);
app.use("/api/history/", historyRoutes);
app.use("/api/users/", userRoute);
app.use("/api/contact-us/", contactUs);
app.use("/api/plant-advisory/", plantAdvisory);
app.use("/api/feedback/", userFeedback);
app.use("/api/logs/", activityLogs);
app.use("/api/categories/", categoryRoutes);
app.use("/api/plant-identification", plantRoutes);
app.use("/api/explore-plant", explorePlantRoutes);
app.use("/api/contact-support", contactSupportRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/diseases", diseases);

export default app;
