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
 //Step 3d - populate the htmlOutut variable with all the relevant data
    for (i = 0; i < responseJson.drinks.length; i++) {
        console.log(responseJson.drinks[i]);
        responseJson.drinks.forEach((drink) => {
            const drinkEntries = Object.entries(drink),
                // This part build arrays out of the two sets of keys
                [
                    ingredientsArray,
                    measuresArray
                ] = [
                    "strIngredient",
                    "strMeasure"
                ].map((keyName) => Object.assign([], ...drinkEntries
                    .filter(([key, value]) => key.startsWith(keyName))
                    .map(([key, value]) => ({ [parseInt(key.slice(keyName.length))]: value })))),
                // This part filters empty values based on the ingredients
                {
                    finalIngredients,
                    finalMeasures
                } = ingredientsArray.reduce((results, value, index) => {
                    if (value && value.trim() || measuresArray[index] && measuresArray[index].trim()) {
                        results.finalIngredients.push(value);
                        results.finalMeasures.push(measuresArray[index]);
                    }
                    return results;
                }, {
                    finalIngredients: [],
                    finalMeasures: []
                }),
                // Optional: zip both arrays
                ingredientsWithMeasures = finalIngredients
                    .map((value, index) => [finalMeasures[index], value]);
            // Output
            console.log("Ingredients:", finalIngredients);
            console.log("Measures:", finalMeasures);
            console.log(ingredientsWithMeasures);
            let ingredientsWithMeasuresOutput = ingredientsWithMeasures.map(([measure, ingredient]) => `${(measure || "").trim()} ${(ingredient || "").trim()}`).join("<br />");
            console.log("All ingredients and measures:\n", ingredientsWithMeasures
                .map(([measure, ingredient]) => `${(measure || "").trim()} ${(ingredient || "").trim()}`)
                .join("\n"));

            $('#results-list').append(`
                        <li>
                                <h3>${responseJson.drinks[i].strDrink}</h3>
                                <img src="${responseJson.drinks[i].strDrinkThumb}" class="img-full">
                                <p class="instructions">
                                    ${ingredientsWithMeasuresOutput}
                                </p>
                            </label>
                        </li>
                    
                `); 
        });
        
        
    }

//Remove hidden class from results
    $('.results').removeClass('hidden');
}


// Watch form for cocktail submissions
function cocktailWatch() {
    console.log("Waiting on the bartender");
    $('form[id="cocktails"]').submit(event => {
        event.preventDefault();
    const chosenIngredient = $('.ingredient-list').val();
    console.log(chosenIngredient);
    getDataByIngredient(chosenIngredient);
    })
}

function main() {
    cocktailWatch();
}

$(main);