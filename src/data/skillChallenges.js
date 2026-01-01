// Skill Challenge Data Structure

export const skillChallenges = {
  'uiux-design': {
    id: 'uiux-design',
    name: 'UI/UX Design',
    description: 'Belajar fundamental design untuk digital product',
    icon: '🎨',
    days: [
      {
        day: 1,
        title: 'Introduction to UI/UX',
        description: 'Tonton video "What is UI/UX?" (5 menit) dan pahami perbedaan antara UI (User Interface) dan UX (User Experience). UI fokus ke visual, UX fokus ke pengalaman pengguna.',
        resources: [
          'Video: What is UI/UX? (YouTube)',
          'Article: The Difference Between UI and UX',
        ],
        reflectionPrompt: 'Apa yang menarik buat kamu dari UI/UX design? Apa yang bikin kamu pengen explore lebih dalam?',
      },
      {
        day: 2,
        title: 'First Sketch',
        description: 'Ambil kertas dan pensil, sketch 3 screen app sederhana (misalnya: login screen, home screen, profile screen). Nggak perlu sempurna, fokus ke layout dan struktur.',
        resources: [
          'Tips: Think about what users need to see first',
          'Inspiration: dribbble.com untuk referensi',
        ],
        reflectionPrompt: 'Apa yang challenging? Apa yang surprisingly fun dari sketching?',
      },
      {
        day: 3,
        title: 'Wireframing',
        description: 'Buat wireframe digital dari sketch kemarin pakai Figma (gratis). Wireframe = blueprint dari design kamu, tanpa warna atau detail visual. Fokus ke struktur dan hierarchy.',
        resources: [
          'Tool: Figma (figma.com/signup)',
          'Tutorial: Basic Wireframing in Figma (15 menit)',
        ],
        reflectionPrompt: 'Apa bedanya digital vs paper? Tool mana yang lebih comfortable buat kamu?',
      },
      {
        day: 4,
        title: 'Color & Typography',
        description: 'Pilih color palette (3-5 warna) dan 1-2 fonts untuk app kamu. Pakai tools seperti Coolors atau Google Fonts. Apply ke wireframe kemarin.',
        resources: [
          'Tool: coolors.co untuk color palette',
          'Tool: fonts.google.com untuk typography',
        ],
        reflectionPrompt: 'Kenapa pilih kombinasi warna dan font ini? Apa yang kamu pertimbangkan?',
      },
      {
        day: 5,
        title: 'Prototype',
        description: 'Connect screens di Figma jadi clickable prototype. Buat simple flow: login → home → profile. Coba click-through sendiri.',
        resources: [
          'Tutorial: Creating Prototypes in Figma',
          'Tip: Use arrow keys to connect screens',
        ],
        reflectionPrompt: 'Gimana rasanya lihat design kamu jadi "hidup" dan clickable?',
      },
      {
        day: 6,
        title: 'User Testing',
        description: 'Minta 2 orang (temen, keluarga, siapapun) untuk coba prototype kamu. Catat feedback mereka: apa yang confusing? apa yang mereka suka?',
        resources: [
          'Questions to ask: What do you think this app does?',
          'Questions to ask: Is anything confusing?',
        ],
        reflectionPrompt: 'Apa feedback yang surprising? Apa yang nggak kamu expect dari user testing?',
      },
      {
        day: 7,
        title: 'Iteration',
        description: 'Improve design berdasarkan feedback. Bisa aja ganti warna, pindahin button, atau simplify flow. Lalu reflect: what did you learn?',
        resources: [
          'Remember: Design is iterative, never "done"',
          'Celebrate: You completed 7 days!',
        ],
        reflectionPrompt: 'Apa yang kamu pelajari selama 7 hari ini? Apa next step yang pengen kamu ambil?',
      },
    ],
  },
  'web-development': {
    id: 'web-development',
    name: 'Web Development',
    description: 'Mulai journey jadi web developer dengan HTML, CSS, JavaScript',
    icon: '💻',
    days: [
      {
        day: 1,
        title: 'HTML Basics',
        description: 'Belajar fundamental HTML: tags, elements, structure. Buat halaman sederhana dengan heading, paragraph, dan link.',
        resources: [
          'Tutorial: HTML Crash Course (20 menit)',
          'Practice: w3schools.com/html',
        ],
        reflectionPrompt: 'Apa yang surprising dari cara HTML bekerja?',
      },
      {
        day: 2,
        title: 'CSS Styling',
        description: 'Tambahkan CSS ke halaman HTML kemarin. Experiment dengan colors, fonts, spacing. Buat halaman kamu lebih menarik.',
        resources: [
          'Tutorial: CSS Basics',
          'Tool: CSS Color Picker',
        ],
        reflectionPrompt: 'Apa perbedaan yang kamu rasakan setelah add CSS?',
      },
      {
        day: 3,
        title: 'Flexbox Layout',
        description: 'Belajar CSS Flexbox untuk arrange elements. Buat simple navigation bar dan card layout.',
        resources: [
          'Game: flexboxfroggy.com (fun way to learn!)',
          'Cheatsheet: CSS Flexbox Guide',
        ],
        reflectionPrompt: 'Apa yang challenging dari flexbox? Kapan mulai "click"?',
      },
      {
        day: 4,
        title: 'JavaScript Intro',
        description: 'Mulai JavaScript: variables, functions, DOM manipulation. Buat button yang bisa show/hide text.',
        resources: [
          'Tutorial: JavaScript for Beginners',
          'Practice: Add interactivity to your page',
        ],
        reflectionPrompt: 'Gimana rasanya pertama kali lihat code kamu "do something"?',
      },
      {
        day: 5,
        title: 'Build a Form',
        description: 'Buat form dengan validation (name, email, message). Pakai HTML5 validation atau JavaScript.',
        resources: [
          'Tutorial: Form Validation',
          'Example: Contact Form',
        ],
        reflectionPrompt: 'Apa yang tricky tentang form validation?',
      },
      {
        day: 6,
        title: 'Responsive Design',
        description: 'Buat website kamu responsive untuk mobile. Pakai media queries dan test di different screen sizes.',
        resources: [
          'Guide: Media Queries',
          'Tool: Browser DevTools for testing',
        ],
        reflectionPrompt: 'Apa bedanya design untuk mobile vs desktop?',
      },
      {
        day: 7,
        title: 'Deploy Your Site',
        description: 'Deploy website kamu ke internet pakai Netlify atau GitHub Pages (gratis). Share link ke temen!',
        resources: [
          'Tutorial: Deploy to Netlify',
          'Tutorial: GitHub Pages Setup',
        ],
        reflectionPrompt: 'Gimana perasaan kamu lihat website sendiri live di internet?',
      },
    ],
  },
  'content-writing': {
    id: 'content-writing',
    name: 'Content Writing',
    description: 'Belajar craft compelling content untuk blog, social media, atau copywriting',
    icon: '✍️',
    days: [
      {
        day: 1,
        title: 'Finding Your Voice',
        description: 'Tulis 3 paragraf tentang topik yang kamu passionate about. Tulis seperti ngobrol ke temen. Nggak perlu formal.',
        resources: [
          'Tip: Write like you talk',
          'Exercise: Freewriting for 10 minutes',
        ],
        reflectionPrompt: 'Apa tone yang natural buat kamu? Friendly? Professional? Casual?',
      },
      {
        day: 2,
        title: 'Headline Practice',
        description: 'Tulis 10 headlines untuk artikel yang sama. Experiment dengan different angles, lengths, emotions.',
        resources: [
          'Formula: Number + Adjective + Keyword + Promise',
          'Examples: "5 Simple Ways to..."',
        ],
        reflectionPrompt: 'Headline mana yang paling kamu suka? Kenapa?',
      },
      {
        day: 3,
        title: 'Storytelling',
        description: 'Tulis short story (300 kata) tentang pengalaman personal. Ada beginning, middle, end. Ada lesson learned.',
        resources: [
          'Structure: Setup → Conflict → Resolution',
          'Tip: Show, don\'t tell',
        ],
        reflectionPrompt: 'Apa yang sulit dari storytelling? Apa yang flow naturally?',
      },
      {
        day: 4,
        title: 'Editing Practice',
        description: 'Ambil tulisan Day 1. Edit dengan fokus: remove fluff, fix grammar, improve clarity. Cut 20% dari word count.',
        resources: [
          'Tool: Grammarly atau Hemingway Editor',
          'Tip: Read out loud',
        ],
        reflectionPrompt: 'Apa yang kamu cut? Apa impact-nya ke readability?',
      },
      {
        day: 5,
        title: 'Call-to-Action',
        description: 'Tulis 5 different CTAs untuk produk yang sama. Experiment dengan urgency, benefit, curiosity.',
        resources: [
          'Examples: "Start Free Trial", "Join Now", "Learn More"',
          'Psychology: What makes people click?',
        ],
        reflectionPrompt: 'CTA mana yang paling compelling? Apa yang bikin beda?',
      },
      {
        day: 6,
        title: 'Social Media Post',
        description: 'Tulis 3 posts untuk platform berbeda: Twitter thread, Instagram caption, LinkedIn post. Same topic, different style.',
        resources: [
          'Twitter: Short, punchy, thread-worthy',
          'Instagram: Visual, emotional, hashtags',
          'LinkedIn: Professional, insights, value',
        ],
        reflectionPrompt: 'Apa yang kamu adjust untuk each platform?',
      },
      {
        day: 7,
        title: 'Your First Article',
        description: 'Tulis artikel lengkap (500-700 kata) tentang apa yang kamu pelajari selama 7 hari ini. Include tips untuk beginners.',
        resources: [
          'Structure: Intro → Body → Conclusion',
          'Tip: Add subheadings for scanability',
        ],
        reflectionPrompt: 'Apa biggest lesson dari content writing challenge ini?',
      },
    ],
  },
};

export const getSkillById = (skillId) => {
  return skillChallenges[skillId] || null;
};

export const getAllSkills = () => {
  return Object.values(skillChallenges);
};
