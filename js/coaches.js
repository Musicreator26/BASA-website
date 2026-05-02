/* Coaches page — loads JSON, filters, renders cards */
(async function () {
  const grid = document.getElementById('coaches-grid');
  const search = document.getElementById('coaches-search');
  const typeFilter = document.getElementById('coaches-type');
  const clubFilter = document.getElementById('coaches-club');
  const updatedEl = document.getElementById('coaches-updated');
  const countEl = document.getElementById('coaches-count');
  if (!grid) return;

  let coaches = [];

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

  const json = await loadJSON('data/coaches.json');
  if (json) {
    coaches = json.coaches || [];
    if (updatedEl) updatedEl.textContent = json.updated || 'TBC';
  }

  /* Build club filter dropdown */
  function buildClubOptions() {
    const clubs = [...new Set(coaches.filter(c => c.type === 'club' && c.affiliation).map(c => c.affiliation))];
    clubFilter.innerHTML = '<option value="">All clubs</option>'
      + clubs.sort().map(c => `<option value="${escape(c)}">${escape(c)}</option>`).join('')
      + '<option value="__freelance__">— Freelance —</option>';
  }

  function render() {
    const q = (search.value || '').toLowerCase().trim();
    const t = typeFilter.value;
    const cl = clubFilter.value;

    const filtered = coaches.filter(c => {
      if (t && c.type !== t) return false;
      if (cl) {
        if (cl === '__freelance__') {
          if (c.type !== 'freelance') return false;
        } else if (c.affiliation !== cl) return false;
      }
      if (q) {
        const hay = `${c.name} ${c.title} ${c.affiliation || ''} ${(c.disciplines || []).join(' ')} ${c.qualifications || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    countEl.textContent = filtered.length;

    if (!filtered.length) {
      grid.innerHTML = `<div class="no-results">
        No coaches match the current filters. Try adjusting the search or filters.
      </div>`;
      return;
    }

    grid.innerHTML = filtered.sort((a, b) => a.name.localeCompare(b.name)).map(c => {
      const isFreelance = c.type === 'freelance';
      const tagClass = isFreelance ? 'tag-freelance' : 'tag-club';
      const tagText = isFreelance ? 'Freelance' : (c.affiliation || 'Club');
      const initials = c.name.split(/\s+/).filter(Boolean).slice(0, 2).map(s => s[0]).join('').toUpperCase() || '?';
      const photoHtml = c.photo
        ? `<img src="${escape(c.photo)}" alt="${escape(c.name)}">`
        : `<span class="initials">${escape(initials)}</span>`;
      const disciplinesHtml = (c.disciplines || []).map(d =>
        `<span class="discipline-pill">${escape(d)}</span>`).join('');
      const qualHtml = c.qualifications && c.qualifications !== 'Pending update'
        ? `<div class="qual">🎓 ${escape(c.qualifications)}</div>` : '';
      const emailHtml = c.email ? `<a href="mailto:${escape(c.email)}">📧 ${escape(c.email)}</a>` : '';
      const phoneHtml = c.phone ? `<span>📞 ${escape(c.phone)}</span>` : '';
      const contactBlock = (emailHtml || phoneHtml) ? `<div class="contact">${emailHtml}${phoneHtml}</div>` : '';

      return `
        <article class="coach-card">
          <div class="coach-avatar">${photoHtml}</div>
          <div class="coach-body">
            <span class="coach-tag ${tagClass}">${escape(tagText)}</span>
            <h3>${escape(c.name)}</h3>
            <div class="coach-title">${escape(c.title || '')}</div>
            <div class="disciplines">${disciplinesHtml}</div>
            ${qualHtml}
            ${contactBlock}
          </div>
        </article>
      `;
    }).join('');
  }

  function escape(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  [search, typeFilter, clubFilter].forEach(el => {
    el && el.addEventListener('input', render);
    el && el.addEventListener('change', render);
  });

  buildClubOptions();
  render();
})();
