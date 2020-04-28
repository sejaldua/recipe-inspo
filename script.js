document.addEventListener('DOMContentLoaded', function () {
    // default search query
    var q = "chicken";
    var state = 0;
    requestData(q);
    
    function requestData(q) {
        // Step 1: create new instance of request object
        let request = new XMLHttpRequest;
        console.log("1: request object created");
        console.log(q);
        // Step 2: Set the URL for the AJAX request to be the JSON file 
        request.open('GET', `https://www.themealdb.com/api/json/v1/1/filter.php?i=`+q, true);
        console.log("2: opened request file");
        // Step 3: set up event handler / callback
        request.onload = function() {
            console.log("3: readystatechange event fired");
    
            if (request.readyState == 4 && request.status == 200) {
                var data = JSON.parse(request.responseText).meals;

                // no data matches the query
                if (data == null) 
                {
                    document.getElementById("results").innerHTML = "<br><br><span>Could not find any meals with that ingredient. :(</span>";
                } 
                // display query results
                else 
                {
                    var allMeals = new Array();
                    var ids = new Array();
                    entries = data.length;
                    i = 0;
                    s = "<table class='table' id='meals'><tr>";
                    for (x in data) {
                        allMeals.push(data[x].strMeal);
                        ids.push(data[x].idMeal);
                        // managing table columns
                        if (i != 0 && i % 3 == 0) {
                            s += "</tr>";
                            s += "<tr>"
                        }
                        // alternating color scheme
                        if (i % 2 == 0)
                            s += "<th style='background-color: #F6E8EA' class='button' id=" + i + ">" + data[x].strMeal + "</th>";
                        else
                            s += "<th style='background-color:#B6DCF6' class='button' id=" + i + ">" + data[x].strMeal + "</th>";
                        s += "<th><img class='button' id=" + i + " src='" + data[x].strMealThumb + "' width='100' height='100'></img></th>";
                        if (i == entries - 1)
                            s += "</tr>";
                        i += 1;
                    }
                    s += "</table";             
                    document.getElementById("results").innerHTML = s;
                    listenClick(allMeals, ids);
                }
            } 
            else if (request.readyState == 4 && request.status != 200) {
                document.getElementById("results").innerHTML = "Uh Oh. Something went wrong."
            }
            else {
                console.log('Reached API but threw error');
            }
        }
        
        request.onerror = function() {
            console.log("Connection error");
        };
    
        // Step 4: fire off HTTP request
        request.send();
        console.log("4: Request sent");
    }

    function createModal(num, meal_name) {
        console.log(num, meal_name);
        var divstr = "";
        divstr += "<div class='modal' id='modal"+num+"'>";
        divstr += "<div class='modal-content' id='modal"+num+"content'>";
        divstr += "<span class='close'>&times;</span>";
        divstr + "<p>"+meal_name+"</p>";
        divstr += "</div>";
        divstr += "</div>";
        return divstr;
    }

    function generate() {
        q = document.getElementById("query").value;
        setTimeout(clear, 1000);
        console.log("before");
        requestData(q);
        console.log("after");
    }

    function clear() {
        document.getElementById('query').value = "";
    }

    document.getElementById("button").addEventListener("click", generate);
    document.addEventListener("keypress", function(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            $('#button').trigger("click");
        }
    });
});

function getId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11)
      ? match[2]
      : null;
}
    
const videoId = getId('http://www.youtube.com/watch?v=zbYf5_S7oJo');
const iframeMarkup = '<iframe width="560" height="315" src="//www.youtube.com/embed/' 
    + videoId + '" frameborder="0" allowfullscreen></iframe>';

function requestRecipe(q) {
    // Step 1: create new instance of request object
    let request = new XMLHttpRequest;
    console.log("1: request object created");
    console.log(q);
    // Step 2: Set the URL for the AJAX request to be the JSON file 
    request.open('GET', 'https://www.themealdb.com/api/json/v1/1/lookup.php?i='+q, true);
    console.log("2: opened request file");
    // Step 3: set up event handler / callback
    request.onload = function() {
        console.log("3: readystatechange event fired");

        if (request.readyState == 4 && request.status == 200) {
            var data = JSON.parse(request.responseText).meals[0];
            var s = data.strInstructions;
            console.log(data.strYoutube);          
            s += "<br><table class='ingredients' style='margin: auto'>";
            i = 1;
            s += "<tr style='font-family: Helvetica, sans-serif;'>";
            s += "<th><b>INGREDIENTS</b></th>";
            s += "<th><b>QUANTITIES</b></th>";
            s += "</tr>";
            while (data['strIngredient' + i] != "" && data['strIngredient' + i] != null) {
                if (i % 2 == 0)
                    s += "<tr class='even'>";
                else
                    s += "<tr class='odd'>";
                s += "<th>" + data['strIngredient' + i] + "</th>";
                s += "<th>" + data['strMeasure' + i] + "</th>";
                s += "</tr>";
                i += 1;
            }
            s += "</table>";
            s += "<br><br><iframe width='560' height='315' src='//www.youtube.com/embed/"+ getId(data.strYoutube) + "' frameborder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe><br>";   
            //console.log(s);
            document.getElementById("recipe").innerHTML = "";
            document.getElementById("recipe").innerHTML = s;
        } 
        else if (request.readyState == 4 && request.status != 200) {
            document.getElementById("results").innerHTML = "Uh Oh. Something went wrong."
        }
        else {
            console.log('Reached API but threw error');
        }
    }
    
    request.onerror = function() {
        console.log("Connection error");
    };

    // Step 4: fire off HTTP request
    request.send();
    console.log("4: Request sent");
}


function listenClick(meals, ids) {
    $(document).click(function(event) {
        console.log(event.target.id);
        if (parseInt(event.target.id) || event.target.id == 0) {
            var num = event.target.id;
            var modal = document.getElementById('modal');
            modal.style.display = "block";
            document.getElementById('modal-content').innerHTML = "<span class='close' id='close'>&times;</span><p>"+meals[num]+"</p><div id='recipe'></div>";
            var closeBtn = document.getElementById('close');
            closeBtn.addEventListener("click", function() {
                console.log("CLOSE");
                document.getElementById('modal').style.display = "none";
            });
            console.log(ids[num]);
            requestRecipe(ids[num]);
        }
    });
    
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target.className === "modal" || event.target.id == "body") {
            this.document.getElementById("modal").style.display = "none";
        }
    }
}