export const initSoundEffects = () => {
  // A subtle, pleasant click sound
  const clickSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
  clickSound.volume = 0.2;

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    // Play sound if a button, link, or an element with role="button" is clicked
    if (target.closest('button') || target.closest('a') || target.closest('[role="button"]')) {
      const soundClone = clickSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.2;
      soundClone.play().catch(() => {
        // Ignore autoplay errors (e.g., if user hasn't interacted with the document yet)
      });
    }
  });
};
