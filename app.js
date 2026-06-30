/**
 * Website Romantis untuk Dinah Dwi Chantika
 * Kumpulan Script Interaktif (Countdown, Envelope Open, Typing Effect, Love Quiz, Lightbox & Music)
 */

// ==========================================
// 1. CONFIGURATION & CONFIG DATA
// ==========================================

// PENTING: Ubah tanggal jadian kalian di bawah ini!
// Format: YYYY-MM-DD (Tahun-Bulan-Tanggal)
const CONFIG_TANGGAL_JADIAN = "2026-02-12"; 

// PENTING: Masukkan isi surat cinta Anda yang panjang di bawah ini!
// Gunakan tag <br> untuk baris baru agar tampilan surat tetap rapi.
const CONFIG_SURAT_CINTA = `
Dear Dinah Dwi Chantika... ❤️<br><br>

Di antara jutaan bintang yang bersinar di langit malam,<br>
kamu adalah cahaya yang paling tenang, paling indah,<br>
dan paling benderang menerangi setiap sudut jalanku.<br><br>

Menyayangimu adalah keputusan paling mudah yang pernah kubuat.<br>
Menatap senyummu adalah cara terbaikku untuk menenangkan dunia yang bising.<br>
Dan berada di sampingmu adalah tempat teraman yang selalu ingin kutuju.<br><br>

Terima kasih telah hadir dengan segala kebaikanmu,<br>
membawa warna-warni indah ke dalam lembar hidupku,<br>
dan mengajarkanku arti dari ketulusan yang sesungguhnya.<br><br>

Setiap detik bersamamu adalah puisi yang sedang ditulis oleh waktu.<br>
Aku mencintaimu bukan hanya untuk hari ini atau esok hari,<br>
tapi di setiap detak jantung, di setiap hembusan napas,<br>
dulu, sekarang, dan selamanya. ✨
`;


