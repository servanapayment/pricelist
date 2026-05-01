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
      products: data.data,   // grouped object dari backend
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

  // Data sudah grouped dari backend
  const grouped = products || {};

  // Mapping prefix → penjelasan kategori
  const categoryDescriptions = {
    "AAM": "PAKET DATA XL AIGO MINI",
    "AAP": "PAKET DATA XL PURE",
    "ABL": "PAKET DATA XL AIGO BRONET",
    "ABV": "PAKET DATA XL BOOSTER VIDEO",
    "ATP": "PULSA TRANSFER XL & AXIS",
    "FLXMX": "PAKET DATA XL FLEXMAX",
    "XBSK": "PAKET DATA XL BEBAS PUAS",
    "XBSL": "PAKET DATA XL BEBAS PUAS + LOKAL",
    "XBSM": "PAKET DATA XL BEBAS PUAS + LOKAL",
    "XCF": "PAKET DATA XL COMBO FLEX S",
    "XCFA": "PAKET DATA XL COMBO FLEX S",
    "XCM": "PAKET DATA XL COMBO MINI + YOUTUBE",
    "XDB": "PAKET DATA XL DATA BLUE",
    "XDHL": "PAKET DATA XL HARIAN L",
    "XDHM": "PAKET DATA XL HARIAN M",
    "XDHS": "PAKET DATA XL HARIAN S",
    "XDHXL": "PAKET DATA XL HARIAN XL",
    "XDP": "PAKET DATA XL PURE",
    "XR": "PULSA XL REGULER",
    "XTP": "PULSA XL TRANSFER",
    "XTS": "PULSA XL TRANSFER",


// PROVIDER TELKOMSEL
    "DOR": "PAKET DATA TELKOMSEL FLASH",
    "GMAXG": "PAKET TELKOMSEL GAMESMAX POWER GOLD MLBB",
    "GMAXS": "PAKET TELKOMSEL GAMESMAX POWER SILVER MLBB",
    "HOTSTAR": "PAKET TELKOMSEL DISNEY+ HOSTAR",
    "NFLX": "PAKET DATA TELKOMSEL NETFLIX MOBILE",
    "OMG": "PAKET DATA TELKOMSEL OMG ZONA",
    "OMGK": "PAKET DATA TELKOMSEL OMG",
    "OMGP": "PAKET DATA TELKOMSEL OMG ZONA",
    "PAS": "PAKET DATA TELKOMSEL PASS",
    "PAY": "PAKET TELEPON TELKOMSEL ALL OPERATOR",
    "PDM": "PAKET DATA TELKOMSEL DATA MINI",
    "SBASU": "PAKET DATA TELKOMSEL",
    "REDASU": "PAKET DATA TELKOMSEL NON PAMA",
    "SCK": "PAKET DATA TELKOMSEL FLASH",
    "SDB": "PAKET DATA TELKOMSEL ",
    "SDB": "PAKET DATA TELKOMSEL BABAT",
    "SDE": "PAKET DATA TELKOMSEL ENTERPRISE",
    "SDF": "PAKET DATA TELKOMSEL EKSKLUSIF",
    "SDH": "PAKET DATA TELKOMSEL EKSKLUSIF",
    "SDI": "PAKET DATA TELKOMSEL FLASH",
    "SDKM": "PAKET DATA TELKOMSEL KETENGAN MINI",
    "SDM": "PAKET DATA TELKOMSEL DATA MINI",
    "SDMG": "PAKET DATA TELKOMSEL",
    "SDMI": "PAKET DATA TELKOMSEL MINI",
    "SDN": "PAKET DATA TELKOMSEL NASIONAL",
    "SDMNP": "PAKET DATA TELKOMSEL MINI",
    "SDMP": "PAKET DATA TELKOMSEL MINI",
    "SMDP": "PAKET DATA TELKOMSEL MINI",
    "SDO": "PAKET DATA TELKOMSEL OMG ZONA",
    "SDP": "PAKET DATA TELKOMSEL MINI",
    "SDT": "PAKET DATA TELKOMSEL FLASH PROMO",
    "SDU": "PAKET DATA TELKOMSEL UKM PLUS",
    "SDV": "PAKET DATA TELKOMSEL FLASH REVAMP",
    "SKFA": "PAKET DATA TELKOMSEL KETENGAN FACEBOOK",
    "SKFB": "PAKET DATA TELKOMSEL KETENGAN FACEBOOK",
    "SKFC": "PAKET DATA TELKOMSEL KETENGAN FACEBOOK",
    "SKFD": "PAKET DATA TELKOMSEL KETENGAN FACEBOOK",
    "SKIA": "PAKET DATA TELKOMSEL KETENGAN INSTAGRAM",
    "SKIB": "PAKET DATA TELKOMSEL KETENGAN INSTAGRAM",
    "SKIC": "PAKET DATA TELKOMSEL KETENGAN INSTAGRAM",
    "SKID": "PAKET DATA TELKOMSEL KETENGAN INSTAGRAM",
    "SKM": "PAKET DATA TELKOMSEL TELP TSEL ZONA",
    "SKTA": "PAKET DATA TELKOMSEL KETENGAN TIKTOK",
    "SKTB": "PAKET DATA TELKOMSEL KETENGAN TIKTOK",
    "SKTC": "PAKET DATA TELKOMSEL KETENGAN TIKTOK",
    "SKTD": "PAKET DATA TELKOMSEL KETENGAN TIKTOK",
    "SKTU": "PAKET DATA TELKOMSEL KETENGAN TIKTOK UNLIMITED",
    "SKWA": "PAKET DATA TELKOMSEL KETENGAN WHATSAPP",
    "SKWC": "PAKET DATA TELKOMSEL KETENGAN WHATSAPP",
    "SKWD": "PAKET DATA TELKOMSEL KETENGAN WHATSAPP",
    "SKYA": "PAKET DATA TELKOMSEL KETENGAN YOUTUBE",
    "SKYB": "PAKET DATA TELKOMSEL KETENGAN YOUTUBE",
    "SKYC": "PAKET DATA TELKOMSEL KETENGAN YOUTUBE",
    "SKYD": "PAKET DATA TELKOMSEL KETENGAN YOUTUBE",
    "STXA": "PAKET DATA TELKOMSEL KETENGAN TWITTER",
    "STXB": "PAKET DATA TELKOMSEL KETENGAN TWITTER",
    "STXC": "PAKET DATA TELKOMSEL KETENGAN TWITTER",
    "STXD": "PAKET DATA TELKOMSEL KETENGAN TWITTER",
    "SPL": "PAKET DATA TELKOMSEL PLAN",
    "SPM": "PAKET DATA TELKOMSEL MALAM HARI",
    "SPRSD": "PAKET TELEPON TELKOMSEL ALL OPERATOR",
    "SSB": "PAKET DATA TELKOMSEL SUKABUMI BOGOR BANTEN",
    "SSD": "PAKET DATA TELKOMSEL SUPER SERU",
    "SSDG": "PAKET DATA TELKOMSEL SUPER SERU",
    "STA": "PAKET TELEPON TELKOMSEL ALL OPERATOR",
    "STAH": "PAKET TELEPON TELKOMSEL ALL OPERATOR",
    "STAK": "PAKET TELEPON TELKOMSEL ALL OPERATOR",
    "STAN": "PAKET TELEPON TELKOMSEL ALL OPERATOR",
    "STANP": "PAKET TELEPON TELKOMSEL ALL OPERATOR NON PAMASUKA",
    "STAP": "PAKET TELEPON TELKOMSEL ALL OPERATOR",
    "STB": "PAKET DATA TELKOMSEL BULK",
    "STBI": "PAKET DATA TELKOMSEL BULK",
    "STD": "PAKET DATA TELKOMSEL FLASH PROMO",
    "STDF": "PAKET DATA TELKOMSEL FLASH",
    "STDH": "PAKET DATA TELKOMSEL ",
    "STDM": "PAKET DATA TELKOMSEL MINGGUAN",
    "STF": "PAKET DATA TELKOMSEL FLASH",
    "STFM": "PAKET DATA TELKOMSEL FLASH",
    "STK": "PAKET TELEPON SESAMA TELKOMSEL ",
    "STL": "PAKET TELEPON SESAMA TELKOMSEL ",
    "STLP": "PAKET TELEPON SESAMA TELKOMSEL ",
    "STM": "PAKET TELEPON SESAMA TELKOMSEL ",
    "STP": "PAKET TELEPON SESAMA TELKOMSEL ",
    "STT": "PAKET TELEPON SESAMA TELKOMSEL ",
    "STU": "PAKET TELEPON SESAMA TELKOMSEL ",
    "STUM": "PAKET TELEPON SESAMA TELKOMSEL ",
    "STR": "PAKET DATA TELKOMSEL EKSLUSIF",
    "STY": "PAKET TELEPON TELKOMSEL ALL OPERATOR + SESAMA",
    "SV": "PULSA TELKOMSEL REGULER",
    "TAL": "PAKET TELEPON TELKOMSEL SEMUA OPERATOR",
    "TAP": "PAKET TELEPON TELKOMSEL SEMUA OPERATOR",
    "TAZ": "PAKET TELEPON TELKOMSEL SEMUA OPERATOR",
    "TBQ": "PAKET DATA TELKOMSEL ",
    "TDF": "PAKET DATA TELKOMSEL FLASH",
    "TDI": "PAKET DATA TELKOMSEL MINI",
    "TDJABAR": "PAKET DATA TELKOMSEL JAWA BARAT",
    "TDJABO": "PAKET DATA TELKOMSEL JABODETABEK",
    "TDK": "PAKET DATA TELKOMSEL FLASH",
    "TDMI": "PAKET DATA TELKOMSEL MINI",
    "TDMJ": "PAKET DATA TELKOMSEL JABODETABEK",
    "TDMP": "PAKET DATA TELKOMSEL  MINI",
    "TDMS": "PAKET DATA TELKOMSEL  MINI",
    "TDOR": "PAKET DATA TELKOMSEL ORBIT",
    "TDU": "PAKET DATA TELKOMSEL FLASH",
    "DTV": "PAKET DATA TELKOMSEL FLASH",
    "TEL": "PAKET DATA TELKOMSEL EKSLUSIF",
    "TELP": "PAKET TELEPON TELKOMSE",
    "TELS": "PAKET DATA TELKOMSEL EKSLUSIF",
    "TELW": "PAKET TELEPON TELKOMSE",
    "TFA": "PAKET DATA TELKOMSEL ",
    "TFL": "PAKET DATA TELKOMSEL ",
    "TFN": "PAKET DATA TELKOMSEL (PAMASUKA)",
    "TFNK": "PAKET DATA TELKOMSEL (PAMASUKA)",
    "TFNP": "PAKET DATA TELKOMSEL (NON PAMASUKA)",
    "TGMAX": "PAKET DATA TELKOMSEL GAMEMAX KETENGAN BULANAN",
    "TLL": "PAKET TELEPON TELKOMSEL",
    "TLM": "PAKET TELEPON TELKOMSEL",
    "TLO": "PAKET TELEPON TELKOMSEL",
    "TLOP": "PAKET TELEPON TELKOMSEL",
    "TLPA": "PAKET TELEPON TELKOMSEL",
    "TLPD": "PAKET TELEPON TELKOMSEL",
    "TLPS": "PAKET TELEPON TELKOMSEL",
    "TMA": "PAKET DATA TELKOMSEL MASA AKTIF",
    "TML": "PAKET TELEPON TELKOMSEL",
    "TNP": "PAKET DATA TELKOMSEL NON PAMASUKA",
    "TPM": "PAKET TELEPON TELKOMSEL ALL OPERATOR",
    "TPP": "PAKET TELEPON TELKOMSEL",
    "TROAM": "PAKET DATA TELKOMSEL COMBO ROAMAX ASIA AUSTRALIA",
    "TROAMC": "PAKET DATA TELKOMSEL COMBO ROAMAX CONTINENT",
    "TROAMW": "PAKET DATA TELKOMSEL COMBO ROAMAX WESTERN",
    "TSD": "PAKET DATA TELKOMSEL ALL NET + DPI",
    "TSF": "PAKET DATA TELKOMSEL NASIONAL",
    "TSG": "PAKET DATA TELKOMSEL GIGAMAX",
    "TSL": "PAKET DATA TELKOMSEL SERBA LIMA RIBU",
    "TSM": "PAKET SMS TELKOMSEL ",
    "TTB": "PAKET DATA TELKOMSEL TERBAIK",
    "TTP": "PULSA TELKOMSEL TRANSFER",
    "TTS": "PULSA TELKOMSEL TRANSFER",


// PROVIDER AXIS
    "AKU": "PAKET DATA AXIS KUOTA WARNET UNLIMITED",
    "AKW": "PAKET DATA AXIS KUOTA WARNET",
    "ATS": "PULSA TRANSFER AXIS & XL",
    "AXM": "PAKET MASA AKTIF",
    "AAM": "PAKET DATA AXIS AIGO MINI",
    "AAM": "PAKET DATA AXIS AIGO MINI",
    "AAM": "PAKET DATA AXIS AIGO MINI",

// PROVIDER INDOSAT
    "IAP": "PAKET DATA INDOSAT ",
    "IDA": "PAKET DATA INDOSAT FREEDOM",
    "IDC": "PAKET DATA INDOSAT FREEDOM COMBO",
    "IDD": "PAKET DATA INDOSAT FREEDOM COMBO",
    "IDR": "PAKET DATA INDOSAT INDOSAT RAMADHAN",
    "IFDS": "PAKET DATA INDOSAT FREEDOM PLAY MOVIES",
    "IFF": "PAKET DATA INDOSAT FREEDOM INTERNET",
    "IFH": "PAKET DATA INDOSAT FREEDOM HARIAN",
    "IFHK": "PAKET DATA INDOSAT FREEDOM HARIAN",
    "IFHM": "PAKET DATA INDOSAT PROMO",
    "IFHP": "PAKET DATA INDOSAT FREEDOM HARIAN",
    "IFK": "PAKET DATA INDOSAT FREEDOM",
    "IFL": "PAKET DATA INDOSAT FREEDOM",
    "IFM": "PAKET DATA INDOSAT FREEDOM",
    "IFMK": "PAKET DATA INDOSAT FREEDOM",
    "IFO": "PAKET DATA INDOSAT FREEDOM",
    "IFP": "PAKET DATA INDOSAT FREEDOM",
    "IFPK": "PAKET DATA INDOSAT FREEDOM",
    "IFU": "PAKET DATA INDOSAT FREEDOM UNLIMITED",
    "IFV": "PAKET DATA INDOSAT FREEDOM UNLIMITED",
    "IFY": "PAKET DATA INDOSAT FREEDOM PROMO",
    "IMS": "PAKET DATA INDOSAT MASA AKTIF",
    "IPS": "PAKET DATA INDOSAT SMS",
    "IPTS": "PAKET DATA INDOSAT TELPON UNLIMITED",
    "IR": "PULSA INDOSAT REGULER",
    "ISP": "PAKET DATA INDOSAT DATA PURE",
    "ISY": "PAKET DATA INDOSAT DATA YELLOW",
    "ITP": "PULSA INDOSAT TRANSFER",
    "ITS": "PULSA INDOSAT TRANSFER",





// PROVIDER GAME
    "AOVS": "VOUCHERS GAME AOV",
    "CODM": "COD MOBILE CP",
    "CODS": "COD MOBILE CP",
    "FFPR": "PROMO FREE FIRE DIAMOND",
    "FFS": "FREE FIRE DIAMOND",
    "SFF": "FREE FIRE DIAMOND",
    "FFS": "FREE FIRE DIAMOND",
    "FFS": "FREE FIRE DIAMOND",
    "MLS": "MOBILE LEGENDS DIAMONDS",
    "MLSCEK": "CEK ID MOBILE LEGENDS",
    "MLWD": "MOBILE LEGENDS WEEKLY DIAMOND PASS",
    "PB": "CASH POINT BLANK",
    "PUBGM": "PUBG MOBILE UC",



// PROVIDER THREE
    "MTA": "PAKET DATA THREE MASA AKTIF",
    "STH": "PAKET DATA THREE HAPPY",
    "STHA": "PAKET DATA THREE HAPPY MINI",
    "STHB": "PAKET DATA THREE HAPPY MINI",
    "STHC": "PAKET DATA THREE HAPPY MINI",
    "STHF": "PAKET DATA THREE HAPPY MINI",
    "STHM": "PAKET DATA THREE HAPPY MINI",
    "STHP": "PAKET DATA THREE HAPPY + KUOTA LOKAL",
    "TDA": "PAKET DATA THREE AON",
    "TDB": "PAKET DATA THREE BULK",
    "TDH": "PAKET DATA THREE HAPPY",
    "TDHA": "PAKET DATA THREE HAPPY",
    "TDHB": "PAKET DATA THREE HAPPY",
    "TDHC": "PAKET DATA THREE HAPPY",
    "TDHD": "PAKET DATA THREE HAPPY",
    "TDHN": "PAKET DATA THREE HAPPY",
    "TDHP": "PAKET DATA THREE HAPPY",
    "STHR": "PAKET DATA THREE HAPPY MINI",
    "STHP": "PAKET DATA THREE HAPPY",
    "TR": "PULSA THREE REGULER",
    "TRP": "PULSA THREE TRANSFER",
    "TTH": "PULSA THREE TRANSFER",



// PROVIDER PLN
    "PLA": "TOKEN LISTRIK SUPER PROMO",
    "PLK": "TOKEN LISTRIK NOMINAL KECIL",
    "PLN": "TOKEN LISTRIK FULL REPLY",



// PROVIDER BYU
    "BYU": "PULSA BYU REGULER",
    "DBH": "PAKET DATA BYU HARIAN",
    "DBY": "PAKET DATA BYU DATA BULANAN",
    "DBYA": "PAKET DATA BYU DATA BULANAN",
    "TLBY": "PAKET DATA BYU TELEPON SESAMA",
    "AAM": "PAKET DATA AXIS AIGO MINI",
    "AAM": "PAKET DATA AXIS AIGO MINI",

// PROVIDER SMART
    "SSR": "PULSA SMARTFREN REGULER",
    "SUL": "PAKET DATA SMART UNLIMITED FUP",
    "SUN": "PAKET DATA SMART UNLIMITED NONSTOP",
    "SUNA": "PAKET DATA SMART UNLIMITED NONSTOP",
    "SUT": "PAKET DATA SMART TERBAIK UNTUKMU",
    "SVL": "PAKET DATA SMART VOL + KUOTA MALAM",
    "SVM": "PAKET DATA SMART HARIAN",
    "SUL": "PAKET DATA SMART UNLIMITED FUP",
    "SSR": "PULSA SMART TRANSFER",

 





// PROVIDER EWALLET
    "CMAX": "SALDO MAXIM CUSTOMER",
    "DNACK": "DANA CEK",
    "DNS": "SALDO DANA",
    "GSC": "SALDO GOPAY CUSTOMER",
    "GSD": "SALDO GOPAY DRIVER",
    "LINK": "SALDO LINK AJA",
    "MAX": "SALDO MAXIM DRIVER",
    "OVS": "SALDO OVO",
    "SHS": "SALDO SHOPEE",
    "SPS": "SALDO SHOPEEPAY",
    "AAM": "PAKET DATA AXIS AIGO MINI",
    "AAM": "PAKET DATA AXIS AIGO MINI",
    "AAM": "PAKET DATA AXIS AIGO MINI",
    "AAM": "PAKET DATA AXIS AIGO MINI",
    "AAM": "PAKET DATA AXIS AIGO MINI",
    "AAM": "PAKET DATA AXIS AIGO MINI",

  };

  // Render per kategori → tabel terpisah
  return (
    <div style={{ padding: "20px" }}>
      <h1>Daftar Produk</h1>

      {/* Filter & Search */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <select value={provider} onChange={handleFilter}>
          <option value="">Semua Provider</option>
          {providers.map((prov) => (
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

      {/* Loop kategori → tabel per kategori */}
      {Object.keys(grouped).map((kategori) => (
        <div key={kategori} style={{ marginBottom: "40px" }}>
          <h2 className="category-title">
            Produk {kategori}
            <span className="category-desc">
              {categoryDescriptions[kategori] || ""}
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
          background-color: #32CD32;
          color: white;
          padding: 8px 12px;
          border-radius: 4px;
          margin-bottom: 10px;
          font-size: 18px;
          text-align: center;
        }

        .category-desc {
          font-size: 18px;   /* sama dengan title */
          color: white;      /* sama dengan title */
          margin-left: 10px;
          font-weight: normal;
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
