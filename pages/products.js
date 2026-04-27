import { useRouter } from 'next/router';

export async function getServerSideProps(context) {
  const { page = 1, provider = '', search = '' } = context.query;

  const baseUrl = process.env.API_URL;

  const res = await fetch(`${baseUrl}/price-list?page=${page}&limit=100&provider=${provider}&search=${search}`);
  const data = await res.json();

  const resProviders = await fetch(`${baseUrl}/providers`);
  const providerData = await resProviders.json();

  return { 
    props: { 
      products: data.data,   // sudah grouped object dari backend
      total: data.total, 
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

  // Grouped sudah dari backend
const grouped = products || {};

// Sorting harga per kategori
Object.keys(grouped).forEach((kategori) => {
  grouped[kategori].sort((a, b) => a.harga_jual - b.harga_jual);
});

// Render per kategori → tabel terpisah
{Object.keys(grouped).map((kategori) => (
  <div key={kategori} style={{ marginBottom: "40px" }}>
    <h2 style={{ marginBottom: "10px" }}>Produk {kategori}</h2>
    <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead style={{ backgroundColor: "#f2f2f2" }}>
        <tr>
          <th>Kode</th>
          <th>Nama Produk</th>
          <th>Provider</th>
          <th>Harga Jual</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {grouped[kategori].map((p) => (
          <tr key={p.kode}>
            <td>{p.kode}</td>
            <td>{p.nama}</td>
            <td>{p.provider}</td>
            <td>Rp {p.harga_jual.toLocaleString("id-ID")}</td>
            <td className={p.aktif ? "status-open" : "status-closed"}>
              {p.aktif ? "Open" : "Closed"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
))}



      {/* Pagination */}
      <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
        <button disabled={page <= 1} onClick={prevPage}>Previous</button>
        <span>Halaman {page} dari {Math.ceil(total / 20)}</span>
        <button disabled={page * 20 >= total} onClick={nextPage}>Next</button>
      </div>

      {/* CSS inline */}
      <style jsx>{`
        table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          margin-bottom: 20px;
        }

        th, td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: center;
          vertical-align: middle;
          word-wrap: break-word;
        }

        th {
          background-color: #f2f2f2;
          font-weight: bold;
        }

        td:nth-child(2) {
          text-align: center;
          white-space: normal;
          word-wrap: break-word;
        }

        tbody tr:nth-child(even) {
          background-color: #fafafa;
        }

        tbody tr:hover {
          background-color: #e6f7ff;
        }

        .status-open {
          color: green;
          font-weight: bold;
        }

        .status-closed {
          color: red;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
