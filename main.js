// Let's use some bad practices
let global = {};

const getRandomIntValueBetween = (min, max) => Math.floor(Math.random() * max) + min;
const getRandomFloatValueBetween = (min, max) => (Math.random() * (max - min) + min).toFixed(2);

const xBrowserScale = innerWidth / 360;
const yBrowserScale = innerHeight / 30;

let idCounter = 0;

const generateNewBoard = () => {
  let bubbles = Array(10).fill({});
  bubbles = bubbles.map(() => ({
    yearlyValue: getRandomIntValueBetween(5000, 10000),
    health: getRandomIntValueBetween(0, 10),
    daysToRenewal: getRandomIntValueBetween(0, 360),
    daysSinceLastContacted: getRandomIntValueBetween(0, 30),
    id: idCounter++,
  }));

  return bubbles;
};

const chooseColor = (healthValue) => {
  if (healthValue > 7.5) return 'rgba(46,204,113 ,1)';
  else if (healthValue < 3.5) return 'rgba(231,76,60 ,1)';
  else return 'rgba(241,196,15 ,1)';
};

const insertIntoBoard = (bubbles) => {
  let html = '';
  bubbles.forEach(item => {
    html += (`
      <div class="bubble"
      style="
      top: ${item.daysSinceLastContacted * yBrowserScale}px;
      right: ${item.daysToRenewal * xBrowserScale}px;
      height: ${item.yearlyValue * 0.002}px;
      width: ${item.yearlyValue * 0.002}px;
      background: ${chooseColor(item.health)};
      "
      data-id=${item.id}
      ></div>
    `);
  });

  document.querySelector('.gameboard').innerHTML = html;
};

const tick = () => {
  // Throw away all contains which were contacted 30 or more days ago
  global.bubbles = global.bubbles.filter(item => item.daysSinceLastContacted < 30);
  // Throw away all clients on subscription day with health < 3.5
  global.bubbles = global.bubbles.filter(item => (item.daysToRenewal || (!item.daysToRenewal && item.health >= 3.5)));

  global.bubbles.forEach(item => {
    // Zero
    if (!item.daysToRenewal) item.daysToRenewal = 360;
    else item.daysToRenewal -= 1;

    item.daysSinceLastContacted += 1;

    const healthDelta = getRandomFloatValueBetween(-0.05, 0.01);
    if (item.health + healthDelta > 10) item.health = 10;
    else if (item.health + healthDelta < 3.5) item.health = 3.49;
    else item.health += healthDelta;
  });

  insertIntoBoard(global.bubbles);
};

const main = () => {
  global.bubbles = generateNewBoard();
  insertIntoBoard(global.bubbles);

  // Everyone knows it's not precice :)
  const interval = setInterval(tick, 166);
  setTimeout(() => {
    clearInterval(interval);
  }, 2 * 60 * 1000)
};

document.querySelector('.gameboard').addEventListener('click', (event) => {
  if (event.target.classList.contains('bubble')) {
    global.bubbles = global.bubbles.map(item => {
      if (item.id === +event.target.dataset.id) {
        return {
          ...item,
          daysSinceLastContacted: 0,
        }
      }
      return item;
    })
  }
});

main();
