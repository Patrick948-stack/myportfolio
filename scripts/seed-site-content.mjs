import { fileURLToPath } from "url";
import path from "path";
import { Client } from "pg";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
const projectDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
loadEnvConfig(projectDir);

// Stable per-project todo ids (t1, t2, ...) are fine here since this seed
// only ever runs once per key (ON CONFLICT DO NOTHING) — no need for real UUIDs.
function todos(items) {
  return items.map((text, i) => ({ id: `t${i + 1}`, text, done: false }));
}

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

  comingNext: {
    items: [
      {
        id: "intellectual-deep-dive-platform",
        name: "Intellectual Deep-Dive Platform",
        needBehind:
          "I want a place to show how my thinking on a topic evolves across books, papers, podcasts, and articles — not just track ratings like Goodreads or Letterboxd do.",
        description:
          "I'm building a social app where the core unit is a themed \"collection\" (deep dive) holding items (books/papers/podcasts/articles), each with my own timestamped notes, plus a follow-based social feed.",
        techStack: ["Next.js", "React", "Supabase (auth, Postgres, storage)", "Tailwind CSS"],
        todos: todos([
          "I finalize the DB schema (collections, items, notes tables + relations)",
          "I set up my Supabase project + auth",
          "I scaffold the Next.js app + Tailwind config",
          "I build collection CRUD (create/edit/delete, public/private toggle)",
          "I build item CRUD within a collection (type, status, metadata)",
          "I build notes CRUD per item",
          "I build the follow system",
          "I build the social feed",
          "I build the user profile page",
          "I add cover image upload for collections",
          "I do a UI/UX polish pass",
          "I deploy the MVP",
          "I get 5–10 test users and collect feedback",
          "I iterate on the core loop before adding AI features",
        ]),
      },
      {
        id: "ai-reading-companion",
        name: "AI Reading Companion (book reader app)",
        needBehind:
          "I want an AI-powered EPUB/PDF reader that can answer questions, summarize, and track characters — without spoiling plot points I haven't reached yet.",
        description:
          "I'm building a reader app with spoiler-safe AI Q&A (scoped to my reading progress), chapter summaries, a progressive character dashboard, and a built-in dictionary/vocab + quote saving system.",
        techStack: ["Lovable", "Supabase + pgvector", "EPUB/PDF parsing pipeline"],
        todos: todos([
          "I finalize my full Lovable build prompt",
          "I build the EPUB parser",
          "I build the PDF parser",
          "I set up the Supabase schema",
          "I implement reading progress tracking",
          "I build the library/bookshelf view",
          "I build reader display settings",
          "I set up the pgvector embeddings pipeline per chapter",
          "I implement the spoiler-safe retrieval filter",
          "I build the AI Q&A feature",
          "I build the chapter summary generator",
          "I build progressive character extraction + dashboard",
          "I build vocabulary saving + definitions",
          "I build quote/phrase saving",
          "I add vocab export to CSV/Anki",
          "I QA the spoiler-safety logic",
          "I launch the MVP with a few test books",
        ]),
      },
      {
        id: "internship-alert-capture-app",
        name: "Internship Alert Capture App",
        needBehind:
          "I keep seeing internship opportunities in short-form social videos and forgetting about them — I want an Osta-style import pipeline for internships.",
        description:
          "I'm building an app that ingests a shared social post/video, transcribes it, extracts structured internship details, and sets reminders.",
        techStack: ["Expo/React Native", "yt-dlp", "faster-whisper", "LLM API", "Supabase"],
        todos: todos([
          "I define the data schema for opportunities",
          "I set up my Supabase project",
          "I scaffold the Expo/React Native shell",
          "I build the share-sheet intake",
          "I implement the yt-dlp scraping service",
          "I integrate faster-whisper transcription",
          "I build the LLM extraction prompt",
          "I wire the extraction pipeline end-to-end",
          "I build the saved-opportunities list UI",
          "I implement deadline reminder notifications",
          "I add manual edit/correction for extracted fields",
          "I test the pipeline against real posts for accuracy",
          "I polish and ship the MVP to my own phone",
        ]),
      },
      {
        id: "career-prep-roadmap-app",
        name: "Career Prep Roadmap App",
        needBehind:
          "I want a tool that shows exactly what skills recruiters look for in a target role and points to free ways to build them, instead of vague advice.",
        description:
          "I'm building an app where a user types a target role and gets real job-posting-derived skills, curated free resources, project ideas, alternate proof-of-work paths, matched job simulations, and interview prep.",
        techStack: ["Streamlit", "Python", "job-posting API/search", "LLM API", "curated Python dictionaries"],
        todos: todos([
          "I define the full roadmap phases",
          "I build the base `LEARNING_RESOURCES` dictionary structure",
          "I build the job-posting fetch/search integration",
          "I build the skill-extraction LLM call",
          "I build the resource-matching logic",
          "I build the \"not yet curated\" fallback message",
          "I build the AI project-idea generator",
          "I build the static practice-resources dictionary",
          "I wire the job-simulation matching",
          "I build the networking/outreach guidance layer",
          "I build the Streamlit UI",
          "I set up the GitHub repo + branch protection",
          "I split remaining tasks with my collaborator",
          "I run an internal test with 2–3 sample roles",
          "I polish the UI and ship for the hackathon/demo",
        ]),
      },
      {
        id: "cs-learning-resources-agent",
        name: "CS Learning Resources Agent",
        needBehind:
          "Beginners don't know which specific, free, high-quality resource to use for a given skill — I want to solve that with a curated backend.",
        description:
          "I'm building the engine behind the career prep app: a deeply enriched dictionary of learning resources per skill, plus role-based job/interview simulation matching.",
        techStack: ["Python", "collaborative Git workflow"],
        todos: todos([
          "I build the initial flat `LEARNING_RESOURCES` dictionary",
          "I restructure it into the nested format",
          "I enrich all skill entries with the full field set",
          "I expand the `_ALIASES` dictionary",
          "I write the `JOB_SIMULATIONS` and `INTERVIEW_SIMULATORS` dictionaries",
          "I implement the `_match_role()` helper",
          "I implement `get_simulations()`",
          "I fix the `_ROLE_KEYWORDS` false-positive risk",
          "I add the remaining roles (data/analytics, consulting/corporate)",
          "I verify all simulation/interview links are live",
          "I write unit tests for the matching logic",
          "I integrate the module into the main Streamlit app",
          "I run a full end-to-end test across all skill/role combos",
        ]),
      },
      {
        id: "astro-agent",
        name: "Astro-Agent",
        needBehind:
          "I want to bridge unstructured astronomy literature and structured celestial catalogs as part of my independent-study-style research with Sita, under my supervisor.",
        description:
          "I'm building a multi-agent framework that extracts celestial objects and physical parameters from astrophysics papers, then verifies claims against SIMBAD, Gaia, and NED.",
        techStack: [
          "AstroBERT/NER models",
          "LLMs",
          "LangGraph",
          "Astroquery API",
          "Label Studio",
          "Gradio/Hugging Face Spaces",
        ],
        todos: todos([
          "I write the project abstract and scope",
          "I build the full learning roadmap",
          "I learn neural network/BERT foundations",
          "I learn NER and token classification concepts",
          "I set up Label Studio and annotate initial training data",
          "I fine-tune AstroBERT on the annotated data",
          "I build the Astroquery integration (SIMBAD, Gaia, NED)",
          "I implement the sigma statistical test and Astropy units",
          "I design the 4-agent LangGraph pipeline",
          "I integrate the Anthropic API with hallucination-prevention prompting",
          "I build per-agent unit tests",
          "I test on a sample batch of real papers",
          "I refine the conflict-flagging logic",
          "I deploy a demo via Gradio on Hugging Face Spaces",
          "I write up results for my supervisor",
        ]),
      },
      {
        id: "karibu-ai-study-abroad-advisor",
        name: "Karibu — AI Study Abroad Advisor",
        needBehind:
          "Students in developing nations, starting with Francophone Africa, have academic ambition but no institutional counseling to navigate international admissions and scholarships — I want to build something reliable and real.",
        description:
          "I'm building a free, multilingual AI agent that turns \"I want to study X abroad\" into a reliable, saveable roadmap: schools, funding, deadlines, and a to-do list.",
        techStack: [
          "Next.js + TypeScript",
          "FastAPI",
          "Anthropic API",
          "Postgres",
          "Supabase + pgvector",
          "Render/Fly.io",
        ],
        todos: todos([
          "I write the full product spec",
          "I resolve engineering gaps (privacy, cost controls, PDF gen, eval harness)",
          "I design the 4-agent architecture (Intake → Planner → Verifier → Writer + Librarian)",
          "I write the full tech-by-tech learning roadmap",
          "I learn Next.js/TypeScript",
          "I learn FastAPI",
          "I learn the Anthropic API and forced tool use",
          "I set up Postgres + Supabase with RLS",
          "I set up pgvector for source retrieval",
          "I build the Librarian offline job",
          "I build the Intake agent",
          "I build the Planner agent",
          "I build the Verifier agent",
          "I build the Writer agent",
          "I implement the anonymous ID persistence model",
          "I build PDF export of the roadmap",
          "I build the pre-launch eval harness",
          "I deploy the MVP",
          "I test with a real Francophone African student",
          "I launch v1 publicly",
        ]),
      },
      {
        id: "book-companion",
        name: "Book Companion",
        needBehind:
          "I read a lot, and I always wish the book could talk back. Half the time I'm looking up a word, trying to remember who a character is, or wanting a quick recap of what happened three chapters ago instead of flipping back.",
        description:
          "A web app for reading books — epubs and PDFs — with an AI built in that can answer questions about what you're reading, give you chapter summaries, and keep a live characters dashboard so you never lose track of who's who. It also has a built-in dictionary: highlight a word or phrase you want to learn or remember, save it, and build your own vocabulary list as you read.",
        techStack: [
          "React + Vite",
          "Tailwind",
          "epub.js / pdf.js for rendering",
          "Claude API for Q&A and summarization",
          "Postgres for user libraries and saved words",
        ],
        todos: todos([
          "Epub/PDF renderer and reading UI",
          "AI chat panel scoped to book content",
          "Chapter summary generation",
          "Live character dashboard",
          "Built-in dictionary + save-word flow",
          "Vocabulary list view with review mode",
        ]),
      },
      {
        id: "ai-course-platform",
        name: "AI Course Platform",
        needBehind:
          "Online courses are usually one-directional — video, quiz, move on. I want something that actually teaches back, like a real tutor sitting across from you.",
        description:
          "An online course platform with an AI built in that grades your work, gives feedback, and explains content in a video-call conversational format — like actually talking to a tutor instead of reading a wall of text.",
        techStack: [
          "React + Vite",
          "Tailwind",
          "Claude API for grading/feedback",
          "real-time voice/video pipeline (WebRTC + TTS/STT)",
          "Postgres for course + progress data",
        ],
        todos: todos([
          "Course/lesson structure and content upload",
          "AI grading pipeline",
          "Feedback generation",
          "Conversational video-call explain mode",
          "Student progress tracking",
        ]),
      },
      {
        id: "movie-translator",
        name: "Movie Translator",
        needBehind:
          "So much good film and TV never reaches people because of the language barrier, and subtitles only get you so far.",
        description:
          "A tool that produces dubbed versions of movies and shows — translating and voicing content so it's watchable in another language, not just readable.",
        techStack: [
          "Python pipeline (speech-to-text, translation via LLM, voice cloning/TTS)",
          "FFmpeg for audio/video sync",
          "React front end for upload and playback",
        ],
        todos: todos([
          "Speech-to-text extraction from source video",
          "Translation pipeline",
          "Voice synthesis / dubbing",
          "Audio-video re-sync",
          "Upload + playback interface",
        ]),
      },
      {
        id: "inbox-reader",
        name: "Inbox Reader",
        needBehind:
          "I don't want another preferences menu with a hundred checkboxes. I want an assistant that learns how I actually treat my inbox and adjusts.",
        description:
          "A browser extension with an AI model that reads your emails and summarizes them for you. It learns which emails to ignore based on your own pattern of reading and ignoring — or you can just tell it. No old-fashioned preferences page with pre-built options; you decide what the options are, by talking to it.",
        techStack: [
          "Chrome extension (Manifest V3)",
          "Gmail API",
          "Claude API for summarization + preference inference",
          "local storage for learned patterns",
        ],
        todos: todos([
          "Gmail API integration",
          "Summarization pipeline",
          "Read/ignore pattern learning",
          "Conversational preference interface",
          "Extension UI popup",
        ]),
      },
      {
        id: "form-reader",
        name: "Form Reader",
        needBehind: "Long forms are exhausting, especially when you don't understand half the fields.",
        description:
          "An AI extension that reads long forms out loud and explains them to you as you go. You can ask questions about parts you don't understand, and fill out the whole form by speaking instead of typing.",
        techStack: [
          "Chrome extension",
          "DOM-parsing for form fields",
          "Claude API for explanation",
          "browser Speech-to-Text/Text-to-Speech APIs",
        ],
        todos: todos([
          "Form field detection and parsing",
          "Text-to-speech read-out",
          "In-context Q&A about fields",
          "Voice-to-field filling",
          "Extension UI",
        ]),
      },
      {
        id: "fact-check-extension",
        name: "Fact-Check Extension",
        needBehind:
          "Every scroll through social media is a minefield of unverified claims. I want to know how true something is before I believe it or share it.",
        description:
          "An extension that fact-checks every social media post you come across, running deep research on the content to surface how true it actually is.",
        techStack: [
          "Chrome extension",
          "web search + retrieval pipeline",
          "Claude API for claim extraction and synthesis",
          "source credibility scoring",
        ],
        todos: todos([
          "Post/claim detection on major platforms",
          "Research pipeline (search + source retrieval)",
          "Claim verification and confidence scoring",
          "Inline UI overlay on posts",
        ]),
      },
      {
        id: "campus-map",
        name: "Campus Map",
        needBehind:
          "Every spot on campus mapped — because I've absolutely been lost looking for a professor's office or a specific lab before.",
        description:
          "A campus map in both 2D and 3D. A chatbot that, given a description like \"a quiet spot to read, somewhere peaceful,\" suggests real places on campus. Every building mapped in 3D — ask the chatbot for a professor's office and hours, then get guided step by step through the building to find it.",
        techStack: [
          "React Three Fiber for 3D building models",
          "Mapbox/Leaflet for 2D layer",
          "Claude API for the recommendation/navigation chatbot",
          "Postgres for building + office data",
        ],
        todos: todos([
          "2D campus map base layer",
          "3D building models (starting with a few key buildings)",
          "\"Find a spot\" recommendation chatbot",
          "Professor/office lookup + in-building navigation",
          "Office hours data integration",
        ]),
      },
      {
        id: "socratic-tutor",
        name: "Socratic Tutor",
        needBehind: "Based on the way the best tutors teach — not spoon-feeding answers, but pulling understanding out of you.",
        description:
          "An AI chatbot that acts like a real tutor without needing heavy prompting. Say the topic you're learning, and it gives you leveled explanations — from child-simple to advanced — then asks you to explain it back and assesses your explanation. It has a math keyboard for formulas, supports speech and handwriting input, quizzes you with feedback based on the science of learning, and classifies what kind of knowledge you're building (factual, procedural, etc.) to suggest the right way to practice. Can even turn concepts into songs to help you remember. Tracks grades and can issue a certificate more trustworthy than most.",
        techStack: [
          "React + Vite",
          "Claude API for tutoring logic and Socratic prompting",
          "math input via MathQuill/KaTeX",
          "handwriting recognition for iPad",
          "TTS/STT for voice",
          "Postgres for progress and certificates",
        ],
        todos: todos([
          "Topic intake + leveled explanation engine",
          "Socratic \"explain it back\" + assessment flow",
          "Quiz engine with spaced-repetition feedback",
          "Math keyboard + handwriting input",
          "Knowledge-type classification (factual/procedural/etc.)",
          "Song-based memory aids",
          "Grading + certificate system",
        ]),
      },
      {
        id: "media-journal",
        name: "Media Journal",
        needBehind:
          "A place to log everything I've watched and read, and actually write down why I liked it — not just star ratings.",
        description:
          "An online journal for every movie, show, and book you've watched or read. Write comments and reflections on each — what you liked, why it stuck with you — and see what others think too. Search a title and get poster/cover art to identify it. Based on your journal entries, likes, and searches, the app recommends what to watch or read next — like a Pinterest for your taste.",
        techStack: [
          "React + Vite",
          "Tailwind",
          "TMDB/Google Books API for poster/cover search",
          "Postgres for journal entries",
          "recommendation engine built on entry content + likes",
        ],
        todos: todos([
          "Title search with poster/cover matching",
          "Journal entry creation (comments, likes)",
          "Public/shared journal view",
          "Recommendation engine",
          "Social following/likes feed",
        ]),
      },
      {
        id: "skill-tree",
        name: "Skill Tree",
        needBehind:
          "Built for a student club — when you're working on a project, you should be able to find exactly who in the group has the skill you need.",
        description:
          "An app that connects programmers within a group, like a student club, shown as a tree. Each person is listed with their specific skills — languages, frameworks, libraries. If you're working on a project, find and contact whoever has the skills you need. People update their own skills, and the tree structure branches by CS specialization. Built mainly for campus level, but also hosts alumni for advice on internships and job applications.",
        techStack: [
          "React + Vite",
          "D3.js for the tree visualization",
          "Postgres for member/skill data",
          "auth for campus + alumni accounts",
        ],
        todos: todos([
          "Skill tree visualization by specialization",
          "Member profiles with editable skills",
          "Search/filter by skill",
          "Alumni accounts + mentorship requests",
          "Contact/connect flow",
        ]),
      },
      {
        id: "clev",
        name: "Clev",
        needBehind: "Kitchens run out of things mid-shift, and the rest of the team doesn't always know until it's too late.",
        description:
          "An app that lets the kitchen know the moment a station runs out of an item. Includes a map showing the location of every station so restocking is fast and clear.",
        techStack: [
          "React Native or lightweight PWA for kitchen tablets",
          "real-time backend (WebSockets)",
          "station map UI",
        ],
        todos: todos([
          "Station inventory alert system",
          "Real-time notifications to kitchen staff",
          "Station location map",
          "Restock confirmation flow",
        ]),
      },
      {
        id: "smart-to-do",
        name: "Smart To-Do",
        needBehind: "Most to-do apps just hold a list. I want one that actually understands my time and habits.",
        description:
          "An AI-powered to-do list and scheduling app with smart task prioritization, deadline awareness, and habit + productivity insights.",
        techStack: [
          "React + Vite",
          "Claude API for prioritization logic",
          "calendar API integration",
          "Postgres for tasks and habit tracking",
        ],
        todos: todos([
          "Task creation + deadline tracking",
          "Smart prioritization engine",
          "Calendar sync",
          "Habit/productivity insights dashboard",
        ]),
      },
      {
        id: "whitman-voice",
        name: "Whitman Voice",
        needBehind: "Campus needs a real channel for feedback — one that doesn't disappear into an inbox nobody checks.",
        description:
          "A student feedback web app for Whitman College, with anonymous and non-anonymous submission options. A community-oriented, civic-tech style platform for raising campus issues, suggestions, and concerns.",
        techStack: ["React + Vite", "Tailwind", "Postgres for submissions", "moderation dashboard for relevant campus offices"],
        todos: todos([
          "Submission form (anonymous + named)",
          "Issue categorization",
          "Public feed of submissions",
          "Admin/moderation dashboard",
          "Status tracking (open, in progress, resolved)",
        ]),
      },
      {
        id: "vocab-builder",
        name: "Vocab Builder",
        needBehind:
          "Learning a language sticks better when you build your own list from words you actually encounter, not a generic deck.",
        description:
          "An iOS app for learning vocabulary. Select a word, phrase, or idiom and add it to your list. The app shows definitions, generates flashcards, and asks you to write practice sentences with feedback on your grammar. Once you've built up enough words, it asks you to write a full story using them.",
        techStack: [
          "Swift/SwiftUI",
          "Claude API for definitions, sentence feedback, and story prompts",
          "on-device storage (Core Data) for vocab lists and flashcards",
        ],
        todos: todos([
          "Word/phrase save + definition lookup",
          "Flashcard review system",
          "Sentence-writing practice with grammar feedback",
          "Story-writing milestone mode",
        ]),
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
