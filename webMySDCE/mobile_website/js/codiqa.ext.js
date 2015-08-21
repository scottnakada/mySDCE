// Put your custom code here
function customize() {
    // -Plain old variable holding a value:
    // var userName = prompt("Please Enter Your Name");
    // -HTML5 Local Storage, holding a more permanent value:
    localStorage.userName = prompt("Please Enter Your Name");
    // -Accessing a plain old variable:6
    // document.getElementById("welcomeMsg").innerHTML = "Welcome, " + userName;
    // -HTML5 Local Storage, accessing a value in localStorage
    // document.getElementById("welcomeMsg").innerHTML = "Welcome, " + localStorage.userName;
    $(".welcomeMsg").html(", " + localStorage.userName);
};

function loadName() {
    if(localStorage.userName == undefined) {
        // True result
        // document.getElementById("welcomeMsg").innerHTML = "Welcome, friend";
        // $(".welcomeMsg").html(", friend.");
    } else {
        // False result
        // document.getElementById("welcomeMsg").innerHTML = "Welcome, " + localStorage.userName;
        $(".welcomeMsg").html(", " + localStorage.userName);
    };
};

/* -- Runs after HTML5 document is ready. Does not need loadName(); --
 $(document).ready(function() {
 if(localStorage.userName == undefined) {
 // True result
 document.getElementById("welcomeMsg").innerHTML = "Welcome, friend";
 } else {
 // False result
 document.getElementById("welcomeMsg").innerHTML = "Welcome, " + localStorage.userName;
 };
 });
 */