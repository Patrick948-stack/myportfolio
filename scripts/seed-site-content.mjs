import { fileURLToPath } from "url";
import path from "path";
import { Client } from "pg";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
const projectDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
loadEnvConfig(projectDir);

// Today's real, hardcoded content — seeded once so the site looks identical
// right after migrating. `ON CONFLICT (key) DO NOTHING` makes this safe to
// re-run without clobbering anything you've already edited from /admin.
const seed = {
  hero: {
    titles: [
      "Software Engineer",
      "Computer Vision Engineer",
      "Full Stack Developer",
      "AI Systems Builder",
      "Physics Research Assistant",
      "Mechanical Engineer",
    ],
    headline:
      "Just a student who enjoys exploring the boundaries of his creativity with technology.",
    subtitle:
      "Hi, I'm Patrick. I love learning new tech and building solutions that address problems I face in my daily life. I am always on the lookout for a new technological challenge, a project that pushes me to my limits, a product that will make others' lives easier.",
  },

  about: {
    photo: "/images/user.png",
    bio: [
      "My name is Patrick, and I'm passionate about technology. Ever since I was introduced to coding, I've been exploring areas ranging from data visualization to machine learning. What I love most about computer science is the sense of creative and problem-solving empowerment it offers—the feeling that, with enough discipline and curiosity, you can build almost anything by learning the right skills.",
      "My background includes coursework in computer science at Whitman College—including Introduction to Computational Problem Solving, Data Structures and Algorithms, Discrete Mathematics, and Computer Systems Fundamentals (upcoming)—along with additional training through Frontend Masters' Complete Intro to Web Development v3 and FreeCodeCamp's JavaScript curriculum. Beyond coursework, I work as a physics research assistant building instrumentation software for Whitman's ESPI lab, and freelance as a software engineer building web apps for outside clients.",
      "I am also actively involved in student leadership as a board member and marketing director of Whitman's ACM chapter and as Secretary of SACNAS. I also won second place at Whitman's Spring 2025 Hackathon with the Whitman AI project, an AI chatbot specifically trained to answer questions about Whitman College.",
    ],
    skills: [
      {
        category: "Languages",
        iconKey: "code",
        items: ["Python", "Java", "C/C++", "JavaScript", "HTML/CSS", "Haskell"],
      },
      {
        category: "Frameworks & Libraries",
        iconKey: "cubes",
        items: [
          "React", "Flask", "Node.js", "Streamlit", "NumPy", "OpenCV", "PyQt5", "Plotly.js", "pytest",
        ],
      },
      {
        category: "Developer Tools & Platforms",
        iconKey: "tools",
        items: [
          "Git", "GitHub", "VS Code", "Linux/Bash", "Google Colab", "Arduino IDE", "PyVISA (SCPI)", "Zadig", "Vimba",
        ],
      },
      {
        category: "APIs & AI/Cloud Services",
        iconKey: "cloud",
        items: [
          "Groq API", "OpenRouter", "Slack Bolt", "Supabase (PostgreSQL)", "LangGraph", "Astroquery API", "Fetch API", "Formspree",
        ],
      },
      {
        category: "Concepts",
        iconKey: "concepts",
        items: [
          "REST APIs", "OOP", "Multi-Agent Systems", "NLP/NER", "CI/CD", "Data Structures & Algorithms", "Computer Vision", "Embedded Systems (BLE)",
        ],
      },
      {
        category: "Soft Skills",
        iconKey: "people",
        items: [
          "Mentoring & Tutoring", "Cross-Cultural Communication", "Public Speaking", "Event Planning & Coordination", "Technical Writing", "Team Leadership",
        ],
      },
      {
        category: "Spoken Languages",
        iconKey: "language",
        items: ["English (Fluent)", "French (Fluent)", "Swahili (Native)"],
      },
      {
        category: "Certifications",
        iconKey: "certificate",
        items: ["UR2PhD Undergraduate Research Training Course Certificate"],
      },
    ],
    experiences: [
      {
        period: "May 2026 – Present",
        role: "Physics Research Assistant",
        org: "Hoffman Physics Research Lab, Whitman College",
        description:
          "Replaced the lab's proprietary LabVIEW setup for an Electronic Speckle Pattern Interferometry experiment with a cross-platform Python app, which saved the lab a real licensing cost. Wrote the camera-control layer over PyVISA and SCPI so it works with any UVC webcam or industrial machine-vision camera — Basler, Allied Vision, whatever's on hand — instead of locking the experiment to one brand. Also built a real-time vibration-imaging tool with automated frequency sweeps, live frame subtraction for finding vibration nodes, and live intensity plots, all wrapped in a PyQt5 interface other people in the lab can actually use without me explaining it every time.",
      },
      {
        period: "Nov 2025 – Present",
        role: "Freelance Software Engineer",
        org: "Ackerman Media",
        description:
          "Built a portfolio site from scratch in vanilla JavaScript, HTML, and CSS — no framework — and made sure it actually holds up across desktop, tablet, and phone. Added a typewriter effect, scroll-triggered content reveals, and a hover-controlled video panel using the YouTube IFrame API, plus a contact form wired to Formspree over the Fetch API so there's no backend to maintain.",
      },
      {
        period: "Nov 2025 – Dec 2025",
        role: "Student Data Visualizer",
        org: "Whitman College Immersive Stories Lab",
        description:
          "Turned raw CSV datasets — climate change, Mount Everest, Mount Kilimanjaro — into interactive 2D and 3D visualizations with JavaScript and Plotly.js. The climate-change pieces were picked for future deployment in the lab's CAVE, an immersive room-scale display.",
      },
      {
        period: "Sept 2025 – Present",
        role: "Board Member",
        org: "Association for Computing Machinery (ACM), Whitman College",
        description:
          "Run sessions on the practical stuff that actually helps with job hunting — setting up GitHub properly, building a portfolio, tightening a résumé. Sit on a 7-person team that plans each semester's programming, and handle most of the Canva graphics and Instagram posts that get people to show up.",
      },
      {
        period: "Sept 2025 – Dec 2025",
        role: "Undergraduate Language Assistant",
        org: "Whitman French Department",
        description:
          "Ran weekly French conversation sessions for intermediate and advanced students, designing activities meant to get people actually talking instead of reciting grammar rules. Helped with pronunciation and syntax one-on-one, in a setting where getting something wrong out loud wasn't a big deal.",
      },
      {
        period: "Feb 2025 – Present",
        role: "Community Outreach Coordinator",
        org: "SACNAS Whitman Chapter",
        description:
          "Run workshops and tabling sessions on undergraduate research and conference funding — a few students have used them to land research spots and travel scholarships since. Also design the club's posters and Instagram content, which has made these resources easier for people to actually find.",
      },
      {
        period: "Feb 2025 – Present",
        role: "Marketing Writer",
        org: "Whitman Office of Communications",
        description:
          "Write student blog posts, Whitman Today articles, and magazine features about campus life — usually starting with an interview (over 30 so far) and turning that conversation into something worth reading. Work with the managing editor on story ideas: alumni profiles, event coverage, that kind of thing.",
      },
      {
        period: "Dec 2024 – Present",
        role: "Student Career Advisor",
        org: "CCEC, Whitman College",
        description:
          "Meet one-on-one with students to go over résumés, cover letters, and interview prep. Help run tabling events and drop-in sessions alongside five other advisors, and show up for the weekly meetings where we actually plan the program.",
      },
      {
        period: "Jan 2023 – May 2024",
        role: "Project Manager",
        org: "Rotary Club, Arusha, Tanzania",
        description:
          "Put together the posters and outreach emails that pulled in over 15 teams for a fundraising football tournament, raising over $500 for children with disabilities. Led a 10-person team from six different countries on a recycling project — mostly a lesson in coordinating across schedules and communication styles.",
      },
      {
        period: "Sept 2022 – Present",
        role: "Academic Tutor",
        org: "UWC & Whitman Academic Resource Center",
        description:
          "Tutor French at every level, Calculus I through III, and intro CS, adjusting explanations to whatever actually clicks for each student. Still mentor a few people at the college level — mostly walking through tough assignments and putting together review materials before exams.",
      },
    ],
    educations: [
      {
        year: "May 2024",
        institution: "United World College (UWC) East Africa",
        location: "Arusha Campus, Tanzania",
        degree: "IB Diploma",
      },
      {
        year: "May 2028",
        institution: "Whitman College",
        location: "Walla Walla, WA USA",
        degree: "Bachelor of Arts in Computer Science and Physics Pre-engineering",
      },
    ],
  },

  services: {
    items: [
      {
        iconKey: "flask",
        title: "Research",
        description:
          "Whenever I run into a question that a quick search cannot answer, I go looking for the papers on it. That is one of the things that draws me toward research: the chance to read what people who have spent years on a problem actually found, learn from experts across fields I have never touched, and help push the edge of what is known even a little further. Between studying AI bias, working on physics research in the lab, and writing a full research proposal for a multi-agent fact-checking astronomy paper system, I have gotten comfortable with the whole process, from framing a question worth asking to designing a study that can actually answer it.",
        extra:
          "I've familiarized myself with Consensus, Google Scholar, Web of Science, PubMed, arXiv, and Zotero for finding, tracking, and organizing sources.",
        ctaLabel: "Read more of my writing",
        ctaHref: "/blog",
      },
      {
        iconKey: "code",
        title: "App Development",
        description:
          "I am always building something. A portfolio for a friend, a script to fix an issue I and many people I know often run into, an app to fix a problem a friend mentioned in passing. I love designing systems that serve real needs and make people's lives a little easier.",
        stack: ["Python", "JavaScript", "React", "Flask", "Node.js"],
        ctaLabel: "Let's connect",
        ctaHref: "#contact",
      },
      {
        iconKey: "microchip",
        title: "Embedded Systems",
        description:
          "This is a large part of why I moved into a mechanical engineering degree at Lehigh. I wanted to go beyond code and get closer to systems that live in the physical world, things you can actually reach out and touch. I like learning how code ends up controlling a real machine, and just as much, I like learning how to build the machine itself. Whether it is designing a new piece of hardware, embedding a tool into a larger system, or writing the software that runs it, I want in.",
        stack: ["Arduino", "C & C++", "PyVISA", "Pypylon", "SCPI", "Embedded Systems"],
        ctaLabel: "Let's connect",
        ctaHref: "#contact",
      },
    ],
  },

  portfolio: {
    items: [
      {
        id: "gpa-visualizer",
        title: "GPA Visualizer & Certificate Generator",
        description:
          "A two-part interactive Python program that helps students understand their semester performance. It generates Matplotlib pie and bar charts showing each course's contribution to the overall GPA, and creates a personalized certificate using Turtle graphics.",
        image: "/images/work-1.png",
        href: "https://github.com/Patrick948-stack/GPA-Visualizer-Certificate-Generator-Python-",
      },
      {
        id: "mount-everest",
        title: "3D Elevation Plot of Mount Everest",
        description:
          "An application of Plotly.js that demonstrates JavaScript's incredible ability to make 3D maps. Based on CSV elevation data, I created a fully interactive 3D map of Mount Everest.",
        image: "/images/work-2.png",
        href: "https://github.com/Patrick948-stack/-3D-Elevation-Plot-Mount-Kilimanjaro-JavaScript-Plotly.js-",
      },
      {
        id: "racial-bias-research",
        title: "Analysing Racial Bias in ML Image Captioning Models",
        description:
          "A research study conducted under the supervision of Whitman Professor Sacchintha Pitigala analyzing racial bias in post-GPT image captioning machine learning models.",
        image: "/images/work-3.png",
        href: "#",
      },
      {
        id: "adrian-portfolio",
        title: "Adrian Ackerman — Portfolio",
        description:
          "A personal portfolio website for Adrian Ackerman, a media professional in video production, photography, and content strategy. Built from a tutorial base and customized with an original animated experience section.",
        image: "/images/work-adrian-portfolio.png",
        href: "https://patrick948-stack.github.io/adrian-portfolio/",
      },
      {
        id: "door-sensor",
        title: "CS Commons Door Sensor",
        description:
          "An ESP32-S3 security sensor for a college CS commons room. Averages HC-SR04 ultrasonic readings against a calibrated baseline to catch doorway movement, plays an alert over I2S, and pushes numbered notifications to a paired phone over Bluetooth LE — re-advertising automatically if the connection drops.",
        image: "/images/work-door-sensor.png",
        href: "https://github.com/Patrick948-stack/cs-commons-door-sensor",
      },
      {
        id: "espi-vibration",
        title: "ESPI Plate Vibration Analysis — Whitman College",
        description:
          "A cross-platform Python replacement for the lab's proprietary LabVIEW setup, built to study how violin and viola plates vibrate. Controls any UVC or industrial machine-vision camera over PyVISA/SCPI, runs automated frequency sweeps, and shows live vibration nodes and intensity plots in a PyQt5 desktop app. An active, ongoing research project.",
        image: "/images/work-espi-vibration.png",
        href: "https://github.com/Patrick948-stack/espi-plate-vibration",
      },
      {
        id: "rose-portfolio",
        title: "Rosemary Mbao — Personal Portfolio",
        description:
          "A portfolio site for Rosemary Mbao, a student journalist and broadcast reporter at Northwestern University. Also my first React project — a learning milestone and a token of appreciation for a close friend.",
        image: "/images/work-rose-portfolio.png",
        href: "https://github.com/Patrick948-stack/rose-portfolio",
      },
      {
        id: "compass",
        title: "Compass — Your University in Slack",
        description:
          "A Slack-native academic support agent built with Node.js, Slack Bolt, the Groq API, and a Supabase/PostgreSQL backend. Routes student questions to the right campus resource through a Block Kit interface, instead of another form nobody fills out.",
        image: "/images/work-compass-slack.png",
        href: "https://github.com/Patrick948-stack/compass-slack-agent",
      },
      {
        id: "duckpath",
        title: "DuckPath",
        description:
          "A skill-roadmap tool built for the \"Build the Future With AI\" Hackathon — it pulls live job postings from the JSearch API and runs them through a Groq/OpenRouter-hosted Llama 3.3 70B model to map out what to learn next. A shared LLM client and Streamlit's caching keep it fast and cheap to run, and the role-matching logic is backed by pytest coverage across every core module.",
        href: "#",
      },
    ],
  },

  contact: {
    email: "patrickmulikuza948@gmail.com",
    phone: "+1 509 360 4942",
    social: [
      { label: "facebook", href: "https://www.facebook.com/profile.php?id=61571321560223" },
      { label: "twitter", href: "" },
      { label: "instagram", href: "https://www.instagram.com/patrickmuliks/" },
      { label: "linkedin", href: "https://www.linkedin.com/in/mulikuzap/" },
    ],
  },

  writing: {
    title: "Latest Writing",
    subtitle: "Notes on physics, data visualization, and AI research.",
  },
};

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL is not set. Add it to .env.local first.");
    process.exit(1);
  }

  const client = new Client({
    connectionString,
    ssl: connectionString.includes("sslmode=disable") ? false : { rejectUnauthorized: false },
  });

  await client.connect();
  try {
    for (const [key, data] of Object.entries(seed)) {
      const result = await client.query(
        `insert into site_content (key, data) values ($1, $2)
         on conflict (key) do nothing
         returning key`,
        [key, JSON.stringify(data)]
      );
      console.log(
        result.rows.length > 0
          ? `Seeded "${key}".`
          : `Skipped "${key}" — already has content.`
      );
    }
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
