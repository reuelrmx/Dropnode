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
    name: "MovieBox_4.0.03.1028.03_(52120136)_Mod_V2.apk",
    category: "software",
    sizeMB: 68,
    date: "2026-11-08",
    desc: "MovieBox offers a wide library of movies and TV shows to suit different tastes.",
    direct: "https://mega.nz/file/tiJ3CSwI#4gWRhDHyxrUMLL3NUOz4ERE9_U6WWCY47iPvyBQ0l1s",
    mirror: "https://leeapk.com/0012-moviebox-mod-apk/",
  },
   {
      name: "AZ_Screen_Recorder_v6.9.12_(70390)_Mod.apk",
      category: "software",
      sizeMB: 46,
      date: "2026-11-08",
      desc: "AZ Screen Recorder is a program that allows users to record screen video in the best way.",
      direct: "https://mega.nz/file/k2AWhR7S#lKr6aH0FGM1NK1G06bgWTQShMD92YIzCSEX5lzPQ5_8",
      mirror: "https://leeapk.com/az-screen-recorder/",
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
   {
      name: "CapCut v18.5.0.apk",
      category: "video-editing",
      sizeMB: 277,
      date: "2026-10-06",
      desc: "CapCut has excellent video processing capabilities, combined with top-notch artificial intelligence, to support deep and precise editing with extreme precision. Above all, its video templates are the main and most important content to create countless amazing videos even if the user does not have the necessary knowledge",
      direct: "https://mega.nz/file/8zBGVAAY#0hnbA-E-GHM-hH1i7R8inaEFe3mAlijyUGaNXui-Y5U",
      mirror: "https://leeapk.com/capcut-mod-apk/download",
   },
];

/* Telegram handle used by the "copy handle" button (no @ needed) */
const TELEGRAM_HANDLE = "th3phreak";
