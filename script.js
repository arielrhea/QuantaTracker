// Dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

darkModeToggle.addEventListener('change', () => {
  body.classList.toggle('dark-mode');
});

const coinListContainer = document.getElementById('coin-list');
const paginationContainer = document.getElementById('pagination');
let currentPage = 1;

// Fetch the list of coins from the API
fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d&locale=en')
  .then(response => response.json())
  .then(data => {
    const coinList = data.slice(0, 100);
    const totalPages = Math.ceil(data.length / 100);

    displayCoins(coinList);
    createPagination(totalPages);
  })
  .catch(error => {
    console.error('Error:', error);
  });

  // Display coins in the list
  function displayCoins(coinList) {
    coinListContainer.innerHTML = '';

    coinList.forEach((coin, index) => {
      const row = document.createElement('div');
      row.classList.add('row');

      // Coin ranking
      const rankElement = document.createElement('div');
      rankElement.classList.add('col');
      rankElement.textContent = index + 1;
      row.appendChild(rankElement);

      // Coin name
      const nameElement = document.createElement('div');
      nameElement.classList.add('col');
      nameElement.innerHTML = `<strong>${coin.name}</strong>`;
      row.appendChild(nameElement);

      // Coin 1h %
      const percent1hElement = document.createElement('div');
      percent1hElement.classList.add('col');
      percent1hElement.textContent = `${coin.price_change_percentage_1h_in_currency.toFixed(2)}%`;
      setPercentageColor(percent1hElement, coin.price_change_percentage_1h_in_currency);
      row.appendChild(percent1hElement);

      // Coin 24h %
      const percent24hElement = document.createElement('div');
      percent24hElement.classList.add('col');
      percent24hElement.textContent = `${coin.price_change_percentage_24h_in_currency.toFixed(2)}%`;
      setPercentageColor(percent24hElement, coin.price_change_percentage_24h_in_currency);
      row.appendChild(percent24hElement);

      // Coin 7d %
      const percent7dElement = document.createElement('div');
      percent7dElement.classList.add('col');
      percent7dElement.textContent = `${coin.price_change_percentage_7d_in_currency.toFixed(2)}%`;
      setPercentageColor(percent7dElement, coin.price_change_percentage_7d_in_currency);
      row.appendChild(percent7dElement);

      // Coin market cap
      const marketCapElement = document.createElement('div');
      marketCapElement.classList.add('col');
      marketCapElement.textContent = `$${coin.market_cap.toLocaleString()}`;
      row.appendChild(marketCapElement);

      // Coin volume
      const volumeElement = document.createElement('div');
      volumeElement.classList.add('col');
      volumeElement.textContent = `$${coin.total_volume.toLocaleString()}`;
      row.appendChild(volumeElement);

      // Append the row to the list container
      coinListContainer.appendChild(row);
    });
  }

  // Set color of percentage based on value
  function setPercentageColor(element, percentage) {
    if (percentage < 0) {
      element.style.color = 'red';
    } else {
      element.style.color = 'green';
    }
  }

// Create pagination buttons
function createPagination(totalPages) {
  paginationContainer.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.classList.add('page-link');
    button.textContent = i;
    button.addEventListener('click', () => {
      currentPage = i;
      fetchCoinsByPage(i);
    });

    const listItem = document.createElement('li');
    listItem.classList.add('page-item');
    listItem.appendChild(button);

    paginationContainer.appendChild(listItem);
  }
}

// Fetch coins based on page number
function fetchCoinsByPage(page) {
  const startIndex = (page - 1) * 100;

  fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=${page}&sparkline=true&price_change_percentage=1h%2C24h%2C7d&locale=en`)
    .then(response => response.json())
    .then(data => {
      const coinList = data.slice(startIndex, startIndex + 100);

      displayCoins(coinList);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
