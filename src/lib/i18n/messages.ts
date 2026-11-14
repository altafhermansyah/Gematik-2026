import type { Locale } from "./localized";

/**
 * The single copy deck for the interface. Every visible string lives here so
 * the Indonesian and English editions cannot drift apart.
 */
export type Messages = {
  common: {
    skipToContent: string;
    opensInNewTab: string;
    backToAtlas: string;
    home: string;
    tryAgain: string;
    close: string;
  };
  nav: {
    atlas: string;
    atlas3d: string;
    indonesia: string;
    domainsSdg: string;
    telemetrySdg: string;
    openAtlas: string;
    language: string;
    navigation: string;
  };
  home: {
    meta: {
      title: string;
      description: string;
    };
    hero: {
      eyebrow: string;
      titleLead: string;
      titleAccent: string;
      lede: string;
      primaryCta: string;
      secondaryCta: string;
      deploymentsLabel: string;
    };
    domains: {
      eyebrow: string;
      title: string;
      description: string;
      caseCountTemplate: string;
      exploreDomain: string;
      sdgPrefix: string;
      summaries: Record<string, string>;
    };
    showcase: {
      eyebrow: string;
      title: string;
      description: string;
      cta: string;
      cardTitle: string;
      tabsAria: string;
      tabs: {
        domains: string;
        sdgs: string;
        indonesia: string;
      };
      domainFootnote: string;
      sdgHeading: string;
      sdgCountTemplate: string;
      indonesiaHeading: string;
      readCase: string;
    };
    stats: {
      casesLabel: string;
      countriesLabel: string;
      metricsLabel: string;
      sdgsLabel: string;
    };
    closing: {
      eyebrow: string;
      title: string;
      description: string;
      primaryCta: string;
      secondaryCta: string;
    };
  };
  atlas: {
    meta: {
      title: string;
      description: string;
    };
    stage: {
      title: string;
      description: string;
      countTemplate: string;
      indexHeading: string;
    };
    stats: {
      cases: string;
      countries: string;
      metrics: string;
    };
    filters: {
      searchPlaceholder: string;
      searchAria: string;
      clearSearch: string;
      allDomains: string;
      indonesiaOnly: string;
      featuredOnly: string;
      filterByDomainAria: string;
      resetFilters: string;
      showingCountTemplate: string;
    };
    controls: {
      pauseRotation: string;
      resumeRotation: string;
      focusIndonesia: string;
      resetView: string;
    };
    rail: {
      heading: string;
      hint: string;
      empty: string;
      clearSelection: string;
    };
    sheet: {
      close: string;
      readFullCase: string;
      metricsHeading: string;
      sourcesTemplate: string;
      featuredBadge: string;
    };
    globe: {
      emptyTitle: string;
      emptyDescription: string;
      webglUnavailableTitle: string;
      webglUnavailableDescription: string;
      canvasAriaTemplate: string;
      keyboardHint: string;
      legendHeading: string;
    };
    sections: {
      globeAria: string;
      railAria: string;
      stageAria: string;
    };
    loading: {
      ariaLabel: string;
      srText: string;
    };
    error: {
      title: string;
      description: string;
    };
  };
  cases: {
    meta: {
      notFoundTitle: string;
      titleSuffix: string;
    };
    fileLabel: string;
    rail: {
      location: string;
      year: string;
      domain: string;
      sdgs: string;
      technologies: string;
      metrics: string;
      sources: string;
      contents: string;
    };
    sections: {
      problem: string;
      solution: string;
      aiRole: string;
      impact: string;
      metrics: string;
      sources: string;
    };
    metrics: {
      sourceQuotePrefix: string;
    };
    sources: {
      accessedPrefix: string;
    };
    footer: {
      exploreDomain: string;
      backToAtlas: string;
    };
    loading: {
      ariaLabel: string;
      srText: string;
    };
    notFound: {
      title: string;
      description: string;
    };
    error: {
      title: string;
      description: string;
    };
  };
  globalNotFound: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    description: string;
    exploreAtlas: string;
    backHome: string;
  };
  footer: {
    tagline: string;
    collection: string;
    casesLabel: string;
    metricsLabel: string;
    competition: string;
    note: string;
    columns: {
      explore: string;
      domains: string;
      competition: string;
    };
    links: {
      atlas3d: string;
      indonesiaFocus: string;
      featuredCases: string;
      climate: string;
      health: string;
      disaster: string;
      inclusion: string;
    };
    badges: {
      event: string;
      architecture: string;
      integrity: string;
    };
  };
};

