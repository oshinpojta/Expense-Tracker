var amount = document.querySelector('#amount');
var description = document.getElementById('description');
var category = document.getElementById('category');
var hidden = document.querySelector("#hidden")
var list = document.getElementById('list');
var button = document.getElementById('button');

const baseURL = "https://crudcrud.com/api/7b06da3fa83a4518ab0b5cb7ed0d2dd0";
const expensesURL = "/expenses";

window.addEventListener("DOMContentLoaded",loadExpenses);
button.addEventListener("click",addExpense);

function addExpense(e){
    e.preventDefault();
    const getPromise = async () => {
        const expensesObj = {"amount": amount.value, "description": description.value, "category" : category.value};
        const returnedObj = {};
        if(hidden.value===""){
            return axios.post(baseURL+expensesURL, expensesObj);
        }else{
            return axios.put(baseURL+expensesURL+"/"+hidden.value, expensesObj)
        }
    }
    getPromise().then((returnedObj)=>{
        console.log(returnedObj);
        console.log(returnedObj.data);
        let amountVal = amount.value;
        let descriptionVal = description.value;
        let categoryVal = category.value;
        let li = document.createElement("li");
        let p = document.createElement("p");
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
    }).catch((err)=>console.log("getPromise Error in Add Expense :- "+err));
    
}

function deleteExpense(e){
    e.preventDefault()
    console.log(e.target.parentNode.id);
    const returnedObj = axios.delete(baseURL+expensesURL+"/"+e.target.parentNode.id);
    if(returnedObj.data.length===0){
        e.target.parentNode.remove();
    }else{
        console.log("Expense couldn't be deleted.");
    }
    
}

function editExpense(e){
    e.preventDefault();
    let currentli = e.target.parentNode;
    let stringList = getSeparatedValues(currentli.textContent);
    amount.value = stringList[0];
    description.value = stringList[1];
    category.value = stringList[2].re;
    hidden.value = currentli.id;
    e.target.parentNode.remove();
}

function loadExpenses(e){
    
    const loadPromise = async () =>{
        return axios.get(baseURL+expensesURL);
    }
    loadPromise().then((returnedObj)=>{
        let data = returnedObj.data;  //array
        for(let i=0;i<data.length;i++){
            var obj = data[i];
            let amountVal = obj.amount;
            let descriptionVal = obj.description;
            let categoryVal = obj.category;
            var li = document.createElement("li");
            var p = document.createElement("p");
            li.id = obj._id;
            var deletebutton = document.createElement("button");
            var editbutton = document.createElement("button");
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
    }).catch((err)=>console.log("load Expense Error :- "+ err));

    
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