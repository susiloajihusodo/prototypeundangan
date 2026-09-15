const cover = document.getElementById('cover');
const invitation = document.getElementById('invitation');
const openButton = document.getElementById('open-invitation');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let opened = false;
const music = document.getElementById('background-music');
music.volume = 0.4;

async function playMusic() {
  try {
    if (music.error) music.load();
    await music.play();
  } catch {
    // Audio availability must never prevent the invitation from opening.
  }
}

// Stagger section content so each entrance is visible while scrolling.
document.querySelectorAll('.section-heading, .couple-layout, .message-section > .reveal, .location-copy').forEach((group) => {
  group.classList.add('reveal-sequence');
  Array.from(group.children).forEach((child, index) => {
    child.style.setProperty('--enter-delay', `${Math.min(index * 180, 720)}ms`);
  });
});

const revealObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          entry.target.classList.remove('is-visible');
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -12% 0px' })
  : null;

openButton.addEventListener('click', () => {
  if (opened) return;
  opened = true;
  void playMusic();
  openButton.disabled = true;
  openButton.classList.add('is-opening');
  openButton.querySelector('span').textContent = 'Membuka undangan…';
  invitation.hidden = false;
  window.setTimeout(() => {
    cover.classList.add('is-leaving');
    window.setTimeout(() => {
      cover.hidden = true;
      invitation.inert = false;
      invitation.classList.add('is-open');
      document.body.classList.remove('is-covered');
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.getElementById('invitation-title').focus({ preventScroll: true });
      document.querySelectorAll('.reveal').forEach((element) => {
        if (revealObserver) revealObserver.observe(element);
        else element.classList.add('is-visible');
      });
    }, reducedMotion.matches ? 0 : 1100);
  }, reducedMotion.matches ? 0 : 280);
});

// The invitation remains usable offline with a neutral photo placeholder.
document.querySelectorAll('img').forEach((img) => {
  const showPlaceholder = () => {
    img.style.visibility = 'hidden';
    img.parentElement.classList.add('photo-unavailable');
    img.parentElement.style.background = '#a5ac94';
  };
  img.addEventListener('error', showPlaceholder);
  if (img.complete && img.naturalWidth === 0) showPlaceholder();
});
