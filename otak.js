/* =====================================================================
   1) PENGATURAN TOKO – ganti sesuai data Anda
   ===================================================================== */
const CONFIG = {
  nama:   "Motor Jerman",
  wa:     "62995960759",              // format internasional tanpa + / 0 di depan
  email:  "@ultraggmail.com",
  alamat: "Bengkulu, Bengkulu",
  tentang:"Kami menjual dan membeli motor militer klasik Jerman era Perang Dunia II. Setiap unit difoto apa adanya, lengkap dengan kondisi mesin dan kelengkapannya, agar Anda bisa menilai sebelum datang."
};

/* =====================================================================
   2) DAFTAR MOTOR – tambah / hapus blok sesuai kebutuhan.
   Gambar: taruh file di folder  img/  lalu tulis nama filenya di "gambar".
   Boleh lebih dari satu foto per motor (jadi slideshow di halaman detail).
   Spesifikasi di bawah hanya CONTOH, mohon cek ulang sesuai unit Anda.
   status: "Tersedia" atau "Terjual"
   harga : angka (mis. 450000000) atau teks. Kosongkan "" untuk "Hubungi kami".
   ===================================================================== */
const MOTORS = [
  {
    nama:"BMW R75", kategori:"Sespan", pabrikan:"BMW", tahun:"1941–1944",
    mesin:"745 cc, boxer 2-silinder OHV", tenaga:"± 26 PS", transmisi:"4 maju + 1 mundur, roda sespan ikut penggerak",
    kondisi:"Restorasi", status:"Tersedia", harga:"",
    deskripsi:"Motor sespan militer berpenggerak dua roda, dirancang untuk medan berat. Isi deskripsi unit Anda di sini: nomor rangka, kelengkapan, riwayat restorasi.",
    gambar:["bmw-r75-1.jpg","bmw-r75-2.jpg","bmw-r75-3.jpg"]
  },
  {
    nama:"Zündapp KS 750", kategori:"Sespan", pabrikan:"Zündapp", tahun:"1941–1944",
    mesin:"751 cc, boxer 2-silinder OHV", tenaga:"± 26 PS", transmisi:"4 maju + 1 mundur, roda sespan ikut penggerak",
    kondisi:"Orisinal", status:"Tersedia", harga:"",
    deskripsi:"Pesaing langsung BMW R75 dengan rangka pres. Isi deskripsi unit Anda di sini.",
    gambar:["zundapp-ks750-1.jpg","zundapp-ks750-2.jpg"]
  },
  {
    nama:"NSU HK 101 Kettenkrad", kategori:"Kettenkrad", pabrikan:"NSU", tahun:"1940–1945",
    mesin:"1.488 cc, 4-silinder (Opel Olympia)", tenaga:"± 36 PS", transmisi:"Setir motor dengan roda rantai (half-track)",
    kondisi:"Proyek", status:"Tersedia", harga:"",
    deskripsi:"Kendaraan half-track kecil yang unik, setengah motor setengah tank. Isi deskripsi unit Anda di sini.",
    gambar:["kettenkrad-1.jpg"]
  },
  {
    nama:"BMW R12", kategori:"Solo", pabrikan:"BMW", tahun:"1935–1942",
    mesin:"745 cc, boxer 2-silinder side-valve", tenaga:"± 18 PS", transmisi:"4 maju",
    kondisi:"Orisinal", status:"Terjual", harga:"",
    deskripsi:"Motor tugas umum Wehrmacht awal perang. Isi deskripsi unit Anda di sini.",
    gambar:["bmw-r12-1.jpg"]
  }
];

/* =====================================================================
   3) KODE HALAMAN – biasanya tidak perlu diubah
   ===================================================================== */
const IMG_DIR = "img/";
const $ = id => document.getElementById(id);

// Placeholder otomatis (menampilkan nama file yang harus Anda taruh di folder img/)
function ph(path){
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <rect width="800" height="600" fill="#e9eef5"/>
    <g fill="none" stroke="#9aa7bd" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="270" cy="320" r="58"/><circle cx="530" cy="320" r="58"/>
      <path d="M270 320 L340 230 H440 L530 320 M340 230 L380 320 H450"/>
    </g>
    <text x="400" y="460" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" fill="#5b6882">Tambahkan gambar:</text>
    <text x="400" y="505" text-anchor="middle" font-family="Arial,sans-serif" font-size="30" font-weight="bold" fill="#0F172B">${path}</text>
  </svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}
const imgTag = (file, cls, alt, extra="") =>
  `<img src="${IMG_DIR+file}" class="${cls}" alt="${alt}" loading="lazy" ${extra} onerror="this.onerror=null;this.src=ph('${IMG_DIR+file}')">`;

const rupiah = h => (typeof h === "number") ? "Rp " + h.toLocaleString("id-ID") : (h || "Hubungi kami");
const waLink = text => `https://wa.me/${CONFIG.wa}?text=${encodeURIComponent(text)}`;

