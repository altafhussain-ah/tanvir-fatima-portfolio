/**
 * publications.js
 * -----------------------------------------------------------------------
 * Complete, verified publication record — 20 peer-reviewed journal
 * articles and 8 conference papers (2019–2026) — sourced directly from
 * Dr. Naik Bukht's own CV and full publications list, as supplied by
 * the site owner, cross-checked against publisher DOIs where available.
 *
 * type: "journal" | "conference" | "book-chapter" | "other"
 * -----------------------------------------------------------------------
 */

const PUBLICATIONS = [
  // ----------------------------- Journal Articles -----------------------------
  {
    id: "j1",
    title: "Hybrid Quantum Gate Enabled CNN Framework with Optimized Features for Human-Object Detection and Recognition",
    authors: "Almujally, N.A., Bukht, T.F.N., Alharbi, S.S., Algarni, A., Jalal, A., Park, J.",
    venue: "Computers, Materials & Continua, 87(1), 94",
    year: 2026,
    type: "journal",
    doi: "10.32604/cmc.2025.072243",
    link: "https://doi.org/10.32604/cmc.2025.072243",
    abstract: ""
  },
  {
    id: "j2",
    title: "Lightweight Lifecare Remote Monitoring System for Human Behavior Interaction Using Embedded Hidden Markov Model",
    authors: "Bukht, T.F.N., Wu, Y., Alabdullah, B., Alnowaiser, K., Jalal, A., Liu, H.",
    venue: "Sensors and Materials, 38(6), 3157–3174",
    year: 2026,
    type: "journal",
    doi: "",
    link: "",
    abstract: ""
  },
  {
    id: "j3",
    title: "Complex Interaction Recognition via Advanced Multilevel Feature Fusion and Deep Learning Model",
    authors: "Alshehri, M., Bukht, T.F.N., Alqahtani, Y., Alshahrani, A., Almujally, N.A., Jalal, A., Park, J.",
    venue: "PeerJ Computer Science, 12, e3514",
    year: 2026,
    type: "journal",
    doi: "10.7717/peerj-cs.3514",
    link: "https://doi.org/10.7717/peerj-cs.3514",
    abstract: ""
  },
  {
    id: "j4",
    title: "Multimodal Human Interaction Recognition Framework Using Multi-Features and Deep Learning Approach",
    authors: "Bukht, T.F.N., Alhaston, H.F., Alshamrari, N., Almujally, N.A., Jalal, A.",
    venue: "International Arab Journal of Information Technology, 23(1), 129–143",
    year: 2026,
    type: "journal",
    doi: "10.34028/iajit/23/1/12",
    link: "https://doi.org/10.34028/iajit/23/1/12",
    abstract: ""
  },
  {
    id: "j5",
    title: "A Novel Activity Pattern Recognition via Convolutional Neural Networks and Advanced Skeleton Models",
    authors: "Bukht, T.F.N., Alshassabi, N.S., Alhasson, H.F., Alabdullah, B., Jalal, A.",
    venue: "Traitement du Signal, 42(4), 1889–1903",
    year: 2025,
    type: "journal",
    doi: "10.18280/ts.420405",
    link: "https://doi.org/10.18280/ts.420405",
    abstract: ""
  },
  {
    id: "j6",
    title: "Novel Quantum-Integrated CNN Model for Improved Human Activity Recognition in Smart Surveillance",
    authors: "Bukht, T.F.N., Wu, Y., Almujally, N.A., Alharbi, S.S., Rahman, H., Jalal, A., Liu, H.",
    venue: "Computer Modeling in Engineering & Sciences, 145(3), 4013",
    year: 2025,
    type: "journal",
    doi: "",
    link: "",
    abstract: ""
  },
  {
    id: "j7",
    title: "Automatic Liver Tumor Segmentation of CT and MRI Volumes Using Ensemble ResUNet-InceptionV4 Model",
    authors: "Rahman, H., Ben Aoun, N., Bukht, T.F.N., Ahmad, S., Tadeusiewicz, R., Plawiak, P., Hammad, M.",
    venue: "Information Sciences, 704, 121966",
    year: 2025,
    type: "journal",
    doi: "10.1016/j.ins.2025.121966",
    link: "https://doi.org/10.1016/j.ins.2025.121966",
    abstract: ""
  },
  {
    id: "j8",
    title: "A Review of Video-Based Human Activity Recognition: Theory, Methods and Applications",
    authors: "Bukht, T.F.N., Rahman, H., Shaheen, M., Algarni, A., Almujally, N.A., Jalal, A.",
    venue: "Multimedia Tools and Applications, 84(17), 18499–18545",
    year: 2025,
    type: "journal",
    doi: "10.1007/s11042-024-19711-w",
    link: "https://doi.org/10.1007/s11042-024-19711-w",
    abstract: ""
  },
  {
    id: "j9",
    title: "Towards Sustainable IoT: A Digital Signature-Enhanced Federated Learning Approach",
    authors: "Qureshi, S.H., Malik, S.U.R., Haseeb, J., Moqurrab, S.A., Bukht, T.F.N., Srivastava, G.",
    venue: "Security and Privacy, 8(4), e70066",
    year: 2025,
    type: "journal",
    doi: "10.1002/spy2.70066",
    link: "https://doi.org/10.1002/spy2.70066",
    abstract: ""
  },
  {
    id: "j10",
    title: "Robust Human Interaction Recognition Using Extended Kalman Filter",
    authors: "Bukht, T.F.N., Alazeb, A., Al Mudawi, N., Alabdullah, B., Alnowaiser, K., Jalal, A., Liu, H.",
    venue: "Computers, Materials & Continua, 81(2), 2987–3002",
    year: 2024,
    type: "journal",
    doi: "10.32604/cmc.2024.053547",
    link: "https://doi.org/10.32604/cmc.2024.053547",
    abstract: ""
  },
  {
    id: "j11",
    title: "A Novel Human Interaction Framework Using Quadratic Discriminant Analysis with HMM",
    authors: "Bukht, T.F.N., Jalal, A.",
    venue: "Computers, Materials & Continua (in press)",
    year: 2023,
    type: "journal",
    doi: "",
    link: "",
    abstract: ""
  },
  {
    id: "j12",
    title: "Efficient Breast Cancer Diagnosis from Complex Mammographic Images Using Deep Convolutional Neural Network",
    authors: "Rahman, H., Bukht, T.F.N., Ahmad, R., Almadhor, A., Javed, A.R., Ben Aoun, N.",
    venue: "Computational Intelligence and Neuroscience, 2023, 7717712",
    year: 2023,
    type: "journal",
    doi: "10.1155/2023/7717712",
    link: "https://doi.org/10.1155/2023/7717712",
    abstract: ""
  },
  {
    id: "j13",
    title: "A Deep Learning Approach for Liver and Tumor Segmentation in CT Images Using ResUNet",
    authors: "Rahman, H., Bukht, T.F.N., Imran, A., Tariq, J., Tu, S., Alzahrani, A.",
    venue: "Bioengineering, 9(8), 368",
    year: 2022,
    type: "journal",
    doi: "10.3390/bioengineering9080368",
    link: "https://doi.org/10.3390/bioengineering9080368",
    abstract: ""
  },
  {
    id: "j14",
    title: "Analyzing the Behaviour of DDOS Cyber Attacks",
    authors: "Raza, M.A., Bukht, T.F.N., Ali, M., Rehman, A.U., Idrees, M.",
    venue: "Technical Journal, 26(4), 46–55",
    year: 2021,
    type: "journal",
    doi: "",
    link: "",
    abstract: ""
  },
  {
    id: "j15",
    title: "Detection and Diagnosis System of Novel COVID-19 Using Internet of Things and Send Alert",
    authors: "Rasool, R.M., Bukht, T.F.N., Ahmad, R.",
    venue: "Journal of Information and Computational Science, 10(7), 129–135",
    year: 2020,
    type: "journal",
    doi: "",
    link: "",
    abstract: ""
  },
  {
    id: "j16",
    title: "Importance of Cyber Security and its Sub-domains",
    authors: "Bukht, T.F.N., Malik, M.H., Ahmad, R.",
    venue: "Journal of Information and Computational Science, 10(6), 473–485",
    year: 2020,
    type: "journal",
    doi: "",
    link: "",
    abstract: ""
  },
  {
    id: "j17",
    title: "Analyzing Cyber-Attacks Targeted on the Banks of Pakistan and Their Solutions",
    authors: "Bukht, T.F.N., Raza, M.A., Awan, J.H., Ahmad, R.",
    venue: "IJCSNS International Journal of Computer Science and Network Security, 20(2), 31–38",
    year: 2020,
    type: "journal",
    doi: "",
    link: "",
    abstract: ""
  },
  {
    id: "j18",
    title: "Review of Network Security Threats and Solutions",
    authors: "Ahmad, R., Saeed, M.J., Bukht, T.F.N.",
    venue: "Journal of Information and Computational Science, 10(6), 324–330",
    year: 2020,
    type: "journal",
    doi: "",
    link: "",
    abstract: ""
  },
  {
    id: "j19",
    title: "Plant Disease Detection Using Internet of Thing (IoT)",
    authors: "Nawaz, M.A., Rasool, R.M., Kausar, M., Usman, A., Bukht, T.F.N., Ahmad, R., Jaleel, A.",
    venue: "International Journal of Advanced Computer Science and Applications, 11(1), 505–509",
    year: 2020,
    type: "journal",
    doi: "",
    link: "",
    abstract: ""
  },
  {
    id: "j20",
    title: "Joint Demographic Features Extraction for Gender, Age and Race Classification Based on CNN",
    authors: "Abbas, Z., Sajid, A., Baloch, M.A., Ilyas, H., Ahmad, M., Malik, M.H., Javaid, N., Bukht, T.F.N.",
    venue: "International Journal of Advanced Computer Science and Applications, 10(12), 460–467",
    year: 2019,
    type: "journal",
    doi: "",
    link: "",
    abstract: ""
  },

  // ----------------------------- Conference Papers -----------------------------
  {
    id: "c1",
    title: "Hybrid Human Interaction Recognition Using Feature Extraction and Deep Neural Network",
    authors: "Bukht, T.F.N., Jalal, A.",
    venue: "Proceedings of ICACS 2025, 1–7",
    year: 2025,
    type: "conference",
    doi: "10.1109/ICACS64902.2025.10937808",
    link: "https://doi.org/10.1109/ICACS64902.2025.10937808",
    abstract: ""
  },
  {
    id: "c2",
    title: "Physical Exergames Movements and Pattern Recognition Using Convolutional Neural Network",
    authors: "Bukht, T.F.N., Jalal, A.",
    venue: "Proceedings of ICACS 2025, 1–8",
    year: 2025,
    type: "conference",
    doi: "10.1109/ICACS64902.2025.10937795",
    link: "https://doi.org/10.1109/ICACS64902.2025.10937795",
    abstract: ""
  },
  {
    id: "c3",
    title: "Enhanced Human Interaction Recognition Framework Using Pyramid Matching and Deep Neural Network",
    authors: "Bukht, T.F.N., Jalal, A., Rahman, H.",
    venue: "Proceedings of the 3rd International Conference on Emerging Trends in Electrical, Control, and Telecommunication Engineering (ETECTE 2024), 1–6",
    year: 2024,
    type: "conference",
    doi: "",
    link: "",
    abstract: ""
  },
  {
    id: "c4",
    title: "Robust Deep Interaction Recognition Framework with Multi-Stage Feature Analysis",
    authors: "Bukht, T.F.N., Jalal, A.",
    venue: "Proceedings of INMIC 2024",
    year: 2024,
    type: "conference",
    doi: "",
    link: "",
    abstract: ""
  },
  {
    id: "c5",
    title: "A Novel Full-Body and Geometric Features for Physical Sports Interaction Recognition",
    authors: "Bukht, T.F.N., Jalal, A.",
    venue: "Proceedings of the International Conference on Innovative Computing (ICIC 2024), 1–6",
    year: 2024,
    type: "conference",
    doi: "",
    link: "",
    abstract: ""
  },
  {
    id: "c6",
    title: "Human Action Recognition Based on Embedded HMM",
    authors: "Bukht, T.F.N., Jalal, A.",
    venue: "Proceedings of ICACS 2024, 1–7",
    year: 2024,
    type: "conference",
    doi: "10.1109/ICACS60934.2024.10473237",
    link: "https://doi.org/10.1109/ICACS60934.2024.10473237",
    abstract: ""
  },
  {
    id: "c7",
    title: "A Robust Model of Human Activity Recognition Using Independent Component Analysis and XGBoost",
    authors: "Bukht, T.F.N., Jalal, A.",
    venue: "Proceedings of ICACS 2024, 1–7",
    year: 2024,
    type: "conference",
    doi: "10.1109/ICACS60934.2024.10473238",
    link: "https://doi.org/10.1109/ICACS60934.2024.10473238",
    abstract: ""
  },
  {
    id: "c8",
    title: "A Novel Framework for Human Action Recognition Based on Features Fusion and Decision Tree",
    authors: "Bukht, T.F.N., Rahman, H., Jalal, A.",
    venue: "Proceedings of ICACS 2023, 1–6",
    year: 2023,
    type: "conference",
    doi: "10.1109/ICACS55311.2023.10089752",
    link: "https://doi.org/10.1109/ICACS55311.2023.10089752",
    abstract: ""
  }
];

/**
 * Aggregate publication metrics, as stated on Dr. Naik Bukht's own CV
 * (supplied by the site owner). Update periodically from her live
 * Google Scholar / ResearchGate profile.
 */
const PUBLICATION_STATS = {
  totalPublications: 28,
  totalJournalArticles: 20,
  totalConferencePapers: 8,
  totalCitations: 818,
  asOf: "2026",
  sourceNote:
    "Figures as stated on Dr. Naik Bukht's CV (818+ citations per Google Scholar / ResearchGate); the 28 individual publications above are listed in full."
};
