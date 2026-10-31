// 1. Data & Elemen
let jenisDiskon = "persen";

const btnPersen = document.getElementById("btn-persen");
const btnRupiah = document.getElementById("btn-rupiah");
const kolomDiskon = document.getElementById("diskon");
const tombolPintasan = document.querySelectorAll(".btn-pintasan");

// Toggle jenis diskon % / Rp
function setJenis(jenis) {
  jenisDiskon = jenis;
  btnPersen.classList.toggle("aktif", jenis === "persen");
  btnRupiah.classList.toggle("aktif", jenis === "rupiah");
}

btnPersen.addEventListener("click", function () {
  setJenis("persen");
});

btnRupiah.addEventListener("click", function () {
  setJenis("rupiah");
});

// Tombol pintasan
tombolPintasan.forEach(function (btn) {
  btn.addEventListener("click", function () {
    setJenis("persen");
    kolomDiskon.value = btn.dataset.nilai;
  });
});

// 2. Fungsi hitung & format rupiah
function hitungHarga(harga, jenis, diskon, voucher) {
  let potongan;

  if (jenis === "persen") {
    potongan = harga * diskon / 100;
  } else {
    potongan = diskon;
  }

  const hargaSetelahDiskon = harga - potongan;
  const hargaAkhir = Math.max(0, hargaSetelahDiskon - voucher);
  const totalHemat = harga - hargaAkhir;
  const persenHemat = harga > 0 ? (totalHemat / harga) * 100 : 0;

  return {
    potongan: potongan,
    hargaAkhir: hargaAkhir,
    totalHemat: totalHemat,
    persenHemat: persenHemat
  };
}

function formatRupiah(angka) {
  return "Rp" + Math.round(angka).toLocaleString("id-ID");
}

// 3. Komentar
function ambilKomentar(totalHemat) {
  if (totalHemat <= 0) return "Boorroos, skip 💪";
  if (totalHemat < 5000) return "Masih boros, cuma buat beli permen sih ini 🍬";
  if (totalHemat < 20000) return "Lumayan lah buat beli es teh 🧋";
  if (totalHemat < 50000) return "Nah lumayan banget sih, cukup buat jajan yang lainnya 🍢";
  if (totalHemat < 100000) return "Nicee! Dompet pun tersenyum";
  if (totalHemat < 300000) return "Serius? Hemat bangett ini!";
  return "WIIHH SULTAAN!";
}

const daftarMenu = [
  { nama: "permen", harga: 1000, emoji: "🍬" },
  { nama: "es teh", harga: 5000, emoji: "🧋" },
  { nama: "gorengan", harga: 2000, emoji: "🍢" },
  { nama: "nasi goreng", harga: 15000, emoji: "🍳" },
  { nama: "mie ayam", harga: 15000, emoji: "🍜" },
  { nama: "bakso", harga: 15000, emoji: "🥣" },
  { nama: "ayam geprek", harga: 18000, emoji: "🍗" },
  { nama: "nasi padang", harga: 25000, emoji: "🍛" },
  { nama: "kopi susu", harga: 20000, emoji: "☕" }
];

function setaraMakanan(totalHemat) {
  const bisaDibeli = daftarMenu.filter(function (menu) {
    return menu.harga <= totalHemat;
  });

  if (bisaDibeli.length === 0) return "";

  const menu = bisaDibeli[Math.floor(Math.random() * bisaDibeli.length)];
  const jumlah = Math.floor(totalHemat / menu.harga);

  return "Hemat setara " + jumlah + " porsi " + menu.nama + " " + menu.emoji;
}

function countUp(elemen, target, durasi) {
  const mulai = performance.now();

  function langkah(sekarang) {
    const progres = Math.min((sekarang - mulai) / durasi, 1);
    elemen.textContent = formatRupiah(target * progres);

    if (progres < 1) {
      requestAnimationFrame(langkah);
    }
  }

  requestAnimationFrame(langkah);
}

