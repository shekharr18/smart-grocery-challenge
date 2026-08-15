// ==============================
// Welcome Message
// ==============================

window.addEventListener("load", () => {
    console.log("Welcome to Smart Grocery Shopping Challenge");
});


// ==============================
// Smooth Scrolling
// ==============================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function(e){

        e.preventDefault();

        document.querySelector(this.getAttribute("href")).scrollIntoView({
            behavior:"smooth"
        });

    });

});


// ==============================
// Scroll to Top Button
// ==============================

// Create Button

const topButton = document.createElement("button");

topButton.innerHTML = "⬆";

topButton.id = "topBtn";

document.body.appendChild(topButton);


// Show Button

window.onscroll = function(){

    if(document.documentElement.scrollTop > 300){

        topButton.style.display = "block";

    }

    else{

        topButton.style.display = "none";

    }

};


// Click Event

topButton.onclick = function(){

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

};


// ==============================
// Dark Mode
// ==============================

const darkButton = document.createElement("button");

darkButton.innerHTML = "🌙";

darkButton.id = "darkBtn";

document.body.appendChild(darkButton);

let darkMode = false;

darkButton.onclick = function(){

    if(!darkMode){

        document.body.style.background =
        "linear-gradient(135deg,#232526,#414345)";

        document.body.style.color="white";

        darkMode=true;

    }

    else{

        document.body.style.background =
        "linear-gradient(135deg,#4facfe,#00f2fe)";

        document.body.style.color="black";

        darkMode=false;

    }

};