// ==========================================
// 2. RELATIONSHIP TRACKER (COUNTDOWN)
// ==========================================
function startRelationshipTracker() {
  const targetDate = new Date(CONFIG_TANGGAL_JADIAN + "T00:00:00");
  
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  function updateTracker() {
    const now = new Date();
    const difference = now.getTime() - targetDate.getTime();

    if (difference < 0) {
      // Jika tanggal jadian di masa depan (belum tercapai)
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      return;
    }

    const msecPerDay = 1000 * 60 * 60 * 24;
    const msecPerHour = 1000 * 60 * 60;
    const msecPerMin = 1000 * 60;

    let days = Math.floor(difference / msecPerDay);
    let hours = Math.floor((difference % msecPerDay) / msecPerHour);
    let minutes = Math.floor((difference % msecPerHour) / msecPerMin);
    let seconds = Math.floor((difference % msecPerMin) / 1000);

    // Format double digits (pad with leading zero)
    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateTracker();
  setInterval(updateTracker, 1000);
}


// ==========================================
// 3. BACKGROUND FALLING PETALS / HEARTS
// ==========================================
function initFallingElements() {
  const container = document.getElementById("bg-decorations");
  if (!container) return;

  const characters = ["🌸", "❤️", "💖", "✨", "💕"];
  const maxElements = 25; // Batasan agar tidak lag di perangkat lambat

  function createElement() {
    if (container.children.length >= maxElements) return;

    const el = document.createElement("div");
    el.className = "falling-element";
    
    // Pilih karakter secara acak
    el.textContent = characters[Math.floor(Math.random() * characters.length)];
    
    // Ukuran acak
    const size = Math.random() * 20 + 12; // 12px s.d 32px
    el.style.fontSize = `${size}px`;
    
    // Posisi X acak
    el.style.left = `${Math.random() * 100}vw`;
    
    // Kecepatan & delay acak
    const duration = Math.random() * 8 + 6; // 6s s.d 14s
    const delay = Math.random() * 5; // 0s s.d 5s
    el.style.animationDuration = `${duration}s`;
    el.style.animationDelay = `${delay}s`;
    
    // Efek filter blur kecil untuk kedalaman dimensi
    if (Math.random() > 0.6) {
      el.style.filter = "blur(1px)";
      el.style.opacity = "0.5";
    }

    container.appendChild(el);

    // Hapus elemen setelah animasi selesai agar memori bersih
    setTimeout(() => {
      if (el.parentNode === container) {
        container.removeChild(el);
      }
    }, (duration + delay) * 1000);
  }

  // Buat beberapa elemen langsung di awal secara acak di berbagai tinggi layar
  for (let i = 0; i < 15; i++) {
    createElement();
  }

  // Terus buat elemen baru secara berkala
  setInterval(createElement, 600);
}


// ==========================================
// 4. INTERACTIVE ENVELOPE & TYPING EFFECT
// ==========================================
let typingTimeoutId = null;

function initEnvelopeAndLetter() {
  const wrapper = document.getElementById("envelope-wrapper");
  const sealBtn = document.getElementById("seal-button");
  const closeBtn = document.getElementById("close-letter-btn");
  const typingTextEl = document.getElementById("typing-text");
  const signatureEl = document.getElementById("letter-signature");

  if (!wrapper || !sealBtn || !closeBtn) return;

  function openLetter() {
    wrapper.classList.add("open");
    closeBtn.classList.remove("hidden");
    
    // Mulai efek mengetik setelah amplop terbuka penuh (durasi transisi amplop)
    setTimeout(() => {
      startTypingEffect();
    }, 1200);
    
    // Coba putar musik otomatis jika belum diputar (kebijakan interaksi pengguna browser)
    tryAutoPlayMusic();
  }

  function closeLetter() {
    wrapper.classList.remove("open");
    closeBtn.classList.add("hidden");
    
    // Reset efek mengetik
    if (typingTimeoutId) {
      clearTimeout(typingTimeoutId);
    }
    typingTextEl.innerHTML = "";
    signatureEl.classList.add("opacity-0");
  }

  sealBtn.addEventListener("click", openLetter);
  wrapper.addEventListener("click", function(e) {
    // Hanya buka jika diklik di bagian amplop dan belum terbuka
    if (!wrapper.classList.contains("open") && !e.target.closest(".heart-seal")) {
      openLetter();
    }
  });
  
  closeBtn.addEventListener("click", function(e) {
    e.stopPropagation(); // Mencegah ter-trigger klik pembuka amplop kembali
    closeLetter();
  });

  // Logika efek mengetik otomatis
  function startTypingEffect() {
    typingTextEl.innerHTML = "";
    signatureEl.classList.add("opacity-0");
    
    const text = CONFIG_SURAT_CINTA;
    let i = 0;
    
    function type() {
      // Menangani tag HTML seperti <br> agar tidak diketik karakter demi karakter
      if (text.substr(i, 4) === "<br>") {
        typingTextEl.innerHTML += "<br>";
        i += 4;
      } else {
        typingTextEl.innerHTML += text.charAt(i);
        i++;
      }
      
      if (i < text.length) {
        // Tentukan kecepatan pengetikan (karakter biasa cepat, tanda baca memberi jeda sedikit)
        let delay = 35; // Kecepatan default dalam milidetik
        const lastChar = text.charAt(i - 1);
        if (lastChar === "." || lastChar === "!") {
          delay = 450; // Jeda lebih lama di akhir kalimat
        } else if (lastChar === ",") {
          delay = 200; // Jeda sedang di tanda koma
        }
        
        typingTimeoutId = setTimeout(type, delay);
      } else {
        // Efek mengetik selesai, munculkan tanda tangan secara halus
        signatureEl.classList.remove("opacity-0");
      }
    }
    
    type();
  }
}


// ==========================================
// 5. INTERACTIVE LOVE QUIZ (YES/NO RUNNER)
// ==========================================
function initLoveQuiz() {
  const yesBtn = document.getElementById("yes-btn");
  const noBtn = document.getElementById("no-btn");
  const container = document.getElementById("quiz-buttons-container");
  const popup = document.getElementById("quiz-popup");
  const closePopupBtn = document.getElementById("close-popup-btn");
  const popupContent = document.getElementById("quiz-popup-content");

  if (!yesBtn || !noBtn || !container) return;

  // Logika memindahkan tombol "Tidak" secara acak saat didekati
  function moveNoButton() {
    const containerRect = container.getBoundingClientRect();
    const noBtnRect = noBtn.getBoundingClientRect();

    // Hitung batas pergerakan agar tidak keluar dari area card kuis
    // dan memberikan jarak aman agar tombol tetap terlihat dan bisa disentuh ulang
    const maxX = containerRect.width - noBtnRect.width;
    const maxY = 250; // Izinkan bergerak ke atas/bawah area kuis

    // Hasilkan posisi koordinat X dan Y acak
    // Diatur relatif terhadap kontainer tombol
    let randomX = Math.random() * maxX;
    let randomY = (Math.random() - 0.5) * maxY; // Nilai positif atau negatif

    // Pastikan tidak bertumpuk di posisi default (tengah kanan) jika kursor dekat
    if (Math.abs(randomX - (containerRect.width/2)) < 50) {
      randomX = randomX > containerRect.width/2 ? randomX + 60 : randomX - 60;
    }

    noBtn.style.position = "absolute";
    noBtn.style.left = `${Math.max(0, Math.min(randomX, maxX))}px`;
    noBtn.style.top = `${randomY}px`;
  }

  // Pemicu tombol kabur (untuk desktop menggunakan mouseover, mobile menggunakan touchstart)
  noBtn.addEventListener("mouseover", moveNoButton);
  noBtn.addEventListener("touchstart", function(e) {
    e.preventDefault(); // Mencegah trigger klik di handphone
    moveNoButton();
  });

  // Pemicu saat tombol "Ya" diklik
  yesBtn.addEventListener("click", function(e) {
    // 1. Picu efek konfeti hati
    triggerConfetti(e.clientX, e.clientY);
    
    // 2. Tampilkan Popup Box
    popup.classList.remove("hidden");
    setTimeout(() => {
      popupContent.classList.remove("scale-95");
      popupContent.classList.add("scale-100");
    }, 10);
    
    // Coba putar musik jika belum
    tryAutoPlayMusic();
  });

  // Tutup popup kuis
  closePopupBtn.addEventListener("click", function() {
    popupContent.classList.remove("scale-100");
    popupContent.classList.add("scale-95");
    setTimeout(() => {
      popup.classList.add("hidden");
    }, 200);
  });
}

// Custom Confetti Ledakan Hati & Sparkles
function triggerConfetti(startX, startY) {
  const particleCount = 40;
  const colors = ["#E84D75", "#FF85A2", "#FFF0F5", "#FFDAB9", "#FFE4E1"];
  const shapes = ["❤️", "💖", "🌸", "✨", "💕"];

  for (let i = 0; i < particleCount; i++) {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle text-lg select-none";
    sparkle.textContent = shapes[Math.floor(Math.random() * shapes.length)];
    
    // Atur koordinat awal konfeti sesuai tombol jadian
    sparkle.style.left = `${startX || window.innerWidth / 2}px`;
    sparkle.style.top = `${startY || window.innerHeight / 2}px`;
    sparkle.style.position = "fixed";
    sparkle.style.zIndex = "99";

    // Hitung vektor arah ledakan acak
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 120 + 60; // Kecepatan rambat ledakan
    const dx = Math.cos(angle) * velocity;
    const dy = Math.sin(angle) * velocity - (Math.random() * 40); // Sedikit dorongan ke atas

    sparkle.style.setProperty("--dx", `${dx}px`);
    sparkle.style.setProperty("--dy", `${dy}px`);
    
    // Atur ukuran & durasi animasi acak
    const size = Math.random() * 14 + 10;
    sparkle.style.fontSize = `${size}px`;
    const animDuration = Math.random() * 0.4 + 0.6; // 0.6s s.d 1s
    sparkle.style.animation = `sparkle-anim ${animDuration}s ease-out forwards`;

    document.body.appendChild(sparkle);

    // Hapus elemen sparkle setelah animasi selesai
    setTimeout(() => {
      sparkle.remove();
    }, animDuration * 1000);
  }
}


// ==========================================
// 6. PHOTO GALLERY & LIGHTBOX MODAL
// ==========================================
function initPhotoGallery() {
  const cards = document.querySelectorAll(".polaroid-card");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxDate = document.getElementById("lightbox-date");
  const lightboxClose = document.getElementById("lightbox-close");

  if (!lightbox || !lightboxImg || cards.length === 0) return;

  // Buka lightbox saat foto polaroid diklik
  cards.forEach(card => {
    card.addEventListener("click", function() {
      const fullImgUrl = this.getAttribute("data-full");
      const captionText = this.querySelector(".polaroid-caption").textContent;
      const dateText = this.querySelector(".polaroid-date").textContent;

      lightboxImg.src = fullImgUrl;
      lightboxCaption.textContent = captionText;
      lightboxDate.textContent = dateText;

      lightbox.classList.add("active");
      document.body.style.overflow = "hidden"; // Kunci scroll halaman utama
      
      // Putar musik jika belum aktif
      tryAutoPlayMusic();
    });
  });

  // Fungsi tutup lightbox
  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = ""; // Lepas kunci scroll
    // Bersihkan src sesaat setelah animasi keluar selesai agar tidak kedip foto lama saat dibuka lagi
    setTimeout(() => {
      lightboxImg.src = "";
    }, 400);
  }

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function(e) {
    // Tutup jika diklik di luar gambar
    if (e.target === lightbox || e.target.id === "lightbox") {
      closeLightbox();
    }
  });

  // Mendukung penutupan dengan tombol Escape
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && lightbox.classList.contains("active")) {
      closeLightbox();
    }
  });
}


