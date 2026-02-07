"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = require("body-parser");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const otp_routes_1 = __importDefault(require("./routes/otp.routes"));
const support_routes_1 = __importDefault(require("./routes/support.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const history_routes_1 = __importDefault(require("./routes/history.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const contact_us_routes_1 = __importDefault(require("./routes/contact_us.routes"));
const plant_advisory_routes_1 = __importDefault(require("./routes/plant_advisory.routes"));
const feedback_routes_1 = __importDefault(require("./routes/feedback.routes"));
const diseases_routes_1 = __importDefault(require("./routes/diseases.routes"));
const plants_routes_1 = __importDefault(require("./routes/plants.routes"));
const activity_logs_routes_1 = __importDefault(require("./routes/activity_logs.routes"));
const categories_routes_1 = __importDefault(require("./routes/categories.routes"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const plant_identification_routes_1 = __importDefault(require("./routes/plant_identification.routes"));
const explore_plant_routes_1 = __importDefault(require("./routes/explore_plant.routes"));
const contactSupport_routes_1 = __importDefault(require("./routes/contactSupport.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const upload = (0, multer_1.default)({ dest: "uploads/" });
app.use((0, body_parser_1.json)());
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use("/images", express_1.default.static(path_1.default.join(__dirname, "..", "assets", "images")));
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "..", "uploads")));
app.use("/api/auth", auth_routes_1.default);
app.use("/api/plants/", plants_routes_1.default);
app.use("/api/forgot-password/", otp_routes_1.default);
app.use("/api/supports/", support_routes_1.default);
app.use("/api/notification/", notification_routes_1.default);
app.use("/api/history/", history_routes_1.default);
app.use("/api/users/", user_routes_1.default);
app.use("/api/contact-us/", contact_us_routes_1.default);
app.use("/api/plant-advisory/", plant_advisory_routes_1.default);
app.use("/api/feedback/", feedback_routes_1.default);
app.use("/api/logs/", activity_logs_routes_1.default);
app.use("/api/categories/", categories_routes_1.default);
app.use("/api/plant-identification", plant_identification_routes_1.default);
app.use("/api/explore-plant", explore_plant_routes_1.default);
app.use("/api/contact-support", contactSupport_routes_1.default);
app.use("/api/diseases", diseases_routes_1.default);
exports.default = app;
