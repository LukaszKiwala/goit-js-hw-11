export { onScroll, onToTopBtn };

const toTopBtn = document.querySelector('.btn-to-top');

const onScroll = () => {
  const scrolled = window.pageYOffset;
  const coords = document.documentElement.clientHeight;

  if (scrolled > coords) {
    toTopBtn.classList.add('btn-to-top--visible');
  }
  if (scrolled < coords) {
    toTopBtn.classList.remove('btn-to-top--visible');
  }
};

const onToTopBtn = () => {
  if (window.pageYOffset > 0) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

window.addEventListener('scroll', onScroll);
toTopBtn.addEventListener('click', onToTopBtn);