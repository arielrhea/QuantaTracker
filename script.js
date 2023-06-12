// Dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

darkModeToggle.addEventListener('change', () => {
  body.classList.toggle('dark-mode');
  body.style.transition = 'background-color 0.5s, color 0.5s'; // Add transition for background-color and color properties
});


const coinListContainer = document.getElementById('coin-list');
const paginationContainer = document.getElementById('pagination');
let currentPage = 1;

// Fetch the list of coins from the API
fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d&locale=en')
  .then(response => response.json())
  .then(data => {
    const coinList = data;
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
    rankElement.textContent = (currentPage - 1) * 100 + index + 1;
    row.appendChild(rankElement);

    // Coin name
    const nameElement = document.createElement('div');
    nameElement.classList.add('col');
    nameElement.innerHTML = `<strong>${coin.name}</strong>`;
    row.appendChild(nameElement);

    // Coin price
    const priceElement = document.createElement('div');
    priceElement.classList.add('col');
    priceElement.innerHTML = `$${coin.current_price.toFixed(2)}`;
    row.appendChild(priceElement);

    // Coin 1h %
    const percent1hElement = document.createElement('div');
    percent1hElement.classList.add('col');
    percent1hElement.textContent = `${coin.price_change_percentage_1h_in_currency.toFixed(2)}%`;
    percent1hElement.style.color = coin.price_change_percentage_1h_in_currency >= 0 ? 'green' : 'red';
    row.appendChild(percent1hElement);

    // Coin 24h %
    const percent24hElement = document.createElement('div');
    percent24hElement.classList.add('col');
    percent24hElement.textContent = `${coin.price_change_percentage_24h_in_currency.toFixed(2)}%`;
    percent24hElement.style.color = coin.price_change_percentage_24h_in_currency >= 0 ? 'green' : 'red';
    row.appendChild(percent24hElement);

    // Coin 7d %
    const percent7dElement = document.createElement('div');
    percent7dElement.classList.add('col');
    percent7dElement.textContent = `${coin.price_change_percentage_7d_in_currency.toFixed(2)}%`;
    percent7dElement.style.color = coin.price_change_percentage_7d_in_currency >= 0 ? 'green' : 'red';
    row.appendChild(percent7dElement);

    // Coin market cap
    const marketCapElement = document.createElement('div');
    marketCapElement.classList.add('col');
    marketCapElement.textContent = coin.market_cap.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    row.appendChild(marketCapElement);

    // Coin volume
    const volumeElement = document.createElement('div');
    volumeElement.classList.add('col');
    volumeElement.textContent = coin.total_volume.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    row.appendChild(volumeElement);

    coinListContainer.appendChild(row);
  });
}

// Create pagination buttons
function createPagination(totalPages) {
  paginationContainer.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.addEventListener('click', () => {
      currentPage = i;
      fetchCoins();
    });
    paginationContainer.appendChild(button);
  }
}

// Fetch coins based on the current page
function fetchCoins() {
  const start = (currentPage - 1) * 100 + 1;
  const end = currentPage * 100;

  fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=${currentPage}&sparkline=true&price_change_percentage=1h%2C24h%2C7d&locale=en`)
    .then(response => response.json())
    .then(data => {
      const coinList = data;

      displayCoins(coinList);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Coin List button event listener
const coinBtn = document.getElementById('coinBtn');
coinBtn.addEventListener('click', () => {
  coinListContainer.style.display = 'block';
  paginationContainer.style.display = 'block';
  coinBtn.classList.add('active');
  exchangeBtn.classList.remove('active');
  fetchCoins();
});

// Exchange button event listener
const exchangeBtn = document.getElementById('exchangeBtn');
exchangeBtn.addEventListener('click', () => {
  coinListContainer.style.display = 'none';
  paginationContainer.style.display = 'none';
  exchangeBtn.classList.add('active');
  coinBtn.classList.remove('active');
});
