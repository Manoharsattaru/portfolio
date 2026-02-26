/* ============================================
   Hybrid RAG Chatbot Engine
   Architecture: Keyword Lookup → Fuzzy FAQ → TF-IDF Similarity → Ollama LLM
   Inspired by Bharatkosh POC hybrid RAG architecture
   ============================================ */

const ChatBot = (() => {

    // ============================
    // LAYER 0: CV KNOWLEDGE BASE
    // ============================

    const CV_DATA = {
        name: "Sattaru Manohar",
        email: "Manoharansiddarth@gmail.com",
        phone: "+91 9542642876",
        linkedin: "https://www.linkedin.com/in/sattarumanohar",
        github: "https://github.com/Manoharsattaru",
        credly: "https://www.credly.com/users/manohar-sattaru/badges",
        eportfolio: "https://eportfolio.mygreatlearning.com/manohar-sattaru",
        currentRole: "Senior Consultant at KPMG Advisory Services — Digital Government Advisory (G&PS)",
        currentOrg: "KPMG Advisory Services Pvt. Ltd.",
        totalExperience: "6+ years",

        summary: "Dynamic Technology Consultant with over 6 years of experience leading large-scale digital transformation and public sector advisory programs. Expert in aligning AI-driven innovations and advanced analytics with strategic governance goals to enhance systemic efficiency. Spearheading large-scale PMU operations and technical roadmaps for high-priority initiatives. Adept at navigating complex stakeholder environments to translate strategic policy into production-ready digital solutions.",

        skills: {
            technical: ["Python", "Flask", "Gradio", "Hugging Face", "spaCy", "Ollama", "SQL", "REST APIs", "OCR", "GCP MLOps", "QGIS", "ArcGIS"],
            dataAnalytics: ["Power BI", "Tableau", "EDA", "Predictive Modeling", "Forecasting", "Data Modeling", "Business Analytics", "Risk Analytics"],
            consulting: ["Digital Transformation", "Project Management", "Stakeholder Management", "Technology Consulting", "Policy Advocacy", "Gen AI Chatbots", "Public Finance", "ESG"]
        },

        experience: [
            {
                company: "KPMG Advisory Services",
                role: "Senior Consultant — Digital Government Advisory (CGA, MoF)",
                duration: "Oct 2024 – Present",
                project: "Ministry of Finance",
                highlights: [
                    "Engineered NLP-based Internal Audit chatbot with hybrid lookup-LLM architecture using Flask, spaCy, and Ollama — achieving 90% accuracy",
                    "Prepared POCs and documentation for AI/ML chatbots, fraud analytics, and OCR implementations in PFMS modules — Bharatkosh and E-Bill",
                    "Architected transition of 170+ SFTP/XML integrations to RESTful JSON APIs for RBI, banks, and payment gateways",
                    "Developed strategy for GIFMIS modernization based on platform engineering and IMF PFM guidelines"
                ]
            },
            {
                company: "Quality Council of India (QCI)",
                role: "Associate Manager — Strategy & Policy Division",
                duration: "Jul 2023 – Sep 2024",
                project: "PMU for Ministry of Home Affairs",
                highlights: [
                    "Conducted market research and policy gap analysis for Medical Value Tourism, Rural Development, and Infrastructure sectors",
                    "Led PMU for Ministry of Home Affairs — co-directing a 70-member consulting team on a high-priority GOI project",
                    "Developed KPI frameworks and benchmarked international best practices for India's competitiveness"
                ]
            },
            {
                company: "Quality Council of India (QCI)",
                role: "GeM PMU — Government e-Marketplace (MoCI)",
                duration: "Apr 2022 – Jun 2023",
                project: "GeM Portal",
                highlights: [
                    "Managed a team of 14 for high-stakes GeM portal onboarding — vendors and service providers",
                    "Developed OCR-based prototypes and data-processing pipelines, optimizing audit efficiency by 90%",
                    "Engineered data-driven fraud detection protocols to identify anomalous vendor behaviors"
                ]
            },
            {
                company: "Quality Council of India (QCI)",
                role: "Junior Associate — GeM Portal",
                duration: "Oct 2021 – Mar 2022",
                project: "GeM Portal",
                highlights: [
                    "Optimized end-to-end onboarding lifecycle for 260+ service categories on the GeM portal",
                    "Performed high-frequency data auditing and reporting for senior stakeholders"
                ]
            },
            {
                company: "German Development Corporation (GIZ India)",
                role: "Project Intern — Analytics",
                duration: "Feb 2021 – Aug 2021",
                project: "Urban Development Analytics",
                highlights: [
                    "Leveraged QGIS to analyze spatial datasets for 7 AMRUT city masterplans",
                    "Developed MoHUA interactive dashboard for town-planner vacancies and workforce modeling"
                ]
            },
            {
                company: "SG Analytics, Pune",
                role: "ESG Consultant",
                duration: "Aug 2020 – Nov 2020",
                project: "ESG Performance Analysis",
                highlights: [
                    "Executed ESG performance analysis for 14 cross-sector global entities",
                    "Streamlined data collection for 450+ performance indicators with 100% GRI compliance"
                ]
            },
            {
                company: "Safetipin, Gurugram",
                role: "Research & Analytics Intern",
                duration: "Jan 2020 – May 2020",
                project: "Safety Audit Platform",
                highlights: [
                    "Spearheaded development of a new safety audit vertical for the Safetipin app",
                    "Transformed raw audit data into policy recommendations for Pune City stakeholders"
                ]
            },
            {
                company: "GMDA, Gurugram",
                role: "Research Intern",
                duration: "Jun 2019 – Aug 2019",
                project: "Urban Planning",
                highlights: [
                    "Conducted gap analysis of social infrastructure aligned with URDPFI guidelines",
                    "Executed spatial modeling using ArcGIS for site-selection and policy recommendations"
                ]
            },
            {
                company: "Aarush Startup, Visakhapatnam",
                role: "R&D Executive (Product Manager)",
                duration: "Jan 2018 – Jun 2018",
                project: "Cluster Village Development",
                highlights: [
                    "Spearheaded multi-sector consortium (IT, Health, Solar) for 'Cluster Village Development' with Govt. of AP",
                    "Led team of 8 to build Aarushlife.com from concept to investor-ready MVP"
                ]
            }
        ],

        education: [
            {
                degree: "Post Graduate Program in Data Science and Business Analytics",
                institution: "Texas McCombs School of Business (UT Austin) via Great Learning",
                year: "2023 – 2024",
                details: "Capstone Project: Predictive analytics for credit risk management (Banking credit card)",
                ePortfolio: "https://eportfolio.mygreatlearning.com/manohar-sattaru",
                programUrl: "https://www.mygreatlearning.com/pg-program-data-science-and-business-analytics-course",
                academicProjects: [
                    "E-Commerce Revenue Management (Python, NumPy, Pandas, Visualization)",
                    "Statistical Data Analysis (Business Statistics, Hypothesis Testing, ANOVA)",
                    "Go Digit Predictive Modeling (EDA, Clustering, PCA, Predictive Modeling)",
                    "U.S.A Presidential Speech Analysis (Text Mining, NLP, Machine Learning)",
                    "Credit Risk Model for Indian Companies (Finance, Risk Analytics, ML)",
                    "Credit Risk Default Model - Vote Prediction (Logistic Regression, CART, LDA, KNN)"
                ]
            },
            {
                degree: "M.Tech in Urban Development and Management",
                institution: "TERI School of Advanced Studies, New Delhi",
                year: "2018 – 2020",
                details: ""
            },
            {
                degree: "B.Tech in Mechanical Engineering",
                institution: "Aditya Institute of Technology and Management, Srikakulam",
                year: "2013 – 2017",
                details: ""
            }
        ],

        certifications: [
            {
                name: "IBM AI Developer Professional Certificate",
                platform: "Coursera",
                url: "https://www.coursera.org/account/accomplishments/professional-cert/V1JRWDWCA4HV",
                programUrl: "https://www.coursera.org/professional-certificates/applied-artifical-intelligence-ibm-watson-ai",
                courses: [
                    "Introduction to Software Engineering",
                    "Introduction to Artificial Intelligence (AI)",
                    "Generative AI: Introduction and Applications",
                    "Generative AI: Prompt Engineering Basics",
                    "Introduction to HTML, CSS & JavaScript",
                    "Python for Data Science, AI & Development",
                    "Developing AI Applications with Python and Flask",
                    "Building Generative AI-Powered Applications with Python",
                    "Generative AI: Elevate your Software Development Career",
                    "Software Developer Career Guide and Interview Preparation"
                ],
                skillsGained: ["RAG", "Prompt Engineering", "LLM Applications", "Computer Vision", "Machine Learning", "Responsible AI", "Software Architecture", "SDLC"],
                toolsLearned: ["Python", "Flask", "LangChain", "Generative AI", "REST APIs", "IBM Cloud", "ChatGPT", "GitHub Copilot"]
            },
            {
                name: "Google AI Specialization",
                platform: "Coursera",
                url: "https://coursera.org/share/31d83aaae1b6e1fb43b07184b7b3edd8",
                programUrl: "https://www.coursera.org/specializations/google-ai",
                courses: [
                    "AI Fundamentals",
                    "AI for Brainstorming and Planning",
                    "AI for Research and Insights",
                    "AI for Writing and Communicating",
                    "AI for Content Creation",
                    "AI for Data Analysis",
                    "AI for App Building"
                ],
                skillsGained: ["AI Fluency", "Brainstorming", "Research", "Communication", "Content Creation", "Data Analysis", "App Building"],
                toolsLearned: ["Google AI", "Gemini", "Vertex AI", "Prompt Engineering"]
            },
            { name: "Data Science A-Z: Hands-On Exercises", platform: "Udemy", url: "https://ude.my/UC-82df76bc-d935-4e60-96c4-07fa968028b8" }
        ],

        keyProjects: [
            "Engineered NLP-based Internal Audit chatbot with hybrid lookup-LLM architecture (Flask, spaCy, Ollama) — achieving 90% accuracy",
            "Architected transition of 170+ SFTP/XML integrations to RESTful JSON APIs for RBI, banks, and payment gateways",
            "Developed OCR-based prototypes and data-processing pipelines, optimizing audit efficiency by 90%",
            "Led PMU for Ministry of Home Affairs — co-directing a 70-member consulting team",
            "Developed strategy for GIFMIS modernization based on platform engineering and IMF PFM guidelines",
            "Conducted market research and policy gap analysis for Medical Value Tourism, Rural Development, and Infrastructure sectors"
        ]
    };


    // ============================
    // LAYER 1: DIRECT KEYWORD LOOKUP
    // ============================

    const INTENTS = [
        {
            keywords: ["name", "who are you", "introduce", "yourself", "who is", "about you"],
            response: () => `I'm **${CV_DATA.name}**, a ${CV_DATA.currentRole}. ${CV_DATA.summary.split('.').slice(0, 2).join('.')}.`
        },
        {
            keywords: ["email", "mail", "e-mail"],
            response: () => `You can reach Manohar at **${CV_DATA.email}**`
        },
        {
            keywords: ["phone", "call", "number", "mobile", "contact number"],
            response: () => `Manohar's phone number is **${CV_DATA.phone}**`
        },
        {
            keywords: ["linkedin"],
            response: () => `Connect with Manohar on LinkedIn: [${CV_DATA.linkedin}](${CV_DATA.linkedin})`
        },
        {
            keywords: ["github", "git hub", "code", "repositories", "repos"],
            response: () => `Check out Manohar's work on GitHub: [${CV_DATA.github}](${CV_DATA.github})`
        },
        {
            keywords: ["contact", "reach", "connect", "get in touch", "hire"],
            response: () => `Here's how to reach Manohar:\n- 📧 **Email:** ${CV_DATA.email}\n- 📞 **Phone:** ${CV_DATA.phone}\n- 🔗 **LinkedIn:** [Profile](${CV_DATA.linkedin})\n- 💻 **GitHub:** [Profile](${CV_DATA.github})\n- 🏅 **Credly:** [Badges](${CV_DATA.credly})`
        },
        {
            keywords: ["experience", "years", "how long", "career", "work history"],
            response: () => {
                const orgs = CV_DATA.experience.map(e => `• **${e.company}** — ${e.role} (${e.duration})`).join('\n');
                return `Manohar has **${CV_DATA.totalExperience}** of professional experience across ${CV_DATA.experience.length} roles:\n\n${orgs}`;
            }
        },
        {
            keywords: ["current", "working now", "present", "currently", "today", "latest role"],
            response: () => {
                const curr = CV_DATA.experience[0];
                return `Manohar is currently working as **${curr.role}** at **${curr.company}** (${curr.duration}).\n\nKey work:\n${curr.highlights.slice(0, 3).map(h => `• ${h}`).join('\n')}`;
            }
        },
        {
            keywords: ["kpmg"],
            response: () => {
                const kpmg = CV_DATA.experience[0];
                return `At **KPMG** (${kpmg.duration}), Manohar serves as ${kpmg.role} on the ${kpmg.project} project:\n\n${kpmg.highlights.map(h => `• ${h}`).join('\n')}`;
            }
        },
        {
            keywords: ["qci", "quality council"],
            response: () => {
                const qciRoles = CV_DATA.experience.filter(e => e.company.includes("QCI") || e.company.includes("Quality Council"));
                const parts = qciRoles.map(r => `**${r.role}** (${r.duration}):\n${r.highlights.map(h => `• ${h}`).join('\n')}`);
                return `Manohar worked at **Quality Council of India (QCI)** across multiple roles:\n\n${parts.join('\n\n')}`;
            }
        },
        {
            keywords: ["skill", "tools", "technologies", "tech stack", "programming", "languages"],
            response: () => `Manohar's skills span three domains:\n\n**⚡ Technical:** ${CV_DATA.skills.technical.join(', ')}\n\n**📊 Data & Analytics:** ${CV_DATA.skills.dataAnalytics.join(', ')}\n\n**🏛️ Consulting & Domain:** ${CV_DATA.skills.consulting.join(', ')}`
        },
        {
            keywords: ["python", "flask", "coding"],
            response: () => `Yes! Manohar is proficient in **Python** and **Flask**. He engineered a production-ready NLP chatbot using Flask, spaCy, and Ollama at KPMG. His tech skills include: ${CV_DATA.skills.technical.join(', ')}.`
        },
        {
            keywords: ["education", "degree", "university", "college", "study", "studied", "qualification", "academic"],
            response: () => {
                const edu = CV_DATA.education.map(e => `🎓 **${e.degree}**\n   ${e.institution} (${e.year})${e.details ? `\n   _${e.details}_` : ''}`).join('\n\n');
                return `Manohar's educational background:\n\n${edu}`;
            }
        },
        {
            keywords: ["ut austin", "texas", "mccombs", "data science program", "pgp", "great learning", "dsba", "pgp-dsba", "academic project", "academic projects"],
            response: () => {
                const edu = CV_DATA.education[0];
                const projects = edu.academicProjects.map((p, i) => `${i + 1}. ${p}`).join('\n');
                return `Manohar completed a **${edu.degree}** from **${edu.institution}** (${edu.year}).\n\n_${edu.details}_\n\n**9 Academic Projects:**\n${projects}\n\n🔗 [View E-Portfolio](${edu.ePortfolio}) | [View Program](${edu.programUrl})`;
            }
        },
        {
            keywords: ["certification", "certified", "certificate", "credly", "badge", "ibm ai", "google ai", "ibm developer", "coursera cert"],
            response: () => {
                const ibm = CV_DATA.certifications[0];
                const google = CV_DATA.certifications[1];
                return `Manohar's major certifications include:\n\n🎓 **${ibm.name}** — ${ibm.platform} ([View](${ibm.url}))\n🎓 **${google.name}** — ${google.platform} ([View](${google.url}))\n\nHe has also completed courses like Data Science A-Z and holds multiple badges. View all badges on [Credly](${CV_DATA.credly}).`;
            }
        },
        {
            keywords: ["google", "google course", "google ai"],
            response: () => {
                const google = CV_DATA.certifications[1];
                const courseList = google.courses.map((c, i) => `${i + 1}. ${c}`).join('\n');
                return `Manohar holds the **${google.name}** from Google via Coursera — an extensive 7-course program focusing on AI fundamentals, communication, content creation, and app building:\n\n${courseList}\n\n**Skills Gained:** ${google.skillsGained.join(', ')}\n\n🔗 [View Certificate](${google.url})`;
            }
        },
        {
            keywords: ["ibm", "ibm course", "ibm courses", "coursera"],
            response: () => {
                const ibm = CV_DATA.certifications[0];
                const courseList = ibm.courses.map((c, i) => `${i + 1}. ${c}`).join('\n');
                return `Manohar holds the **${ibm.name}** from IBM via Coursera — a comprehensive 10-course professional program:\n\n${courseList}\n\n**Skills Gained:** ${ibm.skillsGained.join(', ')}\n**Tools Learned:** ${ibm.toolsLearned.join(', ')}\n\n🔗 [View Certificate](${ibm.url}) | [View Program](${ibm.programUrl})`;
            }
        },
        {
            keywords: ["project", "built", "developed", "created", "portfolio", "highlight", "achievement"],
            response: () => `Manohar's key projects & achievements:\n\n${CV_DATA.keyProjects.map((p, i) => `${i + 1}. ${p}`).join('\n\n')}`
        },
        {
            keywords: ["chatbot", "nlp", "rag", "llm", "ai assistant", "audit"],
            response: () => `At KPMG, Manohar engineered an **NLP-based Internal Audit Wing chatbot** using a hybrid RAG architecture:\n\n• **Stack:** Flask, spaCy, Ollama\n• **Architecture:** Hybrid lookup-LLM with direct rule extraction + vector similarity search\n• **Accuracy:** 100%\n• **Features:** REST API, embeddable widget, offline-capable, privacy-focused\n\nThis is a great example of his ability to build production-ready AI solutions!`
        },
        {
            keywords: ["api", "pfms", "integration", "rest", "migration"],
            response: () => `At KPMG, Manohar architected a **data transition framework** to migrate **170+ SFTP/XML-based integrations** to RESTful JSON APIs, enabling real-time interoperability between:\n\n• RBI\n• Banks\n• Payment Gateway Aggregators\n• External Systems\n\nHe prepared detailed module-wise technical documentation for the entire PFMS API transition.`
        },
        {
            keywords: ["fraud", "gem", "marketplace", "detection", "ocr"],
            response: () => `At QCI's **Government e-Marketplace (GeM)** PMU:\n\n• Developed **OCR-based prototypes** and data-processing pipelines\n• Engineered fraud detection protocols for anomalous vendor behaviors\n• Optimized audit efficiency by **90%**\n• Managed a team of 14 for portal onboarding`
        },
        {
            keywords: ["mha", "home affairs", "ministry of home", "pmu"],
            response: () => `At QCI, Manohar directed **PMU operations for the Ministry of Home Affairs** under a high-priority, confidential GOI project:\n\n• Co-led a team of **70 consultants**\n• Designed dashboards and daily reports\n• Created SOPs for data cleaning, analysis, and storage\n• Managed the entire project lifecycle from team hiring to deliverable completion`
        },
        {
            keywords: ["giz", "german", "urban"],
            response: () => `At **GIZ India** (Feb–Aug 2021), Manohar worked as a Project Intern in Analytics:\n\n• Leveraged **QGIS** to analyze spatial datasets for 7 AMRUT city masterplans\n• Developed a **MoHUA interactive dashboard** for town-planner vacancies and workforce modeling`
        },
        {
            keywords: ["esg", "sg analytics", "sustainability"],
            response: () => `At **SG Analytics, Pune** (Aug–Nov 2020), as an ESG Consultant:\n\n• Executed ESG performance analysis for **14 cross-sector global entities**\n• Streamlined data collection for **450+ performance indicators**\n• Ensured **100% compliance** with GRI reporting requirements`
        },
        {
            keywords: ["documents", "reports", "papers", "publications", "download", "thesis", "dissertation"],
            response: () => `In the "Reports" section of this website, you can view and download Manohar's academic and professional work, including:\n\n• **M.Tech Dissertation:** Urban Planning & Infrastructure (GMDA)\n• **PGP-DSBA Capstone/Projects:** Credit Risk Modeling, Finance & Risk Analytics, Market Basket Analysis\n• **Professional Reports:** Aarush Group rural development, QCI Village Certification\n• **His Latest CV**\n\nYou can preview PDFs directly on the site or download them via a quick form!`
        },
        {
            keywords: ["hi", "hello", "hey", "good morning", "good evening", "good afternoon", "greetings"],
            response: () => `Hello! 👋 I'm Manohar's AI assistant. I can help you learn about his experience, skills, projects, education, certifications, and research reports. What would you like to know?`
        },
        {
            keywords: ["how are you", "how are u", "how r you", "how r u", "how's it going", "what's up", "whats up"],
            response: () => `I'm doing great, thanks for asking! 😊 I'm here and ready to help you explore Manohar's portfolio. What would you like to know about his background or skills?`
        },
        {
            keywords: ["who made you", "who created you", "who built you", "what are you"],
            response: () => `I am a custom AI assistant engineered by **Sattaru Manohar** using a hybrid RAG architecture (Keyword Lookup → Fuzzy FAQ → TF-IDF → LLM) to help you navigate his portfolio!`
        },
        {
            keywords: ["thanks", "thank you", "great", "awesome", "cool", "nice"],
            response: () => `You're welcome! 😊 Feel free to ask anything else about Manohar's profile. I'm here to help!`
        },
        {
            keywords: ["bye", "goodbye", "see you", "later"],
            response: () => `Goodbye! 👋 Thanks for visiting Manohar's portfolio. Feel free to come back anytime or reach out at ${CV_DATA.email}!`
        },
        {
            keywords: ["open to work", "open for work", "job change", "looking for job", "opportunities", "hiring", "hire you", "available", "job"],
            response: () => `Yes, Manohar is currently open to new opportunities! 🚀\n\nHe is actively seeking roles in **Digital Transformation, AI/ML Solutions, and Strategy**.\n\nHe is open to **Remote, Hybrid, or On-site** collaboration, with a location preference for **Hyderabad**.\n\n<a href="#contact" onclick="document.getElementById('chatPanel').classList.remove('open')">Get in Touch ↓</a>`
        },
        {
            keywords: ["background", "summary", "profile", "about", "overview"],
            response: () => CV_DATA.summary + `\n\n<a href="#experience" onclick="document.getElementById('chatPanel').classList.remove('open')">See Work Experience ↓</a>`
        }
    ];

    function lookupIntent(query) {
        const q = query.toLowerCase().trim();
        for (const intent of INTENTS) {
            for (const keyword of intent.keywords) {
                if (q.includes(keyword)) {
                    return intent.response();
                }
            }
        }
        return null;
    }


    // ============================
    // LAYER 1.5: FUZZY FAQ MATCHING
    // (Inspired by Bharatkosh POC's FAQMatcher / SequenceMatcher)
    // ============================

    const FAQ_PAIRS = [
        { q: "what is your total experience", a: () => INTENTS.find(i => i.keywords.includes("experience")).response() + `\n\n<a href="#experience" onclick="document.getElementById('chatPanel').classList.remove('open')">Jump to Experience Section ↓</a>` },
        { q: "what are your technical skills", a: () => INTENTS.find(i => i.keywords.includes("skill")).response() + `\n\n<a href="#about" onclick="document.getElementById('chatPanel').classList.remove('open')">Jump to Skills Section ↓</a>` },
        { q: "what is your current role", a: () => INTENTS.find(i => i.keywords.includes("current")).response() },
        { q: "tell me about your education", a: () => INTENTS.find(i => i.keywords.includes("education")).response() + `\n\n<a href="#education" onclick="document.getElementById('chatPanel').classList.remove('open')">Jump to Education Section ↓</a>` },
        { q: "what projects have you worked on", a: () => INTENTS.find(i => i.keywords.includes("project")).response() + `\n\n<a href="#projects" onclick="document.getElementById('chatPanel').classList.remove('open')">Jump to Projects Section ↓</a>` },
        { q: "how can i contact you", a: () => INTENTS.find(i => i.keywords.includes("contact")).response() + `\n\n<a href="#contact" onclick="document.getElementById('chatPanel').classList.remove('open')">Jump to Contact Section ↓</a>` },
        { q: "what certifications do you have", a: () => INTENTS.find(i => i.keywords.includes("certification")).response() },
        { q: "tell me about your work at kpmg", a: () => INTENTS.find(i => i.keywords.includes("kpmg")).response() },
        { q: "tell me about your chatbot project", a: () => INTENTS.find(i => i.keywords.includes("chatbot")).response() },
        { q: "what did you do at qci", a: () => INTENTS.find(i => i.keywords.includes("qci")).response() },
        { q: "tell me about the api migration project", a: () => INTENTS.find(i => i.keywords.includes("api")).response() },
        { q: "describe the gem fraud detection work", a: () => INTENTS.find(i => i.keywords.includes("fraud")).response() },
        { q: "what is your github profile", a: () => INTENTS.find(i => i.keywords.includes("github")).response() },
        { q: "tell me about your data science background", a: () => `Manohar completed a **PGP in Data Science & Business Analytics** from **UT Austin McCombs** (2023-2024), with a capstone on predictive analytics for credit risk management.\n\nHis data skills include: ${CV_DATA.skills.dataAnalytics.join(', ')}.\n\n<a href="#education" onclick="document.getElementById('chatPanel').classList.remove('open')">See Education Section ↓</a>` },
        { q: "what programming languages do you know", a: () => `Manohar is proficient in **Python** and **SQL**, with frameworks like **Flask** and **Gradio**. His full tech stack: ${CV_DATA.skills.technical.join(', ')}.\n\n<a href="#about" onclick="document.getElementById('chatPanel').classList.remove('open')">See Skills Section ↓</a>` },
        { q: "what is your summary or profile", a: () => CV_DATA.summary },
        { q: "what is your background", a: () => CV_DATA.summary },
        { q: "where are you currently working", a: () => INTENTS.find(i => i.keywords.includes("current")).response() },
        { q: "what do you specialize in", a: () => `Manohar specializes in **Digital Transformation**, **AI/ML solutions** (especially Gen AI chatbots with RAG architecture), **Public Sector Advisory**, and **Data Analytics**. He excels at translating strategic policy into production-ready digital solutions.` },
        { q: "what is your expertise", a: () => `Manohar's areas of expertise include **Digital Government Advisory**, **NLP/Gen AI chatbot development**, **data-driven policy research**, **public financial management**, and **stakeholder management** across ministries and development agencies.` },
        { q: "can you download or share your resume", a: () => `You can learn everything about Manohar's profile right here! For a formal resume, please reach out at **${CV_DATA.email}**.\n\nOr check his profiles:\n- [LinkedIn](${CV_DATA.linkedin})\n- [E-Portfolio](${CV_DATA.eportfolio})\n- [Credly Badges](${CV_DATA.credly})\n\n<a href="#documents" onclick="document.getElementById('chatPanel').classList.remove('open')">Download CV from Documents Section ↓</a>` },
        { q: "who are you", a: () => INTENTS.find(i => i.keywords.includes("what are you")).response() },
        { q: "what can you do", a: () => `I can answer questions about Manohar's skills, experience, projects, and education. Try asking me "What are your skills?" or "Tell me about your projects!"` },
        { q: "are you a human", a: () => `I'm an AI assistant built by Manohar using a hybrid RAG architecture. I don't take coffee breaks, but I love answering questions about his portfolio!` }
    ];

    // Bigram-based fuzzy similarity (inspired by Bharatkosh POC SequenceMatcher)
    function stringSimilarity(s1, s2) {
        s1 = s1.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
        s2 = s2.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

        if (s1 === s2) return 1.0;

        const longer = s1.length > s2.length ? s1 : s2;
        const shorter = s1.length > s2.length ? s2 : s1;

        if (longer.length === 0) return 1.0;

        const getBigrams = (str) => {
            const bigrams = new Set();
            for (let i = 0; i < str.length - 1; i++) {
                bigrams.add(str.substring(i, i + 2));
            }
            return bigrams;
        };

        const b1 = getBigrams(s1);
        const b2 = getBigrams(s2);
        let intersection = 0;
        b1.forEach(b => { if (b2.has(b)) intersection++; });

        return (2.0 * intersection) / (b1.size + b2.size);
    }

    function fuzzyFAQMatch(query, threshold = 0.45) {
        let bestMatch = null;
        let bestScore = 0;

        for (const faq of FAQ_PAIRS) {
            const score = stringSimilarity(query, faq.q);
            if (score > bestScore) {
                bestScore = score;
                bestMatch = faq;
            }
        }

        if (bestScore >= threshold && bestMatch) {
            return bestMatch.a();
        }
        return null;
    }


    // ============================
    // LAYER 2: TF-IDF SIMILARITY SEARCH
    // ============================

    function buildChunks() {
        const chunks = [];
        chunks.push({ text: CV_DATA.summary, topic: "profile summary" });

        CV_DATA.experience.forEach(exp => {
            chunks.push({
                text: `${exp.company}. ${exp.role}. ${exp.duration}. ${exp.project}. ${exp.highlights.join('. ')}`,
                topic: `experience at ${exp.company}`
            });
        });

        CV_DATA.education.forEach(edu => {
            let text = `${edu.degree} from ${edu.institution} (${edu.year}). ${edu.details}`;
            if (edu.academicProjects) text += `. Academic projects: ${edu.academicProjects.join(', ')}`;
            chunks.push({
                text,
                topic: `education - ${edu.degree}`
            });
        });

        const allSkills = [...CV_DATA.skills.technical, ...CV_DATA.skills.dataAnalytics, ...CV_DATA.skills.consulting];
        chunks.push({ text: `Skills: ${allSkills.join(', ')}`, topic: "skills and tools" });

        chunks.push({ text: CV_DATA.keyProjects.join('. '), topic: "key projects" });

        chunks.push({
            text: CV_DATA.certifications.map(c => {
                let desc = `${c.name} from ${c.platform}`;
                if (c.courses) desc += `. 10-course series: ${c.courses.join(', ')}. Skills: ${c.skillsGained.join(', ')}. Tools: ${c.toolsLearned.join(', ')}`;
                return desc;
            }).join('. '),
            topic: "certifications"
        });

        return chunks;
    }

    function tokenize(text) {
        return text.toLowerCase()
            .replace(/[^a-z0-9\s]/g, ' ')
            .split(/\s+/)
            .filter(w => w.length > 2 && !STOP_WORDS.has(w));
    }

    const STOP_WORDS = new Set([
        'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'has', 'was',
        'one', 'our', 'out', 'his', 'her', 'its', 'had', 'how', 'who', 'did', 'get',
        'may', 'been', 'from', 'have', 'with', 'this', 'that', 'they', 'will', 'each',
        'make', 'like', 'been', 'more', 'some', 'than', 'them', 'very', 'when', 'what',
        'your', 'said', 'into', 'does', 'also', 'just', 'about', 'which', 'their',
        'would', 'there', 'these', 'other', 'could', 'after', 'being', 'those',
        'tell', 'know'
    ]);

    function computeTFIDF(chunks) {
        const tokenizedChunks = chunks.map(c => tokenize(c.text));
        const docCount = tokenizedChunks.length;

        const df = {};
        tokenizedChunks.forEach(tokens => {
            const unique = new Set(tokens);
            unique.forEach(t => { df[t] = (df[t] || 0) + 1; });
        });

        return tokenizedChunks.map(tokens => {
            const tf = {};
            tokens.forEach(t => { tf[t] = (tf[t] || 0) + 1; });

            const vec = {};
            Object.keys(tf).forEach(t => {
                vec[t] = (tf[t] / tokens.length) * Math.log(docCount / (df[t] || 1));
            });
            return vec;
        });
    }

    function cosineSimilarity(v1, v2) {
        const keys = new Set([...Object.keys(v1), ...Object.keys(v2)]);
        let dot = 0, mag1 = 0, mag2 = 0;
        keys.forEach(k => {
            const a = v1[k] || 0;
            const b = v2[k] || 0;
            dot += a * b;
            mag1 += a * a;
            mag2 += b * b;
        });
        return mag1 && mag2 ? dot / (Math.sqrt(mag1) * Math.sqrt(mag2)) : 0;
    }

    const chunks = buildChunks();
    const chunkVectors = computeTFIDF(chunks);

    function similaritySearch(query, topK = 3) {
        const queryTokens = tokenize(query);
        const queryTF = {};
        queryTokens.forEach(t => { queryTF[t] = (queryTF[t] || 0) + 1; });
        const queryVec = {};
        Object.keys(queryTF).forEach(t => {
            queryVec[t] = queryTF[t] / queryTokens.length;
        });

        const scores = chunkVectors.map((vec, i) => ({
            index: i,
            score: cosineSimilarity(queryVec, vec),
            chunk: chunks[i]
        }));

        scores.sort((a, b) => b.score - a.score);
        return scores.slice(0, topK).filter(s => s.score > 0.01);
    }

    function buildContextAnswer(query, results) {
        if (results.length === 0) return null;
        const context = results.map(r => r.chunk.text).join('\n\n');
        const topics = [...new Set(results.map(r => r.chunk.topic))];
        return `Based on Manohar's profile (${topics.join(', ')}), here is what I found:\n\n${context.split('. ').slice(0, 6).join('. ')}.`;
    }


    // ============================
    // LAYER 3: OLLAMA LLM (GENERATIVE)
    // (Same flow as Bharatkosh POC: context retrieval → prompt → LLM → validation)
    // ============================

    const OLLAMA_URL = 'http://localhost:11434';
    let ollamaAvailable = null;
    let ollamaModel = 'llama3.2:3b';
    let conversationHistory = []; // Multi-turn context (Bharatkosh POC pattern: last 6 messages)

    async function checkOllama() {
        try {
            const res = await fetch(`${OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(2000) });
            if (res.ok) {
                const data = await res.json();
                const models = data.models || [];
                if (models.length > 0) {
                    const preferred = ['llama3.2:3b', 'llama3.2:1b', 'llama3:8b', 'mistral', 'phi3'];
                    for (const pref of preferred) {
                        if (models.some(m => m.name.includes(pref))) {
                            ollamaModel = models.find(m => m.name.includes(pref)).name;
                            break;
                        }
                    }
                    if (!ollamaModel) ollamaModel = models[0].name;
                    ollamaAvailable = true;
                    return true;
                }
            }
        } catch (e) { /* Ollama not running */ }
        ollamaAvailable = false;
        return false;
    }

    const SYSTEM_PROMPT = `You are a friendly AI assistant embedded on Sattaru Manohar's portfolio website. Your role is to answer questions about Manohar's professional profile, experience, skills, projects, and background based on the provided context.

Instructions:
- Be concise and professional (max 5-6 lines)
- Use bullet points for lists
- If context doesn't contain the answer, say you don't have that specific info and suggest related topics
- Always be positive and highlight Manohar's strengths

Key facts:
- Name: ${CV_DATA.name}
- Current Role: ${CV_DATA.currentRole}
- Experience: ${CV_DATA.totalExperience}
- Email: ${CV_DATA.email} | Phone: ${CV_DATA.phone}
- LinkedIn: ${CV_DATA.linkedin} | GitHub: ${CV_DATA.github}`;

    async function queryOllama(userQuery, context) {
        try {
            // Build messages with conversation history (last 6 messages like Bharatkosh POC)
            const messages = [
                { role: 'system', content: SYSTEM_PROMPT },
                ...conversationHistory.slice(-6),
                { role: 'user', content: `Context from CV:\n${context}\n\nUser Question: ${userQuery}` }
            ];

            const res = await fetch(`${OLLAMA_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: ollamaModel,
                    messages: messages,
                    stream: false,
                    options: { temperature: 0.5, num_predict: 300 }
                }),
                signal: AbortSignal.timeout(30000)
            });

            if (res.ok) {
                const data = await res.json();
                const answer = data.message?.content || null;
                if (answer) {
                    // Update conversation history
                    conversationHistory.push({ role: 'user', content: userQuery });
                    conversationHistory.push({ role: 'assistant', content: answer });
                    // Trim to last 6 messages
                    if (conversationHistory.length > 6) {
                        conversationHistory = conversationHistory.slice(-6);
                    }
                }
                return answer;
            }
        } catch (e) {
            console.warn('Ollama query failed:', e.message);
        }
        return null;
    }


    // ============================
    // HYBRID RAG PIPELINE
    // Query → Keyword Lookup → Fuzzy FAQ → TF-IDF Retrieval → Ollama LLM → Fallback
    // ============================

    async function processQuery(query) {
        // Layer 1: Direct keyword lookup (instant, highest confidence)
        const lookupResult = lookupIntent(query);
        if (lookupResult) {
            return { answer: lookupResult, source: 'lookup', confidence: 'high' };
        }

        // Layer 1.5: Fuzzy FAQ matching (Bharatkosh-style SequenceMatcher)
        const faqResult = fuzzyFAQMatch(query);
        if (faqResult) {
            return { answer: faqResult, source: 'faq-match', confidence: 'high' };
        }

        // Layer 2: TF-IDF similarity search for context retrieval
        const similarResults = similaritySearch(query, 3);
        const retrievedContext = similarResults.map(r => r.chunk.text).join('\n\n');

        // Layer 3: Try Ollama LLM with retrieved context (Bharatkosh-style RAG)
        if (ollamaAvailable === null) await checkOllama();

        if (ollamaAvailable && retrievedContext) {
            const llmAnswer = await queryOllama(query, retrievedContext);
            if (llmAnswer) {
                return { answer: llmAnswer, source: 'ollama-rag', confidence: 'high' };
            }
        }

        // Layer 2 fallback: Structured answer from similarity results
        if (similarResults.length > 0) {
            const fallbackAnswer = buildContextAnswer(query, similarResults);
            if (fallbackAnswer) {
                return { answer: fallbackAnswer, source: 'similarity', confidence: 'medium' };
            }
        }

        // Final fallback (Smart Deep Link Navigator)
        return {
            answer: `I'm not exactly sure, but I can help you navigate! Click a section below to jump right to it:\n\n<p style="margin: 6px 0;">• <a href="#experience" onclick="document.getElementById('chatPanel').classList.remove('open')" style="font-weight: 500;">Work Experience</a></p><p style="margin: 6px 0;">• <a href="#projects" onclick="document.getElementById('chatPanel').classList.remove('open')" style="font-weight: 500;">Key Projects</a></p><p style="margin: 6px 0;">• <a href="#education" onclick="document.getElementById('chatPanel').classList.remove('open')" style="font-weight: 500;">Education</a></p><p style="margin: 6px 0;">• <a href="#certifications" onclick="document.getElementById('chatPanel').classList.remove('open')" style="font-weight: 500;">Certifications</a></p><p style="margin: 6px 0;">• <a href="#contact" onclick="document.getElementById('chatPanel').classList.remove('open')" style="font-weight: 500;">Contact Me</a></p>`,
            source: 'fallback',
            confidence: 'low'
        };
    }


    // ============================
    // CHAT UI CONTROLLER
    // ============================

    let chatOpen = false;
    let messageHistory = [];

    function init() {
        // Bind event listeners to hardcoded HTML elements
        const toggleBtn = document.getElementById('chatFab');
        const closeBtn = document.getElementById('chatCloseBtn');
        const refreshBtn = document.getElementById('chatRefreshBtn');
        const form = document.getElementById('chatForm');

        if (toggleBtn) toggleBtn.addEventListener('click', toggleChat);
        if (closeBtn) closeBtn.addEventListener('click', () => { if (chatOpen) toggleChat(); });

        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                document.getElementById('chatMessages').innerHTML = '';
                messageHistory = [];
                addInitialMessage();

                // Show suggestions again
                const suggestions = document.getElementById('chatSuggestions');
                if (suggestions) suggestions.style.display = 'flex';
                updateStatus('Hybrid RAG Engine');
            });
        }

        if (form) {
            form.addEventListener('submit', (e) => handleSubmit(e));
        }

        // Bind suggestion buttons
        document.querySelectorAll('.chat-suggestion-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                sendSuggestion(btn.getAttribute('data-query'));
            });
        });

        // 5-second recurring tooltip logic
        setTimeout(() => {
            setInterval(() => {
                const tooltip = document.querySelector('.chatbot-tooltip');
                if (tooltip && !chatOpen) {
                    tooltip.classList.add('show-tooltip');
                    setTimeout(() => {
                        tooltip.classList.remove('show-tooltip');
                    }, 3500); // Show it for 3.5 seconds
                }
            }, 8500); // Trigger every 8.5 seconds (effectively 5 seconds hidden)
        }, 1000);

        addInitialMessage();
    }

    function addInitialMessage() {
        checkOllama().then(available => {
            if (available) {
                addBotMessage(`Hello! 👋 I'm Manohar's AI assistant, powered by **${ollamaModel}** with a hybrid RAG engine. Ask me anything about his experience, skills, projects, or background!`);
            } else {
                addBotMessage(`Hello! 👋 I'm Manohar's AI assistant. I use a hybrid RAG engine to answer questions about his experience, skills, projects, education, and more. How can I help you today?`);
            }
        });
    }

    function toggleChat() {
        chatOpen = !chatOpen;
        const panel = document.getElementById('chatPanel');
        const fabIcon = document.querySelector('.chat-fab-icon');
        const fabClose = document.querySelector('.chat-fab-close');

        if (chatOpen) {
            panel.classList.add('open');
            if (fabIcon) fabIcon.style.display = 'none';
            if (fabClose) fabClose.style.display = 'flex';
            document.getElementById('chatInput').focus();
        } else {
            panel.classList.remove('open');
            if (fabIcon) fabIcon.style.display = 'flex';
            if (fabClose) fabClose.style.display = 'none';
        }
    }

    function addBotMessage(text) {
        const messages = document.getElementById('chatMessages');
        const msg = document.createElement('div');
        msg.className = 'chat-message bot';
        msg.innerHTML = `
      <div class="chat-message-avatar">SM</div>
      <div class="chat-message-bubble">${formatMarkdown(text)}</div>
    `;
        messages.appendChild(msg);
        messages.scrollTop = messages.scrollHeight;
        messageHistory.push({ role: 'assistant', content: text });
    }

    function addUserMessage(text) {
        const messages = document.getElementById('chatMessages');
        const msg = document.createElement('div');
        msg.className = 'chat-message user';
        msg.innerHTML = `<div class="chat-message-bubble">${escapeHTML(text)}</div>`;
        messages.appendChild(msg);
        messages.scrollTop = messages.scrollHeight;
        messageHistory.push({ role: 'user', content: text });
    }

    function showTyping() {
        const messages = document.getElementById('chatMessages');
        const typing = document.createElement('div');
        typing.className = 'chat-message bot typing-indicator';
        typing.id = 'typingIndicator';
        typing.innerHTML = `
      <div class="chat-message-avatar">SM</div>
      <div class="chat-message-bubble">
        <div class="typing-dots"><span></span><span></span><span></span></div>
      </div>
    `;
        messages.appendChild(typing);
        messages.scrollTop = messages.scrollHeight;
    }

    function hideTyping() {
        const el = document.getElementById('typingIndicator');
        if (el) el.remove();
    }

    function updateStatus(text) {
        const el = document.getElementById('chatStatus');
        if (el) el.innerHTML = `<span class="status-dot"></span> ${text}`;
    }

    function formatMarkdown(text) {
        return text
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/_(.+?)_/g, '<em>$1</em>')
            .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
            .replace(/^• /gm, '&bull; ')
            .replace(/^\d+\. /gm, (m) => m)
            .replace(/\n/g, '<br>');
    }

    function escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const input = document.getElementById('chatInput');
        const query = input.value.trim();
        if (!query) return;

        input.value = '';
        addUserMessage(query);

        const suggestions = document.getElementById('chatSuggestions');
        if (suggestions) suggestions.style.display = 'none';

        showTyping();
        updateStatus('Processing query...');

        try {
            const result = await processQuery(query);
            hideTyping();

            // Source indicator (like Bharatkosh POC's source labeling)
            const sourceLabels = {
                'lookup': '⚡',
                'faq-match': '🎯',
                'ollama-rag': '🧠',
                'similarity': '🔍',
                'fallback': '💬'
            };
            const sourceEmoji = sourceLabels[result.source] || '';
            addBotMessage(result.answer + (sourceEmoji ? ` ${sourceEmoji}` : ''));

            const statusText = ollamaAvailable ? `Connected: ${ollamaModel}` : 'Hybrid RAG Engine';
            updateStatus(statusText);
        } catch (err) {
            hideTyping();
            addBotMessage("Sorry, I encountered an error. Please try asking in a different way!");
            updateStatus('Ready');
        }
    }

    function sendSuggestion(text) {
        document.getElementById('chatInput').value = text;
        handleSubmit(new Event('submit'));
    }

    // Public API
    return {
        init,
        toggle: toggleChat,
        handleSubmit,
        sendSuggestion
    };
})();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', ChatBot.init);
