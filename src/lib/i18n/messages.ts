import type { Locale } from "./localized";

export type Messages = {
  common: {
    backToAtlas: string;
    tryAgain: string;
    opensInNewTab: string;
  };
  atlas: {
    meta: {
      title: string;
      description: string;
    };
    header: {
      title: string;
      description: string;
    };
    sections: {
      globeAria: string;
      panelAria: string;
      listAria: string;
    };
    panel: {
      empty: string;
      readFullCase: string;
    };
    list: {
      empty: string;
      navAria: string;
      casesHeading: string;
      clearSelection: string;
    };
    globe: {
      emptyTitle: string;
      emptyDescription: string;
      webglUnavailableTitle: string;
      webglUnavailableDescription: string;
      canvasAriaTemplate: string;
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
    sections: {
      problem: string;
      solution: string;
      aiRole: string;
      impact: string;
      metrics: string;
      sources: string;
    };
    sources: {
      accessedPrefix: string;
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
};

export const idMessages: Messages = {
  common: {
    backToAtlas: "Kembali ke Atlas",
    tryAgain: "Coba lagi",
    opensInNewTab: "(buka di tab baru)",
  },
  atlas: {
    meta: {
      title: "Atlas Inovasi Global | KarsaLoka",
      description:
        "Jelajahi inovasi teknologi dan peran AI dalam menyelesaikan tantangan global.",
    },
    header: {
      title: "Atlas Inovasi Global",
      description:
        "Eksplorasi tantangan global dan studi kasus inovasi teknologi yang membuka jalan bagi masa depan berkelanjutan.",
    },
    sections: {
      globeAria: "Visualisasi globe",
      panelAria: "Detail kasus terpilih",
      listAria: "Daftar kasus terbit",
    },
    panel: {
      empty:
        "Pilih titik di globe atau kasus dari daftar untuk melihat ringkasannya.",
      readFullCase: "Baca studi kasus lengkap",
    },
    list: {
      empty: "Belum ada kasus yang diterbitkan.",
      navAria: "Daftar kasus atlas",
      casesHeading: "Kasus",
      clearSelection: "Batalkan pilihan (Esc)",
    },
    globe: {
      emptyTitle: "Belum ada kasus yang diterbitkan",
      emptyDescription:
        "Kasus yang diterbitkan dalam basis data akan muncul di globe interaktif.",
      webglUnavailableTitle: "Globe 3D Interaktif Tidak Tersedia",
      webglUnavailableDescription:
        "WebGL dinonaktifkan atau tidak didukung oleh browser Anda. Anda dapat menjelajahi seluruh kasus langsung menggunakan daftar kasus.",
      canvasAriaTemplate:
        "Globe interaktif yang menampilkan {count} kasus terbit. Gunakan daftar kasus untuk menjelajahi kasus.",
    },
    loading: {
      ariaLabel: "Memuat konten atlas",
      srText: "Memuat data atlas...",
    },
    error: {
      title: "Gagal Memuat Atlas",
      description: "Kami tidak dapat memuat atlas saat ini. Silakan coba lagi.",
    },
  },
  cases: {
    meta: {
      notFoundTitle: "Kasus Tidak Ditemukan — KarsaLoka",
      titleSuffix: " — KarsaLoka",
    },
    sections: {
      problem: "Masalah",
      solution: "Solusi",
      aiRole: "Peran AI",
      impact: "Dampak",
      metrics: "Metrik utama",
      sources: "Sumber & referensi",
    },
    sources: {
      accessedPrefix: "Diakses",
    },
    loading: {
      ariaLabel: "Memuat detail kasus",
      srText: "Memuat detail kasus...",
    },
    notFound: {
      title: "Kasus Tidak Ditemukan",
      description:
        "Studi kasus inovasi yang diminta tidak ditemukan atau belum diterbitkan.",
    },
    error: {
      title: "Gagal Memuat Detail Kasus",
      description:
        "Terjadi kendala saat memuat detail studi kasus ini. Silakan coba lagi atau kembali ke Atlas.",
    },
  },
};

export const enMessages: Messages = {
  common: {
    backToAtlas: "Back to Atlas",
    tryAgain: "Try again",
    opensInNewTab: "(opens in a new tab)",
  },
  atlas: {
    meta: {
      title: "Global Innovation Atlas | KarsaLoka",
      description:
        "Explore technological innovations and the role of AI in solving global challenges.",
    },
    header: {
      title: "Global Innovation Atlas",
      description:
        "Explore global challenges and technological innovation case studies paving the way for a sustainable future.",
    },
    sections: {
      globeAria: "Globe visualization",
      panelAria: "Selected case details",
      listAria: "Published cases list",
    },
    panel: {
      empty:
        "Select a marker on the globe or a case from the list to view its summary.",
      readFullCase: "Read the full case",
    },
    list: {
      empty: "No published cases yet.",
      navAria: "Atlas cases list",
      casesHeading: "Cases",
      clearSelection: "Clear selection (Esc)",
    },
    globe: {
      emptyTitle: "No published cases yet",
      emptyDescription:
        "Cases published in the database will appear on the interactive globe.",
      webglUnavailableTitle: "Interactive 3D Globe Unavailable",
      webglUnavailableDescription:
        "WebGL is disabled or unsupported by your current browser environment. You can explore all cases directly using the case list.",
      canvasAriaTemplate:
        "Interactive globe showing {count} published cases. Use the case list to browse cases.",
    },
    loading: {
      ariaLabel: "Loading atlas content",
      srText: "Loading atlas data...",
    },
    error: {
      title: "Unable to Load Atlas",
      description: "We couldn't load the atlas right now. Please try again.",
    },
  },
  cases: {
    meta: {
      notFoundTitle: "Case Not Found — KarsaLoka",
      titleSuffix: " — KarsaLoka",
    },
    sections: {
      problem: "The problem",
      solution: "The solution",
      aiRole: "The role of AI",
      impact: "The impact",
      metrics: "Key metrics",
      sources: "Sources & references",
    },
    sources: {
      accessedPrefix: "Accessed",
    },
    loading: {
      ariaLabel: "Loading case details",
      srText: "Loading case details...",
    },
    notFound: {
      title: "Case Not Found",
      description:
        "The requested innovation case study could not be found or has not been published yet.",
    },
    error: {
      title: "Unable to Load Case Details",
      description:
        "We encountered an issue retrieving the details for this case study. Please try again or return to the Atlas.",
    },
  },
};

export const messages: Record<Locale, Messages> = {
  id: idMessages,
  en: enMessages,
};

/**
 * Returns the typed dictionary of UI messages for the specified locale.
 * Defaults to Indonesian ("id").
 */
export function getMessages(locale: Locale = "id"): Messages {
  return messages[locale] ?? messages.id;
}

/**
 * Helper to interpolate variables into template strings (e.g. "{count}").
 */
export function formatTemplate(
  template: string,
  variables: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    return key in variables ? String(variables[key]) : match;
  });
}
