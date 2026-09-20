async function buildInteractiveMap() {
  const mapBox = document.getElementById('india-map');
  const info = document.getElementById('map-info');
  if (!mapBox || !info) return;

  try {
    const response = await fetch('indiastates.svg');
    if (!response.ok) throw new Error('indiastates.svg could not be loaded');
    mapBox.innerHTML = await response.text();

    const svg = mapBox.querySelector('svg');
    const states = [...svg.querySelectorAll('.map-region')];
    if (!states.length) throw new Error('No .map-region elements found');

    const values = states.map(s => destinationData2025[s.dataset.state]?.transactions || 0);
    const max = Math.max(...values);

    states.forEach(state => {
      const name = state.dataset.state;
      const data = destinationData2025[name];
      state.setAttribute('tabindex', '0');
      state.setAttribute('role', 'button');
      state.setAttribute('aria-label', name + (data ? `: ${data.transactions.toLocaleString('en-IN')} transactions` : ''));

      if (data) {
        state.classList.add('has-data');
        const t = Math.sqrt(data.transactions / max);
        const light = 92 - Math.round(t * 45);
        state.style.fill = `hsl(15 55% ${light}%)`;
      }

      const activate = () => {
        states.forEach(s => s.classList.remove('selected'));
        state.classList.add('selected');
        showState(name, data);
      };
      state.addEventListener('mouseenter', () => showState(name, data));
      state.addEventListener('focus', () => showState(name, data));
      state.addEventListener('click', activate);
      state.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
      });
    });

    const legend = document.createElement('div');
    legend.className = 'map-legend';
    legend.innerHTML = `<div>2025 destination transactions</div><div class="legend-bar"></div><div class="legend-labels"><span>Lower</span><span>Higher</span></div>`;
    mapBox.parentElement.appendChild(legend);

    function showState(name, data) {
      if (!data) {
        info.innerHTML = `<strong>${name}</strong><span>No 2025 interstate transaction data in this dataset.</span>`;
        return;
      }
      info.innerHTML = `<strong>${name}</strong><span>${data.transactions.toLocaleString('en-IN')} interstate transactions</span><small>${data.share.toFixed(2)}% of India's 2025 interstate transactions</small>`;
    }
  } catch (error) {
    console.error(error);
    info.innerHTML = `<strong>Map couldn't load.</strong><span>Make sure this folder is opened with VS Code Live Server and that <b>indiastates.svg</b>, <b>destination-data.js</b> and <b>map.js</b> are beside index.html.</span>`;
  }
}

document.addEventListener('DOMContentLoaded', buildInteractiveMap);
