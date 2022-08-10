let amount = document.querySelector('#amount');
let description = document.getElementById('description');
let category = document.getElementById('category');
let hidden = document.querySelector("#hidden")
let list = document.getElementById('list');
let button = document.getElementById('button');

const baseURL = "https://crudcrud.com/api/ed4ea7056f714552be6f0f12a2483a54";
const expensesURL = "/expenses";

let addExpense = async (e) => {
    e.preventDefault();
    const getPromise = async () => {
        const expensesObj = {"amount": amount.value, "description": description.value, "category" : category.value};
        if(hidden.value===""){
            return axios.post(baseURL+expensesURL, expensesObj);
        }else{
            return axios.put(baseURL+expensesURL+"/"+hidden.value, expensesObj)
        }
    }
    let returnedObj = await getPromise();
    let display = (returnedObj)=>{
        console.log(returnedObj);
        console.log(returnedObj.data);
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
    }
    display(returnedObj);
    
}

let deleteExpense = async (e) => {
    e.preventDefault()
    console.log(e.target.parentNode.id);
    const returnedObj = await axios.delete(baseURL+expensesURL+"/"+e.target.parentNode.id);
    if(returnedObj.data.length===0){
        e.target.parentNode.remove();
    }else{
        console.log("Expense couldn't be deleted.");
    }
    
}

let loadExpenses = async (e) => {

    let returnedObj = await axios.get(baseURL+expensesURL);
    let display = (returnedObj)=>{
        let data = returnedObj.data;  //array
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
    }
    display(returnedObj);
}

function editExpense(e){
    e.preventDefault();
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


window.addEventListener("DOMContentLoaded",loadExpenses);
button.addEventListener("click",addExpense);