export const idMessages: Messages = {
  common: {
    skipToContent: "Lewati ke konten utama",
    opensInNewTab: "(buka di tab baru)",
    backToAtlas: "Kembali ke atlas",
    home: "Beranda",
    tryAgain: "Coba lagi",
    close: "Tutup",
  },
  nav: {
    atlas: "Atlas",
    atlas3d: "Atlas 3D",
    indonesia: "Indonesia",
    domainsSdg: "Domain & SDG",
    telemetrySdg: "Telemetri SDG",
    openAtlas: "Buka Atlas",
    language: "Bahasa",
    navigation: "Navigasi utama",
  },
  home: {
    meta: {
      title: "KarsaLoka — Atlas Inovasi AI Terverifikasi & 17 SDGs",
      description:
        "Arsip 16 studi kasus kecerdasan buatan dan teknologi terapan di 11 negara yang mendukung agenda GEMATIK VI dan 12 target UN SDGs, lengkap dengan kutipan angka dari laporan primer.",
    },
    hero: {
      eyebrow: "GEMATIK VI 2026 · INOVASI AI & 17 SDGs",
      titleLead: "Teknologi terapan",
      titleAccent: "yang teruji di lapangan",
      lede: "Kumpulan 16 studi kasus kecerdasan buatan dan sistem digital di 11 negara, dari sensor bioakustik di Sumatra Barat sampai prakiraan banjir 7 hari di Bangladesh. Seluruh data merujuk langsung ke makalah ilmiah dan laporan lapangan aslinya.",
      primaryCta: "Jelajahi Atlas 3D",
      secondaryCta: "Lihat 3 Kasus Indonesia",
      deploymentsLabel: "MITRA LAPANGAN & SUMBER DATA",
    },
    domains: {
      eyebrow: "ENAM BIDANG & SDG",
      title: "Masalah di lapangan dan target SDG yang dituju",
      description:
        "Pilih salah satu sektor di bawah untuk melihat lokasi penerapan, ringkasan teknologi, serta target SDG pada masing-masing kasus.",
      caseCountTemplate: "{count} Kasus",
      exploreDomain: "Lihat bidang di atlas",
      sdgPrefix: "SDG",
      summaries: {
        climate:
          "Rekaman bioakustik untuk mendeteksi pembalakan di Sumatra Barat dan pelacakan radar kapal ikan tanpa transponder.",
        food: "Deteksi penyakit daun singkong luring lewat kamera ponsel serta klasifikasi hama tanaman bagi petani kecil.",
        health:
          "Pemodelan struktur protein, pengiriman darah dengan drone di Rwanda, skrining foto toraks TB, verifikasi obat via SMS, dan pelepasan Wolbachia di Yogyakarta.",
        education:
          "Perangkat lunak latihan matematika adaptif sesuai kemampuan siswa serta modul numerasi awal berbasis tablet luring.",
        disaster:
          "Pemetaan genangan banjir Jakarta dari laporan warga dan model prakiraan tinggi muka air sungai berbasis LSTM.",
        inclusion:
          "Penyaluran bantuan tunai dari citra satelit, asisten visual bagi tunanetra, dan riset NLP bahasa daerah Afrika.",
      },
    },
    showcase: {
      eyebrow: "DATA & KUTIPAN",
      title: "Setiap angka disertai kutipan asli dari naskah sumber",
      description:
        "Bandingkan distribusi 41 metrik di enam sektor, lihat 12 target UN SDGs yang terkait, dan tinjau tiga penerapan di Indonesia sebelum membuka peta 3D.",
      cta: "Buka Atlas 3D",
      cardTitle: "Ringkasan Koleksi",
      tabsAria: "Tampilan telemetri koleksi",
      tabs: {
        domains: "Per Domain",
        sdgs: "Target SDGs",
        indonesia: "3 Kasus Indonesia",
      },
      domainFootnote:
        "Persentase dihitung langsung dari 16 berkas kasus dan 41 metrik berkutipan.",
      sdgHeading: "Sebaran target UN Sustainable Development Goals",
      sdgCountTemplate: "{count} kasus",
      indonesiaHeading: "Tiga kasus terverifikasi di Indonesia",
      readCase: "Baca berkas",
    },
    stats: {
      casesLabel: "Studi kasus terbit",
      countriesLabel: "Negara lokasi penerapan",
      metricsLabel: "Angka berkutipan sumber",
      sdgsLabel: "Target UN SDGs terkait",
    },
    closing: {
      eyebrow: "EKSPLORASI PETA",
      title: "Putar globe 3D dan telusuri sumber tiap kasus",
      description:
        "Saring lokasi berdasarkan bidang masalah, fokus Indonesia, atau teknologi yang dipakai, lalu periksa sendiri daftar referensi dan kutipan verbatim di berkas lengkapnya.",
      primaryCta: "Buka Atlas 3D",
      secondaryCta: "Lihat Fokus Indonesia",
    },
  },
  atlas: {
    meta: {
      title: "Atlas inovasi",
      description:
        "Jelajahi enam belas studi kasus inovasi AI dan teknologi di sebelas negara melalui globe interaktif.",
    },
    stage: {
      title: "Atlas inovasi",
      description:
        "Enam belas kasus, sebelas negara, satu pertanyaan: apa yang benar-benar berubah?",
      countTemplate: "{shown} dari {total} titik",
      indexHeading: "Bidang masalah",
    },
    stats: {
      cases: "kasus",
      countries: "negara",
      metrics: "metrik",
    },
    filters: {
      searchPlaceholder: "Cari negara, teknologi, atau SDG",
      searchAria: "Cari studi kasus di atlas",
      clearSearch: "Hapus pencarian",
      allDomains: "Semua bidang",
      indonesiaOnly: "Indonesia",
      featuredOnly: "Pilihan editor",
      filterByDomainAria: "Saring menurut bidang masalah",
      resetFilters: "Hapus semua filter",
      showingCountTemplate: "{shown} dari {total} titik",
    },
    controls: {
      pauseRotation: "Jeda putaran",
      resumeRotation: "Putar otomatis",
      focusIndonesia: "Indonesia",
      resetView: "Reset pandangan",
    },
    rail: {
      heading: "Titik pada atlas",
      hint: "Geser mendatar untuk melihat semuanya.",
      empty: "Tidak ada titik yang cocok dengan filter ini.",
      clearSelection: "Tutup detail",
    },
    sheet: {
      close: "Tutup detail",
      readFullCase: "Baca berkas lengkap",
      metricsHeading: "Metrik terverifikasi",
      sourcesTemplate: "{count} sumber",
      featuredBadge: "Pilihan editor",
    },
    globe: {
      emptyTitle: "Tidak ada titik pada filter ini",
      emptyDescription:
        "Longgarkan bidang atau kata kunci pencarian untuk menampilkan kembali kasus di globe.",
      webglUnavailableTitle: "Globe 3D tidak tersedia",
      webglUnavailableDescription:
        "WebGL tidak dapat dijalankan di peramban ini. Seluruh kasus tetap bisa dibaca lewat daftar di bawah globe.",
      canvasAriaTemplate:
        "Globe interaktif yang menampilkan {count} studi kasus. Gunakan tombol panah untuk memutar globe, atau jelajahi daftar kasus di bawahnya.",
      keyboardHint:
        "Geser untuk memutar. Klik titik untuk membuka berkas. Tombol panah memutar globe.",
      legendHeading: "Bidang masalah",
    },
    sections: {
      globeAria: "Globe interaktif",
      railAria: "Daftar kasus pada atlas",
      stageAria: "Panggung atlas",
    },
    loading: {
      ariaLabel: "Memuat atlas",
      srText: "Memuat atlas...",
    },
    error: {
      title: "Atlas gagal dimuat",
      description:
        "Kami tidak bisa memuat atlas saat ini. Coba lagi, atau kembali ke beranda untuk membaca kasus lewat daftar.",
    },
  },
  cases: {
    meta: {
      notFoundTitle: "Berkas tidak ditemukan",
      titleSuffix: " — KarsaLoka",
    },
    fileLabel: "Berkas kasus",
    rail: {
      location: "Lokasi",
      year: "Tahun",
      domain: "Bidang",
      sdgs: "SDG",
      technologies: "Teknologi",
      metrics: "Metrik",
      sources: "Sumber",
      contents: "Isi berkas",
    },
    sections: {
      problem: "Masalah",
      solution: "Yang dikerjakan",
      aiRole: "Peran AI dan teknologi",
      impact: "Yang berubah",
      metrics: "Jejak angka",
      sources: "Sumber",
    },
    metrics: {
      sourceQuotePrefix: "Kutipan sumber",
    },
    sources: {
      accessedPrefix: "Diakses",
    },
    footer: {
      exploreDomain: "Jelajahi bidang ini di atlas",
      backToAtlas: "Kembali ke atlas",
    },
    loading: {
      ariaLabel: "Memuat berkas kasus",
      srText: "Memuat berkas kasus...",
    },
    notFound: {
      title: "Berkas tidak ditemukan",
      description:
        "Studi kasus yang diminta tidak ada di koleksi lokal ini. Atlas memuat seluruh berkas yang tersedia.",
    },
    error: {
      title: "Berkas gagal dimuat",
      description:
        "Ada kendala saat membuka berkas ini. Coba lagi, atau kembali ke atlas untuk memilih kasus lain.",
    },
  },
  globalNotFound: {
    metaTitle: "404 — Halaman tidak ditemukan · KarsaLoka",
    metaDescription:
      "Halaman yang Anda cari tidak tersedia. Buka Atlas 3D atau kembali ke beranda KarsaLoka.",
    eyebrow: "Rute tidak ditemukan · 404",
    title: "Halaman ini tidak ada di indeks KarsaLoka",
    description:
      "Tautan mungkin sudah berubah atau salah ketik. Seluruh studi kasus aktif tersedia di Atlas 3D dan halaman utama.",
    exploreAtlas: "Jelajahi Atlas 3D",
    backHome: "Kembali ke Beranda",
  },
  footer: {
    tagline:
      "Katalog studi kasus AI dan sistem digital dengan rujukan jurnal dan laporan lapangan.",
    collection: "Koleksi",
    casesLabel: "Studi kasus",
    metricsLabel: "Metrik terkutip",
    competition: "GEMATIK VI 2026",
    note: "Disusun dari laporan lapangan dan publikasi ilmiah terbuka.",
    columns: {
      explore: "Eksplorasi",
      domains: "Bidang & SDG",
      competition: "Kompetisi",
    },
    links: {
      atlas3d: "Atlas 3D",
      indonesiaFocus: "Fokus Indonesia",
      featuredCases: "Kasus Unggulan",
      climate: "Iklim · SDG 13",
      health: "Kesehatan · SDG 3",
      disaster: "Kebencanaan · SDG 11",
      inclusion: "Inklusi · SDG 10",
    },
    badges: {
      event: "GEMATIK VI 2026",
      architecture: "Indeks Statis Lokal",
      integrity: "Kutipan Sumber Verbatim",
    },
  },
};

