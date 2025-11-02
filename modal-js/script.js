const dialog = document.querySelector("dialog");
const openButton = document.querySelector("#open-button");
const closeButton = document.querySelector("#close-button");

openButton.addEventListener("click", () => {
  dialog.showModal();
});

closeButton.addEventListener("click", () => {
  dialog.close();
});

// Closing the modal when press "Esc" is default.

dialog.addEventListener("click", e => {
  
  const dialogRect = dialog.getBoundingClientRect();
  const isInContent =
    e.clientX >= dialogRect.left &&
    e.clientX <= dialogRect.right &&
    e.clientY >= dialogRect.top &&
    e.clientY <= dialogRect.bottom;

  if (!isInContent) dialog.close();

});