// Maskot besar hemat
function ambilMaskot(totalHemat) {
  if (totalHemat <= 0) return "😐";
  if (totalHemat < 20000) return "🙂";
  if (totalHemat < 100000) return "😄";
  return "💰";
}
// Setara makanan emoji
function setaraMakananVisual(totalHemat) {
  const bisaDibeli = daftarMenu.filter(function (menu) {
    return menu.harga <= totalHemat;
  });

  if (bisaDibeli.length === 0) return "";

  const menu = bisaDibeli[Math.floor(Math.random() * bisaDibeli.length)];
  const jumlah = Math.floor(totalHemat / menu.harga);
  const tampil = Math.min(jumlah, 4);

  let html =
    "<p class='komentar'>Hematmu setara " + jumlah + " porsi " + menu.nama + "</p>" +
    "<div class='deret-makanan'>";

  for (let i = 0; i < tampil; i++) {
    html += "<span style='animation-delay:" + (1 + i * 0.12) + "s'>" + menu.emoji + "</span>";
  }

  if (jumlah > tampil) {
    html += "<span class='lebih' style='animation-delay:" + (1 + tampil * 0.12) + "s'>+" + (jumlah - tampil) + "</span>";
  }

  html += "</div>";
  return html;
}

// 4. Tombol hitung
const kolomHarga = document.getElementById("harga");
const kolomVoucher = document.getElementById("voucher");
const pesanError = document.getElementById("pesan-error");
const btnHitung = document.getElementById("btn-hitung");
const struk = document.getElementById("struk");

let hitungTerakhir = null;

btnHitung.addEventListener("click", function () {
  const harga = Number(kolomHarga.value) || 0;
  const diskon = Number(kolomDiskon.value) || 0;
  const voucher = Number(kolomVoucher.value) || 0;

  pesanError.textContent = "";
  struk.innerHTML = "";
  if (harga <= 0) {
    pesanError.textContent = "Isi harga barangnya yang bener dong";
    return;
  }
  if (diskon < 0 || voucher < 0) {
    pesanError.textContent = "Angkanya ngga boleh negatif yaa, kalau ngga ada kosongin ajaa";
    return;
  }
  if (jenisDiskon === "persen" && diskon > 100) {
    pesanError.textContent = "Diskon persen maksimal 100. Mau pakai Rp ajaa?";
    return;
  }
  if (jenisDiskon === "rupiah" && diskon > harga) {
    pesanError.textContent = "Diskon Rp ngga boleh lebih besar dari harga yaa";
    return;
  }

  const hasil = hitungHarga(harga, jenisDiskon, diskon, voucher);

  hitungTerakhir = { harga: harga, jenis: jenisDiskon, diskon: diskon, voucher: voucher };

  const maskot = ambilMaskot(hasil.totalHemat);
  const kelasMaskot = hasil.totalHemat >= 100000 ? "maskot besar" : "maskot";

  struk.innerHTML =
    "<div class='" + kelasMaskot + "'>" + maskot + "</div>" +
    "<h3>STRUK HEMAT</h3>" +
    "<div class='baris'><span>Harga awal</span><span>" + formatRupiah(harga) + "</span></div>" +
    "<div class='baris'><span>Bayar</span><strong>" + formatRupiah(hasil.hargaAkhir) + "</strong></div>" +
    "<div class='garis-putus'></div>" +
    "<div class='baris hemat'><span>Hemat</span><strong id='angka-hemat'>Rp0</strong></div>" +
    "<div class='baris'><span>Persen hemat</span><span>" + hasil.persenHemat.toFixed(1) + "%</span></div>" +
    "<div class='garis-putus'></div>" +
    "<p class='komentar'>" + ambilKomentar(hasil.totalHemat) + "</p>" +
    setaraMakananVisual(hasil.totalHemat) +
    "<button type='button' id='btn-ke-adu'>⚖️ Bandingkan dengan penawaran lain</button>";

  countUp(document.getElementById("angka-hemat"), hasil.totalHemat, 1000);
  setTimeout(function () {
    struk.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 100);
  setTimeout(function () {
    countUp(document.getElementById("angka-hemat"), hasil.totalHemat, 1000);
  }, 500);
});

// Enter untuk hitung
[kolomHarga, kolomDiskon, kolomVoucher].forEach(function (kolom) {
  kolom.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      btnHitung.click();
    }
  });
});