export const enMessages: Messages = {
  common: {
    skipToContent: "Skip to main content",
    opensInNewTab: "(opens in a new tab)",
    backToAtlas: "Back to the atlas",
    home: "Home",
    tryAgain: "Try again",
    close: "Close",
  },
  nav: {
    atlas: "Atlas",
    atlas3d: "3D Atlas",
    indonesia: "Indonesia",
    domainsSdg: "Domains & SDGs",
    telemetrySdg: "SDG Telemetry",
    openAtlas: "Open Atlas",
    language: "Language",
    navigation: "Main navigation",
  },
  home: {
    meta: {
      title: "KarsaLoka — Verified AI Innovation & 17 SDGs Atlas",
      description:
        "An index of 16 documented AI and digital technology deployments across 11 countries aligned with GEMATIK VI and 12 UN SDGs, anchored to verbatim primary-source quotes.",
    },
    hero: {
      eyebrow: "GEMATIK VI 2026 · AI INNOVATION & 17 SDGs",
      titleLead: "Applied technology",
      titleAccent: "tested in the field",
      lede: "Sixteen documented AI and digital deployments across 11 countries, from bioacoustic forest sensors in West Sumatra to 7-day river flood forecasts in Bangladesh. Every figure traces back to its primary paper or field evaluation.",
      primaryCta: "Explore 3D Atlas",
      secondaryCta: "See 3 Indonesian Cases",
      deploymentsLabel: "FIELD PARTNERS & DATA SOURCES",
    },
    domains: {
      eyebrow: "SIX SECTORS & SDGs",
      title: "Field problems documented alongside their SDG targets",
      description:
        "Open any sector below to filter deployments by location, underlying technology, and mapped UN Sustainable Development Goals.",
      caseCountTemplate: "{count} Cases",
      exploreDomain: "Explore domain in atlas",
      sdgPrefix: "SDG",
      summaries: {
        climate:
          "Bioacoustic forest monitoring in West Sumatra and satellite radar detection of dark fishing vessels.",
        food: "Offline cassava disease vision diagnosis and regional-language pest detection for smallholders.",
        health:
          "Protein structure prediction, Rwanda medical drones, TB triage screening, SMS pack authentication, and Wolbachia trials.",
        education:
          "Mastery-based personalized tutoring software and offline tablet numeracy interventions in high-ratio classrooms.",
        disaster:
          "Citizen-verified Jakarta flood alerts and LSTM river discharge forecasts up to 5–7 days in advance.",
        inclusion:
          "Satellite-guided humanitarian cash aid, volunteer and multimodal visual aid, and participatory African NLP.",
      },
    },
    showcase: {
      eyebrow: "DATA & CITATIONS",
      title: "Every metric stays anchored to a verbatim source quote",
      description:
        "Compare all 41 cited metrics across six sectors, see how 12 UN SDGs overlap, and inspect three Indonesian deployments before opening the 3D globe.",
      cta: "Open 3D Atlas",
      cardTitle: "Collection Summary",
      tabsAria: "Collection telemetry views",
      tabs: {
        domains: "By Domain",
        sdgs: "SDG Targets",
        indonesia: "3 Indonesia Cases",
      },
      domainFootnote:
        "Shares calculated directly from 16 published case studies and 41 cited metrics.",
      sdgHeading: "Coverage across UN Sustainable Development Goals",
      sdgCountTemplate: "{count} cases",
      indonesiaHeading: "Three documented deployments in Indonesia",
      readCase: "Read dossier",
    },
    stats: {
      casesLabel: "Published case studies",
      countriesLabel: "Countries documented",
      metricsLabel: "Source-quoted figures",
      sdgsLabel: "UN SDG targets covered",
    },
    closing: {
      eyebrow: "EXPLORE THE MAP",
      title: "Turn the 3D globe and inspect the source behind each case",
      description:
        "Filter points by sector, Indonesian focus, or technology tag, then verify the underlying papers and verbatim excerpts inside each dossier.",
      primaryCta: "Open 3D Atlas",
      secondaryCta: "Compare Indonesian Cases",
    },
  },
  atlas: {
    meta: {
      title: "Innovation atlas",
      description:
        "Explore sixteen AI and technology case studies across eleven countries on an interactive globe.",
    },
    stage: {
      title: "Innovation atlas",
      description:
        "Sixteen cases, eleven countries, one question: what actually changed?",
      countTemplate: "{shown} of {total} points",
      indexHeading: "Problem domains",
    },
    stats: {
      cases: "cases",
      countries: "countries",
      metrics: "metrics",
    },
    filters: {
      searchPlaceholder: "Search country, technology, or SDG",
      searchAria: "Search case studies in the atlas",
      clearSearch: "Clear search",
      allDomains: "All domains",
      indonesiaOnly: "Indonesia",
      featuredOnly: "Editor's picks",
      filterByDomainAria: "Filter by problem domain",
      resetFilters: "Clear all filters",
      showingCountTemplate: "{shown} of {total} points",
    },
    controls: {
      pauseRotation: "Pause rotation",
      resumeRotation: "Auto-rotate",
      focusIndonesia: "Indonesia",
      resetView: "Reset view",
    },
    rail: {
      heading: "Points on the atlas",
      hint: "Scroll sideways to see them all.",
      empty: "No point matches this filter.",
      clearSelection: "Close detail",
    },
    sheet: {
      close: "Close detail",
      readFullCase: "Read the full case",
      metricsHeading: "Verified metrics",
      sourcesTemplate: "{count} sources",
      featuredBadge: "Editor's pick",
    },
    globe: {
      emptyTitle: "No points under this filter",
      emptyDescription:
        "Loosen the domain filter or search terms to bring the cases back onto the globe.",
      webglUnavailableTitle: "The 3D globe is unavailable",
      webglUnavailableDescription:
        "WebGL cannot run in this browser. Every case can still be read from the list below the globe.",
      canvasAriaTemplate:
        "Interactive globe showing {count} case studies. Use the arrow keys to rotate the globe, or browse the case list below it.",
      keyboardHint:
        "Drag to rotate. Click a point to open its file. Arrow keys turn the globe.",
      legendHeading: "Problem domains",
    },
    sections: {
      globeAria: "Interactive globe",
      railAria: "Case list on the atlas",
      stageAria: "Atlas stage",
    },
    loading: {
      ariaLabel: "Loading the atlas",
      srText: "Loading the atlas...",
    },
    error: {
      title: "The atlas failed to load",
      description:
        "We could not load the atlas right now. Try again, or return home to read cases from the list.",
    },
  },
  cases: {
    meta: {
      notFoundTitle: "Case file not found",
      titleSuffix: " — KarsaLoka",
    },
    fileLabel: "Case file",
    rail: {
      location: "Location",
      year: "Year",
      domain: "Domain",
      sdgs: "SDGs",
      technologies: "Technologies",
      metrics: "Metrics",
      sources: "Sources",
      contents: "In this file",
    },
    sections: {
      problem: "The problem",
      solution: "What they built",
      aiRole: "The role of AI and technology",
      impact: "What changed",
      metrics: "The numbers, traced",
      sources: "Sources",
    },
    metrics: {
      sourceQuotePrefix: "Source quote",
    },
    sources: {
      accessedPrefix: "Accessed",
    },
    footer: {
      exploreDomain: "Explore this domain in the atlas",
      backToAtlas: "Back to the atlas",
    },
    loading: {
      ariaLabel: "Loading the case file",
      srText: "Loading the case file...",
    },
    notFound: {
      title: "Case file not found",
      description:
        "The requested case study is not part of this local collection. The atlas lists every available file.",
    },
    error: {
      title: "The case file failed to load",
      description:
        "Something went wrong while opening this file. Try again, or return to the atlas to choose another case.",
    },
  },
  globalNotFound: {
    metaTitle: "404 — Page not found · KarsaLoka",
    metaDescription:
      "The requested page does not exist. Explore the 3D Atlas or return to the KarsaLoka homepage.",
    eyebrow: "Route not found · 404",
    title: "This page is not in the KarsaLoka index",
    description:
      "The link may have moved or been mistyped. All verified field cases are available in the 3D Atlas and on the homepage.",
    exploreAtlas: "Explore 3D Atlas",
    backHome: "Return Home",
  },
  footer: {
    tagline:
      "An atlas of applied AI and digital systems backed by field reports and papers.",
    collection: "Collection",
    casesLabel: "Case studies",
    metricsLabel: "Cited metrics",
    competition: "GEMATIK VI 2026",
    note: "Compiled from open scientific papers and published field evaluations.",
    columns: {
      explore: "Explore",
      domains: "Domains & SDGs",
      competition: "Competition",
    },
    links: {
      atlas3d: "3D Atlas",
      indonesiaFocus: "Indonesia Focus",
      featuredCases: "Editor's Picks",
      climate: "Climate · SDG 13",
      health: "Health · SDG 3",
      disaster: "Disaster · SDG 11",
      inclusion: "Inclusion · SDG 10",
    },
    badges: {
      event: "GEMATIK VI 2026",
      architecture: "Static Local Index",
      integrity: "Verbatim Source Quotes",
    },
  },
};

export const messages: Record<Locale, Messages> = {
  id: idMessages,
  en: enMessages,
};

/** Returns the typed copy deck for the requested locale (Indonesian default). */
export function getMessages(locale: Locale = "id"): Messages {
  return messages[locale] ?? messages.id;
}

/** Interpolates `{variable}` placeholders in copy templates. */
export function formatTemplate(
  template: string,
  variables: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    return key in variables ? String(variables[key]) : match;
  });
}
