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
    // console.log(url);
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
    // console.log(responseJson);
    for (i = 0; i < responseJson.drinks.length; i++) {
        //console.log(responseJson.drinks[i])
        // console.log(responseJson.drinks[i].idDrink);
        getDataById(responseJson.drinks[i].idDrink);
    }
}

function getDataById(cocktailId) {
    //Step 2a - create the url
    const url = `https://the-cocktail-db.p.rapidapi.com/lookup.php?i=${cocktailId}`;
    // console.log(url);
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
                                <h3>${responseJson.drinks[i].strDrink}</h3>
                                <img src="${responseJson.drinks[i].strDrinkThumb}" class="img-full">
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
        let testObject = responseJson.drinks[i];

        // Put the object into storage
        localStorage.setItem('testObject', JSON.stringify(testObject));

        // Retrieve the object from storage
        let retrievedObject = localStorage.getItem('testObject');

        // console.log('retrievedObject: ', JSON.parse(retrievedObject));
        pickFavorites2(retrievedObject);

    }

    //Remove hidden class from results
    $('.results').removeClass('hidden');
}

function displayFaveInfo(objectCocktail) {
    for (i = 0; i < localStorage.length; i++) {
        console.log(objectCocktail);
        // Object.entries(objectCocktail).forEach(entry => {
        //     const [key, value] = entry;
        //     console.log(key, value);
        // })
        // Object.values(objectCocktail).forEach(val => {
        //     console.log(val);
        // })
        // objectCocktail.forEach((drink) => {
        //     const drinkEntries = Object.entries(drink),
        //         // This part build arrays out of the two sets of keys
        //         [
        //             ingredientsArray,
        //             measuresArray
        //         ] = [
        //             "strIngredient",
        //             "strMeasure"
        //         ].map((keyName) => Object.assign([], ...drinkEntries
        //             .filter(([key, value]l) => key.startsWith(keyName))
        //             .map(([key, value]) => ({ [parseInt(key.slice(keyName.length))]: value })))),
        //         // This part filters empty values based on the ingredients
        //         {
        //             finalIngredients,
        //             finalMeasures
        //         } = ingredientsArray.reduce((results, value, index) => {
        //             if (value && value.trim() || measuresArray[index] && measuresArray[index].trim()) {
        //                 results.finalIngredients.push(value);
        //                 results.finalMeasures.push(measuresArray[index]);
        //             }
        //             return results;
        //         }, {
        //             finalIngredients: [],
        //             finalMeasures: []
        //         }),
        //         // Optional: zip both arrays
        //         ingredientsWithMeasures = finalIngredients
        //             .map((value, index) => [finalMeasures[index], value]);
        //     // Output
        //     console.log("Ingredients:", finalIngredients);
        //     console.log("Measures:", finalMeasures);
        //     console.log(ingredientsWithMeasures);
        //     let ingredientsWithMeasuresOutput = ingredientsWithMeasures.map(([measure, ingredient]) => `${(measure || "").trim()} ${(ingredient || "").trim()}`).join("<br />");
        //     console.log("All ingredients and measures:\n", ingredientsWithMeasures
        //         .map(([measure, ingredient]) => `${(measure || "").trim()} ${(ingredient || "").trim()}`)
        //         .join("\n"));

        //         })            
    }
}


