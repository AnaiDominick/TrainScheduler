$(document).ready(function () {
    // 1. Initialize Firebase
    var config = {
        apiKey: "AIzaSyADHNsd08_sJNMQYiUoGmIPAZjr5h083KA",
        authDomain: "anai-8b424.firebaseapp.com",
        databaseURL: "https://anai-8b424.firebaseio.com",
        projectId: "anai-8b424",
        storageBucket: "anai-8b424.appspot.com",
        messagingSenderId: "769078964438"
    };

    firebase.initializeApp(config);

    var database = firebase.database();
    var trainName = "";
    var trainDestination = "";
    var firstTrain = 0;
    var trainFrequency = "";


    // 2. Button for adding Trains
    $("#submit").click(function (event) {
        event.preventDefault();

        // Grabs user input
        trainName = $("#trainName-input").val().trim();
        trainDestination = $("#destination-input").val().trim();
        firstTrain = $("#firstTrainTime-input").val().trim();
        trainFrequency = $("#frequency-input").val().trim();

        // Creates local "temporary" object for holding train data
        database.ref().push( {
            name: trainName,
            destination: trainDestination,
            first: firstTrain,
            frequency: trainFrequency,
            // dateAdded: firebase.database.ServerValue.TIMESTAMP
        });

        // Clears all of the text-boxes
        $("#trainName-input").val("");
        $("#destination-input").val("");
        $("#firstTrainTime-input").val("");
        $("#frequency-input").val("");
    });

    // 3. Create Firebase event for adding a train to the database and a row in the html when a user adds an entry
    database.ref().on("child_added", function(snapshot) {

        // Logs everything to console
        console.log(snapshot.val());
        console.log(snapshot.val().name);
        console.log(snapshot.val().destination);
        console.log(snapshot.val().first);
        console.log(snapshot.val().frequency);
  
        
       first = snapshot.val().first;
       frequency = snapshot.val().frequency;

       var firstTimeConverted = moment(first, "HH:mm").subtract(1, "years");
       console.log(firstTimeConverted);

       var currentTime = moment();
       console.log("Current time: " + moment(currentTime).format("HH:mm"));

       var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
       console.log("Difference in time: " + diffTime);

       var tRemainder = diffTime % frequency;
       console.log(tRemainder);

       var tMinutesTillTrain = frequency - tRemainder;
       console.log("Minutes till train: " + tMinutesTillTrain);

       var nextTrain = moment().add(tMinutesTillTrain, "minutes");
       console.log("Next Arrival " + moment(nextTrain).format("HH:mm"));

        
        // Create the new row
        var newRow = $("<tr>").append(
            $("<td>").text(snapshot.val().name),
            $("<td>").text(snapshot.val().destination),
            $("<td>").text(snapshot.val().first),
            $("<td>").text(moment(nextTrain).format("hh:mm")),
            $("<td>").text(tMinutesTillTrain)
        );

        // Append the new row to the table
        $("tbody").append(newRow);

    }, function (errorObject) {
        console.log("Errors handled: " + errorObject);
    });
});
