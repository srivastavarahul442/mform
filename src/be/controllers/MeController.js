import { Controller } from "@framework";
import AuthService from "../services/AuthService";

class MeController extends Controller {
    constructor() {
        super();

        this.service = new AuthService();
    }

    async get(req, res) {
        return this.service.me(
            req,
            res,
        );
    }
}

export default new MeController().handler;