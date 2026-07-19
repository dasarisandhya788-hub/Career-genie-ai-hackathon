function generateRoadmap(){

let name=document.getElementById("name").value;

let education=document.getElementById("education").value;

let career=document.getElementById("career").value;

let study=document.getElementById("studyHours").value;

localStorage.setItem("name",name);

localStorage.setItem("education",education);

localStorage.setItem("career",career);

localStorage.setItem("study",study);

window.location.href="roadmap.html";

}


function showCareer(){

    document.getElementById("careerDiv").style.display = "block";
    document.getElementById("interestDiv").style.display = "none";

}

function hideCareer(){

    document.getElementById("careerDiv").style.display = "none";
    document.getElementById("interestDiv").style.display = "block";

}

function recommendCareer(){

let interests=[];

document.querySelectorAll('input[type="checkbox"]:checked').forEach(function(item){

interests.push(item.value);

});

let recommendation="";

if(interests.includes("Coding") && interests.includes("AI")){

recommendation="🥇 AI Engineer";

}

else if(interests.includes("Coding") && interests.includes("Data")){

recommendation="🥇 Data Scientist";

}

else if(interests.includes("Coding") && interests.includes("Cyber")){

recommendation="🥇 Cyber Security";

}

else if(interests.includes("Govt")){

recommendation="🥇 IAS Officer";

}

else{

recommendation="🥇 Software Engineer";

}

document.getElementById("recommendationBox").style.display="block";

document.getElementById("recommendationText").innerHTML=

recommendation;

}

function useRecommendation(){

let text=document.getElementById("recommendationText").innerText;

if(text.includes("AI"))

localStorage.setItem("career","AI Engineer");

else if(text.includes("Data"))

localStorage.setItem("career","Data Scientist");

else if(text.includes("Cyber"))

localStorage.setItem("career","Cyber Security");

else if(text.includes("IAS"))

localStorage.setItem("career","IAS");

else

localStorage.setItem("career","Software Engineer");

generateRoadmap();

}

async function askAI() {


    console.log("askAI button clicked");

    let question = document.getElementById("question").value;

    if (question.trim() === "") {
        alert("Please ask a question.");
        return;
    }

    document.getElementById("aiAnswer").style.display = "block";
    document.getElementById("aiAnswer").innerHTML = "🤖 Thinking...";

    try {


        const response = await fetch("http://localhost:3000/ask-ai", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ question })
        });

console.log("Request sent");

        const data = await response.json();

        console.log("Server Response:", data);

        document.getElementById("aiAnswer").innerHTML = data.answer;

    } catch (error) {

        console.error(error);

        document.getElementById("aiAnswer").innerHTML =
            "❌ " + error.message;

    }

}

