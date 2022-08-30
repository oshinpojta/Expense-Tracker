let amount = document.querySelector('#amount');
let description = document.getElementById('description');
let category = document.getElementById('category');
let hidden = document.querySelector("#hidden")
let listDiv = document.getElementById('list-div');
//let totalExpenseDiv = document.querySelector("#total-expense"); // ****ERROR : Causing PassByValue
let msg = document.getElementById("msg");


let url = "http://localhost:4000";
let jwt_token = sessionStorage.getItem('token'); //getCookie('token')
let options = { 
    headers : { 
        authorization : `${jwt_token}` 
    } 
};

// function getCookies() {
//     return document.cookie.split("; ").reduce(function(cookies, token){
//         // split key=value into array
//         var pair = token.split("=");
//         // assign value (1) as object's key with (0)
//         cookies[pair[0]] = decodeURIComponent(pair[1]);
//         // pass through the key-value store
//         return cookies;
//     }, { /* start with empty "cookies" object */ });
// }

// function getCookie(name) {
//     return getCookies()[name];
// }


const getClick = async (e) => {
    e.preventDefault()
    try{
        if(e.target.className == "btn-primary"){
            document.querySelector(".is-editing").style.display = "none";
            let amountVal = amount.value;
            let descriptionVal = description.value;
            let categoryVal = category.value;
            if(amountVal==""){
                msg.innerText = "Amount field cannot be empty!"
                setTimeout(()=>{
                    msg.innerText = "";
                },5000);
                return;
            }
            let response = null;

            if(hidden.value==""){
                let expenseObj = {
                    amount : amountVal,
                    description : descriptionVal,
                    category : categoryVal
                }
                response = await axios.post(`${url}/expenses/add`,expenseObj, options);
            }else{
                let expenseObj = {
                    id : hidden.value,
                    amount : amountVal,
                    description : descriptionVal,
                    category : categoryVal
                }
                response = await axios.put(`${url}/expenses/update`, expenseObj, options);
            }
            console.log(response);
            if(response.data.success == true){
                let expense = response.data.data;

                let totalExpense = Number(document.querySelector("#total-expense").innerText);
                totalExpense += Number(amountVal);
                document.querySelector("#total-expense").innerText = totalExpense;
                console.log(document.querySelector("#total-expense"));
                let textHtml = `<div id="list-item${expense.id}" class="list-item">
                                        <div class="list-hidden" style="display:none;">${expense.id}</div>
                                        <div class="list-category">${expense.category}</div>
                                        <div class="list-description">${expense.description}</div>
                                        <div class="list-amount">Rs.${expense.amount}</div>
                                        <button class="list-button-edit">Edit</button>
                                        <button class="list-button-delete">X</button>
                                    </div>`;
                listDiv.innerHTML += textHtml;

                amount.value = "";
                category.value = "Fuel";
                description.value = "";
                hidden.value = "";
            }else{
                msg.innerText = "ERROR : Expense could not be added! Please try again later."
                setTimeout(()=>{
                    msg.innerText = "";
                },5000);
                return;
            }
        }

        if(e.target.className == "list-button-edit"){
            let totalExpense = Number(document.querySelector("#total-expense").innerText);
            if(hidden.value!=""){  
                totalExpense += Number(document.querySelector(`#list-item${hidden.value}`).querySelector(".list-amount").innerText.slice(3));
                document.querySelector(`#list-item${hidden.value}`).style.display = "flex";
            }
            amount.value = Number(e.target.parentNode.querySelector(".list-amount").innerText.slice(3));
            totalExpense -= amount.value;
            description.value = e.target.parentNode.querySelector(".list-description").innerText;
            category.value = e.target.parentNode.querySelector(".list-category").innerText;
            hidden.value = e.target.parentNode.querySelector(".list-hidden").innerText;
            e.target.parentNode.style.display = "none";
            document.querySelector(".is-editing").style.display = "block";
            document.querySelector("#total-expense").innerText = totalExpense;
        }

        if(e.target.className == "list-button-delete"){
            let totalExpense = Number(document.querySelector("#total-expense").innerText);
            let response = await axios.delete(`${url}/expenses/${e.target.parentNode.querySelector(".list-hidden").innerText}`, options);
            if(response.data.success == true){
                totalExpense -= Number(e.target.parentNode.querySelector(".list-amount").innerText.slice(3));
                document.querySelector("#total-expense").innerText = totalExpense;
                e.target.parentNode.remove();
            }else{
                msg.innerText = "ERROR : Item cannot be deleted! Try again later."
                setTimeout(()=>{
                    msg.innerText = "";
                },5000)
            }
        }

        if(e.target.className == "is-editing"){
            if(hidden.value!=""){
                document.querySelector(`#list-item${hidden.value}`).style.display = "flex";
                let totalExpense = Number(document.querySelector("#total-expense").innerText);
                totalExpense += Number(document.querySelector(`#list-item${hidden.value}`).querySelector(".list-amount").innerText.slice(3));
                document.querySelector("#total-expense").innerText = totalExpense;
            }
            hidden.value = "";
            amount.value = "";
            description.value = "";
            category.value = "Fuel";
            e.target.style.display = "none";
        }

        if(e.target.id == "logout"){
            let response = await axios.post(`${url}/user/logout`, {}, options);
            console.log(response.data);
            sessionStorage.removeItem('token');
            if(response.data.success == true){
                window.location.replace(`${url}/login.html`);
            }else{
                window.location.replace(`${url}/error.html`);
            }
        }

        if(e.target.id == "membership"){

            let response = await axios.post(`${url}/membership/create-order`, {}, options);
            console.log(response.data);
            if(response.data.success==true){
                let order = response.data.data;
                let willProceed = await swal({
                    title: `Order-id Created! : ${order.id}`,
                    text: `Would You Like To Proceed!? Amount : ${order.amount}`,
                    icon: "success",
                    buttons: true,
                    dangerMode: true,
                })
                
                if (willProceed) {
                    let result = null;
                    let orderOptions = {
                        "key" : "rzp_test_EgsrVRajg1uGbM",
                        "currency" : "INR",
                        "name" : "ZODIAC",
                        "description" : "RazorPay Membership Order",
                        "order_id" : order.id,
                        "handler" : async (response) => {
                             result = await axios.post(`${url}/membership/add`, response, options);
                             console.log(result);
                            if(result.data.success==true){
                                swal({
                                    title: "Congratulations!",
                                    text : "You Are Now A Premium Member!",
                                    icon: "success"
                                }).then(()=>{
                                    location.reload();
                                })
                            }else{
                                let willTryAgain = await swal({
                                    title: "Error: Transaction Failed!",
                                    text: "Would You Like To Try Again!?",
                                    icon: "warning",
                                    buttons: true,
                                    dangerMode: true,
                                })
                                
                                if (willTryAgain) {
                                    let result = null;
                                    let orderOptions = {
                                        "key" : "rzp_test_EgsrVRajg1uGbM",
                                        "currency" : "INR",
                                        "name" : "ZODIAC",
                                        "description" : "RazorPay Membership Order",
                                        "order_id" : order.id,
                                        "handler" : async (response) => {
                                             result = await axios.post(`${url}/membership/add`, response, options);
                                             console.log(result);
                                            if(result.data.success==true){
                                                swal({
                                                    title: "Congratulations!",
                                                    text : "You Are Now A Premium Member!",
                                                    icon: "success"
                                                }).then(()=>{
                                                    location.reload();
                                                })
                                            }else{
                                                swal({
                                                    title: "Error: Transaction Failed!",
                                                    text : "Please Try Again Later!",
                                                    icon: "warning"
                                                });
                                            }
                                        },
                                        "theme" : {
                                            "color" : "#227254"
                                        }
                                    };
                                    var getPayment = new Razorpay(orderOptions);
                                    getPayment.open();
                                } else {
                                    swal("Transaction Cancelled!");
                                }
                            }
                        },
                        "theme" : {
                            "color" : "#227254"
                        }
                    };
                    var getPayment = new Razorpay(orderOptions);
                    getPayment.open();
                } else {
                    swal({
                      title: "Order Cancelled!",
                      icon: "success"
                    });
                }

            }else{
                swal({
                    title: "Order cannot Be Created!",
                    text : "Please Try Again After Some Time!",
                    icon: "warning"
                  });
            };
        }

        if(e.target.className == "leaderboard"){
            window.location.replace(`${url}/leaderboard.html`);
        }

    }catch(error){
        console.log(error);
    }
}


