import { useRouter } from 'next/router';

export async function getServerSideProps(context) {
  const { page = 1, provider = '', search = '' } = context.query;

  const baseUrl = process.env.API_URL;

  // 1. Fetch data price-list dengan bypass header ngrok
  const res = await fetch(`${baseUrl}/price-list?page=${page}&limit=100&provider=${provider}&search=${search}`, {
    headers: {
      'ngrok-skip-browser-warning': 'true',
    },
  });
  const data = await res.json();

  // 2. Fetch data providers dengan bypass header ngrok
  const resProviders = await fetch(`${baseUrl}/providers`, {
    headers: {
      'ngrok-skip-browser-warning': 'true',
    },
  });
  const providerData = await resProviders.json();

  return { 
    props: { 
      // Jika data.data tidak ada, coba pakai data utama. Pastikan fallback adalah array []
      products: data.data || (Array.isArray(data) ? data : []),   
      total: data.total || 0, 
      page: Number(page), 
      provider, 
      search,
      providers: providerData.providers || []
    } 
  };
}

export default function Products({ products, total, page, provider, search, providers }) {
  const router = useRouter();

  const handleFilter = (e) => {
    router.push(`/products?provider=${e.target.value}&search=${search}&page=1`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const value = e.target.search.value;
    router.push(`/products?provider=${provider}&search=${value}&page=1`);
  };

  const nextPage = () => {
    router.push(`/products?provider=${provider}&search=${search}&page=${page + 1}`);
  };

  const prevPage = () => {
    router.push(`/products?provider=${provider}&search=${search}&page=${page - 1}`);
  };

  // Pastikan data yang di-loop di tabel adalah Array aman
  const productList = Array.isArray(products) ? products : [];
  const safeProviders = Array.isArray(providers) ? providers : [];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Daftar Produk</h1>

      {/* Filter & Search */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <select value={provider} onChange={handleFilter}>
          <option value="">Semua Provider</option>
          {safeProviders.map((prov) => (
            <option key={prov.kode} value={prov.kode}>
              {prov.nama}
            </option>
          ))}
        </select>

        <form onSubmit={handleSearch}>
          <input type="text" name="search" defaultValue={search} placeholder="Cari kode produk..." />
          <button type="submit">Cari</button>
        </form>
      </div>

      {/* Satu tabel utama untuk semua daftar produk array */}
      <div style={{ marginBottom: "40px" }}>
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
            {productList.length > 0 ? (
              productList.map((p, index) => (
                <tr key={p.kode || index}>
                  <td>{p.kode || "-"}</td>
                  <td className="product-name">{p.nama || p.nama_produk || "-"}</td>
                  <td>{p.provider || "-"}</td>
                  <td>Rp {p.harga_jual ? p.harga_jual.toLocaleString("id-ID") : 0}</td>
                  <td className={p.aktif ? "status-open" : "status-closed"}>
                    {p.aktif ? "Open" : "Closed"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">Tidak ada produk ditemukan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
        <button disabled={page <= 1} onClick={prevPage}>Previous</button>
        <span>Halaman {page} dari {Math.ceil(total / 20) || 1}</span>
        <button disabled={page * 20 >= total} onClick={nextPage}>Next</button>
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
