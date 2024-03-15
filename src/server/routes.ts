import { AppServer } from "./base";
import authRoutes from "../domains/auth/routes";
import providersRoutes from "../domains/providers/routes";
import messegingRoutes from "../domains/messages/routes";
import filesRoutes from "../domains/files/routes";

export default function registerRoutes(app: AppServer) {

    authRoutes(app);
    providersRoutes(app);
    messegingRoutes(app);
    //filesRoutes(app);
}