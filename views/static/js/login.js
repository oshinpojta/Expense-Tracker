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
                setTimeout(()=>{
                    msg.innerHTML = "";
                },5000);
            }else if(password.value == ""){
                msg.innerHTML = "<p style='color : red'>Please enter a 'Password!'</p>";
                setTimeout(()=>{
                    msg.innerHTML = "";
                },5000);
            }else{

                let requestBody = {
                    email : email.value,
                    password : password.value
                }
        
                let response = await axios.post(`${url}/user/login`, requestBody);
                console.log(response.data);
                if(response.data.success == true){
                    //document.cookie = `token=${response.data.token}`
                    sessionStorage.setItem("token", response.data.token);
                    window.location.replace(`${url}/index.html`);
                }else{
                    msg.innerHTML = `<p style='color : red'>${response.data.data}</p>`;
                    setTimeout(()=>{
                        msg.innerHTML = "";
                    },5000);
                }
                password.value = "";
            }
        }

        if(e.target.id=="signup"){
            window.location.replace(`${url}/signup.html`);
        }
    }catch(err){
        console.log(err);
        msg.innerHTML = `<p style='color : red'>Email Or Password Invalid!</p>`;
        setTimeout(()=>{
            msg.innerHTML = "";
        },5000);
    }
});