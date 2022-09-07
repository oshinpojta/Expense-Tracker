let listDiv = document.getElementById('list-div');

let url = "http://54.159.134.29:4000";
let jwt_token = sessionStorage.getItem('token'); //getCookie('token')
let options = { 
    headers : { 
        authorization : `${jwt_token}` 
    } 
};

let leaderboard = [];

let getClick = async (e) => {
    e.preventDefault();
    try {
        if(e.target.className == "index"){
            window.location.replace(`${url}/index.html`);
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
        if(e.target.className == "list-item"){
            let id = Number(e.target.querySelector(".list-hidden").innerText);
            for(let i=0;i<leaderboard.length;i++){
                if(leaderboard[i].user.id == id){
                    let userText = `${leaderboard[i].user.name}\n${leaderboard[i].user.email}\nTotal Expense: ${leaderboard[i].totalExpense}\n`;
                    let expensesText = "\nExpenses : \n\n";
                    for(let j=0;j<leaderboard[i].expenses.length;j++){
                        expensesText += `${leaderboard[i].expenses[j].description} (${leaderboard[i].expenses[j].category}), Amount: ${leaderboard[i].expenses[j].amount}\n`;
                    }
                    userText+=expensesText;
                    swal({
                        closeOnClickOutside: false,
                        title : `Rank ${i+1}`,
                        text : userText
                    })
                    break;
                }
            }
        }

        if(e.target.parentNode.className == "list-item"){
            let id = Number(e.target.parentNode.querySelector(".list-hidden").innerText);
            for(let i=0;i<leaderboard.length;i++){
                if(leaderboard[i].user.id == id){
                    let userText = `${leaderboard[i].user.name}\n${leaderboard[i].user.email}\nTotal Expense: Rs.${leaderboard[i].totalExpense}\n`;
                    let expensesText = "\nExpenses: \n\n";
                    for(let j=0;j<leaderboard[i].expenses.length;j++){
                        expensesText += `${leaderboard[i].expenses[j].description} (${leaderboard[i].expenses[j].category}), Amount: Rs.${leaderboard[i].expenses[j].amount}\n`;
                    }
                    userText+=expensesText;
                    swal({
                        closeOnClickOutside: false,
                        title : `Rank ${i+1}`,
                        text : userText
                    })
                    break;
                }
            }
        }

    } catch (error) {
        console.log(error);
    }

}

let loadUsers = async (e) =>{ 
    e.preventDefault();
    try {
        let response = await axios.get(`${url}/expenses/leaderboard`,options);
        if(response.data.success==true){

            leaderboard = response.data.data;
            if(leaderboard.length>0){
                leaderboard.sort((a,b)=>{
                    return b.totalExpense - a.totalExpense;
                });
                //console.log(leaderboard);
                let textHtml = "";
                for(let i=0;i<leaderboard.length;i++){
                    textHtml += `<div id="list-item${leaderboard[i].user.id}" class="list-item">
                                    <div class="list-hidden" style="display:none;">${leaderboard[i].user.id}</div>
                                    <div class="list-rank">Rank ${i+1}</div>
                                    <div class="list-name">${leaderboard[i].user.name}</div>
                                    <div class="list-amount">Monthly Expense : Rs.${leaderboard[i].totalExpense}</div>
                                </div>`;
                }
                document.getElementById('list-div').innerHTML += textHtml;
            }else{
                swal("No Users To Show!");
            }

        }else{
            swal("No Response From Server!");
            console.log("Success Failure! : ",response);
        }

    } catch (error) {
        console.log(error);
    }
}

document.addEventListener("click",getClick);
document.addEventListener("DOMContentLoaded",loadUsers);