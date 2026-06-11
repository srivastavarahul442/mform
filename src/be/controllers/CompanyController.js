import { Controller } from "@framework";
import AuthService from "../services/AuthService";

class CompanyController extends Controller {
    constructor() {
        super();

        this.service = new AuthService();
    }

    // TODO: implement GET /companies (get company details for the logged-in user)
    async get(req, res) {
        return res.status(501).json({
            success: false,
            message: "Not implemented",
        });
    }
}

export default new CompanyController().handler;