// 5. Tombol reset
const btnReset = document.getElementById("btn-reset");

btnReset.addEventListener("click", function () {
  kolomHarga.value = "";
  kolomDiskon.value = "";
  kolomVoucher.value = "";
  setJenis("persen");
  pesanError.textContent = "";
  struk.innerHTML = "";
  kolomHarga.focus();
});

// Menu mobile
const btnMenu = document.getElementById("btn-menu");
const menuMobile = document.getElementById("menu");

btnMenu.addEventListener("click", function () {
  menuMobile.classList.toggle("aktif");
  btnMenu.classList.toggle("aktif");
});

// Tutup menu setelah link diklik
menuMobile.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () {
    menuMobile.classList.remove("aktif");
    btnMenu.classList.remove("aktif");
  });
});

// Adu penawaran
const jenisAdu = { a: "persen", b: "rupiah" };

// Toggle % / Rp per kartu
document.querySelectorAll(".kartu-adu .toggle").forEach(function (btn) {
  btn.addEventListener("click", function () {
    const kartu = btn.dataset.kartu;
    jenisAdu[kartu] = btn.dataset.jenis;

    document
      .querySelectorAll('.toggle[data-kartu="' + kartu + '"]')
      .forEach(function (t) {
        t.classList.toggle("aktif", t === btn);
      });
  });
});

// Baca dan validasi satu kartu. Mengembalikan objek hasil, atau null jika tidak valid.
function bacaKartu(kode) {
  const harga = Number(document.getElementById(kode + "-harga").value) || 0;
  const diskon = Number(document.getElementById(kode + "-diskon").value) || 0;
  const voucher = Number(document.getElementById(kode + "-voucher").value) || 0;
  const jenis = jenisAdu[kode];
  const nama = "Penawaran " + kode.toUpperCase();

  if (harga <= 0) return { error: nama + ": isi harga dulu ya." };
  if (diskon < 0 || voucher < 0) return { error: nama + ": angka tidak boleh negatif." };
  if (jenis === "persen" && diskon > 100) return { error: nama + ": diskon persen maksimal 100." };
  if (jenis === "rupiah" && diskon > harga) return { error: nama + ": diskon Rp tidak boleh lebih besar dari harga." };

  return { hasil: hitungHarga(harga, jenis, diskon, voucher) };
}

const btnAdu = document.getElementById("btn-adu");
const pesanAdu = document.getElementById("pesan-adu");
const pemenang = document.getElementById("pemenang");
const kartuA = document.getElementById("kartu-a");
const kartuB = document.getElementById("kartu-b");
const hasilA = document.getElementById("hasil-a");
const hasilB = document.getElementById("hasil-b");

