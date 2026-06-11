import { Controller } from "../framework/controller.js";
import AuthService from "../services/AuthService";

class RegisterCompanyController extends Controller {
    constructor() {
        super();

        this.service = new AuthService();
    }

    async post(req, res) {
        return this.service.registerCompany(req, res);
    }
}

export default new RegisterCompanyController().handler;
