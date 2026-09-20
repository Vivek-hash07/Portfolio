import "dotenv/config";
import prisma from "../lib/prisma";

function utcDate(year: number, month: number, day = 1) {
  return new Date(Date.UTC(year, month - 1, day));
}

async function seed() {
  console.log("Seeding portfolio content from resume...\n");

  await prisma.skill.deleteMany();
  await prisma.skillGroup.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.project.deleteMany();
  await prisma.certification.deleteMany();
  await prisma.education.deleteMany();
  await prisma.post.deleteMany();
  await prisma.profile.deleteMany();

  await prisma.profile.create({
    data: {
      name: "Vivek Sarvaiya",
      title:
        "Full Stack Developer | AI/GenAI Engineer | Software Developer | Backend Developer",
      location: "Bengaluru, India",
      email: "viveksarvaiya1873@gmail.com",
      phone: "+91 9322962633",
      summary:
        "Full Stack Developer and AI/GenAI Engineer with ~2 years of experience building production-grade web applications and LLM-powered backend systems. Skilled across the full stack — React, Next.js, Node.js, TypeScript, PostgreSQL — and modern AI engineering, including LLM integration, Retrieval-Augmented Generation (RAG), vector search, and agentic workflows. At Quralyst, built and shipped scalable backend systems and API orchestration layers spanning 5-10 external data sources, cutting manual research effort by 30-50%. Independently created and deployed multiple full-stack SaaS products end-to-end — authentication, billing, databases, and AI-powered features. Comfortable owning problems from architecture through deployment, and targeting Full Stack Developer / AI Engineer / Software Developer roles building production-grade, LLM-integrated web applications at scale.",
      linkedinUrl: "https://www.linkedin.com/in/vivek-sarvaiya-40537a286",
      githubUrl: "https://github.com/Vivek-hash07",
    },
  });

  const skillGroups = [
    {
      label: "Languages",
      order: 0,
      skills: [
        "Python",
        "TypeScript",
        "JavaScript",
        "Node.js",
        "Java (Learning)",
      ],
    },
    {
      label: "Frontend",
      order: 1,
      skills: [
        "React.js",
        "Next.js (App Router)",
        "Tailwind CSS",
        "shadcn/ui",
        "HTML5",
        "CSS3",
        "Zod",
      ],
    },
    {
      label: "Backend",
      order: 2,
      skills: [
        "Node.js",
        "Express.js",
        "RESTful APIs",
        "tRPC",
        "WebSockets (Socket.IO)",
        "API Orchestration",
        "Microservices",
      ],
    },
    {
      label: "AI / GenAI",
      order: 3,
      skills: [
        "LLM Integration (OpenAI, Claude, Gemini APIs)",
        "Prompt Engineering (Zero-shot, Few-shot, Chain-of-Thought, ReAct)",
        "Retrieval-Augmented Generation (RAG)",
        "Vector Search & Embeddings",
        "Agentic Workflows & AI Agents",
        "NLP (Sentiment Analysis, Intent Detection)",
        "Vercel AI SDK",
        "Inngest AgentKit",
      ],
    },
    {
      label: "Databases",
      order: 4,
      skills: [
        "PostgreSQL",
        "MongoDB",
        "Redis",
        "Prisma ORM",
        "Vector Databases (Pinecone, Qdrant)",
      ],
    },
    {
      label: "DevOps & Cloud",
      order: 5,
      skills: ["Docker", "AWS", "CI/CD", "Git & GitHub", "Vercel"],
    },
    {
      label: "Tools & Integrations",
      order: 6,
      skills: [
        "GitHub Apps/Octokit",
        "Razorpay",
        "Better Auth",
        "Inngest",
        "Postman",
      ],
    },
  ];

  for (const group of skillGroups) {
    const createdGroup = await prisma.skillGroup.create({
      data: {
        label: group.label,
        order: group.order,
      },
    });

    await prisma.skill.createMany({
      data: group.skills.map((name, index) => ({
        name,
        order: index,
        groupId: createdGroup.id,
      })),
    });
  }

  await prisma.experience.createMany({
    data: [
      {
        role: "Software Engineer",
        company: "Quralyst",
        companyNote: "Backed by Indago Research",
        startDate: utcDate(2025, 4),
        endDate: null,
        bullets: [
          "Architected scalable, multi-tiered full-stack backend systems for an AI-powered M&A deal intelligence platform, orchestrating distributed data flows across ingestion, processing, and enrichment layers spanning 5–10 external data sources.",
          "Built end-to-end data pipelines in Python to ingest, normalize, and process structured and unstructured data from 5+ external sources, improving processing speed and reliability across test, integration, and production environments.",
          "Built an API orchestration layer connecting OpenAI and Apollo APIs to automate AI-driven data enrichment, cutting manual research effort by 30–50%.",
          "Developed intelligent filtering and transformation logic to extract high-quality deal insights from large datasets, surfacing higher-signal insights for investment decision-making.",
          "Collaborated cross-functionally with product and business stakeholders, participated in code reviews, and maintained clean, well-documented, production-grade code.",
          "Monitored and supported data-processing systems across test, integration, and production environments within two-week Agile/Scrum sprints (planning, standups, retrospectives), resolving defects to sustain reliable performance across 5–10 external pipelines.",
        ],
        order: 0,
      },
      {
        role: "Software Developer Intern",
        company: "Quralyst",
        companyNote: null,
        startDate: utcDate(2025, 4),
        endDate: utcDate(2025, 12, 31),
        bullets: [
          "Contributed to backend development of an AI-powered deal sourcing platform used by investment teams, streamlining enrichment workflows across 5+ external data sources to reduce manual research effort.",
          "Connected external APIs and built data-ingestion pipelines for real-time enrichment, supporting the same multi-source architecture later used in production.",
          "Assisted in building scalable backend components to handle multi-source, mixed-format data feeding the enrichment pipeline.",
        ],
        order: 1,
      },
      {
        role: "Intern",
        company: "Edunet Foundation",
        companyNote: null,
        startDate: utcDate(2025, 2),
        endDate: utcDate(2025, 3, 31),
        bullets: [
          "Built and evaluated multiple machine-learning models in Python and TensorFlow across real-world problem statements during a 2-month AI/ML and Green Skills internship, applying refined data-preprocessing techniques to improve model accuracy.",
          "Refined data-preprocessing pipelines and collaborated with fellow interns to optimize model accuracy and computational efficiency.",
        ],
        order: 2,
      },
      {
        role: "AI Engineer",
        company: "Freudia",
        companyNote: null,
        startDate: utcDate(2024, 11),
        endDate: utcDate(2025, 2, 28),
        bullets: [
          "Built an AI-powered chatbot delivering empathetic, contextually-aware conversations for users dealing with stress, anxiety, and everyday mental health challenges, using Large Language Models (LLMs).",
          "Fine-tuned LLMs on domain-specific conversational data to improve response quality, tone, and emotional relevance.",
          "Applied Retrieval-Augmented Generation (RAG) to ground responses in curated resources, reducing hallucination and improving factual reliability of sensitive advice.",
          "Leveraged NLP techniques for sentiment analysis and intent detection, enabling the chatbot to adapt tone and response style based on user emotional state.",
        ],
        order: 3,
      },
    ],
  });

  await prisma.project.createMany({
    data: [
      {
        title: "KVM AI CodeReviewer",
        subtitle: "AI-Powered Code Review SaaS",
        description: [
          "Built a full-stack SaaS AI code review platform with GitHub App integration (Octokit) that automatically reviews pull requests via webhook-driven triggers and posts detailed feedback on correctness, security, performance, and maintainability.",
          "Built an AI review pipeline using OpenRouter (LLM-based) combined with Pinecone vector search — chunking and embedding PR diffs plus synced repository code (up to 200 files/repo) for context-aware reviews.",
          "Orchestrated background jobs with Inngest for durable, retry-safe workflows; built GitHub OAuth authentication (Better Auth) and a usage-based billing system paired with Razorpay subscriptions.",
          "Built the full dashboard and database layer (Prisma + PostgreSQL) for repository sync, PR tracking, and subscription management.",
        ],
        techStack: [
          "Next.js 16",
          "TypeScript",
          "React 19",
          "Tailwind CSS",
          "Better Auth",
          "PostgreSQL",
          "Prisma",
          "Octokit",
          "Inngest",
          "Pinecone",
          "OpenRouter",
          "Razorpay",
        ],
        liveUrl: null,
        repoUrl: null,
        featured: true,
        order: 0,
      },
      {
        title: "AI-Powered Personal Fitness & Nutrition Coach",
        subtitle: "Full-Stack Mobile App (Solo Project)",
        description: [
          "Architected and built a full-stack mobile application combining multimodal AI (vision + language models) to analyze daily physique and meal photos, generating personalized workout and diet plans in real time.",
          "Built a computer-vision pipeline using the Claude API to extract granular nutritional data (calories, macros, protein) from food images, enabling automatic meal logging with an interactive macro-gap-closing recommendation engine.",
          "Engineered a custom memory-management system using PostgreSQL and Redis with a rolling-summarization architecture (header/summary/content records), enabling long-term AI context retention without a vector database and cutting prompt token usage and API costs.",
          "Built a gym session tracker with automatic personal-record (PR) detection, workout adherence tracking, and progress analytics feeding back into AI-driven plan regeneration.",
          "Built a relational database schema (10+ interlinked tables) covering user profiles, nutrition logs, workout sessions, and AI-generated media, with a scheduled job system for automatic weekly plan regeneration.",
        ],
        techStack: [
          "React Native",
          "Node.js",
          "FastAPI",
          "PostgreSQL",
          "Redis",
          "AWS S3",
          "Claude API (Vision/LLM)",
          "REST APIs",
          "JWT Authentication",
        ],
        liveUrl: null,
        repoUrl: null,
        featured: true,
        order: 1,
      },
    ],
  });

  await prisma.certification.createMany({
    data: [
      { name: "Generative AI (GenAI)", issuer: null, url: null, order: 0 },
      { name: "Web Development", issuer: null, url: null, order: 1 },
      {
        name: "AWS Cloud Practitioner",
        issuer: "Amazon Web Services",
        url: null,
        order: 2,
      },
      { name: "AI Agents Fundamentals", issuer: null, url: null, order: 3 },
      {
        name: "Introduction to Software Engineering",
        issuer: null,
        url: null,
        order: 4,
      },
    ],
  });

  await prisma.education.create({
    data: {
      degree: "Bachelor of Computer Applications (BCA)",
      institution: "Acharya Institute of Graduate Studies (AIGS)",
      detail: "CGPA: 8.9/10 | Final Semester SGPA: 9.5",
      startDate: utcDate(2022, 8),
      endDate: utcDate(2025, 8, 31),
      order: 0,
    },
  });

  const counts = {
    profile: await prisma.profile.count(),
    skillGroups: await prisma.skillGroup.count(),
    skills: await prisma.skill.count(),
    experience: await prisma.experience.count(),
    projects: await prisma.project.count(),
    certifications: await prisma.certification.count(),
    education: await prisma.education.count(),
  };

  console.log("Seed complete:");
  for (const [label, count] of Object.entries(counts)) {
    console.log(`  - ${label}: ${count}`);
  }
}

seed()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