// Info toko
document.title = `${CONFIG.nama} – Motor Perang Jerman PD II`;
$("brandName").textContent = CONFIG.nama;
$("footName").textContent = CONFIG.nama;
$("year").textContent = new Date().getFullYear();
$("aboutText").textContent = CONFIG.tentang;
$("cAlamat").textContent = CONFIG.alamat;
$("cWa").textContent = "+" + CONFIG.wa; $("cWa").href = waLink("Halo, saya ingin bertanya tentang motor di katalog.");
$("cEmail").textContent = CONFIG.email; $("cEmail").href = "mailto:" + CONFIG.email;
$("navWa").href = $("heroWa").href = waLink("Halo, saya ingin bertanya tentang motor di katalog.");

// Statistik
$("statTotal").textContent = MOTORS.length;
$("statAvail").textContent = MOTORS.filter(m => m.status === "Tersedia").length;
$("statBrand").textContent = new Set(MOTORS.map(m => m.pabrikan)).size;

// Filter
let activeCat = "Semua";
const cats = ["Semua", ...new Set(MOTORS.map(m => m.kategori))];
function renderFilters(){
  $("filterBar").innerHTML = cats.map(c =>
    `<button class="filter-btn ${c===activeCat?'active':''}" data-cat="${c}">${c}</button>`).join("");
  $("filterBar").querySelectorAll("button").forEach(b => b.onclick = () => { activeCat = b.dataset.cat; renderFilters(); renderGrid(); });
}

// Grid
function renderGrid(){
  const q = $("searchInput").value.trim().toLowerCase();
  const list = MOTORS.map((m,i)=>({...m,i})).filter(m =>
    (activeCat==="Semua" || m.kategori===activeCat) &&
    (!q || [m.nama,m.pabrikan,m.mesin,m.tahun,m.kategori].join(" ").toLowerCase().includes(q)));
  $("emptyMsg").classList.toggle("d-none", list.length>0);
  $("motorGrid").innerHTML = list.map(m => {
    const sold = m.status==="Terjual";
    return `<div class="col-md-6 col-lg-4">
      <div class="card motor-card ${sold?'sold':''}">
        <div class="position-relative">
          ${imgTag(m.gambar[0],"motor-img",m.nama,`data-open="${m.i}"`)}
          <span class="badge badge-status ${sold?'bg-secondary':'bg-success'}">${m.status}</span>
        </div>
        <div class="card-body p-4">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h5 class="mb-0" style="color:var(--dark)">${m.nama}</h5>
            <span class="badge bg-dark">${m.kategori}</span>
          </div>
          <div class="spec mb-1"><i class="fa fa-calendar"></i>${m.tahun}</div>
          <div class="spec mb-1"><i class="fa fa-gears"></i>${m.mesin}</div>
          <div class="spec mb-3"><i class="fa fa-screwdriver-wrench"></i>${m.kondisi}</div>
          <div class="d-flex justify-content-between align-items-center">
            <span class="price">${sold?'Terjual':rupiah(m.harga)}</span>
            <button class="btn btn-primary btn-sm px-3" data-open="${m.i}">Detail</button>
          </div>
        </div>
      </div>
    </div>`;
  }).join("");
  $("motorGrid").querySelectorAll("[data-open]").forEach(el => el.onclick = () => openDetail(+el.dataset.open));
}

// Detail
const modal = new bootstrap.Modal($("detailModal"));
function openDetail(i){
  const m = MOTORS[i], sold = m.status==="Terjual", cid = "car"+i;
  const multi = m.gambar.length>1;
  $("mCarousel").innerHTML = `<div id="${cid}" class="carousel slide" data-bs-ride="false">
    <div class="carousel-inner">${m.gambar.map((g,k)=>`<div class="carousel-item ${k===0?'active':''}">${imgTag(g,"d-block w-100",m.nama+" foto "+(k+1))}</div>`).join("")}</div>
    ${multi?`<button class="carousel-control-prev" type="button" data-bs-target="#${cid}" data-bs-slide="prev" aria-label="Sebelumnya"><span class="carousel-control-prev-icon"></span></button>
    <button class="carousel-control-next" type="button" data-bs-target="#${cid}" data-bs-slide="next" aria-label="Berikutnya"><span class="carousel-control-next-icon"></span></button>`:""}
  </div>`;
  $("mTitle").textContent = m.nama;
  $("mSub").textContent = `${m.pabrikan} · ${m.kategori} · ${m.tahun}`;
  $("mPrice").textContent = sold ? "Terjual" : rupiah(m.harga);
  const st = $("mStatus"); st.textContent = m.status; st.className = "badge mb-2 " + (sold?"bg-secondary":"bg-success");
  $("mSpecs").innerHTML = [["Mesin",m.mesin],["Tenaga",m.tenaga],["Transmisi",m.transmisi],["Kondisi",m.kondisi]]
    .map(([k,v])=>`<tr><td>${k}</td><td>${v}</td></tr>`).join("");
  $("mDesc").textContent = m.deskripsi;
  $("mWa").href = waLink(`Halo, saya tertarik dengan ${m.nama} (${m.tahun}) di katalog. Apakah masih tersedia?`);
  modal.show();
}

$("searchInput").addEventListener("input", renderGrid);
renderFilters(); renderGrid();

// Tombol ke atas & menu aktif
const toTop = $("toTop");
addEventListener("scroll", () => { toTop.style.display = scrollY>400 ? "block" : "none"; });