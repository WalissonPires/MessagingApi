import { AppServer } from "./base";
import messegingRoutes from "../domains/messages/routes";
import authRoutes from "../domains/auth/routes";

export default function registerRoutes(app: AppServer) {

    authRoutes(app);
    messegingRoutes(app);
}