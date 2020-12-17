//Format API query parameters
function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

//Fetch data by ingredient
function getDataByIngredient(chosenIngredient) {
    //Step 2a - create the url
    let apiKey = "d36a838384mshc96686c738af0aap11fd78jsnf972d810e8ef"
    let hostUrl = "the-cocktail-db.p.rapidapi.com"
    const url = `https://the-cocktail-db.p.rapidapi.com/filter.php?i=${chosenIngredient}`;
    // console.log(url);
    // Step 2b - make the api call using the URL, dataType (JSON or JSONP), type (GET or POST)
    fetch(url, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": apiKey,
            "x-rapidapi-host": hostUrl
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

//Convert returned drinks into their id numbers
function displayDrinks(responseJson) {
    // console.log(responseJson);  
    //if responseJSON is a string, then it is an error
    if ((typeof responseJson.drinks) == "string") {
        $(".error").html("<h2>Sorry, we don't seem to have that ingredient. Try again.</h2>");
        $('.error').removeClass('hidden'); 
    }
    //if responseJSON is an array, continue function
    else {
        $('.error').addClass('hidden'); 
        for (i = 0; i < responseJson.drinks.length; i++) {
            // console.log(responseJson.drinks[i]);
            // console.log(responseJson.drinks[i].idDrink);
            getDataById(responseJson.drinks[i].idDrink);
        }
    }
    
}

//Search database by drink id
function getDataById(cocktailId) {
    // console.log(cocktailId);
    let apiKey = "d36a838384mshc96686c738af0aap11fd78jsnf972d810e8ef"
    let hostUrl = "the-cocktail-db.p.rapidapi.com"

    let cid = cocktailId;
    if (cid == undefined) {
        $(".error").html("<h2>Sorry, we don't seem to have that ingredient. Try again.</h2>");
        $('.error').removeClass('hidden'); 
    } else {
    //Step 2a - create the url
    const url = `https://the-cocktail-db.p.rapidapi.com/lookup.php?i=${cocktailId}`;
    // console.log(url);
    // Step 2b - make the api call using the URL, dataType (JSON or JSONP), type (GET or POST)
    fetch(url, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": apiKey,
            "x-rapidapi-host": hostUrl
        }
    })
        //Step 2c - success scenario (call the function to display the results)
        .then(response => {
            if (response.ok) {
                // console.log(response.json());
                return response.json();
            }
            // DISPLAY ERRORS if the server connection works but the json data is broken
            throw new Error(response.statusText);
        })
        .then(responseJson => displayCocktailDetails(responseJson))
        // Step 2d - failure scenario  (DISPLAY ERRORS if the server connection fails)
        .catch(err => {
            console.log(err);
            // console.log(drinks)
            // alert("Sorry, doesn't look like we have that")
        });
    }
}

//Display drinks, ingredients, and measurements; Format API Data
function displayCocktailDetails(responseJson) {
    // console.log(responseJson);
    //Step 3d - populate the htmlOutut variable with all the relevant data
    for (i = 0; i < responseJson.drinks.length; i++) {
        // console.log(responseJson.drinks[i]);
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
            // console.log("Ingredients:", finalIngredients);
            // console.log("Measures:", finalMeasures);
            // console.log(ingredientsWithMeasures);
            let ingredientsWithMeasuresOutput = ingredientsWithMeasures.map(([measure, ingredient]) => `${(measure || "").trim()} ${(ingredient || "").trim()}`).join("<br />");
            // console.log("All ingredients and measures:\n", ingredientsWithMeasures
            //     .map(([measure, ingredient]) => `${(measure || "").trim()} ${(ingredient || "").trim()}`)
            //     .join("\n"));
            $('#results-list').append(`
                        <li class="list-item">
                        <p class="pop-up hidden">Favorited!</p>
                                <h3>${responseJson.drinks[i].strDrink}</h3>
                                <img src="${responseJson.drinks[i].strDrinkThumb}" alt="${responseJson.drinks[i].strDrink}" class="img-full">
                                <p class="instructions hidden">
                                    ${ingredientsWithMeasuresOutput}<br/><br/>
                                    ${responseJson.drinks[i].strInstructions}
                                </p>
                                <p class="other-info hidden">
                                
                                </p>
                            </label>
                        </li>
                    
                `);
        });
        pickFavorites2(responseJson.drinks[i]);

    }

    //Remove hidden class from results
    $('.results').removeClass('hidden');
}

//Confirm drink data stored in local storage
function displayFaveInfo(objectCocktail) {
    for (i = 0; i < localStorage.length; i++) {
        // console.log(objectCocktail);
    }
}

