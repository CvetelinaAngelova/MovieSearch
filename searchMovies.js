document.addEventListener('DOMContentLoaded', function () {
 
	/* ============== GLOBALS ============== */
	const Url = 'https://api.tvmaze.com/search/shows?q=$NAME';
    const searchInput = document.getElementById('searchInput');
    const movieList = document.getElementById('movieList');
    const noR = document.querySelector('.no-results').classList;

fetch(Url).then( async function (response) {
	// successful API call
	if (response.ok) {
		return await response.json();
	} else {
		return Promise.reject(response);
	}
}).then(function (data) {
    searchEngine(data);
}).catch(function (err) {
	// There was an error
	console.warn('Something went wrong.', err);
});

function searchEngine(data) {
        var elArray =[];
        var searchL;
        var filtered = [];
        data.map((item)=>{
          if (!item.show.type.toLowerCase().includes("show")){
            elArray.push(item.show);
          }
       
        })

    searchInput.addEventListener("keyup", (event) => {
            if (event.isComposing ) {
              return;
            }

      const searchString = event.target.value.toLowerCase();
      if (searchL == "undefined"){
       
             searchL = searchString.length;
        }

		if (elArray && searchString) {

                /* Search Optimization to handle big amount of data by countinue to search in already filterd options
                    On backspace start to search in all objects again
                */

            if (filtered.length > 0 && searchL < searchString.length){
            filtered = filtered.filter(function (el)
            {
                if (el.name.toLowerCase().includes(searchString)){
                return el
            }});
            searchL++;
        }else{
            filtered = elArray.filter(function (el)
            {
                if (el.name.toLowerCase().includes(searchString)){
                return el
            }});
            searchL = searchString.length;
        }

            if (!filtered.length){
                noResults();
            }else{
            displayMovies(filtered);
            }
		} else {
            noResults();
		}
		
    });

}

const noResults = () => {
   noR.remove('hidden');
   movieList.classList.add('hidden');
}

const displayMovies = (movies) => {
    noR.add('hidden');
    movieList.classList.remove('hidden');
    const htmlString = movies
        .map((movie) => {
            movie.name.replace("robot","robot".toUpperCase());
            movie.summary.replace("robot","robot".toUpperCase());
            return `
            <li class="movie">
                <img src="${movie.image.original}"></img>
                <span class="text-wrapper"> 
                <h2>${movie.name}</h2>
                ${movie.rating.average ? "<p><b>Rating:</b>" + movie.rating.average + "</p>" : "<p>Unrated:</p>"}
                <p>${movie.genres.map((val) => { return val;})} </p>
                ${movie.summary}</span>
            </li>
        `;
        })
        .join('');
        movieList.innerHTML = htmlString;
};
	
}, false);
