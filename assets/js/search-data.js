// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "About",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "Blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-projects",
          title: "Projects",
          description: "Ongoing projects and expertise including an interactive normalizing flow slider.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-repositories",
          title: "Repositories",
          description: "A collection of my open-source projects and repositories on GitHub.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/repositories/";
          },
        },{id: "nav-resume",
          title: "Resume",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "post-deep-learning-based-particle-identification-in-the-glue-x-experiment",
        
          title: "Deep Learning-Based Particle Identification In The Glue-X Experiment",
        
        description: "A comprehensive study on applying deep learning and hyperparameter optimization for particle classification in nuclear physics",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/particle-identification/";
          
        },
      },{id: "post-instructions-for-setting-up-twilio-for-use-in-applications",
        
          title: 'Instructions for setting up Twilio for use in applications <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "Beginner-friendly overview of Twilio setup, access tokens, TwiML, and conference calls with the Twilio Voice JS SDK.",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/@anupam.siwakoti/instructions-for-setting-up-twilio-for-use-in-applications-ac607ca8b949", "_blank");
          
        },
      },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather/";
            },},{id: "news-visiting-researcher-gluex-pid-project-gluex-collaboration-halld-project-url-invited-position-may-1-21-2024",
          title: 'Visiting Researcher - GlueX PID Project (GlueX Collaboration / HallD). Project URL. Invited...',
          description: "",
          section: "News",},{id: "news-invited-speaker-best-practice-for-ai-in-nuclear-physics-applications-cebaf-center-documentation-url-invited-position-feb-18-19-2025-jefferson-lab-virginia",
          title: 'Invited Speaker - “Best practice for AI in nuclear physics applications” (CEBAF Center)....',
          description: "",
          section: "News",},{id: "news-met-with-the-octavo-team-and-their-cto-to-explore-integrating-my-edge-and-software-sdks-we-discussed-a-joint-path-for-future-collaboration-and-a-technical-roadmap-for-sdk-compatibility-and-deployment",
          title: 'Met with the Octavo team and their CTO to explore integrating my edge...',
          description: "",
          section: "News",},{id: "news-attended-the-partnerships-between-academia-and-the-midstream-industry-symposium-oct-15-16-2025-and-presented-physics-inspired-methods-for-real-time-industrial-analytics-at-the-edge",
          title: 'Attended the Partnerships Between Academia and the Midstream Industry Symposium (Oct 15–16, 2025)...',
          description: "",
          section: "News",},{id: "news-invited-exhibitor-live-anomaly-detection-demonstration-center-for-data-analytics-and-cybersecurity-lamar-university-invited-position",
          title: 'Invited Exhibitor - Live Anomaly Detection Demonstration (Center for Data Analytics and Cybersecurity,...',
          description: "",
          section: "News",},{id: "projects-explore-preprocessing-checkpoint",
          title: 'Explore_preprocessing Checkpoint',
          description: "",
          section: "Projects",handler: () => {
              window.location.href = "/projects/Genesis/notebooks/.ipynb_checkpoints/explore_preprocessing-checkpoint/";
            },},{id: "projects-explore-preprocessing",
          title: 'Explore_preprocessing',
          description: "",
          section: "Projects",handler: () => {
              window.location.href = "/projects/Genesis/notebooks/explore_preprocessing/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%61%73%69%77%61%6B%6F%74%69@%6C%61%6D%61%72.%65%64%75", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/Anupam1223", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/anupamsiwakoti", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
