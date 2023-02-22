//!! first always get your data and show them up in console, and just after evyr function returns the correct data you can start styling it and hooking them up to DOM elements!!!

const endpoint = 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';
const searchInput = document.querySelector('.search');
const suggestions = document.querySelector('.suggestions');

function addCommasToThousands(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const cities = [];
fetch(endpoint)  //fetch returns a promise so we call a .then against a promise which will return a data from it
  .then(blob => blob.json())
        // .then returns a heap of raw data that we do not know the format of --> we can call it unProcessedData
        // JSON.parse does not work because the blob is in raw data and must be converted into JSON
        // we can call blob.json() which will return another promise so we chain another .then for this promise
  .then(data => cities.push(...data));
        // and only this second then will give us the data we want and we can work with - in this case array of city objects
        // .push() puts data from this fetched json into our cities array , ... means spread the data into the array rather than saving it as its own object in an array

function findMatches(wordToMatch, cities){
    return cities.filter(place => {
        //this logic figures out if any city from array matches what is tyoed in the search bar
        const regex = new RegExp(wordToMatch, 'gi')// regular expressions - g for global means it will look through the entire string for the typed in expression,
                                                   //                     - i for insensitive means it will match both lowercase and uppercase
        return place.city.match(regex)   //.city is one key form the cities object we want to match our city names to
          ||   place.state.match(regex)  //we also want to match the types in expression to state, and .state is another key from the cities object
    })
};
//findMatches('New', cities);  //try if findMatches function works

function displayMatches(){ 
    //console.log(this.value) // try if displayMatches works - this.value is the typed-in expression
    const matchesArray = findMatches(this.value, cities);
    // console.log(matchesArray); // check if matchesArray works and displays matches to the typed-in expression
    const matchesToListItems = matchesArray.map(place => {
        const regex = new RegExp(this.value, 'gi');
        const cityName = place.city.replace(regex, `<span class='highlight'>${this.value}</span>`); //it will find whatever regex matched and replace it with the same value but highlighted(we need to set this highlight in css)
        const stateName = place.state.replace(regex, `<span class='highlight'>${this.value}</span>`);
        return (`
        <li>
            <span class='name'>${cityName}, ${stateName}</span>
            <span class='population'>${addCommasToThousands(place.population)}</span>
        </li>
        `);
    }).join(''); // .join will combine the array of single list items into a long string of list items with cities
    suggestions.innerHTML = matchesToListItems; // we will pass in the long string of list items as inner html of suggestions list
}
searchInput.addEventListener('keyup', displayMatches); //everytime the search input changes we will run a function displayMatches, which will log the typed in value to the console 
        

      
