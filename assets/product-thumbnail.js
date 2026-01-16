function initializeProductThumbnailSlider() {
  const sliderElement = document.querySelector(".product-thumbnail-slider");

  // Only initialize if slider exists and has more than 4 items
  if (!sliderElement) return;

  const productThumbnailSlider = new Glide(".product-thumbnail-slider", {
    type: "slider",
    perView: 4,
  });

  // Mount the slider to enable button navigation
  productThumbnailSlider.mount();
}

// I want to have active selected thumbnail in the slider
function activateSelectedThumbnail() {
  const thumbnails = document.querySelectorAll(".product-single__thumbnail");
  if (!thumbnails.length) return;

  // By default, activate the first thumbnail
  thumbnails.forEach((thumb, idx) => {
    if (idx === 0) {
      thumb.parentNode.classList.add("active");
    } else {
      thumb.parentNode.classList.remove("active");
    }

    // Add click event to allow activation on click
    thumb.addEventListener("click", function () {
      thumbnails.forEach((t) => {
        t.parentNode.classList.remove("active");
      });
      this.parentNode.classList.add("active");
    });
  });
}
document.addEventListener("DOMContentLoaded", function () {
  initializeProductThumbnailSlider();
  activateSelectedThumbnail();
});
