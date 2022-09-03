const ForgotPasswordRequest = require("../models/forgot-password-request");

class ForgotPasswordRequestService {

    getForgotPasswordRequestByUuid = async (uuid) => {
        try {
            return await ForgotPasswordRequest.findOne({ where : { uuid : uuid }});
        } catch (error) {
            throw error;
        }
    }

    saveForgotPasswordRequest = async (forgotPasswordRequest) => {
        try {
            return await ForgotPasswordRequest.create(forgotPasswordRequest);
        } catch (error) {
            throw error;
        }
    }

}

module.exports = ForgotPasswordRequestService;