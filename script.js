const yearNode = document.getElementById("year");
const profileImage = document.getElementById("profile-image");
const photoInput = document.getElementById("photo-input");
const photoReset = document.getElementById("photo-reset");
const profilePhotoStorageKey = "portfolio.profilePhoto";

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (profileImage) {
  const savedPhoto = window.localStorage.getItem(profilePhotoStorageKey);

  if (savedPhoto) {
    profileImage.src = savedPhoto;
  }
}

if (profileImage && photoInput) {
  photoInput.addEventListener("change", (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const nextSrc = typeof reader.result === "string" ? reader.result : "";
      if (!nextSrc) {
        return;
      }

      profileImage.src = nextSrc;
      window.localStorage.setItem(profilePhotoStorageKey, nextSrc);
    };
    reader.readAsDataURL(file);
  });
}

if (profileImage && photoReset) {
  photoReset.addEventListener("click", () => {
    profileImage.src = profileImage.dataset.defaultSrc || profileImage.src;
    window.localStorage.removeItem(profilePhotoStorageKey);

    if (photoInput) {
      photoInput.value = "";
    }
  });
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