function updateFavorites(objectCocktail) {
    let htmlOutput = ""
    for (let i = 0; i < localStorage.length; i++) {
        // console.log(localStorage.key(i) + "=[" + localStorage.getItem(localStorage.key(i)) + "]");
        htmlOutput += `<div class="focus-fave>`
        htmlOutput += `<p class="cocktailName">${objectCocktail.strDrink}</p>`
        htmlOutput += `<img src = "${objectCocktail.strDrinkThumb}" class="img-thumb" />`
        htmlOutput += `<div class="ingredients-instructions">`
        if ((objectCocktail.strMeasure1 != null) && (objectCocktail.strIngredient1 != null)) {
            htmlOutput += `<p>${objectCocktail.strMeasure1} ${objectCocktail.strIngredient1}</p>`
        } 
        if ((objectCocktail.strMeasure2 != null) && (objectCocktail.strIngredient2 != null)) {
            htmlOutput += `<p>${objectCocktail.strMeasure2} ${objectCocktail.strIngredient2}</p>`
        } 
        if ((objectCocktail.strMeasure3 != null) && (objectCocktail.strIngredient3 != null)) {
            htmlOutput += `<p>${objectCocktail.strMeasure3} ${objectCocktail.strIngredient3}</p>`
        } 
        if ((objectCocktail.strMeasure4 != null) && (objectCocktail.strIngredient4 != null)) {
            htmlOutput += `<p>${objectCocktail.strMeasure4} ${objectCocktail.strIngredient4}</p>`
        } 
        if ((objectCocktail.strMeasure5 != null) && (objectCocktail.strIngredient5 != null)) {
            htmlOutput += `<p>${objectCocktail.strMeasure5} ${objectCocktail.strIngredient5}</p>`
        }

        htmlOutput += `<p>${objectCocktail.strInstructions}</p>`
        htmlOutput += `</div>`
        htmlOutput += `</div>`
        console.log(objectCocktail.strDrink);
    }
    $('.favorites-list').html(htmlOutput);
}

function pickFavorites2(retrievedObject) {
    let objectCocktail = JSON.parse(retrievedObject);
    // console.log(objectCocktail);

    $(document).on('click', '.list-item', function () {
        let cocktailName = $(this).find('h3').text();
        console.log(cocktailName);
        let checkForDuplicates = localStorage.getItem(cocktailName);
        console.log(checkForDuplicates);
        if (checkForDuplicates == null) {
            localStorage.setItem(cocktailName, objectCocktail);
            console.log(objectCocktail.idDrink);
        }
        console.log(objectCocktail.strDrink);
        console.log(objectCocktail.strInstructions);


        $('.favorites-list').empty();
        updateFavorites(objectCocktail);
        displayFaveInfo(objectCocktail);

    })
}

// var testObject = { 'one': 1, 'two': 2, 'three': 3 };

// // Put the object into storage
// localStorage.setItem('testObject', JSON.stringify(testObject));

// // Retrieve the object from storage
// var retrievedObject = localStorage.getItem('testObject');

// console.log('retrievedObject: ', JSON.parse(retrievedObject));

// function pickFavorites() {
//     $(document).on('click', '.list-item', function() {
//         let cocktailName = $(this).find('h3').text();
//         console.log(cocktailName);
//         let cocktailInstructions = $(this).find('p.instructions').text();
//         console.log(cocktailInstructions);
//         // localStorage.setItem(cocktailName, cocktailInstructions);
//         let cocktailImage = $(this).find('img').prop('src');
//         console.log(cocktailImage);
//         localStorage.setItem(cocktailName, cocktailImage);
//         $('.favorites-list').empty();
//         updateFavorites();

//     })
// }

function focusFaves() {
    $(document).on('click', '.focus-fave', function () {
        $(this).find('div.ingredients-instructions').toggleClass('hidden');
    });
}

function removeFaves() {
    $(document).on('click', '.focus-fave', function () {
        for (let i = 0; i < localStorage.length; i++) {
            console.log(localStorage.key(i) + "=[" + localStorage.getItem(localStorage.key(i)) + "]");
        }
    });
}

function showIngredients() {
    $(document).on('mouseover mouseout', '.list-item', function () {
        $(this).find('p.instructions').toggleClass('hidden');
    })
}

// Watch form for cocktail submissions
function cocktailWatch() {
    console.log("Waiting on the bartender");
    $('form[id="cocktails"]').submit(event => {
        event.preventDefault();
        $('#results-list').empty();
        const chosenIngredient = $('.ingredient-list').val();
        console.log(chosenIngredient);
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
    updateFavorites();
}

$(main);