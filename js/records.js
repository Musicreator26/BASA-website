/* Records page — loads JSON, filters, renders tables */
(async function () {
  const tabsEl = document.getElementById('records-tabs');
  const tableBody = document.querySelector('#records-table tbody');
  const search = document.getElementById('records-search');
  const genderSel = document.getElementById('records-gender');
  const courseSel = document.getElementById('records-course');
  const ageSel = document.getElementById('records-age');
  const ageWrap = document.getElementById('age-wrap');
  const updatedEl = document.getElementById('records-updated');

  if (!tableBody) return;

  let activeSet = 'open'; // 'open' | 'age'
  let dataOpen = [];
  let dataAge = [];
  let updated = '';

  async function loadJSON(path) {
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error('Not found');
      return await res.json();
    } catch (e) {
      console.warn('Could not load', path, e);
      return null;
    }
  }

  const [openJson, ageJson] = await Promise.all([
    loadJSON('data/records-open.json'),
    loadJSON('data/records-age-group.json')
  ]);

  if (openJson) { dataOpen = openJson.records || []; updated = openJson.updated || updated; }
  if (ageJson) { dataAge = ageJson.records || []; updated = ageJson.updated || updated; }
  if (updatedEl) updatedEl.textContent = updated || 'TBC';

  function ageOptions() {
    const groups = [...new Set(dataAge.map(r => r.age_group).filter(Boolean))];
    // Sort numerically by the first number in the label so "7 years" precedes "10 years"
    groups.sort((a, b) => {
      const na = parseInt((a.match(/\d+/) || [0])[0], 10);
      const nb = parseInt((b.match(/\d+/) || [0])[0], 10);
      return na - nb;
    });
    ageSel.innerHTML = '<option value="">All age groups</option>' +
      groups.map(g => `<option value="${g}">${g}</option>`).join('');
  }

  function render() {
    const dataset = activeSet === 'open' ? dataOpen : dataAge;
    const q = (search.value || '').toLowerCase().trim();
    const g = genderSel.value;
    const c = courseSel.value;
    const a = ageSel.value;

    const rows = dataset.filter(r => {
      if (g && r.gender !== g) return false;
      if (c && r.course !== c) return false;
      if (activeSet === 'age' && a && r.age_group !== a) return false;
      if (q) {
        const hay = `${r.event} ${r.holder} ${r.location || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (!rows.length) {
      const colspan = activeSet === 'age' ? 8 : 7;
      tableBody.innerHTML = `<tr><td colspan="${colspan}" style="text-align:center; padding:40px; color:#6b7280;">
        No records match the current filters. Try adjusting the search or filters.
      </td></tr>`;
      return;
    }

    tableBody.innerHTML = rows.map(r => `
      <tr>
        <td class="event">${escape(r.event)}</td>
        ${activeSet === 'age' ? `<td>${escape(r.age_group || '-')}</td>` : ''}
        <td><span class="gender-tag ${r.gender === 'M' ? 'male' : 'female'}">${r.gender === 'M' ? 'Men' : 'Women'}</span></td>
        <td>${escape(r.course || '-')}</td>
        <td><span class="time">${escape(r.time)}</span></td>
        <td>${escape(r.holder)}</td>
        <td>${escape(r.location || '-')}</td>
        <td>${escape(r.date || '-')}</td>
      </tr>
    `).join('');
  }

  function escape(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function updateHeader() {
    const head = document.querySelector('#records-table thead tr');
    if (!head) return;
    const ageCol = activeSet === 'age' ? '<th>Age Group</th>' : '';
    head.innerHTML = `
      <th>Event</th>
      ${ageCol}
      <th>Category</th>
      <th>Course</th>
      <th>Time</th>
      <th>Record Holder</th>
      <th>Location</th>
      <th>Date</th>
    `;
  }

  /* Tabs */
  tabsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    tabsEl.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeSet = btn.dataset.set;
    ageWrap.style.display = activeSet === 'age' ? '' : 'none';
    updateHeader();
    render();
  });

  [search, genderSel, courseSel, ageSel].forEach(el => {
    el && el.addEventListener('input', render);
    el && el.addEventListener('change', render);
  });

  ageOptions();
  updateHeader();
  render();
})();
