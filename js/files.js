/* ══════════════════════════════════════════════════════
   FILES DATABASE — this is the only file you need to edit
   to add / remove downloads.

   For each entry:
     name     → display filename
     category → one of the CATEGORIES ids below
     sizeMB   → size in megabytes (number)
     date     → "YYYY-MM-DD"
     desc     → short description shown when row expands
     direct   → direct download URL (file hosted with the site,
                e.g. "downloads/myfile.zip", or any direct link)
     mirror   → third-party cloud link (Google Drive, Mega,
                Dropbox, MediaFire...). Set to "" to hide.
   ══════════════════════════════════════════════════════ */

const CATEGORIES = [
  {}
];

const FILES = [
  {
    name: "MovieBox_4.0.03.0930.03_(50020132_premium.apk",
    category: "software",
    sizeMB: 80,
    date: "2026-10-06",
    desc: "MovieBoxoffers a wide library of movies and TV shows to suit different tastes.",
    direct: "https://mega.nz/file/l6YgCaAB#3gNpL2c5daqoooDDKqpMfqZiCjBXGbPmlz3TBU29I4Q",
    mirror: "https://leeapk.com/0012-moviebox-mod-apk/",
  },
  {
    name: "The Back Of The Photo.pdf",
    category: "pdf",
    sizeMB: 1,
    date: "2026-10-06",
    desc: "A chronological record of the authors experiences, arranged from age seven through age eighteen",
    direct: "https://mega.nz/file/06hyjZ5B#hAfnPjn4imWVQouwG9CDZt0icFzpHkI3g2xDN9Goar0",
    mirror: "https://mega.nz/file/06hyjZ5B#hAfnPjn4imWVQouwG9CDZt0icFzpHkI3g2xDN9Goar0",
  },
];

/* Telegram handle used by the "copy handle" button (no @ needed) */
const TELEGRAM_HANDLE = "th3phreak";
