export const RELATIONSHIP_OPTIONS = [
  { label: "College", value: "College", points: 100, type: "Education", hidden: true },
  { label: "Professor", value: "Professor", points: 50, type: "Education" },
  { label: "Almuni", value: "Almuni", points: 10, type: "Education" },

  { label: "Employer", value: "Employer", points: 100, type: "Employment", hidden: true },
  { label: "Reporting Manager", value: "Reporting Manager", points: 10, type: "Employment" },
  { label: "Colleague", value: "Colleague", points: 10, type: "Employment" },

  { label: "Reporting Manager", value: "Reporting Manager", points: 10, type: "Skills" },
  { label: "Colleague", value: "Colleague", points: 10, type: "Skills" },

  { label: "Customer", value: "Customer", points: 100, type: "Projects", hidden: true },
  { label: "Reporting Manager", value: "Reporting Manager", points: 10, type: "Projects" },
  { label: "Colleague", value: "Colleague", points: 5, type: "Projects" },

  {
    label: "Training Organisation",
    value: "Training Organisation",
    points: 100,
    type: "Trainings",
    hidden: true
  },
  { label: "Trainer", value: "Trainer", points: 50, type: "Trainings" },

  { label: "Organisation", value: "Organisation", points: 100, type: "Awards", hidden: true },

  { label: "Organisation", value: "Organisation", points: 100, type: "Certifications", hidden: true }
];
