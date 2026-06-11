import { Controller } from "@framework";
import UserService from "../services/UserService";

class UserByIdController extends Controller {
    constructor() {
        super();

        this.service =
            new UserService();
    }

    async get(req, res) {
        return this.service.getUserById(
            req,
            res,
        );
    }

    async patch(req, res) {
        return this.service.updateUser(
            req,
            res,
        );
    }

    async delete(req, res) {
        return this.service.deactivateUser(
            req,
            res,
        );
    }
}

export default new UserByIdController().handler;