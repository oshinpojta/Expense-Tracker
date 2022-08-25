const email = document.querySelector("#email");
const password = document.querySelector("#password");
const loginBtn = document.querySelector("#login-btn");
const signup = document.querySelector("#signup");
const formDiv = document.querySelector("#form-div");
const msg = document.querySelector("#msg");

let url = "http://localhost:4000";

formDiv.addEventListener("click", async (e) => {
    e.preventDefault();
    try{
        if(e.target.id=="login-btn"){
            if(email.value == ""){
                msg.innerHTML = "<p style='color : red'>'Email' is necessary for Login!</p>";
            }else if(password.value == ""){
                msg.innerHTML = "<p style='color : red'>Please enter a 'Password!'</p>";
            }else{

                let requestBody = {
                    email : email.value,
                    password : password.value
                }
        
                let response = await axios.post(`${url}/user/login`, requestBody);
                console.log(response.data);
                if(response.data.success == true){
                    window.location.replace(`${url}/index.html`);
                }else{
                    msg.innerHTML = "<p style='color : red'>Either 'Email' or 'Password' is Invalid!</p>";
                }
                password.value = "";
            }
        }

        if(e.target.id=="signup"){
            window.location.replace(`${url}/signup.html`);
        }
    }catch(err){
        console.log(err);
    }
});