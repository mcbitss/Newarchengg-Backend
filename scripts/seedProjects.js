import { config } from "dotenv-safe";
import mongoose from "mongoose";
import path from "path";
import Project from "../src/api/projects/model";

config({
  path: path.join(__dirname, "../.env"),
  sample: path.join(__dirname, "../.env.example"),
  allowEmptyValues: true
});

const sampleProjects = [
  {
    title: "14 Unit Villa Complex",
    description:
      "A sophisticated residential development featuring 14 luxury villa units with modern architectural design and premium finishes. This project showcases contemporary Middle Eastern architecture with elegant proportions.",
    location: "Umm Suqeim 3rd",
    year: 2023,
    client: "Private Developer",
    category: "villa",
    image: "/assets/14 UNIT VILLA_UMM SUQEIM 3RD_3660497.jpeg",
    tags: ["residential", "villa", "luxury", "modern"],
    highlight: true
  },
  {
    title: "3-Unit Villa Development",
    description:
      "Contemporary villa complex with three units, featuring innovative design and sustainable building practices. Each villa offers spacious living areas and private gardens.",
    location: "Satwa",
    year: 2022,
    client: "Residential Developer",
    category: "villa",
    image: "/assets/3-UNIT VILLA_SATWA_3340459.jpeg",
    tags: ["residential", "villa", "sustainable"],
    highlight: true
  },
  {
    title: "3-Unit Villa Development - View 2",
    description:
      "Alternative perspective of the Satwa villa development, showcasing the elegant façade design and landscaping integration.",
    location: "Satwa",
    year: 2022,
    client: "Residential Developer",
    category: "villa",
    image: "/assets/3-UNIT VILLA_SATWA_3341512.jpeg",
    tags: ["residential", "villa"],
    highlight: false
  },
  {
    title: "G+1 Villa - Khawaneej",
    description:
      "Ground plus one villa design featuring modern architecture with traditional elements. Spacious interiors and premium finishes throughout.",
    location: "Khawaneej 2nd",
    year: 2021,
    client: "Private Owner",
    category: "villa",
    image: "/assets/G+1 VILLA_ KHWANEEJ 2ND_2822528.jpeg",
    tags: ["residential", "villa", "traditional"],
    highlight: true
  },
  {
    title: "G+1 Villa - Khawaneej View 2",
    description: "Secondary view of the Khawaneej villa showing the rear elevation and outdoor spaces.",
    location: "Khawaneej 2nd",
    year: 2021,
    client: "Private Owner",
    category: "villa",
    image: "/assets/G+1 VILLA_ KHWANEEJ 2ND_2822528 VIEW-2.jpeg",
    tags: ["residential", "villa"],
    highlight: false
  },
  {
    title: "G+1 Villa - Khawaneej Alternative",
    description:
      "Another perspective of the Khawaneej villa development showcasing the architectural diversity.",
    location: "Khawaneej 2nd",
    year: 2021,
    client: "Private Owner",
    category: "villa",
    image: "/assets/G+1 VILLA_ KHWANEEJ 2ND_2826836.jpeg",
    tags: ["residential", "villa"],
    highlight: false
  },
  {
    title: "G+2P+6 Residential Tower",
    description:
      "Modern residential tower with ground floor plus two parking levels and six residential floors. Features contemporary design with efficient space planning.",
    location: "Nad Al Sheba",
    year: 2023,
    client: "Property Group",
    category: "residential",
    image: "/assets/G+2P+6_NAD AL SHEBA_6185368_VIEW-1.jpeg",
    tags: ["residential", "tower", "apartments", "high-rise"],
    highlight: true
  },
  {
    title: "G+2P+6 Residential Tower - View 2",
    description:
      "Alternative view of the Nad Al Sheba residential tower showing the building's relationship to its surroundings.",
    location: "Nad Al Sheba",
    year: 2023,
    client: "Property Group",
    category: "residential",
    image: "/assets/G+2P+6_NAD AL SHEBA_6185368_VIEW-2.jpeg",
    tags: ["residential", "tower"],
    highlight: false
  },
  {
    title: "G+2P+8 Residential Building",
    description:
      "High-rise residential building with comprehensive parking facilities and modern amenities. Designed for optimal living comfort.",
    location: "Satwa",
    year: 2022,
    client: "Development Company",
    category: "residential",
    image: "/assets/G+2P+8 RES. BLDG_SATWA_3342745 VIEW-1.jpeg",
    tags: ["residential", "high-rise", "apartments"],
    highlight: true
  },
  {
    title: "G+2P+8 Residential Building - View 2",
    description: "Secondary elevation view of the Satwa residential building.",
    location: "Satwa",
    year: 2022,
    client: "Development Company",
    category: "residential",
    image: "/assets/G+2P+8 RES. BLDG_SATWA_3342745 VIEW-2.jpeg",
    tags: ["residential", "high-rise"],
    highlight: false
  },
  {
    title: "G+2P+8 Residential Building - View 3",
    description:
      "Third perspective of the Satwa residential building showing additional architectural details.",
    location: "Satwa",
    year: 2022,
    client: "Development Company",
    category: "residential",
    image: "/assets/G+2P+8 RES. BLDG_SATWA_3342745 VIEW-3.jpeg",
    tags: ["residential", "high-rise"],
    highlight: false
  },
  {
    title: "G+3 Residential Commercial",
    description:
      "Ground plus three floors combining residential and commercial spaces. Strategic location with excellent visibility.",
    location: "Satwa",
    year: 2021,
    client: "Mixed-Use Developer",
    category: "mixed",
    image: "/assets/G+3 RES COMM _ SATWA_3340480.jpeg",
    tags: ["residential", "commercial", "mixed-use"],
    highlight: true
  },
  {
    title: "G+M+1 Commercial Residential",
    description:
      "Ground floor with mezzanine plus one floor combining commercial and residential functions. Modern design with flexible space planning.",
    location: "Souq Al Kabeer",
    year: 2020,
    client: "Commercial Developer",
    category: "mixed",
    image: "/assets/G+M+1 COMM RESI _SOUQ AL KABEER_3120306.jpeg",
    tags: ["commercial", "residential", "mixed-use"],
    highlight: true
  },
  {
    title: "G+M+1 Muteena Development",
    description:
      "Ground plus mezzanine plus one floor development in Muteena area. Contemporary design with efficient space utilization.",
    location: "Muteena",
    year: 2020,
    client: "Property Developer",
    category: "residential",
    image: "/assets/G+M+1 Muteena_1230323.jpeg",
    tags: ["residential", "modern"],
    highlight: false
  },
  {
    title: "G+M+1 Residential Commercial",
    description:
      "Mixed-use development combining residential units with ground floor commercial spaces. Strategic design for maximum functionality.",
    location: "Souq Al Kabeer",
    year: 2020,
    client: "Mixed-Use Developer",
    category: "mixed",
    image: "/assets/G+M+1 RESI.COMM_SOUQ AL KABEER_3120370.jpeg",
    tags: ["residential", "commercial", "mixed-use"],
    highlight: true
  },
  {
    title: "G+M+2 Residential Commercial",
    description:
      "Ground plus mezzanine plus two floors of mixed-use development. Features modern architecture with efficient space planning.",
    location: "Souq Al Kabeer",
    year: 2019,
    client: "Development Group",
    category: "mixed",
    image: "/assets/G+M+2 RES COMM_SOUQ AL KABEER_3121447.jpeg",
    tags: ["residential", "commercial", "mixed-use"],
    highlight: false
  },
  {
    title: "G+M+2 Residential Commercial Alternative",
    description: "Alternative design approach for mixed-use development in Souq Al Kabeer area.",
    location: "Souq Al Kabeer",
    year: 2019,
    client: "Development Group",
    category: "mixed",
    image: "/assets/G+M+2 RESI COMM_SOUQ AL KABEER_3121085.jpeg",
    tags: ["residential", "commercial"],
    highlight: false
  },
  {
    title: "G+M+3 Residential Commercial",
    description:
      "Larger scale mixed-use development with ground, mezzanine, and three upper floors. Comprehensive design for residential and commercial use.",
    location: "Souq Al Kabeer",
    year: 2018,
    client: "Commercial Developer",
    category: "mixed",
    image: "/assets/G+M+3 RES.COMM_SOUQ AL KABEER_3120816.jpeg",
    tags: ["residential", "commercial", "mixed-use", "large-scale"],
    highlight: true
  },
  // Additional projects using project-XX.jpg files
  {
    title: "Luxury Residential Complex",
    description:
      "Premium residential development featuring high-end finishes and modern amenities. Designed for discerning clients seeking luxury living.",
    location: "Dubai",
    year: 2023,
    client: "Luxury Developer",
    category: "residential",
    image: "/assets/project-01.jpg",
    tags: ["residential", "luxury", "premium"],
    highlight: true
  },
  {
    title: "Modern Villa Collection",
    description:
      "Collection of contemporary villas featuring innovative design and sustainable building practices.",
    location: "Dubai",
    year: 2022,
    client: "Villa Developer",
    category: "villa",
    image: "/assets/project-02.jpg",
    tags: ["villa", "residential", "modern"],
    highlight: true
  },
  {
    title: "Commercial Tower Development",
    description: "State-of-the-art commercial tower with modern office spaces and retail facilities.",
    location: "Dubai",
    year: 2023,
    client: "Commercial Group",
    category: "commercial",
    image: "/assets/project-03.jpg",
    tags: ["commercial", "tower", "office"],
    highlight: false
  },
  {
    title: "Residential High-Rise",
    description: "Contemporary high-rise residential building with panoramic views and premium amenities.",
    location: "Dubai",
    year: 2022,
    client: "Residential Developer",
    category: "residential",
    image: "/assets/project-04.jpg",
    tags: ["residential", "high-rise", "apartments"],
    highlight: false
  },
  {
    title: "Mixed-Use Complex",
    description: "Comprehensive mixed-use development combining residential, commercial, and retail spaces.",
    location: "Dubai",
    year: 2023,
    client: "Mixed-Use Developer",
    category: "mixed",
    image: "/assets/project-05.jpg",
    tags: ["mixed-use", "residential", "commercial"],
    highlight: true
  },
  {
    title: "Luxury Villa Estate",
    description:
      "Exclusive villa estate featuring custom-designed homes with private gardens and premium finishes.",
    location: "Dubai",
    year: 2022,
    client: "Luxury Developer",
    category: "villa",
    image: "/assets/project-06.jpg",
    tags: ["villa", "luxury", "residential"],
    highlight: true
  },
  {
    title: "Modern Office Complex",
    description:
      "Contemporary office complex designed for modern businesses with flexible workspace solutions.",
    location: "Dubai",
    year: 2021,
    client: "Commercial Developer",
    category: "commercial",
    image: "/assets/project-07.jpg",
    tags: ["commercial", "office", "modern"],
    highlight: false
  },
  {
    title: "Residential Community",
    description: "Master-planned residential community with parks, amenities, and diverse housing options.",
    location: "Dubai",
    year: 2023,
    client: "Community Developer",
    category: "residential",
    image: "/assets/project-08.jpg",
    tags: ["residential", "community", "master-plan"],
    highlight: true
  },
  {
    title: "Commercial Plaza",
    description:
      "Modern commercial plaza featuring retail spaces, restaurants, and entertainment facilities.",
    location: "Dubai",
    year: 2022,
    client: "Retail Developer",
    category: "commercial",
    image: "/assets/project-09.jpg",
    tags: ["commercial", "retail", "plaza"],
    highlight: false
  },
  {
    title: "Luxury Apartment Tower",
    description: "Premium apartment tower offering luxury living with world-class amenities and services.",
    location: "Dubai",
    year: 2023,
    client: "Luxury Developer",
    category: "residential",
    image: "/assets/project-10.jpg",
    tags: ["residential", "luxury", "apartments"],
    highlight: true
  },
  {
    title: "Modern Development",
    description:
      "Contemporary development showcasing innovative architecture and sustainable design principles.",
    location: "Dubai",
    year: 2022,
    client: "Development Company",
    category: "mixed",
    image: "/assets/project-11.jpg",
    tags: ["mixed-use", "modern", "sustainable"],
    highlight: false
  }
];

const seed = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI is required in .env file");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing projects
    await Project.deleteMany({});
    console.log("🗑️  Cleared existing projects");

    // Insert sample projects
    const projects = await Project.insertMany(sampleProjects);
    console.log(`✅ Seeded ${projects.length} projects`);
    console.log(`   - Featured projects: ${projects.filter((p) => p.highlight).length}`);
    console.log(`   - Villas: ${projects.filter((p) => p.category === "villa").length}`);
    console.log(`   - Residential: ${projects.filter((p) => p.category === "residential").length}`);
    console.log(`   - Commercial: ${projects.filter((p) => p.category === "commercial").length}`);
    console.log(`   - Mixed-use: ${projects.filter((p) => p.category === "mixed").length}`);

    await mongoose.disconnect();
    console.log("✅ Database seeding completed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seed();
