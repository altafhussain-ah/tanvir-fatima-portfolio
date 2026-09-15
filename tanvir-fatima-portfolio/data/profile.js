/**
 * profile.js
 * -----------------------------------------------------------------------
 * Core profile information for Dr. Tanvir Fatima Naik Bukht.
 * Edit the values below to update the site. See README.md, section
 * "How to update profile information" for a full walkthrough.
 *
 * Source: her own CV (CV_Tanvir_Fatima_Naik_Bukht_Updated.docx) and
 * publications list, supplied directly by the site owner, cross-checked
 * against her Google Scholar and dblp profiles. Any field still marked
 * "[Information to be added]" was not present in the supplied documents.
 * -----------------------------------------------------------------------
 */

const PROFILE = {
  fullName: "Dr. Tanvir Fatima Naik Bukht",
  shortName: "Dr. Tanvir Fatima",
  credentials: "Ph.D. (Computer Science)",
  headline: "Computer Vision & Deep Learning Researcher",
  designation: "Lecturer",
  department: "Department of Computer Games Development (CGD), Faculty of Computing & Artificial Intelligence",
  institution: "Air University, Islamabad, Pakistan",
  location: "Islamabad, Pakistan",
  languages: "English, Urdu",

  // Short professional introduction shown in the Hero section.
  introduction:
    "Dr. Tanvir Fatima Naik Bukht is a Lecturer in the Department of Computer Games Development, Faculty of Computing & Artificial Intelligence at Air University, Islamabad, and holds a Ph.D. in Computer Science from Air University. Her research spans computer vision, human activity and interaction recognition, medical image analysis, cybersecurity, and IoT — with 20 journal articles and 8 conference papers cited over 818 times.",

  // Full biography for the About section.
  biography: [
    "Dr. Tanvir Fatima Naik Bukht is a Lecturer in the Department of Computer Games Development (CGD), Faculty of Computing & Artificial Intelligence at Air University, Islamabad, and holds a Ph.D. in Computer Science from Air University (completed May 2026). Her research sits at the intersection of computer vision, deep learning, cybersecurity, IoT, and image processing — fields that shape how intelligent systems interpret human behaviour and protect digital infrastructure.",
    "Her publication record spans human activity and interaction recognition, medical image analysis, sensor and data fusion, and applied machine learning, with 20 peer-reviewed journal articles and 8 conference papers published between 2019 and 2026, cited more than 818 times according to Google Scholar and ResearchGate. A central line of her work develops deep convolutional neural networks, skeleton-based models, feature-fusion pipelines, and — in her most recent work — quantum-enhanced CNN architectures for recognising human actions and interactions from video and sensor data.",
    "Alongside this, she has contributed to medical image analysis — including deep learning approaches for breast cancer diagnosis from mammographic images and segmentation of liver and tumour tissue in CT and MRI scans — and to applied cybersecurity research, including analyses of DDoS attacks and cyber-attacks targeting Pakistan's banking sector. Her background also includes IoT-based detection systems, dataset development, and benchmarking of deep neural network architectures.",
    "Before joining Air University, she worked as an Instructor and Exam Coordinator at the Federal Urdu University of Arts, Science & Technology, Islamabad, as a Head Teacher at a government elementary school in Muzaffargarh, and as an IT Administrator for the Tehsil Municipal Committee, Muzaffargarh — experience that spans classroom teaching, academic administration, and hands-on IT infrastructure work alongside her research career.",
    "She holds professional certifications spanning network security and cybersecurity operations (Cisco Networking Academy, the International Cybersecurity Institute, and Virtual University of Pakistan) and artificial intelligence (Huawei's HCIA-AI), and continues to publish actively — her most recent work extends into quantum-integrated deep learning frameworks for human activity and object recognition."
  ],

  // Buttons in the hero section.
  heroButtons: {
    primary: { label: "Explore My Research", href: "#research" },
    secondary: { label: "Download CV", href: "assets/cv/Dr-Tanvir-Fatima-Naik-Bukht-CV.pdf" }
  },

  // Profile photograph.
  photo: {
    src: "assets/images/profile-photo.png",
    alt: "Dr. Tanvir Fatima Naik Bukht",
    isPlaceholder: false
  },

  // Meta / SEO
  seo: {
    title: "Dr. Tanvir Fatima Naik Bukht | Academic & Researcher",
    description:
      "Official academic portfolio of Dr. Tanvir Fatima Naik Bukht, Lecturer in the Department of Computer Games Development, Faculty of Computing & Artificial Intelligence at Air University, Islamabad — specialising in computer vision, human activity recognition, medical image analysis, and cybersecurity.",
    keywords:
      "Tanvir Fatima Naik Bukht, Air University, Computer Games Development, Faculty of Computing and Artificial Intelligence, human activity recognition, computer vision researcher, deep learning, medical image analysis, cybersecurity research, Pakistan academic portfolio",
    ogImage: "assets/images/profile-photo.png",
    siteUrl: "https://www.example.com/"
  },

  // Contact — only publicly appropriate details. A personal mobile number
  // appears on her CV but is intentionally left off this public-facing
  // page; add it here only if she wants it published openly.
  contact: {
    email: "fatimaishtiaq7@gmail.com",
    institutionAddress: "Air University, E-9, Islamabad, Pakistan",
    office: "FCAI Building, 5th Floor, CGD Office"
  },

  // Verified public profile / academic links only. Empty string = not
  // publicly confirmed; the site hides links with an empty href.
  socialLinks: {
    linkedin: "https://www.linkedin.com/in/tanvirfatimanaikbukht/",
    googleScholar: "https://scholar.google.com/citations?hl=en&user=QIKqYG8AAAAJ",
    researchGate: "https://www.researchgate.net/profile/Tanvir-Fatima-Naik-Bukht",
    academiaEdu: "https://independent.academia.edu/tanvirfatimanaikbukht",
    dblp: "https://dblp.org/pid/345/1223.html",
    universityProfile: "https://webdata.au.edu.pk/Pages/Faculties/FCAI/Departments/CGD/FacultyDetail.aspx?fid=2621",
    orcid: "",
    github: ""
  }
};
