import { fetchImages } from './js/fetch-images.js';
import { renderGallery } from './js/render-gallery.js';
import { onScroll, onToTopBtn } from './js/scroll.js';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.btn-load-more');
let query = '';
let page = 1;
let simpleLightBox;
const perPage = 40;

onScroll();
onToTopBtn();

const onSearchForm = async e => {
  e.preventDefault();
  window.scrollTo({ top: 0 });
  page = 1;
  query = e.currentTarget.searchQuery.value.trim();
  gallery.innerHTML = '';
  loadMoreBtn.classList.add('is-hidden');

  if (query === '') {
    alertNoEmptySearch();
    return;
  }

 try {
    const { data } = await fetchImages(query, page, perPage);
      if (data.totalHits === 0) {
        alertNoImagesFound();
      } else {
        renderGallery(data.hits);
        simpleLightBox = new SimpleLightbox('.gallery a').refresh();
        alertImagesFound(data);

        if (data.totalHits > perPage) {
          loadMoreBtn.classList.remove('is-hidden');
        }
      }
    } catch (error) {
        console.log(error);
      } finally {
        searchForm.reset();
      }
    };

const onLoadMoreBtn = async () => {
  page += 1;
  simpleLightBox.destroy();

  try {
    const { data } = await fetchImages(query, page, perPage);

      renderGallery(data.hits);
      simpleLightBox = new SimpleLightbox('.gallery a').refresh();

      const totalPages = Math.ceil(data.totalHits / perPage);

      if (page > totalPages) {
        loadMoreBtn.classList.add('is-hidden');
        alertEndOfSearch();
      }
    }catch (error) {
    console.log(error);
  }
};

const alertImagesFound = data => {
  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
};

const alertNoEmptySearch = () => {
  Notiflix.Notify.failure(
    'The search string cannot be empty. Please specify your search query.'
  );
};

const alertNoImagesFound = () => {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
};

const alertEndOfSearch = () => {
  Notiflix.Notify.failure(
    "We're sorry, but you've reached the end of search results."
  );
};
searchForm.addEventListener('submit', onSearchForm);
loadMoreBtn.addEventListener('click', onLoadMoreBtn);