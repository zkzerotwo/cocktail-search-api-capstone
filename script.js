//Format API query parameters
function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

//Select from a dropdown menu a list of ingredients or cocktails
//Cocktail menus will be populated by Cocktail DB's API
function getDataByIngredient(chosenIngredient) {
    //Step 2a - create the url
    const url = `https://the-cocktail-db.p.rapidapi.com/filter.php?i=${chosenIngredient}`;
    console.log(url);
    // Step 2b - make the api call using the URL, dataType (JSON or JSONP), type (GET or POST)
    fetch(url, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "d36a838384mshc96686c738af0aap11fd78jsnf972d810e8ef",
            "x-rapidapi-host": "the-cocktail-db.p.rapidapi.com"
        }
    })

        //Step 2c - success scenario (call the function to display the results)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            // DISPLAY ERRORS if the server connection works but the json data is broken
            throw new Error(response.statusText);
        })
        .then(responseJson => displayDrinks(responseJson))

        // Step 2d - failure scenario  (DISPLAY ERRORS if the server connection fails)
        .catch(err => {
            console.log(err);
        });
}


function displayDrinks(responseJson) {
    console.log(responseJson);
    for (i = 0; i < responseJson.drinks.length; i++) {
        //console.log(responseJson.drinks[i])
        console.log(responseJson.drinks[i].idDrink);
        getDataById(responseJson.drinks[i].idDrink);
    }
}

function getDataById(cocktailId) {
    //Step 2a - create the url
    const url = `https://the-cocktail-db.p.rapidapi.com/lookup.php?i=${cocktailId}`;
    console.log(url);
    // Step 2b - make the api call using the URL, dataType (JSON or JSONP), type (GET or POST)
    fetch(url, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "d36a838384mshc96686c738af0aap11fd78jsnf972d810e8ef",
            "x-rapidapi-host": "the-cocktail-db.p.rapidapi.com"
        }
    })

        //Step 2c - success scenario (call the function to display the results)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            // DISPLAY ERRORS if the server connection works but the json data is broken
            throw new Error(response.statusText);
        })
        .then(responseJson => displayCocktailDetails(responseJson))

        // Step 2d - failure scenario  (DISPLAY ERRORS if the server connection fails)
        .catch(err => {
            console.log(err);
        });
}

function displayCocktailDetails(responseJson) {
    console.log(responseJson);
    let htmlOutput = "";

    //Step 3d - populate the htmlOutut variable with all the relevant data
    for (i = 0; i < responseJson.drinks.length; i++) {
        console.log(responseJson.drinks[i])
        htmlOutput += `
                <li>${responseJson.drinks[i].strDrink}
                <ul>
                <li>${responseJson.drinks[i].strDrinkThumb}</li>
                <li>${responseJson.drinks[i]}</li>
                <li>${responseJson.drinks[i]}</li></ul></li>
            `;
    }

    //Step 3e - send the content of HTML results variable to the HTML
    $('#results-list').html(htmlOutput);
    $('.results').removeClass('hidden');
}
//Get drink ID's based on search results
// function getDrinkId(responseJson) {
//     const id = 
//     console.log(id);
// }

//Search results will populate a new form with chekcboxes, cocktail names, and images
//checkboxes will save and create thumbnails of cocktails
//thumbnails clicked will bring up cocktails they've saved
// Watch form for cocktail submissions
function cocktailWatch() {
    console.log("Waiting on the bartender");
    $('form').submit(event => {
        event.preventDefault();
    const chosenIngredient = $('.ingredient-list').val();
    console.log(chosenIngredient);
    getDataByIngredient(chosenIngredient);
    })
}

$(cocktailWatch);