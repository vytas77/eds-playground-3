export default function decorate(block) {
  const section = block.closest('.section');
  if (!section) return;
  const rows = [...block.children];
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      const key = cells[0].textContent.trim().toLowerCase();
      const value = cells[1].textContent.trim();
      if (key === 'style') {
        value.split(',').forEach((style) => {
          section.classList.add(style.trim());
        });
      }
    }
  });
  block.remove();
}
