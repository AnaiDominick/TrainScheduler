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

    // 2. Button for adding Trains
    $("#submit").click(function (event) {
        event.preventDefault();

        // Grabs user input
        var trainName = $("#trainName-input").val().trim();
        var trainDestination = $("#destination-input").val().trim();
        var firstTrain = $("#firstTrainTime-input").val().trim();
        var trainFrequency = $("#frequency-input").val().trim();

        // Creates local "temporary" object for holding train data
        var newTrain = {
            name: trainName,
            destination: trainDestination,
            first: firstTrain,
            frequency: trainFrequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        };

        // Uploads train data to the database
        database.ref().push(newTrain);

        // Logs everything to console
        console.log(newTrain.name);
        console.log(newTrain.destination);
        console.log(newTrain.first);
        console.log(newTrain.frequency);

        // Clears all of the text-boxes
        $("#trainName-input").val("");
        $("#destination-input").val("");
        $("#firstTrainTime-input").val("");
        $("#frequency-input").val("");

    });

    // 3. Create Firebase event for adding a train to the database and a row in the html when a user adds an entry
    database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
        
        //var temp = moment(snapshot.val().first, 'hh:mm').format("s ss");
        var firstTime = snapshot.val().first;
        console.log(firstTime);

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
        console.log(firstTimeConverted);

        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % snapshot.val().frequency;
        console.log(tRemainder);

        // Minute Until Train
        var tMinutesTillTrain = snapshot.val().frequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));        
        
        // Create the new row
        var newRow = $("<tr>").append(
            $("<td>").text(snapshot.val().name),
            $("<td>").text(snapshot.val().destination),
            $("<td>").text(snapshot.val().frequency),
            $("<td>").text(moment(nextTrain).format("hh:mm")),
            $("<td>").text(tMinutesTillTrain)
        );

        // Append the new row to the table
        $("tbody").append(newRow);

    });
});
