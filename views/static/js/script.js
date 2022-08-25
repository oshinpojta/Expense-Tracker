let amount = document.querySelector('#amount');
let description = document.getElementById('description');
let category = document.getElementById('category');
let hidden = document.querySelector("#hidden")
let list = document.getElementById('list');
let button = document.getElementById('button');
const logout = document.getElementById("logout");

let url = "http://localhost:4000";
let jwt_token = sessionStorage.getItem('token'); //getCookie('token')
let options = { 
    headers : { 
        authorization : `Bearer ${jwt_token}` 
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


const getPromise = async () => {
    const expensesObj = {"amount": amount.value, "description": description.value, "category" : category.value};
    if(hidden.value===""){
        return await axios.post(url, options, expensesObj);
    }else{
        return await axios.put(`${url}/${hidden.value}`, options, expensesObj)
    }
}

let addExpense = async (e) => {
    e.preventDefault();
    try{
        let returnedObj = await getPromise();
        let amountVal = amount.value;
        let descriptionVal = description.value;
        let categoryVal = category.value;
        let li = document.createElement("li");
        let p = document.createElement("p");
        p.className = "expenses-p"
        if(hidden.value===""){
            li.id = returnedObj.data._id;   //object - not array
        }else{
            li.id = hidden.value;
        }
        let deletebutton = document.createElement("button");
        let editbutton = document.createElement("button");
        p.innerHTML = amountVal+", "+descriptionVal+", "+categoryVal;
        deletebutton.textContent = "Delete Expense";
        deletebutton.addEventListener("click",deleteExpense);
        editbutton.textContent = "Edit Expense";
        editbutton.addEventListener("click",editExpense);
        li.appendChild(p);
        li.appendChild(deletebutton);
        li.appendChild(editbutton);
        list.appendChild(li);
    
        amount.value = "";
        category.value = "";
        description.value = "";
        hidden.value = "";

    }catch(err){
        console.log(err);
    }
}

let deleteExpense = async (e) => {
    e.preventDefault()
    try {
        
        console.log(e.target.parentNode.id);
        const returnedObj = await axios.delete(url+"/"+e.target.parentNode.id, options);
        if(returnedObj.data.length===0){
            e.target.parentNode.remove();
        }else{
            console.log("Expense couldn't be deleted.");
        }

    } catch (error) {
        console.log(error);
    }
}

let logoutUser = async (e) => {
    e.preventDefault();
    try {
        console.log("clicked");
        let response = await axios.post(`${url}/user/logout`, options);
        console.log(response.data);
        if(response.data.success == true){
            sessionStorage.removeItem('token');
            window.location.replace(`${url}/login.html`);
        }else{
            window.location.replace(`${url}/error.html`);
        }
    } catch (error) {
        console.log(error);
    }
}

let loadExpenses = async (e) => {
    e.preventDefault();
    try {
        let response = await axios.get(`${url}/expenses`,options);
        console.log(response);
        if(response.data.success == false){
            window.location.replace(`${url}/login.html`);
        }
        logout.addEventListener("click",logoutUser);
        let data = response.data.expenses;  //array
        for(let i=0;i<data.length;i++){
            let obj = data[i];
            let amountVal = obj.amount;
            let descriptionVal = obj.description;
            let categoryVal = obj.category;
            let li = document.createElement("li");
            let p = document.createElement("p");
            p.className = "expenses-p";
            li.id = obj._id;
            let deletebutton = document.createElement("button");
            let editbutton = document.createElement("button");
            p.innerHTML = amountVal+", "+descriptionVal+", "+categoryVal;
            deletebutton.textContent = "Delete Expense";
            deletebutton.addEventListener("click",deleteExpense);
            editbutton.textContent = "Edit Expense";
            editbutton.addEventListener("click",editExpense);
            li.appendChild(p);
            li.appendChild(deletebutton);
            li.appendChild(editbutton);
            list.appendChild(li);

            amount.value = "";
            category.value = "";
            description.value = "";
            hidden.value = "";
        }
        
    } catch (error) {
        console.log(error);
    }
}

function editExpense(e){
    e.preventDefault();

    try {

        if(hidden.value!=""){
            document.getElementById(hidden.value).style.display = "initial";
        }
        let currentli = e.target.parentNode;
        let stringList = getSeparatedValues(currentli.querySelector(".expenses-p").textContent);
        amount.value = stringList[0];
        description.value = stringList[1];
        category.value = stringList[2];
        hidden.value = currentli.id;
        e.target.parentNode.style.display = "none";
        
    } catch (error) {
        console.log(error);
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
button.addEventListener("click",addExpense);