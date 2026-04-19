export interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  avatar?: string;
  initials: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
}

export const team: TeamMember[] = [
  {
    name: "Avinash Shrivastav",
    role: "Full-Stack Developer",
    bio: "Ships production React + Node apps at speed. 6+ yrs across fintech and e-commerce.",
    initials: "AS",
    avatar:
      "https://media.licdn.com/dms/image/v2/D5603AQFc4qMMkJ1A7g/profile-displayphoto-scale_400_400/B56ZpTyyQNHQAg-/0/1762342414854?e=1777507200&v=beta&t=iCioDjShJGYXcgoNekaqZzcfLyYJmHtFKv7VEE-Wqgg",
    linkedin: "#",
    github: "#",
  },
  {
    name: "Priya Patel",
    role: "UI / UX Designer",
    bio: "Turns research into wireframes into pixel-perfect Figma systems teams love.",
    initials: "PP",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Amit Kumar Yadav",
    role: "Frontend Developer",
    bio: "Performance-obsessed React specialist. Lighthouse 100s are the baseline.",
    initials: "AY",
    linkedin: "#",
    github: "#",
  },
  {
    name: "Sneha Gupta",
    role: "Backend Developer",
    bio: "APIs, databases, and auth done right. Node.js, Postgres, AWS.",
    initials: "SG",
    linkedin: "#",
    github: "#",
  },
  {
    name: "Aditya Kumar",
    role: "Mobile Developer",
    bio: "Cross-platform React Native for apps that feel native on both stores.",
    initials: "AK",
    linkedin: "#",
    github: "#",
  },
  {
    name: "Neha Joshi",
    role: "Project Manager",
    bio: "Your single point of contact. Keeps scope, timeline, and sanity on track.",
    initials: "NJ",
    linkedin: "#",
  },
];
