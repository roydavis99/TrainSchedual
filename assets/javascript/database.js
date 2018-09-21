
var config = {
    apiKey: "AIzaSyCmcJpgLHzZcAZ8owMefWSkNr2KRBjGUdM",
    authDomain: "trainschedual.firebaseapp.com",
    databaseURL: "https://trainschedual.firebaseio.com",
    projectId: "trainschedual",
    storageBucket: "trainschedual.appspot.com",
    messagingSenderId: "479558096826"
  };

  
firebase.initializeApp(config);

var database = firebase.database();

var userInput = {
    name: "",
    destination: "",
    startTime: 0,
    frequency: 0
}

$(document).ready(function(){

    //button click for submit
    $("#new-train-btn").on("click",function(){
        event.preventDefault();
        //get input from user
        userInput.name = $("#train-name-input").val().trim();
        userInput.destination = $("#destination-input").val().trim();
        userInput.startTime = moment($("#first-train-time-input").val().trim(), "HHmm").format("X");
        userInput.frequency = $("#frequency-input").val().trim();

        if(moment($("#first-train-time-input").val().trim(), "HHmm").isValid()){

        database.ref().push(userInput);
        console.log(userInput);

        $("#train-name-input").val("");
        $("#destination-input").val("");
        $("#first-train-time-input").val("");
        $("#frequency-input").val("");
        }
        else{
            alert("The start time is not valid");
        }
    });

    database.ref().on("child_added", function(childSnapshot){
        console.log(childSnapshot.val());
        var shot = userInput;
        shot = childSnapshot.val();
        console.log(shot);

        var startTime = moment.unix(shot.startTime, "X").format("HHmm");
        console.log(startTime);
        var diffTime = moment().diff(moment(startTime).format("HHmm"));
        console.log(diffTime);
        var inMinutes = shot.frequency - (diffTime % shot.frequency);
        var nextRun = moment(moment().add(inMinutes, "minutes")).format("HHmm");


        var newRow = $("<tr>").append(
            $("<td>").text(shot.name),
            $("<td>").text(shot.destination),
            $("<td>").text(startTime),
            $("<td>").text(shot.frequency),
            $("<td>").text(nextRun),
            $("<td>").text(inMinutes)
        );
        $("#table-train").append(newRow);
    })
});
