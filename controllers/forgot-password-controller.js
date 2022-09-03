const ForgotPasswordRequestService = require("../services/forgot-password-services");
const UserService = require("../services/user-services");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const { v4: uuidv4 } = require('uuid');

const forgotPasswordRequestService = new ForgotPasswordRequestService();
const userService = new UserService();

exports.getPasswordRequestByUuid = async (req, res, next) => {
    try {
        let uuid = req.params.uuid;
        let forgotPasswordRequest = await forgotPasswordRequestService.getForgotPasswordRequestByUuid(uuid);
        if(forgotPasswordRequest.isActive == false){
            return res.send(`<html>
                                <link rel="icon" href="data:;base64,=">
                                <script>
                                document.addEventListener("DOMContentLoaded",()=>{ alert("Link Expired! It Has Been Used Already!")});
                                </script>
                            </html>`);
        }
        await forgotPasswordRequest.update({ isActive : false});
        res.send(`<html>
                    <link rel="icon" href="data:;base64,=">
                    <form>
                        <label for="newpassword">Enter New Password</label>
                        <input name="newpassword" type="password" id="newpassword" required></input>
                        <button type="button" id="button">Reset Password</button>
                    </form>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.27.2/axios.min.js" integrity="sha512-odNmoc1XJy5x1TMVMdC7EMs3IVdItLPlCeL5vSUPN2llYKMJ2eByTTAIiiuqLg+GdNr9hF6z81p27DArRFKT7A==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
                    <script>
                        let formsubmitted = async (e) => {
                            e.preventDefault();
                            console.log(document.querySelector("#newpassword").value);
                            await axios.post("${process.env.HOST_URL}/password/updatepassword/${forgotPasswordRequest.userId}", { newpassword : document.querySelector("#newpassword").value } );
                            window.location.replace("${process.env.HOST_URL}/login.html");
                        }
                        document.querySelector("#button").addEventListener("click",formsubmitted);
                    </script>
                </html>`);
    } catch (error) {
        console.log(error);
        res.json({ success : false});
    }
}

exports.addPasswordRequest = async (req, res, next) => {
    try {
        let email = req.body.email; 
        let user = await userService.findUserByEmail(email);
        let uuid = uuidv4();
        // code to send uuid-link to email
        let result = await forgotPasswordRequestService.saveForgotPasswordRequest({ userId : user.id, uuid : uuid, isActive : true});
        res.json({ success : true});
    } catch (error) {
        console.log(error);
        res.json({ success : false});
    }
}

exports.updatePassword = async (req, res, next) => {
    try {
        let userId = req.params.userId;
        let user = await userService.getUser(userId);
        let newpassword = req.body.newpassword;
        if(newpassword){
            let passwordHash = await bcrypt.hash(newpassword, saltRounds);
            await user.update({ password : passwordHash});
            res.json({ success : true});
        }else{
            res.json({success : false});
        }
    } catch (error) {
        console.log(error);
        res.json({success : false});
    }
}