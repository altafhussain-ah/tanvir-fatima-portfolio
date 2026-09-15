/**
 * research.js
 * -----------------------------------------------------------------------
 * Research areas, derived from her CV's research summary and cross-
 * checked against the full verified publication list in publications.js.
 * -----------------------------------------------------------------------
 */

const RESEARCH_AREAS = [
  {
    icon: "activity",
    title: "Human Activity & Interaction Recognition",
    description:
      "Deep learning and hybrid models — CNNs, HMMs, skeleton-based models, feature-fusion pipelines, and quantum-enhanced architectures — for recognising human actions and interactions from video and sensor data.",
    keywords: ["Human Activity Recognition", "Interaction Recognition", "CNNs", "HMM", "Skeleton Models", "Feature Fusion"],
    relatedPublicationIds: ["j1", "j2", "j3", "j4", "j5", "j6", "j8", "j11", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8"]
  },
  {
    icon: "brain",
    title: "Computer Vision & Deep Learning",
    description:
      "Applied computer vision research using convolutional neural networks and emerging quantum-integrated deep learning frameworks for visual recognition tasks, including demographic feature classification.",
    keywords: ["Computer Vision", "Deep Learning", "Quantum-Enhanced CNNs", "Object Detection"],
    relatedPublicationIds: ["j1", "j6", "j20"]
  },
  {
    icon: "medical",
    title: "Medical Image Analysis",
    description:
      "Deep learning approaches applied to diagnostic imaging, including breast cancer diagnosis from mammographic images and liver/tumour segmentation in CT and MRI scans using ResUNet-based ensemble models.",
    keywords: ["Medical Imaging", "Breast Cancer Diagnosis", "Tumor Segmentation", "ResUNet", "Deep CNNs"],
    relatedPublicationIds: ["j7", "j12", "j13"]
  },
  {
    icon: "shield",
    title: "Cybersecurity & Network Security",
    description:
      "Research on cybersecurity threats and defences, including DDoS attack analysis, cyber-attacks on the banking sector, and network security fundamentals — complemented by professional certifications in network security and cybersecurity operations.",
    keywords: ["Cyber Security", "DDoS", "Network Security", "Banking Sector Threats", "Federated Learning"],
    relatedPublicationIds: ["j9", "j14", "j16", "j17", "j18"]
  },
  {
    icon: "network",
    title: "Internet of Things (IoT)",
    description:
      "Applied IoT research, including sensor-based systems for COVID-19 detection and alerting, and plant disease identification.",
    keywords: ["IoT", "Sensor Systems", "Applied AI", "Federated Learning"],
    relatedPublicationIds: ["j9", "j15", "j19"]
  }
];
