var amount = document.querySelector('#amount');
var description = document.getElementById('description');
var category = document.getElementById('category');
var hidden = document.querySelector("#hidden")
var listDiv = document.getElementById('list-div');
var usernameHeader = document.querySelector("#username");
//let totalExpenseDiv = document.querySelector("#total-expense"); // ****ERROR : Causing PassByValue
var msg = document.getElementById("msg");
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

let url = "http://54.159.134.29:4000";
let jwt_token = sessionStorage.getItem('token'); //getCookie('token')
let options = { 
    headers : { 
        authorization : `${jwt_token}` 
    } 
};
let currentPageNumber = 1;
let items_count = 5;
let expenseFormat = "week";
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

let getAllExpensesResponse = async () => {
    try {

        let response = await axios.post(`${url}/expenses/get-all`, { expenseFormat : expenseFormat, limit : items_count, offset : currentPageNumber }, options);
            if(response.data.success == false){
                alert("ERROR : Something Went Wrong In Fetching Expenses!");
            }else{
                listDiv.innerHTML = ``;
                let expensesPerDays = response.data.data;
                let keys = Object.keys(expensesPerDays);
                let totalExpense = 0;
                if(expensesPerDays){
                    for(let i=0; i<keys.length;i++){
                        let obj = expensesPerDays[keys[i]];
                        let expenses = obj.expenses;
                        let day = obj.day;
                        let date = obj.date;
                        let month = obj.month;
                        let year = obj.year;

                        let textHtml = "";
                        if(expenses){
                            textHtml += `<h2 class='expense-basis-header'>${day}, ${date}-${month}-${year}</h2>`;
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
                        }
                        listDiv.innerHTML += textHtml;
                        document.querySelector("#total-expense").innerText = response.data.totalExpense;
                    }

                    let expenseCount = response.data.expenseCount;
                    var paginationDiv = document.querySelector(".pagination-div");
                    paginationDiv.innerHTML = "";
                    let lastPage = Math.ceil(expenseCount/items_count);
                    let i = currentPageNumber == 1? 1 : currentPageNumber-1;
                    let n = currentPageNumber == 1? 3 : currentPageNumber+1;
                    n = lastPage < n ? lastPage : n; 
                    i = currentPageNumber == lastPage && n>2 ? currentPageNumber-2 : i;
                    if(currentPageNumber>=3){
                        paginationDiv.innerHTML += `<button class="pagination-btn">${1}</button>
                                                    <button class="pagination-btn" disabled>...</button>`;
                    }
                    while(i<=n){
                        if(i==currentPageNumber){
                            paginationDiv.innerHTML += `<button id="currentPageNumber" class="pagination-btn" style="background-color:rgb(114, 10, 10);color:aliceblue;">${i}</button>`;
                        }else{
                            paginationDiv.innerHTML += `<button class="pagination-btn">${i}</button>`;
                        }
                        i++;
                    }
                    if(lastPage>n){
                        paginationDiv.innerHTML += `<button class="pagination-btn" disabled>...</button>
                                                    <button class="pagination-btn">${lastPage}</button>`;
                    }
                    
                }else{
                    textHtml += `<h2 class='expense-basis-header'>No Expenses To Show</h2>`;
                    listDiv.innerHTML += textHtml;
                }
            }
        
    } catch (error) {
        throw error;
    }
}


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
                //console.log(expenseObj);
                response = await axios.put(`${url}/expenses/update`, expenseObj, options);
            }
            if(response.data.success == true){
                let expense = response.data.data;
                let totalExpense = Number(document.querySelector("#total-expense").innerText);
                totalExpense += Number(amountVal);
                document.querySelector("#total-expense").innerText = totalExpense;
                let thisDate = new Date(response.data.data.createdAt);
                let day = weekdays[thisDate.getDay()];
                let date = thisDate.getDate();
                let month = months[thisDate.getMonth()];
                let year = thisDate.getFullYear();
                let textHtml = `<h2 class='expense-basis-header'>${day}, ${date}-${month}-${year}</h2>`;
                textHtml += `<div id="list-item${expense.id}" class="list-item">
                                        <div class="list-hidden" style="display:none;">${expense.id}</div>
                                        <div class="list-category">${expense.category}</div>
                                        <div class="list-description">${expense.description}</div>
                                        <div class="list-amount">Rs.${expense.amount}</div>
                                        <button class="list-button-edit">Edit</button>
                                        <button class="list-button-delete">X</button>
                                    </div>`;
                let tempText = listDiv.innerHTML;
                listDiv.innerHTML = textHtml;
                listDiv.innerHTML += tempText;

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
            e.target.parentNode.previousSibling.style.display = "none";
            document.querySelector(".is-editing").style.display = "block";
            document.querySelector("#total-expense").innerText = totalExpense;
        }

        if(e.target.className == "list-button-delete"){
            let totalExpense = Number(document.querySelector("#total-expense").innerText);
            let response = await axios.delete(`${url}/expenses/${e.target.parentNode.querySelector(".list-hidden").innerText}`, options);
            if(response.data.success == true){
                totalExpense -= Number(e.target.parentNode.querySelector(".list-amount").innerText.slice(3));
                document.querySelector("#total-expense").innerText = totalExpense;
                e.target.parentNode.previousSibling.remove();
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
                document.querySelector(`#list-item${hidden.value}`).previousSibling.style.display = "flex";
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
                    text: `Would You Like To Proceed!? Amount : ${order.amount/100}`,
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

        if(e.target.id == "leaderboard"){
            window.location.replace(`${url}/leaderboard.html`);
        }

        if(e.target.id == "downloadexpenses"){
            let response  = await axios.get(`${url}/expenses/download`, options);
            if(response.data.success == false){
                swal({
                    title: `ERROR`,
                    text: `File Could Not Be Downloaded! Please Try Again Later`,
                    icon: "warning",
                    dangerMode: true,
                })
            }else{
                let a = document.createElement("a");
                a.href = response.data.data.fileUrl;
                a.click();
                swal({
                    title: `Success`,
                    text: `File Downloaded Successfully!`,
                    icon: "success"
                })
                document.querySelector("#list-urls-div").innerHTML +=   `<div class="list-url">
                                                                            <a class="list-url-link" href="${response.data.data.fileUrl}">${response.data.data.name}</a>
                                                                        </div>`
            }
        }

        if(e.target.className == "list-url"){
            let a = document.createElement("a");
            a.href = e.target.querySelector(".list-url-link").href;
            a.click();
            swal("Previous File Downloaded!");
        }

        if(e.target.className == "list-url-link"){
            let a = document.createElement("a");
            a.href = e.target.href;
            a.click();
            swal("Previous File Downloaded!");
        }

        if(e.target.id == "selectorbtn"){
            expenseFormat = document.querySelector("#expenseformat").value;
            document.querySelector("#expenseformat").value = expenseFormat;
            document.querySelector("#count").value = items_count;
            getAllExpensesResponse();
        }

        if(e.target.id == "countbtn"){
            items_count = Number(document.querySelector("#count").value);
            localStorage.setItem( "items_count", items_count);
            document.querySelector("#expenseformat").value = expenseFormat;
            document.querySelector("#count").value = items_count;
            getAllExpensesResponse();
        }

        if(e.target.className == "pagination-btn"){
            currentPageNumber = Number(e.target.innerText);
            document.querySelector("#expenseformat").value = expenseFormat;
            document.querySelector("#count").value = items_count;
            getAllExpensesResponse();
        }

    }catch(error){
        alert("ERROR:", error);
        console.log(error);
    }
}


