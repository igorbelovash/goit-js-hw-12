import getImagesByQuery from './js/pixabay-api';
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { createGallery, clearGallery, showLoader, hideLoader, showLoadMoreButton, hideLoadMoreButton } from './js/render-functions';

const formEl = document.querySelector(".form");
const loadMoreBtn = document.querySelector(".load-more-btn")

formEl.addEventListener("submit", handleSubmit);
loadMoreBtn.addEventListener("click", handleLoadMore);


let page = 1;
let currentQuery = "";

async function handleSubmit(event) {
    event.preventDefault();

    const searchQuery = event.currentTarget.elements["search-text"].value.trim();
    if (!searchQuery) {
        return;
    }

    page = 1;
    currentQuery = searchQuery;
    clearGallery();
    hideLoadMoreButton();
    showLoader();

    try {
        const { hits, totalHits } = await getImagesByQuery(searchQuery, page);
        if (hits.length > 0) {
            createGallery(hits);
            checkEndOfCollection(page, totalHits);
        }
        else {
            hideLoadMoreButton();
            iziToast.show({
                color: '#EF4040',
                messageColor: '#FAFAFB',
                message: 'Sorry, there are no images matching your search query. Please try again!',
                maxWidth: '322px'
            });
        }
    } catch(error) {
        iziToast.show({
            color: '#EF4040',
            messageColor: '#FAFAFB',
            message: `${error.message}`,
            maxWidth: '322px'
        });
    } finally {
        event.target.reset();
        hideLoader();
    }
  
}

async function handleLoadMore() {
    page++;
    loadMoreBtn.disabled = true;
    hideLoadMoreButton();
    showLoader();

    try {
        const { hits, totalHits } = await getImagesByQuery(currentQuery, page);
        console.log({ hits, totalHits });
        createGallery(hits);

        const galleryItem = document.querySelector(".gallery-item");
        if (galleryItem) {
            const cardHeight = galleryItem.getBoundingClientRect().height;
            window.scrollBy({
                top: cardHeight * 2,
                behavior: "smooth",
            });
        }

        checkEndOfCollection(page, totalHits);
    } catch(error) {
        iziToast.show({
            color: '#EF4040',
            messageColor: '#FAFAFB',
            message: `${error.message}`,
            maxWidth: '322px'
        });
    } finally {
        hideLoader();
        loadMoreBtn.disabled = false;
    }
}

function checkEndOfCollection(page, totalHits) {
    if (page * 15 >= totalHits) {
        hideLoadMoreButton();
        iziToast.show({
            color: '#EF4040',
            messageColor: '#FAFAFB',
            message: "We're sorry, but you've reached the end of search results.",
            maxWidth: '322px'
        });
    }
    else {
        showLoadMoreButton();
    }
}