// ==========================================
// 7. FLOATING MUSIC PLAYER & AUTOPLAY LOGIC
// ==========================================
let isMusicInitialized = false;

function initMusicPlayer() {
  const musicBtn = document.getElementById("music-btn");
  const audio = document.getElementById("bg-music");
  const ring = document.getElementById("music-vinyl-ring");
  const icon = document.getElementById("music-icon");

  if (!musicBtn || !audio) return;

  // Volume default agak pelan agar manis dan tidak mengejutkan (30%)
  audio.volume = 0.3;

  function togglePlay() {
    if (audio.paused) {
      audio.play().then(() => {
        ring.classList.remove("music-paused");
        // Ganti icon ke pause
        icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>`;
      }).catch(err => {
        console.log("Pemutaran musik ditolak oleh browser. Menunggu klik halaman.");
      });
    } else {
      audio.pause();
      ring.classList.add("music-paused");
      // Ganti icon ke play
      icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>`;
    }
  }

  musicBtn.addEventListener("click", togglePlay);
  isMusicInitialized = true;
}

// Coba putar musik otomatis di sela-sela interaksi pertama user (klik tombol apapun)
function tryAutoPlayMusic() {
  const audio = document.getElementById("bg-music");
  const ring = document.getElementById("music-vinyl-ring");
  const icon = document.getElementById("music-icon");

  if (audio && audio.paused && isMusicInitialized) {
    audio.play().then(() => {
      ring.classList.remove("music-paused");
      icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>`;
    }).catch(err => {
      // Abaikan jika browser tetap menolak
      console.log("Autoplay ditolak, butuh klik manual pada pemutar musik.");
    });
  }
}

// Memicu musik saat interaksi pertama kali di layar
document.addEventListener("click", function firstClickTrigger() {
  tryAutoPlayMusic();
  // Hapus listener agar tidak berjalan berulang kali setiap klik
  document.removeEventListener("click", firstClickTrigger);
}, { once: true });


// ==========================================
// 8. GLOBAL INITIALIZER ON LOAD
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  // Inisialisasi semua fungsi utama
  startRelationshipTracker();
  initFallingElements();
  initEnvelopeAndLetter();
  initLoveQuiz();
  initPhotoGallery();
  initMusicPlayer();
  
  // Halus: Beri animasi fade-in lembut untuk seluruh halaman body
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 1s ease-in";
  requestAnimationFrame(() => {
    document.body.style.opacity = "1";
  });
});
