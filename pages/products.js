import { useRouter } from 'next/router';
import { useState } from 'react';

export async function getServerSideProps(context) {
  const { page = 1, provider = '', search = '' } = context.query;

  const baseUrl = process.env.API_URL;

  // 1. Fetch data price-list dengan parameter filter & search ke FastAPI
  const res = await fetch(`${baseUrl}/price-list?page=${page}&limit=100&provider=${provider}&search=${search}`, {
    headers: {
      'ngrok-skip-browser-warning': 'true',
    },
  });
  const data = await res.json();

  // 2. Fetch data list providers untuk mengisi opsi di menu dropdown
  const resProviders = await fetch(`${baseUrl}/providers`, {
    headers: {
      'ngrok-skip-browser-warning': 'true',
    },
  });
  const providerData = await resProviders.json();

  const listProviders = providerData.providers || (Array.isArray(providerData) ? providerData : []);

  return { 
    props: { 
      products: data.data || (Array.isArray(data) ? data : []),   
      total: data.total || 0, 
      page: Number(page), 
      currentProvider: provider, 
      currentSearch: search,
      providers: listProviders
    } 
  };
}

export default function Products({ products, total, page, currentProvider, currentSearch, providers }) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(currentSearch);

  const handleFilter = (e) => {
    const selectedProvider = e.target.value;
    router.push(`/products?provider=${selectedProvider}&search=${currentSearch}&page=1`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    router.push(`/products?provider=${currentProvider}&search=${searchInput}&page=1`);
  };

  const nextPage = () => {
    router.push(`/products?provider=${currentProvider}&search=${currentSearch}&page=${page + 1}`);
  };

  const prevPage = () => {
    router.push(`/products?provider=${currentProvider}&search=${currentSearch}&page=${page - 1}`);
  };

  const productList = Array.isArray(products) ? products : [];
  const safeProviders = Array.isArray(providers) ? providers : [];

  // ======================================================================
  // DAFTAR KATA/KALIMAT KHUSUS YANG INGIN DISEMBUNYIKAN SAAT DI-FILTER
  // ======================================================================
  const kataDilarang = [
    "KHUSUS TEMBAK 2X",
    "TEMBAK",
    // Tambahkan kata khusus lainnya di sini dengan tanda koma, contoh: "PROMO ERROR",
  ];

  // ==========================================
  // PROSES PENYARINGAN KATA & GROUPING TABEL
  // ==========================================
  const groupedProducts = {};

  productList.forEach((product) => {
    if (product.kode) {
      const namaProduk = (product.nama || product.nama_produk || "").toUpperCase();

      // Cek apakah nama produk mengandung salah satu dari daftar kataDilarang
      const mengandungKataTerlarang = kataDilarang.some((kata) => 
        namaProduk.includes(kata.toUpperCase())
      );

      // JIKA MENGANDUNG KATA TERLARANG, PRODUK DIBUANG (TIDAK MASUK TABEL)
      if (mengandungKataTerlarang) {
        return;
      }

      // Ekstraksi huruf depan kode produk sebagai nama kategori
      const match = product.kode.match(/^([A-Za-z]+)/);
      const kategori = match ? match.toUpperCase() : "LAINNYA";

      if (!groupedProducts[kategori]) {
        groupedProducts[kategori] = [];
      }
      groupedProducts[kategori].push(product);
    }
  });

  // Mapping prefix / kategori produk → penjelasan deskripsi
  const categoryDescriptions = {
    "AAM": "PAKET DATA XL AIGO MINI",
    "DOR": "PAKET DATA TELKOMSEL FLASH",
    "AKU": "PAKET DATA AXIS KUOTA WARNET UNLIMITED",
    "IAP": "PAKET DATA INDOSAT ",
    "AOVS": "VOUCHERS GAME AOV",
    "CODM": "VOUCHERS GAME COD MOBILE",
    "FFTE": "PROMO TOP UP FREE FIRE", // Contoh penambahan deskripsi untuk FFTE
    "MTA": "PAKET DATA THREE MASA AKTIF LOKAL",
    "TDA": "PAKET DATA THREE AON",
    "PLA": "TOKEN LISTRIK SUPER PROMO",
    "PLK": "TOKEN LISTRIK NOMINAL KECIL",
    "PLN": "TOKEN LISTRIK FULL REPLY",
    "BYU": "PULSA BYU REGULER",
    "SSR": "PULSA SMARTFREN REGULER",
    "CMAX": "SALDO MAXIM CUSTOMER",
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Daftar Produk</h1>

      {/* Filter & Search Bar */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <select value={currentProvider} onChange={handleFilter} style={{ padding: "6px 10px", borderRadius: "4px" }}>
          <option value="">Semua Provider</option>
          {safeProviders.map((prov, index) => {
            const code = prov.kode || prov.id || prov.provider || prov;
            const name = prov.nama || prov.name || code;
            return (
              <option key={code + index} value={code}>
                {name.toUpperCase()}
              </option>
            );
          })}
        </select>

        <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "5px" }}>
          <input 
            type="text" 
            value={searchInput} 
            onChange={(e) => setSearchInput(e.target.value)} 
            placeholder="Cari kode atau nama produk..." 
            style={{ padding: "6px 10px", width: "220px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
          <button type="submit" style={{ padding: "6px 12px", background: "#0070f3", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Cari
          </button>
        </form>
      </div>

      {/* Render Kelompok Tabel Terpisah Per Kode Kategori */}
      {Object.keys(groupedProducts).length > 0 ? (
        Object.keys(groupedProducts).map((kategori) => (
          <div key={kategori} style={{ marginBottom: "40px" }}>
            <h2 className="category-title">
              Produk {kategori}
              <span className="category-desc">
                {categoryDescriptions[kategori] ? ` - ${categoryDescriptions[kategori]}` : ""}
              </span>
            </h2>
            <table>
              <thead>
                <tr>
                  <th>Kode</th>
                  <th>Nama Produk</th>
                  <th>Provider</th>
                  <th>Harga Jual</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {groupedProducts[kategori].map((p, index) => (
                  <tr key={p.kode || index}>
                    <td>{p.kode || "-"}</td>
                    <td className="product-name">{p.nama || p.nama_produk || "-"}</td>
                    <td>{p.provider || "-"}</td>
                    <td>Rp {p.harga_jual ? p.harga_jual.toLocaleString("id-ID") : 0}</td>
                    <td className={p.aktif ? "status-open" : "status-closed"}>
                      {p.aktif ? "Open" : "Closed"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <div style={{ padding: "40px", textAlign: "center", border: "1px dashed #ccc", color: "#666" }}>
          Tidak ada daftar produk ditemukan (atau produk disembunyikan oleh sistem filter).
        </div>
      )}

      {/* Pagination */}
      <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button disabled={page <= 1} onClick={prevPage} style={{ padding: "6px 12px", cursor: page <= 1 ? "not-allowed" : "pointer" }}>
          Previous
        </button>
        <span>Halaman {page} dari {Math.ceil(total / 100) || 1}</span>
        <button disabled={productList.length < 100 || (page * 100) >= total} onClick={nextPage} style={{ padding: "6px 12px", cursor: (productList.length < 100 || (page * 100) >= total) ? "not-allowed" : "pointer" }}>
          Next
        </button>
      </div>

      {/* CSS inline */}
      <style jsx>{`
        table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          margin-bottom: 20px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          border-radius: 6px;
          overflow: hidden;
        }

        th, td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: center;
          vertical-align: middle;
          word-wrap: break-word;
        }

        th {
          background: linear-gradient(90deg, #f2f2f2, #e6e6e6);
          font-weight: bold;
          color: #333;
        }

        tbody tr:nth-child(even) {
          background-color: #fafafa;
        }

        tbody tr:nth-child(odd) {
          background-color: #ffffff;
        }

        tbody tr:hover {
          background-color: #dff0ff;
          transition: background-color 0.3s ease;
        }

        .category-title {
          background-color: #0070f3;
          color: #fff;              
          padding: 10px 14px;
          border-radius: 4px;
          margin-bottom: 10px;
          font-size: 20px;          
          text-align: left;
          font-weight: bold;        
          text-transform: uppercase;
        }

        .category-desc {
          font-size: 16px;          
          color: #e0e0e0;              
          margin-left: 8px;
          font-weight: normal;        
          text-transform: uppercase;
        }

        .product-name {
          text-transform: uppercase;
        }

        .status-open {
          color: #2e8b57;
          font-weight: bold;
        }

        .status-closed {
          color: #b22222;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