let loadExpenses = async (e) => {
    e.preventDefault();
    try {
        //console.log(sessionStorage.getItem('token'));
        if(localStorage.getItem("items_count")!=null){
            items_count = Number(localStorage.getItem("items_count"));
        }
        document.querySelector("#expenseformat").value = expenseFormat;
        document.querySelector("#count").value = items_count;
        if(!sessionStorage.getItem('token')){
            window.location.replace(`${url}/login.html`);
            return;
        }
        let response = await axios.post(`${url}/expenses/get-all`, { expenseFormat : expenseFormat, limit : items_count, offset : currentPageNumber }, options);
        if(response.data.success == false){
            //also delete user token in node app here - code
            sessionStorage.removeItem('token');
            window.location.replace(`${url}/login.html`);
        }
        let expensesPerDays = response.data.data;  //array
        usernameHeader.innerText = `Welcome! ${response.data.username}.`;
        let premiumResponse = await axios.get(`${url}/membership/get`,options);
        if(premiumResponse.data.success == true){
            document.querySelector("body").classList.add("premium");
            document.querySelector(".header h1").classList.add("premium");
            document.querySelector("#membership").classList.add("premium");
            //document.querySelector(".btn-primary").classList.add("premium");
            document.querySelector(".leaderboard").classList.add("premium");
            document.getElementById("downloadexpenses").disabled = false;

            let response = await axios.get(`${url}/expenses/file-urls`,options);
            if(response.data.success==true){
                let fileURLs = response.data.data;
                if(fileURLs.length>0){
                    let textHtml = "";
                    for(let i=0;i<fileURLs.length;i++){
                        textHtml += `<div class="list-url">
                                        <a class="list-url-link" href="${fileURLs[i].fileUrl}">${fileURLs[i].name.slice(0, -4)}.csv</a>
                                    </div>`
                    }
                    document.querySelector("#list-urls-div").innerHTML += textHtml;
                }


            }else{
                console.log(response.data.error);
            }

        }
        // console.log(expensesPerDays);
        let totalExpense = 0;
        let textHtml = "";
        let keys = Object.keys(expensesPerDays);
        if(expensesPerDays){
            for(let i=0; i<keys.length;i++){
                let obj = expensesPerDays[keys[i]];
                let expenses = obj.expenses;
                let day = obj.day;
                let date = obj.date;
                let month = obj.month;
                let year = obj.year;

                if(expenses){
                    textHtml += `<h2 class='expense-basis-header'>${day}, ${date}-${month}-${year}</h2>`;
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
                }
            }
            listDiv.innerHTML += textHtml;
            document.querySelector("#total-expense").innerText = response.data.totalExpense;
        }else{
            textHtml += `<h2 class='expense-basis-header'>No Expenses To Show</h2>`;
            listDiv.innerHTML += textHtml;
        }

        let expenseCount = response.data.expenseCount;
        var paginationDiv = document.querySelector(".pagination-div");
        paginationDiv.innerHTML = "";
        let lastPage = Math.ceil(expenseCount/items_count);
        let i = currentPageNumber == 1? 1 : currentPageNumber-1;
        let n = currentPageNumber == 1? 3 : currentPageNumber+2;
        n = lastPage < n ? lastPage : n; 
        if(currentPageNumber>=3){
            paginationDiv.innerHTML += `<button class="pagination-btn" disabled>...</button>`
        }
        while(i<=n){
            if(i==currentPageNumber){
                paginationDiv.innerHTML += `<button id="currentPageNumber" class="pagination-btn" style="background-color:rgb(114, 10, 10);color:aliceblue;">${1}</button>`;
            }else{
                paginationDiv.innerHTML += `<button class="pagination-btn">${i}</button>`;
            }
            i++;
        }
        if(lastPage>n){
            paginationDiv.innerHTML += `<button class="pagination-btn" disabled>...</button>
                                        <button class="pagination-btn">${lastPage}</button>`;
        }
        
        
    } catch (error) {
        console.log(error);
        alert("Something Went Wrong! Check Console and Reload!");
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