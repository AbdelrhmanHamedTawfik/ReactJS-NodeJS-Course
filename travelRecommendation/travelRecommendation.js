document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('travelSearch');
  const input = document.getElementById('travelSearchInput');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    fetch('travel_recommendation_api.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const country_keys = ["country", "countries"]
        let form_input = input.value.trim().toLowerCase()
        let result = []

        if (event.submitter.id == "clear-button") {
          displayRecommendations([]);
        } else {
          if (country_keys.includes(form_input)) {
            let filteredKey = "countries"
            data[filteredKey].forEach(country => {
              country["cities"].forEach(city => {
                result.push(city);
              });
            });
          } else {
            let filteredKey = Object.keys(data).find(key => key.includes(input.value.trim().toLowerCase()));
            result = data[filteredKey]
          }

          displayRecommendations(result);
        }
      })
      .catch(error => {
        console.error('Error fetching the JSON file:', error);
      });
  });
});

function displayRecommendations(places) {
  const container = document.querySelector('.recommendations');
  container.innerHTML = ''; // Clear previous results

  places.forEach(place => {
    console.log(place)
    const card = document.createElement('div');
    card.className = 'col';

    card.innerHTML = `
      <div class="card h-100">
        <img src="${place.imageUrl}" class="card-img-top" alt="${place.name}">
        <div class="card-body">
          <h5 class="card-title">${place.name}</h5>
          <p class="card-text">${place.description}</p>
          <a href="${place.link}" target="_blank" class="btn btn-success">Visit</a>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}
