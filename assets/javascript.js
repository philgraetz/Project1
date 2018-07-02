function omdbAPIFunc(input){                    // function that calls the OMDb API (used for poster and overview)

    var queryURL = "https://www.omdbapi.com/?t=" + input + "&y=&plot=full&apikey=ccaa8d15";
    //ajax function
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response)

        var imgPoster = response.Poster;                            // variable to store the poster returned in the results
        var posterDiv = $("<img>").attr("src", imgPoster);          // variable that creates an img tag for the poster
        $("#image-poster").html(posterDiv);                         // add the poster to the newly created img tag

        var description = response.Plot;                                                        // variable to store the plot returned in the results
        var descriptionDiv = $("<p>").html("<strong>Description:</strong> " + description);     // variable that creates an p tag for the plot
        $("#description").html(descriptionDiv);                                                 // add the plot to the newly created p tag
        console.log(descriptionDiv)         

        var rating = response.Rated;                                                // variable to store the rating returned in the results
        var ratingDiv = $("<p>").html("<strong>Rating:</strong> " + rating);        // variable that creates a p tag for the rating
        $("#rating").html(ratingDiv);                                               // add the rating to the newly created p tag

        var runTime = response.Runtime;                                             // variable to store the run time returned in the results
        var runTimeDiv = $("<p>").html("<strong>Run Time:</strong> " + runTime);    // variable that creates a p tag for the run time
        $("#runtime").html(runTimeDiv);                                             // add the run time to the newly create p tag

        var releaseDate = response.Released;                                                    // variable to store the release date returned in the results
        var releaseDateDiv = $("<p>").html("<strong>Release Date:</strong> " + releaseDate);    // variable that creates a p tag for the release date
        $("#releasedate").html(releaseDateDiv);                                                 // add the releaes date to the newly created p tag
    });                                                             // end of OMDb API function
};
$("#goButton").on("click", function () {                                                        // function for youTube API pull (used for trailer)

    var userMovieInputYT = $("#movieInput").val().trim() + "official movie trailer";            // 
    var userMovieInput = $("#movieInput").val().trim();

    youtubeFunc(userMovieInputYT);
    omdbAPIFunc(userMovieInput)
    // end youTube API call
});
// end of gobutton onclick function
$("#showtimeButton").on("click", function () {

    var userZipCodeInput = $("#zipCodeField").val().trim();
    console.log(userZipCodeInput);

    $("#dateField").attr("pattern", "[0-9]{4}-[0-9]{2}-[0-9]{2}");
    var userDateInput = $("#dateField").val().trim();
    console.log(userDateInput);

    if ((userZipCodeInput === "") || (userDateInput === "")) {

        $("#missingInput").html("Missing input. Please input a zip code and a date.")
    } else {
        findMovies();
    }
});
// end of showtimeButton onclick function
function findMovies() {
    $("#missingInput").html("");

    var newSearchButton = $("<button>").attr("class", "btn btn-default");
    $(newSearchButton).attr("type", "button");
    $(newSearchButton).attr("id", "searchNewMovie");
    $(newSearchButton).html("Search using a new zip code or date");

    $("#searchButtons").append(newSearchButton);

    var userZipCodeInput = $("#zipCodeField").val().trim();
    var userDateInput = $("#dateField").val().trim();
    var queryShowtimeURL = "https://data.tmsapi.com/v1.1/movies/showings?startDate=" + userDateInput + "&zip=" + userZipCodeInput + "&api_key=qcw98up43djnn38bmwsh739a";

    $.ajax({
        url: queryShowtimeURL,
        method: "GET"
    }).then(function (results) {
        console.log(results)

        var infoLeftSide = results.slice(0, (results.length / 2));
        var infoRightSide = results.slice((results.length / 2));
        console.log(infoLeftSide);
        console.log(infoRightSide);

        for (h = 0; h < infoLeftSide.length; h++) {
            var titleDisplayLeft = infoLeftSide[h].title;
            var createPtagLeft = $("<p>").html(titleDisplayLeft);

            $(createPtagLeft).attr("class", "moviesForList");
            $(createPtagLeft).attr("id", infoLeftSide[h].title);
            $("#leftSide").append(createPtagLeft);
        };
        for (w = 0; w < infoRightSide.length; w++) {
            var titleDisplayRight = infoRightSide[w].title;
            var createPtagRight = $("<p>").html(titleDisplayRight);

            $(createPtagRight).attr("class", "moviesForList");
            $(createPtagRight).attr("id", infoRightSide[w].title);
            $("#rightSide").append(createPtagRight);

        };
        $(document).on('click', '.moviesForList', function () {
            var clicked = this.id;        // creates a variable to represent the value of the id of the movie clicked on from the currently in theaters list
            console.log(clicked);
            console.log(results);

            omdbAPIFunc(clicked);
            youtubeFunc(clicked);

            for (r = 0; r < results.length; r++) {
                if (results[r].title === clicked) {
                    console.log("found a match")
                    console.log(r);

                    for (z = 0; z < results[r].showtimes.length; z++) {
                        var theatreDisplay = results[r].showtimes[z].theatre.name;
                        var showtimesDisplay = results[r].showtimes[z].dateTime;
                        console.log(theatreDisplay);
                        console.log(showtimesDisplay);

                        var timeDisplay = showtimesDisplay.slice(11);
                        var dateDisplay = showtimesDisplay.slice(0, 10);
                        console.log(dateDisplay);

                        function convert(input) {
                            return moment(input, 'HH:mm:ss').format('h:mm A');
                        }
                        console.log(convert(timeDisplay));

                        var createTDtitle = $("<td>").html(clicked);
                        var createTDtheatre = $("<td>").html(theatreDisplay);
                        var createTDshowtimes = $("<td>").html(convert(timeDisplay));
                        
                        var createTR = $("<tr>").attr("class", "newRow");
                        $(createTR).append(createTDtitle, createTDtheatre, createTDshowtimes);
                        $("#showtimeTable").append(createTR);
                    };
                } else {
                    continue;
                }
            };
        });
    });
};   // end of findMovies function
$(document).on('click', '#searchNewMovie', function () {

    $("#zipCodeField").val("");
    $("#dateField").val("");
    $("#searchNewMovie").remove();
    $("#leftSide").html("");
    $("#rightSide").html("");
    $(".newRow").remove();
});

