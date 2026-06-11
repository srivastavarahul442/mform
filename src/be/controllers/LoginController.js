import { Controller } from "@framework";
import AuthService from "../services/AuthService";


class LoginController extends Controller {
    constructor() {
        super();

        this.service = new AuthService();
    }

    async post(req, res) {
        return this.service.login(
            req,
            res,
        );
    }
}

export default new LoginController().handler;