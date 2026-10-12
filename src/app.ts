import './styles.css';

const intro = document.querySelector<HTMLParagraphElement>('#intro');
if (!intro) throw new Error('The Rollmino entry paragraph is missing.');

intro.textContent = 'A timed solo puzzle. Game controls are coming next.';
