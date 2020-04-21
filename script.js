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
                    var meals = new Array();
                    var ids = new Array();
                    entries = data.length;
                    i = 0;
                    s = "<table class='table' id='meals'><tr>";
                    for (x in data) {
                        meals.push(data[x].strMeal);
                        ids.push(data[x].idMeal);
                        // managing table columns
                        if (i != 0 && i % 3 == 0) {
                            s += "</tr>";
                            s += "<tr>"
                        }
                        // alternating color scheme
                        if (i % 2 == 0)
                            s += "<th class='button' data-modal='modal" + i + "'>" + data[x].strMeal + "</th>";
                        else
                            s += "<th style='background-color:#27252B' class='button' data-modal='modal" + i + "'>" + data[x].strMeal + "</th>";
                        s += "<th><img class='button' data-modal='modal" + i + "' src='" + data[x].strMealThumb + "' width='100' height='100'></img></th>";
                        if (i == entries - 1)
                            s += "</tr>";
                        i += 1;
                        document.getElementById("blooock").innerHTML += createModal(i, data[x].strMeal);
                    }
                    s += "</table";

                    console.log('ID:', data);                    
                    document.getElementById("results").innerHTML = s;
                    listenClick(meals, ids);
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
        num = num - 1
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
        document.getElementById("blooock").innerHTML = "";
        q = document.getElementById("query").value;
        console.log('Query: ',document.getElementById("query").value);
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
            s += "<br><a href='" + data.strYoutube + "'></a>";             
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
            //console.log(s);
            document.getElementById("recipe").innerHTML = "";
            document.getElementById("recipe").innerHTML = s;
            console.log(document.getElementById("recipe").innerHTML);
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
    console.log("testing");
    var modalBtns = [...document.querySelectorAll(".button")];
    modalBtns.forEach(function(btn){
        btn.addEventListener("click", function() {
            console.log("clicked");
            var modal = btn.getAttribute('data-modal');
            document.getElementById(modal).style.display = "block";
            document.getElementById(modal+'content').innerHTML = "<span class='close'>&times;</span><p>Recipe: "+meals[modal[5]]+"</p><div id='recipe'></div>";
            var closeBtns = [...document.querySelectorAll(".close")];
            closeBtns.forEach(function(btn){
                console.log(btn);
                btn.addEventListener("click", function() {
                    console.log("CLOSE");
                    var modal = btn.closest('.modal');
                    modal.style.display = "none";
                })
            });
            requestRecipe(ids[modal[5]]);
        })
    });
    

    
    /*console.log("here");
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        console.log("close!");
         modal.style.display = "none";
    }
    */
    
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target.className === "modal") {
            event.target.style.display = "none";
        }
    }
}