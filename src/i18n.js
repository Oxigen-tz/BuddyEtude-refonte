import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  fr: {
    translation: {
      layout: {
        nav: {
          Dashboard: "Tableau de bord",
          Search: "Rechercher",
          Messages: "Messages",
          Sessions: "Sessions",
          Profile: "Mon profil",
          Settings: "Paramètres"
        },
        notifications: {
          title: "Notifications",
          markAllRead: "Tout marquer comme lu",
          empty: "Aucune nouvelle notification.",
          acceptedTitle: "Demande acceptée 🎉",
          acceptedBody: "{{name}} a accepté votre demande de binôme !",
          acceptedToast: "🎉 Bonne nouvelle !",
          inviteTitle: "Nouvelle invitation 👋",
          inviteBody: "{{name}} souhaite réviser avec vous !",
          inviteToast: "Nouvelle demande de {{name}} !",
          view: "Voir"
        },
        language: "English",
        logout: "Déconnexion"
      },
      dashboard: {
        greeting: "Bonjour, {{name}}",
        subtitle: "Prêt à booster vos révisions aujourd'hui ?",
        findBuddy: "Trouver un binôme",
        tutorial: {
          title_ready: "Félicitations, vous êtes prêt !",
          title_welcome: "Bienvenue sur votre espace !",
          desc_ready: "Vous avez accompli toutes les étapes de base. Vous pouvez maintenant fermer ce tutoriel et profiter pleinement de BuddyEtude !",
          desc_welcome: "Suivez ces 3 étapes simples pour débloquer tout le potentiel de BuddyEtude et commencer à réviser à plusieurs.",
          step1: "Compléter mon profil",
          step1_done: "Profil validé et visible.",
          step1_todo: "Ajoutez vos matières et votre niveau.",
          step2: "Trouver un binôme",
          step2_done: "Vous avez des partenaires d'étude.",
          step2_todo: "Cherchez des étudiants compatibles.",
          step3: "Lancer une session",
          step3_done: "Première session planifiée !",
          step3_ready: "Organisez votre premier tableau blanc !",
          step3_todo: "Disponible une fois votre binôme trouvé."
        },
        contacts: {
          title: "Nouveaux contacts",
          subtitle: "Faites le premier pas !",
          desc: "Découvrez les étudiants qui partagent vos matières et proposez-leur de travailler.",
          button: "Explorer les profils"
        },
        sessions: {
          title: "Prochaines sessions",
          subtitle: "Votre agenda est vide",
          desc: "Il est temps d'organiser votre prochaine session de révision au tableau blanc.",
          button: "Planifier une session"
        }
      },
      // --- TRADUCTIONS DE LA PAGE D'ACCUEIL ---
      hero: {
        badge: "Tableau blanc collaboratif intégré",
        title1: "Trouvez votre",
        title_highlight: "binôme d'études",
        title2: "idéal",
        subtitle_part1: "Ne révisez plus seul. Trouvez des étudiants de votre niveau, lancez une session et ",
        subtitle_bold: "collaborez en temps réel sur notre tableau blanc",
        subtitle_part2: ".",
        btn_dashboard: "Accéder à mon espace",
        btn_start: "C'est parti !",
        stats: {
          // "free" et "realtime" sont vérifiables par le visiteur ; on a retiré
          // "0ms latence" (faux) et "∞ matières" (invérifiable).
          free: "Gratuit",
          realtime_value: "Live",
          realtime: "Collaboration"
        }
      },
      features: {
        title: "Étudier à deux, avec les bons outils",
        subtitle: "BuddyEtude n'est pas qu'un simple annuaire de rencontre étudiante, c'est une plateforme de travail complète.",
        items: {
          goals: {
            title: "Objectifs communs",
            desc: "Filtrez par examen ou chapitre en cours pour trouver un partenaire qui révise exactement la même chose que vous."
          },
          chat: {
            title: "Chat intégré",
            desc: "Messagerie texte avec partage de fichiers et de notes, directement dans l'appli, sans passer par WhatsApp ou Discord."
          },
          whiteboard: {
            title: "Tableau blanc temps réel",
            desc: "Dessinez, écrivez et résolvez des problèmes ensemble sur un espace de travail collaboratif fluide."
          },
          matching: {
            title: "Matching intelligent",
            desc: "Un algorithme de filtrage croise niveau d'études, matière et créneaux de disponibilité pour proposer des binômes compatibles."
          },
          schedule: {
            title: "Sessions planifiées",
            desc: "Proposez un créneau, votre binôme confirme, et la session apparaît automatiquement dans votre agenda BuddyEtude."
          },
          subjects: {
            title: "Toutes les matières",
            desc: "Mathématiques, droit, médecine, langues... Il y a forcément un binôme pour votre spécialité."
          }
        }
      },
      cta: {
        title: "Prêt à trouver votre binôme ?",
        subtitle: "Rejoignez BuddyEtude gratuitement et commencez à étudier plus efficacement dès aujourd'hui.",
        button: "Créer mon compte"
      }
    }
  },
  en: {
    translation: {
      layout: {
        nav: {
          Dashboard: "Dashboard",
          Search: "Search",
          Messages: "Messages",
          Sessions: "Sessions",
          Profile: "My Profile",
          Settings: "Settings"
        },
        notifications: {
          title: "Notifications",
          markAllRead: "Mark all as read",
          empty: "No new notifications.",
          acceptedTitle: "Request accepted 🎉",
          acceptedBody: "{{name}} accepted your buddy request!",
          acceptedToast: "🎉 Good news!",
          inviteTitle: "New invitation 👋",
          inviteBody: "{{name}} wants to study with you!",
          inviteToast: "New request from {{name}}!",
          view: "View"
        },
        language: "Français",
        logout: "Logout"
      },
      dashboard: {
        greeting: "Hello, {{name}}",
        subtitle: "Ready to boost your studies today?",
        findBuddy: "Find a buddy",
        tutorial: {
          title_ready: "Congratulations, you're ready!",
          title_welcome: "Welcome to your space!",
          desc_ready: "You have completed all basic steps. You can now close this tutorial and fully enjoy BuddyEtude!",
          desc_welcome: "Follow these 3 simple steps to unlock BuddyEtude's full potential and start studying together.",
          step1: "Complete my profile",
          step1_done: "Profile validated and visible.",
          step1_todo: "Add your subjects and level.",
          step2: "Find a buddy",
          step2_done: "You have study partners.",
          step2_todo: "Look for compatible students.",
          step3: "Start a session",
          step3_done: "First session scheduled!",
          step3_ready: "Organize your first whiteboard!",
          step3_todo: "Available once your buddy is found."
        },
        contacts: {
          title: "New contacts",
          subtitle: "Make the first move!",
          desc: "Discover students sharing your subjects and propose to study together.",
          button: "Explore profiles"
        },
        sessions: {
          title: "Upcoming sessions",
          subtitle: "Your schedule is empty",
          desc: "It's time to organize your next whiteboard revision session.",
          button: "Schedule a session"
        }
      },
      // --- ENGLISH LANDING PAGE TRANSLATIONS ---
      hero: {
        badge: "Integrated collaborative whiteboard",
        title1: "Find your ideal",
        title_highlight: "study buddy",
        title2: "today",
        subtitle_part1: "Stop studying alone. Find students at your level, start a session and ",
        subtitle_bold: "collaborate in real-time on our whiteboard",
        subtitle_part2: ".",
        btn_dashboard: "Go to my dashboard",
        btn_start: "Let's get started!",
        stats: {
          free: "Free",
          realtime_value: "Live",
          realtime: "Collaboration"
        }
      },
      features: {
        title: "Study together, with the right tools",
        subtitle: "BuddyEtude is not just a student directory, it's a complete workspace.",
        items: {
          goals: {
            title: "Common goals",
            desc: "Filter by exam or chapter to find a partner reviewing exactly the same material as you."
          },
          chat: {
            title: "Integrated chat",
            desc: "Text messaging with file and note sharing, built into the app — no need for WhatsApp or Discord."
          },
          whiteboard: {
            title: "Real-time whiteboard",
            desc: "Draw, write, and solve problems together on a fluid collaborative workspace."
          },
          matching: {
            title: "Smart matching",
            desc: "A filtering algorithm cross-references study level, subject, and availability to suggest compatible buddies."
          },
          schedule: {
            title: "Scheduled sessions",
            desc: "Propose a time slot, your buddy confirms it, and the session shows up automatically in your BuddyEtude calendar."
          },
          subjects: {
            title: "All subjects",
            desc: "Maths, law, medicine, languages... There's definitely a buddy for your specialty."
          }
        }
      },
      cta: {
        title: "Ready to find your buddy?",
        subtitle: "Join BuddyEtude for free and start studying more effectively today.",
        button: "Create my account"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;