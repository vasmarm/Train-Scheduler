

// Initialize Firebase
var config = {
    apiKey: "AIzaSyD7-U0-MzAg8tO5lVE8ky6fzpuNjVmAqS8",
    authDomain: "train-scheduler-a57e2.firebaseapp.com",
    databaseURL: "https://train-scheduler-a57e2.firebaseio.com",
    projectId: "train-scheduler-a57e2",
    storageBucket: "",
    messagingSenderId: "425818475658"
};

firebase.initializeApp(config);

var database = firebase.database();

// variable for Displaying Current Time
var currentTime = moment().format('LT');

$("#current-time").append(moment().format('LT'));

// Button for adding Train
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var firstTrainTime = $("#first-train-time").val().trim();
  var frequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: destination,
    firstTrainTime: firstTrainTime,
    frequency: frequency,
    timeNow: currentTime
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Alert when train is added
  alert("Train Successfully Added!");
   
  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-time").val("");
  $("#frequency-input").val("");
  $("#current-time").val("");
});

  // Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainFirstTime = childSnapshot.val().firstTrainTime;
  var trainFrequency = childSnapshot.val().frequency;


  // Calculate Next Arrival

  var firstTimeConverted = moment(trainFirstTime, "hh:mm");
  
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  
  var tRemainder = diffTime % trainFrequency;
  
  var tMinutesTillTrain = trainFrequency - tRemainder;
  
  var nextArrival = moment().add(tMinutesTillTrain, "minutes").format('LT');
  

  // Displaying data in the table after formating it
   $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" +
  trainFrequency + "</td><td>" + nextArrival + "</td><td>" + tMinutesTillTrain + "</td><td>" + currentTime +"</td></tr>");

});
