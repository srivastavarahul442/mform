import { Controller } from "@framework";
import UserService from "../services/UserService";

class UserController extends Controller {
    constructor() {
        super();

        this.service =
            new UserService();
    }

    async get(req, res) {
        return this.service.getUsers(
            req,
            res,
        );
    }

    async post(req, res) {
        return this.service.createUser(
            req,
            res,
        );
    }
}

export default new UserController().handler;