//Update favorites list with selected cocktails 
function updateFavorites(cocktailName, objectCocktail) {
    // console.log(localStorage.length);
    let htmlOutput = ""
    for (let i = 0; i < localStorage.length; i++) {
        // console.log(localStorage.key(i));
        // console.log(localStorage.getItem(localStorage.key(i)));
        let localStorageFavorite = localStorage.getItem(localStorage.key(i));
        let localStorageFavoriteJson = JSON.parse(localStorageFavorite);
        // console.log(localStorageFavoriteJson);
        htmlOutput += `<li class="focus-fave">`
        htmlOutput += `<p class="cocktailName">${localStorageFavoriteJson.strDrink}</p>`
        htmlOutput += `<img src = "${localStorageFavoriteJson.strDrinkThumb}" alt="${localStorageFavoriteJson.strDrink}" class="img-thumb" />`
        htmlOutput += `<div class="ingredients-instructions">`
        if ((localStorageFavoriteJson.strMeasure1 != null) && (localStorageFavoriteJson.strIngredient1 != null)) {
            htmlOutput += `<p>${localStorageFavoriteJson.strMeasure1} ${localStorageFavoriteJson.strIngredient1}</p>`
        }
        if ((localStorageFavoriteJson.strMeasure2 != null) && (localStorageFavoriteJson.strIngredient2 != null)) {
            htmlOutput += `<p>${localStorageFavoriteJson.strMeasure2} ${localStorageFavoriteJson.strIngredient2}</p>`
        }
        if ((localStorageFavoriteJson.strMeasure3 != null) && (localStorageFavoriteJson.strIngredient3 != null)) {
            htmlOutput += `<p>${localStorageFavoriteJson.strMeasure3} ${localStorageFavoriteJson.strIngredient3}</p>`
        }
        if ((localStorageFavoriteJson.strMeasure4 != null) && (localStorageFavoriteJson.strIngredient4 != null)) {
            htmlOutput += `<p>${localStorageFavoriteJson.strMeasure4} ${localStorageFavoriteJson.strIngredient4}</p>`
        }
        if ((localStorageFavoriteJson.strMeasure5 != null) && (localStorageFavoriteJson.strIngredient5 != null)) {
            htmlOutput += `<p>${localStorageFavoriteJson.strMeasure5} ${localStorageFavoriteJson.strIngredient5}</p>`
        }

        htmlOutput += `<p>${localStorageFavoriteJson.strInstructions}</p>`
        htmlOutput += `</div>`
        htmlOutput += `</li>`
        // console.log(objectCocktail.strDrink);
    }
    // console.log(localStorage);
    $('.favorites-list').html(htmlOutput);
}

function pickFavorites2(objectCocktail) {
    $(document).on('dblclick', '.list-item', function () {
        // console.log(retrievedObject)
        let cocktailName = $(this).find('h3').text();
        // console.log(cocktailName);
        // console.log(objectCocktail);
        let checkForDuplicates = localStorage.getItem(cocktailName);
        // console.log(checkForDuplicates);
        if (checkForDuplicates == null) {
            // console.log(objectCocktail.strDrink)
            if (objectCocktail.strDrink == cocktailName) {
                localStorage.setItem(cocktailName, JSON.stringify(objectCocktail));
            }            
            // console.log(objectCocktail.idDrink);
        }
        // console.log(objectCocktail.strDrink);
        // console.log(objectCocktail.strInstructions);
        $('.favorites-list').empty();
        updateFavorites(cocktailName, objectCocktail);
        // displayFaveInfo(objectCocktail);
        // $(this).find('.pop-up').toggleClass('hidden', 3000);
        $(this).find('p.pop-up').show(500);

    })
    // $(document).on('focusout', '.list-item', function () {
    //     console.log('Triggerrrrred');
    //     $(this).find('p.pop-up').hide(500)

    // })
}


function focusFaves() {
    $(document).on('click', '.focus-fave', function () {
        console.log('I been clicked');
        // $(this).find('div.ingredients-instructions').toggleClass('hidden');
    });
}

function showIngredients() {
    $(document).on('click', '.list-item', function () {
        $(this).find('p.instructions').toggleClass('hidden');
    })
}

function resetFaves() {
    $('form[id="reset"]').on('click', '.no-fave', function() {
        let htmlOutput2 = "";
        // console.log('I been clicked');
        $('.favorites-list').html(htmlOutput2);
        localStorage.clear();
    })
}

// Watch form for cocktail submissions
function cocktailWatch() {
    // console.log("Waiting on the bartender");
    $('form[id="cocktails"]').submit(event => {
        event.preventDefault();
        $('#results-list').empty();
        const chosenIngredient = $('.ingredient-list').val();
        // console.log(chosenIngredient);
        getDataByIngredient(chosenIngredient);
    })
}

function main() {
    cocktailWatch();
    // pickFavorites();
    focusFaves();
    // removeFaves();
    showIngredients();
    localStorage.clear();
    // updateFavorites();
    resetFaves();
}

$(main);