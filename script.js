
document.addEventListener("DOMContentLoaded", () => {

  // ==================================================
  // ELEMEN HTML
  // ==================================================

  const screens = {
    envelope: document.getElementById("screen-envelope"),
    menu: document.getElementById("screen-menu"),
    choices: document.getElementById("screen-choices"),
    photos: document.getElementById("screen-photos"),
    wishes: document.getElementById("screen-wishes"),
    playlist: document.getElementById("screen-playlist")
  };

  const openEnvelope = document.getElementById("openEnvelope");
  const showMenu = document.getElementById("showMenu");
  const homeLink = document.getElementById("homeLink");
  const backToChoices = document.getElementById("backToChoices");

  // Tombol musik atas bersifat opsional.
  const musicToggle = document.getElementById("musicToggle");
  const musicStatus = document.getElementById("musicStatus");

  const birthdayAudio = document.getElementById("birthdayAudio");
  const playButton = document.getElementById("playButton");
  const playText = document.getElementById("playText");
  const playIcon = document.getElementById("playIcon");
  const record = document.getElementById("record");
  const audioNote = document.getElementById("audioNote");

  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const closeLightbox = document.getElementById("closeLightbox");
  const confettiLayer = document.getElementById("confettiLayer");


  // ==================================================
  // NAVIGASI ANTARHALAMAN
  // ==================================================

  function showScreen(name) {
    if (!screens[name]) return;

    Object.entries(screens).forEach(([key, screen]) => {
      if (!screen) return;

      const active = key === name;

      screen.hidden = !active;
      screen.classList.toggle("active", active);
    });

    // Musik tidak dihentikan saat berpindah halaman.
    // Posisi lagu juga tidak diatur ulang.

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }


  // Membuka amplop menuju menu utama.
  if (openEnvelope) {
    openEnvelope.addEventListener("click", () => {
      openEnvelope.classList.add("opened");
      openEnvelope.setAttribute("aria-label", "Amplop terbuka");

      setTimeout(() => {
        showScreen("menu");
        sprinkleConfetti(35);
      }, 500);
    });
  }


  // Menu utama menuju halaman pilihan.
  if (showMenu) {
    showMenu.addEventListener("click", () => {
      showScreen("choices");
    });
  }


  // Tombol Photos, Wishes, dan Playlist.
  document.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => {
      showScreen(button.dataset.go);
    });
  });


  // Tombol Back pada halaman foto, ucapan, dan playlist.
  document.querySelectorAll("[data-back]").forEach(button => {
    button.addEventListener("click", () => {
      showScreen(button.dataset.back);

      // Jangan menghentikan musik di sini.
    });
  });


  // Tombol kembali ke halaman pilihan.
  if (backToChoices) {
    backToChoices.addEventListener("click", () => {
      showScreen("choices");
    });
  }


  // Logo atas kembali ke halaman amplop.
  if (homeLink) {
    homeLink.addEventListener("click", event => {
      event.preventDefault();
      showScreen("envelope");
    });
  }


  // ==================================================
  // MUSIK
  // Musik tetap menyala ketika halaman berganti.
  // ==================================================

  function updateMusicUI(isPlaying) {
    if (musicToggle) {
      musicToggle.setAttribute(
        "aria-pressed",
        String(isPlaying)
      );
    }

    if (musicStatus) {
      musicStatus.textContent = isPlaying
        ? "Pause music"
        : "Play music";
    }

    if (playButton) {
      playButton.setAttribute(
        "aria-pressed",
        String(isPlaying)
      );
    }

    if (playIcon) {
      playIcon.textContent = isPlaying ? "Ⅱ" : "▶";
    }

    if (playText) {
      playText.textContent = isPlaying
        ? "Pause music"
        : "Play music";
    }

    if (record) {
      // Menyesuaikan dengan class spinning milik CSS lama.
      record.classList.toggle("spinning", isPlaying);

      // Mendukung CSS yang memakai class playing.
      record.classList.toggle("playing", isPlaying);
    }
  }


  async function toggleMusic() {
    if (!birthdayAudio) return;

    if (birthdayAudio.paused) {
      try {
        await birthdayAudio.play();

        updateMusicUI(true);

        if (audioNote) {
          audioNote.textContent = "Now playing ♡";
        }

      } catch (error) {
        updateMusicUI(false);

        if (audioNote) {
          audioNote.textContent =
            "Musik gagal diputar. Periksa file audio di folder assets.";
        }

        console.error("Gagal memutar musik:", error);
      }

    } else {
      birthdayAudio.pause();
      updateMusicUI(false);

      if (audioNote) {
        audioNote.textContent = "Music paused";
      }
    }
  }


  // Tombol musik di bagian atas, jika masih digunakan.
  if (musicToggle) {
    musicToggle.addEventListener("click", toggleMusic);
  }


  // Tombol Play Music pada halaman Playlist.
  if (playButton) {
    playButton.addEventListener("click", toggleMusic);
  }


  // Perbarui tampilan mengikuti keadaan audio sebenarnya.
  if (birthdayAudio) {
    birthdayAudio.addEventListener("play", () => {
      updateMusicUI(true);
    });

    birthdayAudio.addEventListener("pause", () => {
      updateMusicUI(false);
    });

    birthdayAudio.addEventListener("ended", () => {
      updateMusicUI(false);
    });

    birthdayAudio.addEventListener("error", () => {
      updateMusicUI(false);

      if (audioNote) {
        audioNote.textContent =
          "Musik tidak dapat dimuat. Periksa nama dan lokasi file MP3.";
      }
    });
  }


  // ==================================================
  // GALERI FOTO
  // ==================================================

  document.querySelectorAll(".gallery-image img").forEach(img => {
    const wrapper = img.closest(".gallery-image");

    function updatePhotoState() {
      if (img.naturalWidth > 0) {
        if (wrapper) {
          wrapper.classList.add("has-photo");
        }

        img.style.display = "";
      } else {
        img.style.display = "none";
      }
    }

    img.addEventListener("load", updatePhotoState);
    img.addEventListener("error", updatePhotoState);

    // Menangani foto yang sudah selesai dimuat.
    if (img.complete) {
      updatePhotoState();
    }
  });


  // Membuka foto dalam lightbox.
  document.querySelectorAll(".polaroid[data-photo]").forEach(button => {
    button.addEventListener("click", () => {
      const img = button.querySelector("img");

      if (
        !img ||
        !img.complete ||
        img.naturalWidth === 0 ||
        img.style.display === "none" ||
        !lightbox ||
        !lightboxImage
      ) {
        return;
      }

      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt;

      if (lightboxCaption) {
        lightboxCaption.textContent =
          button.dataset.caption || "";
      }

      if (typeof lightbox.showModal === "function") {
        lightbox.showModal();
      } else {
        lightbox.setAttribute("open", "");
      }
    });
  });


  // Menutup lightbox.
  if (closeLightbox && lightbox) {
    closeLightbox.addEventListener("click", () => {
      if (typeof lightbox.close === "function") {
        lightbox.close();
      } else {
        lightbox.removeAttribute("open");
      }
    });

    lightbox.addEventListener("click", event => {
      if (event.target === lightbox) {
        if (typeof lightbox.close === "function") {
          lightbox.close();
        } else {
          lightbox.removeAttribute("open");
        }
      }
    });
  }


  // ==================================================
  // KONFETI
  // ==================================================

  function sprinkleConfetti(count) {
    if (!confettiLayer) return;

    const symbols = ["♡", "✦", "✿", "♥", "✧", "✨"];

    const colors = [
      "#ffd9f1",
      "#f2b9e1",
      "#ffe9bb",
      "#d9c7ff",
      "#fff8ed"
    ];

    for (let i = 0; i < count; i++) {
      const piece = document.createElement("span");

      piece.className = "confetti-piece";

      piece.textContent =
        symbols[Math.floor(Math.random() * symbols.length)];

      piece.style.left = `${Math.random() * 100}%`;
      piece.style.animationDelay = `${Math.random() * 1.2}s`;
      piece.style.fontSize = `${12 + Math.random() * 18}px`;

      piece.style.color =
        colors[Math.floor(Math.random() * colors.length)];

      confettiLayer.appendChild(piece);

      piece.addEventListener("animationend", () => {
        piece.remove();
      });
    }
  }


  // ==================================================
  // DEKORASI KECIL YANG BERULANG
  // ==================================================

  function addFloatingDecorations() {
    // Hindari membuat dekorasi ganda.
    if (document.querySelector(".ambient-float")) return;

    const symbols = ["♡", "✦", "✿", "♥"];

    for (let i = 0; i < 16; i++) {
      const item = document.createElement("span");

      item.className = "ambient-float";
      item.textContent = symbols[i % symbols.length];

      item.style.left = `${(i * 37 + 8) % 100}%`;
      item.style.animationDelay = `${(i % 8) * -1.4}s`;
      item.style.animationDuration = `${10 + (i % 5) * 2}s`;
      item.style.fontSize = `${12 + (i % 4) * 5}px`;

      document.body.appendChild(item);
    }
  }


  // ==================================================
  // KUPU-KUPU, HATI, DAN BINTANG
  // ==================================================

  function addContinuousDecorations() {
    const layer = document.getElementById("flightDecorations");

    // Pastikan elemen tersedia dan dekorasi tidak digandakan.
    if (!layer || layer.dataset.ready === "true") return;

    layer.dataset.ready = "true";


    // Kupu-kupu terbang.
    for (let i = 0; i < 6; i++) {
      const butterfly = document.createElement("div");
      const wings = document.createElement("span");

      butterfly.className = "flying-butterfly";
      wings.textContent = "🦋";

      butterfly.style.setProperty(
        "--start-y",
        `${8 + i * 16}%`
      );

      butterfly.style.setProperty(
        "--duration",
        `${16 + i * 3}s`
      );

      butterfly.style.setProperty(
        "--delay",
        `${-i * 3.7}s`
      );

      butterfly.style.setProperty(
        "--size",
        `${25 + (i % 3) * 7}px`
      );

      butterfly.appendChild(wings);
      layer.appendChild(butterfly);
    }


    // Hati melayang.
    const heartSymbols = ["♡", "♥", "ღ"];

    const heartColors = [
      "#ffd4ef",
      "#ffc2e8",
      "#e9d5ff",
      "#fff0c9"
    ];

    for (let i = 0; i < 14; i++) {
      const heart = document.createElement("span");

      heart.className = "floating-heart";
      heart.textContent = heartSymbols[i % heartSymbols.length];

      heart.style.setProperty(
        "--left",
        `${(i * 17 + 7) % 100}%`
      );

      heart.style.setProperty(
        "--size",
        `${14 + (i % 4) * 5}px`
      );

      heart.style.setProperty(
        "--duration",
        `${10 + (i % 5) * 2}s`
      );

      heart.style.setProperty(
        "--delay",
        `${-i * 1.4}s`
      );

      heart.style.setProperty(
        "--heart-color",
        heartColors[i % heartColors.length]
      );

      layer.appendChild(heart);
    }


    // Bintang berkilau.
    for (let i = 0; i < 20; i++) {
      const twinkle = document.createElement("span");

      twinkle.className = "twinkle";
      twinkle.textContent = i % 3 === 0 ? "✦" : "✧";

      twinkle.style.left = `${(i * 29 + 11) % 98}%`;
      twinkle.style.top = `${(i * 23 + 8) % 92}%`;

      twinkle.style.setProperty(
        "--size",
        `${10 + (i % 3) * 5}px`
      );

      twinkle.style.setProperty(
        "--duration",
        `${1.8 + (i % 4) * 0.6}s`
      );

      twinkle.style.setProperty(
        "--delay",
        `${-(i % 7) * 0.55}s`
      );

      layer.appendChild(twinkle);
    }
  }


  // ==================================================
  // JALANKAN DEKORASI DAN TAMPILAN AWAL
  // ==================================================

  addFloatingDecorations();
  addContinuousDecorations();

  // Sinkronkan tombol dengan keadaan musik saat halaman dibuka.
  if (birthdayAudio) {
    updateMusicUI(!birthdayAudio.paused);
  }

});