let loadExpenses = async (e) => {
    e.preventDefault();
    try {
        console.log(sessionStorage.getItem('token'));
        if(sessionStorage.getItem('token') == null){
            window.location.replace(`${url}/login.html`);
        }
        let response = await axios.get(`${url}/expenses/get-all`,options);
        if(response.data.success == false){
            //also delete user token in node app here - code
            sessionStorage.removeItem('token');
            window.location.replace(`${url}/login.html`);
        }
        let expenses = response.data.data;  //array
        let premiumResponse = await axios.get(`${url}/membership/get`,options);
        if(premiumResponse.data.success == true){
            document.querySelector("body").classList.add("premium");
            document.querySelector(".header h1").classList.add("premium");
            document.querySelector("#membership").classList.add("premium");
            document.querySelector(".btn-primary").classList.add("premium");
            document.querySelector(".leaderboard").classList.add("premium");
        }
        if(expenses.length>0){
            let totalExpense = 0;
            let textHtml = "";
            for(let i=0;i<expenses.length;i++){
                let expense = expenses[i];
                totalExpense += expense.amount;
                textHtml += `<div id="list-item${expense.id}" class="list-item">
                                        <div class="list-hidden" style="display:none;">${expense.id}</div>
                                        <div class="list-category">${expense.category}</div>
                                        <div class="list-description">${expense.description}</div>
                                        <div class="list-amount">Rs.${expense.amount}</div>
                                        <button class="list-button-edit">Edit</button>
                                        <button class="list-button-delete">X</button>
                                    </div>`;
            }
            listDiv.innerHTML += textHtml;
            document.querySelector("#total-expense").innerText = totalExpense;
        }
        
    } catch (error) {
        console.log(error);
       // window.location.replace(`${url}/login.html`);
    }
}


function getSeparatedValues(stringObj){
    let stringList = []
    let string = "";
    for(let i=0;i<stringObj.length;i++){
        if(stringObj[i]!=","){
            string=string+stringObj[i];
        }else{
            stringList.push(string.trim());
            string = "";
        }
        if(i===stringObj.length-1){
          stringList.push(string.trim());
        }
    }
    return stringList;
}


document.addEventListener("DOMContentLoaded",loadExpenses);
document.addEventListener("click", getClick)