//enter button code 
function enter() {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("goButton").click();
    }
}
var input = document.getElementById("movieInput");
input.addEventListener("keyup", enter);
//end enter button function 

//this is the youTube API call for the top 8 posters from the header 
$('.trailer-image').on('click', function (e) {
    e.preventDefault();
    var userMovieInput = this.title;
    youtubeFunc(userMovieInput);
    omdbAPIFunc(userMovieInput);
    //end second youTube API call for header movies 
})

//This is stating the function for youTube API once, so we can use "youtubefunc" in multiple places. 
function youtubeFunc(input) {
    var youTubeAPI = {
        url: "https://www.googleapis.com/youtube/v3/search",
        part: "?part=snippet",
        results: "&maxResults=1",
        type: "&type=video",
        q: "&q=" + input + " official movie trailer",
        videoEmbed: "&videoEmbeddable=true",
        key: "&key=AIzaSyA48DgSrZgc7HxXqMqf1nwRIgn7pfYq_Ig"
    };
    $.ajax({
        url: youTubeAPI.url + youTubeAPI.part + youTubeAPI.results + youTubeAPI.type + youTubeAPI.q + youTubeAPI.videoEmbed + youTubeAPI.key,
        method: "GET"
    })
        .done(function (response) {
            console.log(response);
            for (var i = 0; i < response.items.length; i++) {
                var trailerDiv = $("<div>");
                trailerDiv.addClass('column box youtubeBox');
                var videoFrameDiv = $('<div>');
                var videoFrame = $('<iframe>');
                var videoUrl = 'https://www.youtube.com/embed/';
                videoFrame.attr({
                    src: videoUrl + response.items[i].id.videoId + "?version=3",
                    width: 400,
                    height: 320,
                    frameborder: 0
                });
                trailerDiv.html(videoFrameDiv);
                videoFrameDiv.html(videoFrame);
                $('.trailer').html(trailerDiv);
            }
        });
}
// END YOUTUBE API FUNCTION CALL STATEMENT 