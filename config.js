/* ================= MIPANGILIO YA MSAMBAZAJI (badilisha hapa tu) ================= */
const APP = {
  name: "DUKA KIGANJANI",
  version: "1.1 (12/11/2026)",
  trialDays: 7,
  pricePerMonth: 10000,
  pay: { network: "Mixx by Yas", number: "0710106169", name: "Emmanuel Mottey" },
  whatsapp: "255710106169",           // namba ya WhatsApp ya kupokea Transaction ID
  publicKey: {"kty":"EC","crv":"P-256","x":"rg74_KikKy5lqgKlNvsgkPEJ0gAMmq4LI9n-g6eT-1k","y":"klgwfyYftqAaMcCce3Oq31amaCWASSOTYMi7Bw4SSCU"}            // ufunguo wa kuthibitisha leseni (usibadilishe)
};

/* Aina za biashara na sifa zake */
const AINA = {
  rejareja: {
    jina: "Rejareja na Jumla", ikoni: "&#128722;",
    maelezo: "Duka la bidhaa za kawaida: bei ya rejareja na jumla, katoni/paketi, wateja wa mkopo.",
    features: { jumla: true, pakiti: true, mkopo: true, batch: false, desimali: false, proforma: false, chupa: false },
    makundi: ["Vyakula", "Vinywaji", "Sabuni na Usafi", "Vipodozi", "Vifaa vya Nyumbani", "Shule na Ofisi", "Mengineyo"],
    vipimo: ["pc", "kg", "L", "pakiti"], pakitiJina: "Katoni"
  },
  famasi: {
    jina: "Famasi / Duka la Dawa", ikoni: "&#128138;",
    maelezo: "Batch na tarehe ya kuisha muda (expiry), tahadhari za dawa zinazokaribia kuisha, dawa za cheti.",
    features: { jumla: true, pakiti: true, mkopo: true, batch: true, desimali: false, proforma: false, chupa: false },
    makundi: ["Vidonge", "Sindano", "Syrup", "Krimu na Mafuta", "Vifaa Tiba", "Virutubisho", "Mengineyo"],
    vipimo: ["pc", "kidonge", "chupa", "boksi", "strip"], pakitiJina: "Boksi"
  },
  hardware: {
    jina: "Hardware / Vifaa vya Ujenzi", ikoni: "&#128296;",
    maelezo: "Kuuza kwa mita, kilo na lita (desimali), Proforma kwa wateja, bei ya jumla kwa mafundi.",
    features: { jumla: true, pakiti: true, mkopo: true, batch: false, desimali: true, proforma: true, chupa: false },
    makundi: ["Saruji na Mchanga", "Nondo na Chuma", "Mabati", "Rangi", "Umeme", "Mabomba", "Misumari na Bolti", "Zana", "Mengineyo"],
    vipimo: ["pc", "m", "kg", "L", "mfuko", "futi"], pakitiJina: "Boksi"
  },
  vinywaji: {
    jina: "Vinywaji / Bar / Grocery", ikoni: "&#127866;",
    maelezo: "Kreti na chupa, amana ya chupa tupu, ufuatiliaji wa chupa zilizo nje.",
    features: { jumla: true, pakiti: true, mkopo: true, batch: false, desimali: false, proforma: false, chupa: true },
    makundi: ["Bia", "Soda", "Maji", "Juisi", "Pombe Kali", "Vitafunwa", "Mengineyo"],
    vipimo: ["chupa", "pc", "kopo"], pakitiJina: "Kreti"
  }
};
const NJIA_MALIPO = ["Taslimu", "Mixx by Yas", "M-Pesa", "Airtel Money", "HaloPesa", "Benki", "Mkopo"];
const KUNDI_MATUMIZI = ["Kodi ya Pango", "Umeme na Maji", "Mshahara", "Usafiri", "Chakula", "Ushuru na Leseni", "Mawasiliano", "Matengenezo", "Mengineyo"];
const SABABU_MAREKEBISHO = ["Hesabu ya stoo", "Imeharibika", "Imeisha muda", "Imepotea / Wizi", "Matumizi binafsi", "Imerudishwa kwa msambazaji", "Marekebisho mengine"];
