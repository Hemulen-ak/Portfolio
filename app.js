// Theme toggle logic
const themeToggle = document.getElementById('themeToggle');
const root = document.body;
let darkMode = true;
if (localStorage.getItem('hemulen_theme') === 'light') {
  root.classList.add('light-mode');
  themeToggle.textContent = '☀️';
  darkMode = false;
}
themeToggle.onclick = () => {
  darkMode = !darkMode;
  if (darkMode) {
    root.classList.remove('light-mode');
    themeToggle.textContent = '🌙';
    localStorage.setItem('hemulen_theme', 'dark');
  } else {
    root.classList.add('light-mode');
    themeToggle.textContent = '☀️';
    localStorage.setItem('hemulen_theme', 'light');
  }
};
// Funky background animation is handled by CSS

// PDF resources by class (replace links with your actual Google Drive links)
const pdfResources = {
  class9: [
    { title: 'Science Notes', url: 'https://drive.google.com/file/d/EXAMPLE1/view?usp=sharing' },
    { title: 'Maths Guide', url: 'https://drive.google.com/file/d/EXAMPLE2/view?usp=sharing' }
  ],
  class10: [
    { title: 'English Literature', url: 'https://drive.google.com/file/d/EXAMPLE3/view?usp=sharing' },
    { title: 'Social Studies', url: 'https://drive.google.com/file/d/EXAMPLE4/view?usp=sharing' }
  ],
  class11: [
    { title: 'Physics Handout', url: 'https://drive.google.com/file/d/EXAMPLE5/view?usp=sharing' }
  ],
  class12: [
    { title: 'Biology Revision', url: 'https://drive.google.com/file/d/EXAMPLE6/view?usp=sharing' }
  ]
};

const pdfList = document.getElementById('pdfList');
const classSelect = document.getElementById('classSelect');

function renderPDFsForClass(classKey) {
  pdfList.innerHTML = '';
  if (!classKey || !pdfResources[classKey] || pdfResources[classKey].length === 0) {
    pdfList.innerHTML = '<div style="color:#aaa;">No resources available for this class yet.</div>';
    return;
  }
  pdfResources[classKey].forEach(pdf => {
    const card = document.createElement('div');
    card.className = 'pdf-card';
    card.innerHTML = `
      <div class="pdf-title">${pdf.title}</div>
      <a href="${pdf.url}" class="pdf-download" target="_blank">View/Download</a>
    `;
    pdfList.appendChild(card);
  });
}

classSelect.onchange = e => {
  renderPDFsForClass(e.target.value);
};

// Contact form (demo only)
document.getElementById('contactForm').onsubmit = e => {
  e.preventDefault();
  alert('Thank you for reaching out! (Demo only)');
  e.target.reset();
};
