document.addEventListener("DOMContentLoaded", event => {
  const textarea = document.getElementsByTagName("textarea")[0];

  document
    .getElementsByTagName("button")[0]
    .addEventListener("click", () => {
      location.href = `/result?text=${encodeURIComponent(textarea.value)}`;
    });
});