btnAdu.addEventListener("click", function () {
  // bersihkan hasil lama
  pesanAdu.textContent = "";
  pemenang.textContent = "";
  hasilA.textContent = "";
  hasilB.textContent = "";
  kartuA.classList.remove("menang");
  kartuB.classList.remove("menang");

  const a = bacaKartu("a");
  const b = bacaKartu("b");

  if (a.error) {
    pesanAdu.textContent = a.error;
    return;
  }
  if (b.error) {
    pesanAdu.textContent = b.error;
    return;
  }

  hasilA.innerHTML =
    "Bayar: <strong>" + formatRupiah(a.hasil.hargaAkhir) + "</strong><br>" +
    "Hemat: " + formatRupiah(a.hasil.totalHemat) +
    " (" + a.hasil.persenHemat.toFixed(1) + "%)";

  hasilB.innerHTML =
    "Bayar: <strong>" + formatRupiah(b.hasil.hargaAkhir) + "</strong><br>" +
    "Hemat: " + formatRupiah(b.hasil.totalHemat) +
    " (" + b.hasil.persenHemat.toFixed(1) + "%)";

  const selisih = Math.abs(a.hasil.hargaAkhir - b.hasil.hargaAkhir);
  let kartuMenang = null;

  if (selisih === 0) {
    pemenang.textContent = "Seri! Keduanya samaa aja";
  } else if (a.hasil.hargaAkhir < b.hasil.hargaAkhir) {
    kartuMenang = kartuA;
    pemenang.textContent = "🏆 Penawaran A lebih untung, lebih murah " + formatRupiah(selisih);
  } else {
    kartuMenang = kartuB;
    pemenang.textContent = "🏆 Penawaran B lebih untung, lebih murah " + formatRupiah(selisih);
  }

  if (kartuMenang) {
    kartuMenang.classList.add("menang");
  }

  // HP (kartu bertumpuk)
  // Laptop (kartu berdampingan)
  const layarHP = window.matchMedia("(max-width: 599px)").matches;

  if (layarHP && kartuMenang) {
    kartuMenang.scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    pemenang.scrollIntoView({ behavior: "smooth", block: "end" });
  }
});

// Salin kalkulator ke kartu A
struk.addEventListener("click", function (e) {
  if (e.target.id !== "btn-ke-adu" || !hitungTerakhir) return;

  // Isi kartu A
  document.getElementById("a-harga").value = hitungTerakhir.harga;
  document.getElementById("a-diskon").value = hitungTerakhir.diskon;
  document.getElementById("a-voucher").value = hitungTerakhir.voucher || "";

  // Samakan mode % / Rp kartu A
  jenisAdu.a = hitungTerakhir.jenis;
  document.querySelectorAll('.toggle[data-kartu="a"]').forEach(function (t) {
    t.classList.toggle("aktif", t.dataset.jenis === hitungTerakhir.jenis);
  });

  // Bersihkan
  pesanAdu.textContent = "";
  pemenang.textContent = "";
  hasilA.textContent = "";
  hasilB.textContent = "";
  kartuA.classList.remove("menang");
  kartuB.classList.remove("menang");

  // Ubah halaman ke adu
  location.hash = "#adu";
});

// Reset adu
document.getElementById("btn-reset-adu").addEventListener("click", function () {
  ["a", "b"].forEach(function (kode) {
    document.getElementById(kode + "-harga").value = "";
    document.getElementById(kode + "-diskon").value = "";
    document.getElementById(kode + "-voucher").value = "";
  });

  // kembali ke mode default
  jenisAdu.a = "persen";
  jenisAdu.b = "rupiah";
  document.querySelectorAll('.toggle[data-kartu="a"]').forEach(function (t) {
    t.classList.toggle("aktif", t.dataset.jenis === "persen");
  });
  document.querySelectorAll('.toggle[data-kartu="b"]').forEach(function (t) {
    t.classList.toggle("aktif", t.dataset.jenis === "rupiah");
  });

  pesanAdu.textContent = "";
  pemenang.textContent = "";
  hasilA.textContent = "";
  hasilB.textContent = "";
  kartuA.classList.remove("menang");
  kartuB.classList.remove("menang");
});

/* Pindah halaman */
const halaman = document.querySelectorAll("main > section");
const linkMenu = document.querySelectorAll("#menu a");

function tampilkanHalaman() {
  let id = location.hash.replace("#", "");
  const target = document.getElementById(id);

  // Kalau hash kosong/tidak dikenal, buka kalkulator
  if (!target || !target.matches("main > section")) {
    id = "kalkulator";
  }

  halaman.forEach(function (s) {
    s.classList.toggle("aktif", s.id === id);
  });

  linkMenu.forEach(function (a) {
    a.classList.toggle("aktif", a.getAttribute("href") === "#" + id);
  });

  window.scrollTo({ top: 0, behavior: "instant" });
}
window.addEventListener("hashchange", tampilkanHalaman);
tampilkanHalaman();
