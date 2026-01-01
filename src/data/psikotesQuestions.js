// Psikotes Questions Data
// 15 questions for self-assessment

export const psikotesQuestions = [
  {
    id: 1,
    question: "Umur kamu?",
    type: "radio",
    options: [
      { value: "18-20", label: "18-20" },
      { value: "21-23", label: "21-23" },
      { value: "24-26", label: "24-26" },
      { value: "27+", label: "27+" },
    ],
  },
  {
    id: 2,
    question: "Status kamu?",
    type: "radio",
    options: [
      { value: "Mahasiswa", label: "Mahasiswa" },
      { value: "Kerja", label: "Kerja" },
      { value: "Fresh grad", label: "Fresh grad" },
      { value: "Gap year", label: "Gap year" },
    ],
  },
  {
    id: 3,
    question: "Seberapa sering feeling lost?",
    type: "radio",
    options: [
      { value: "Hampir tiap hari", label: "Hampir tiap hari" },
      { value: "Seminggu beberapa kali", label: "Seminggu beberapa kali" },
      { value: "Kadang-kadang", label: "Kadang-kadang" },
      { value: "Jarang", label: "Jarang" },
    ],
  },
  {
    id: 4,
    question: "Seberapa paham diri sendiri?",
    type: "scale",
    options: [
      { value: 1, label: "1 - Nggak ngerti sama sekali" },
      { value: 2, label: "2 - Ngerti dikit" },
      { value: 3, label: "3 - Lumayan ngerti" },
      { value: 4, label: "4 - Cukup paham" },
      { value: 5, label: "5 - Paham banget" },
    ],
  },
  {
    id: 5,
    question: "Apa yang bikin 'hilang' dari diri?",
    type: "checkbox",
    maxSelect: null, // unlimited
    options: [
      { value: "scroll_sosmed", label: "Scroll sosmed terlalu lama" },
      { value: "tekanan_ortu", label: "Tekanan ortu/keluarga" },
      { value: "ngebanding", label: "Ngebanding-bandingin diri" },
      { value: "ekspektasi", label: "Terlalu banyak ekspektasi" },
      { value: "skill_bingung", label: "Nggak tau skill apa yang mau dipelajari" },
      { value: "terlalu_banyak_pilihan", label: "Terlalu banyak pilihan" },
      { value: "takut_salah", label: "Takut salah pilih jalan hidup" },
      { value: "standar_orang", label: "Harus ikut standar orang lain" },
    ],
  },
  {
    id: 6,
    question: "Platform yang paling bikin brainrot?",
    type: "radio",
    options: [
      { value: "TikTok", label: "TikTok" },
      { value: "Instagram", label: "Instagram" },
      { value: "Twitter/X", label: "Twitter/X" },
      { value: "YouTube Shorts", label: "YouTube Shorts" },
      { value: "Facebook", label: "Facebook" },
    ],
  },
  {
    id: 7,
    question: "Perasaan after scroll lama?",
    type: "checkbox",
    maxSelect: 3,
    options: [
      { value: "capek_mental", label: "Capek mental" },
      { value: "insecure", label: "Insecure" },
      { value: "overwhelmed", label: "Overwhelmed" },
      { value: "guilty", label: "Guilty" },
      { value: "kosong", label: "Kosong/hampa" },
      { value: "termotivasi", label: "Termotivasi" },
    ],
  },
  {
    id: 8,
    question: "Lagi bingung skill apa yang mau dipelajari?",
    type: "radio",
    options: [
      { value: "Iya, bingung banget", label: "Iya, bingung banget" },
      { value: "Agak bingung", label: "Agak bingung" },
      { value: "Nggak, udah tau", label: "Nggak, udah tau" },
      { value: "Nggak tertarik", label: "Nggak tertarik" },
    ],
  },
  {
    id: 9,
    question: "Kenapa biasanya berhenti belajar skill?",
    type: "checkbox",
    maxSelect: 3,
    options: [
      { value: "nggak_tau_mulai", label: "Nggak tau mulai dari mana" },
      { value: "terlalu_banyak_resources", label: "Terlalu banyak resources" },
      { value: "nggak_ada_support", label: "Nggak ada support" },
      { value: "cepet_bosan", label: "Cepet bosan" },
      { value: "nggak_ada_waktu", label: "Nggak ada waktu" },
    ],
  },
  {
    id: 10,
    question: "Cara belajar yang efektif?",
    type: "radio",
    options: [
      { value: "Visual", label: "Visual (video, diagram)" },
      { value: "Hands-on", label: "Hands-on (praktek langsung)" },
      { value: "Reading", label: "Reading (artikel, buku)" },
      { value: "Audio", label: "Audio (podcast, diskusi)" },
    ],
  },
  {
    id: 11,
    question: "Pengalaman dengan komunitas online?",
    type: "radio",
    options: [
      { value: "Mostly positif", label: "Mostly positif" },
      { value: "Mixed", label: "Mixed" },
      { value: "Mostly negatif", label: "Mostly negatif" },
      { value: "Belum pernah join", label: "Belum pernah join" },
    ],
  },
  {
    id: 12,
    question: "Seberapa nyaman share kebingungan?",
    type: "radio",
    options: [
      { value: "Nyaman banget, asal anonim", label: "Nyaman banget, asal anonim" },
      { value: "Nyaman kalau kecil & aman", label: "Nyaman kalau kecil & aman" },
      { value: "Nggak terlalu nyaman", label: "Nggak terlalu nyaman" },
      { value: "Nggak mau share", label: "Nggak mau share" },
    ],
  },
  {
    id: 13,
    question: "Yang paling kamu butuhin?",
    type: "radio",
    options: [
      { value: "Memahami diri lebih dalam", label: "Memahami diri lebih dalam" },
      { value: "Tempat nulis/refleksi", label: "Tempat nulis/refleksi" },
      { value: "Komunitas kecil", label: "Komunitas kecil" },
      { value: "Panduan skill", label: "Panduan skill" },
      { value: "Ngobrol sama mentor", label: "Ngobrol sama mentor" },
    ],
  },
  {
    id: 14,
    question: "Energy pattern kamu?",
    type: "radio",
    options: [
      { value: "Morning person", label: "Morning person" },
      { value: "Night owl", label: "Night owl" },
      { value: "Flexible", label: "Flexible" },
    ],
  },
  {
    id: 15,
    question: "Prefer kerja solo atau bareng?",
    type: "radio",
    options: [
      { value: "Solo", label: "Solo" },
      { value: "Bareng tim", label: "Bareng tim" },
      { value: "Depends on task", label: "Depends on task" },
    ],
  },
];
