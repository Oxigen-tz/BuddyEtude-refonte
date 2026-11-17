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
        logout: "Déconnexion",
        menu: "Menu"
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
      // --- LANDING : barre de navigation ---
      home: {
        nav: {
          login: "Connexion",
          signup: "Inscription",
          dashboard: "Tableau de bord",
          switchLanguage: "Changer de langue"
        }
      },
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
        previewAlt: "Aperçu du tableau blanc collaboratif et de la messagerie de BuddyEtude",
        social: {
          early: "Plateforme en <bold>lancement</bold> — rejoins les premiers étudiants !",
          active: "Rejoins déjà <bold>{{count}} étudiants</bold> actifs sur la plateforme !"
        }
      },
      features: {
        title: "Étudier à deux, avec les bons outils",
        subtitle: "Trouver un partenaire, discuter, planifier et réviser sur un tableau blanc partagé : tout se passe au même endroit.",
        items: {
          filters: {
            title: "Recherche ciblée",
            desc: "Filtrez par matière, niveau d'études, ville et mode (en ligne ou présentiel) pour trouver quelqu'un qui révise la même chose que vous."
          },
          chat: {
            title: "Chat intégré",
            desc: "Messagerie avec envoi de fichiers, directement dans l'appli, sans passer par WhatsApp ou Discord."
          },
          whiteboard: {
            title: "Tableau blanc temps réel",
            desc: "Dessinez, écrivez et résolvez des problèmes ensemble sur un espace de travail collaboratif fluide."
          },
          requests: {
            title: "Une demande, un message",
            desc: "Présentez-vous en quelques mots. Si l'autre accepte, la discussion s'ouvre et vous pouvez planifier une session."
          },
          schedule: {
            title: "Sessions planifiées",
            desc: "Choisissez un binôme, une date, une heure et une durée, en ligne ou en présentiel. Vos sessions sont regroupées dans une page dédiée."
          },
          subjects: {
            title: "Toutes les matières",
            desc: "Mathématiques, droit, médecine, langues… La matière est libre : indiquez la vôtre et voyez qui la partage."
          }
        }
      },
      cta: {
        title: "Prêt à trouver votre binôme ?",
        subtitle: "Connectez-vous avec Google, complétez votre profil et envoyez votre première demande de binôme. C'est gratuit.",
        button: "Créer mon compte",
        buttonLoggedIn: "Accéder à mon tableau de bord"
      },
      footer: {
        tagline: "Créé par un étudiant, pour les étudiants. Notre mission est de rendre l'entraide académique accessible à tous, partout en France, grâce à des outils collaboratifs puissants.",
        platform: "Plateforme",
        about: "À propos de nous",
        findBuddy: "Trouver un binôme",
        support: "Support & Légal",
        legal: "Mentions Légales & CGU",
        privacy: "Politique de Confidentialité",
        rights: "Tous droits réservés"
      },
      // --- NOUVEAU : PAGE "TROUVER UN BINÔME" ---
      search: {
        title: "Trouver un binôme",
        subtitle: "Filtrez les profils pour trouver le partenaire d'étude idéal",
        searchPlaceholder: "Rechercher par nom ou école...",
        subjectPlaceholder: "Filtrer par matière (ex: Droit, Cinéma...)",
        cityPlaceholder: "Filtrer par ville...",
        defaultSubject: "Général",
        defaultStudent: "Étudiant",
        levels: {
          all: "Tous les niveaux",
          college: "Collège",
          lycee: "Lycée",
          prepa: "Prépa",
          bts_iut: "BTS / IUT",
          licence: "Licence",
          master: "Master",
          doctorat: "Doctorat"
        },
        types: {
          all: "En ligne & Présentiel",
          online: "En ligne uniquement",
          inperson: "Présentiel uniquement"
        },
        loginRequired: {
          title: "Connexion requise",
          desc: "Tu dois être connecté à ton compte BuddyEtude pour accéder à la recherche de binômes et contacter des étudiants.",
          button: "Retourner à l'accueil / Se connecter"
        },
        noResults: {
          title: "Aucun profil ne correspond",
          desc: "Essayez d'élargir votre recherche en retirant certains filtres ou en modifiant vos mots-clés.",
          reset: "Réinitialiser les filtres"
        },
        requestDialog: {
          title: "Proposer une session",
          desc: "Envoyez un petit mot à <bold>{{name}}</bold> pour vous présenter et proposer d'étudier ensemble.",
          placeholder: "Bonjour ! J'ai vu que tu préparais aussi les mêmes examens...",
          cancel: "Annuler",
          send: "Envoyer ma demande"
        },
        toast: {
          success: "Demande envoyée avec succès !",
          error: "Impossible d'envoyer la demande",
          loadError: "Impossible de charger les profils."
        }
      },
      // --- NOUVEAU : CARTE DE PROFIL (résultats de recherche) ---
      buddyCard: {
        defaultStudent: "Étudiant",
        noBio: "Cet étudiant n'a pas encore rédigé de présentation.",
        report: "Signaler",
        requestSent: "Demande envoyée",
        contact: "Contacter",
        levels: {
          college: "Collège",
          lycee: "Lycée",
          prepa: "Prépa",
          bts_iut: "BTS/IUT",
          licence: "Licence",
          master: "Master",
          doctorat: "Doctorat",
          autre: "Autre"
        },
        reportDialog: {
          title: "Signaler un profil",
          reasonLabel: "Motif du signalement",
          reasonPlaceholder: "Choisir un motif...",
          reasons: {
            harassment: "Harcèlement ou insulte",
            spam: "Contenu publicitaire / Spam",
            fake: "Faux profil / Usurpation",
            inappropriate: "Contenu inapproprié",
            other: "Autre"
          },
          detailsLabel: "Détails (Optionnel)",
          detailsPlaceholder: "Expliquez-nous brièvement le problème...",
          cancel: "Annuler",
          confirm: "Confirmer",
          missingReason: "Veuillez choisir un motif",
          success: "Signalement envoyé. Nous allons étudier le profil.",
          error: "Erreur lors du signalement"
        }
      },
      // --- NOUVEAU : PAGE MESSAGES ---
      messages: {
        contacts: "Mes Contacts",
        noConversation: "Aucune conversation",
        new: "Nouveau",
        studyBuddy: "Binôme d'étude",
        openWhiteboard: "Ouvrir le Tableau Blanc",
        edited: "(modifié)",
        edit: "Modifier",
        delete: "Supprimer",
        inputPlaceholder: "Écrire un message à {{name}}...",
        fileDefaultName: "Document",
        pendingRequest: {
          title: "Nouvelle demande",
          desc: "<bold>{{name}}</bold> souhaite réviser avec vous. Acceptez pour lancer la messagerie.",
          accept: "Accepter",
          reject: "Refuser"
        },
        emptyState: {
          title: "Vos messages",
          desc: "Sélectionnez un contact à gauche pour afficher la discussion."
        },
        toast: {
          accepted: "Demande acceptée ! Vous pouvez maintenant discuter.",
          acceptError: "Erreur lors de l'acceptation.",
          rejected: "Demande refusée.",
          rejectError: "Erreur lors du refus.",
          sendError: "Erreur lors de l'envoi.",
          deleted: "Message supprimé",
          deleteError: "Impossible de supprimer le message",
          edited: "Message modifié",
          editError: "Impossible de modifier le message",
          fileNotAllowed: "Ce type de fichier n'est pas autorisé."
        },
        rejectModal: {
          title: "Refuser la demande ?",
          desc: "Cette action est définitive. Vous ne pourrez plus discuter avec cette personne à moins qu'une nouvelle demande ne soit envoyée.",
          cancel: "Annuler",
          confirm: "Oui, refuser"
        },
        deleteModal: {
          title: "Supprimer ce message ?",
          desc: "Êtes-vous sûr de vouloir supprimer ce message ? Il sera effacé pour vous et pour votre interlocuteur de manière irréversible.",
          cancel: "Annuler",
          confirm: "Supprimer"
        }
      },
      // --- NOUVEAU : PAGE SESSIONS ---
      sessions: {
        title: "Sessions d'étude",
        subtitle: "Planifiez et suivez vos sessions",
        newSession: "Nouvelle session",
        upcoming: "Prochaines sessions",
        noUpcoming: "Aucune session prévue",
        history: "Historique",
        with: "Avec {{name}}",
        joinWhiteboard: "Rejoindre le tableau blanc",
        markCompleted: "Terminée",
        cancel: "Annuler",
        defaultOrganizer: "Moi",
        defaultBuddy: "Binôme",
        noBuddyAlert: {
          title: "Vous n'avez pas encore de binôme accepté.",
          desc: "Allez dans l'onglet Recherche pour trouver un partenaire !"
        },
        status: {
          upcoming: "À venir",
          past: "Passée",
          completed: "Terminée"
        },
        mode: {
          online: "En ligne",
          inperson: "Présentiel"
        },
        createDialog: {
          title: "Nouvelle session d'étude",
          titleLabel: "Titre de la session",
          titlePlaceholder: "Ex: Révision Algèbre",
          buddyLabel: "Choisir un binôme",
          buddyPlaceholder: "Sélectionnez un binôme",
          dateLabel: "Date",
          timeLabel: "Heure",
          durationLabel: "Durée (min)",
          modeLabel: "Mode",
          modeOnline: "En ligne (Tableau blanc)",
          modeInPerson: "Présentiel",
          locationLabel: "Lieu",
          locationPlaceholder: "Ex: Bibliothèque universitaire, salle 2",
          cancel: "Annuler",
          submit: "Planifier la session"
        },
        toast: {
          created: "Session planifiée !",
          createError: "Erreur lors de la création",
          statusUpdated: "Statut mis à jour",
          statusError: "Erreur"
        }
      },
      // --- NOUVEAU : PAGE PROFIL (vue affichage) ---
      profile: {
        title: "Mon profil",
        subtitle: "Gérez vos informations et vos préférences",
        public: "Profil public",
        defaultStudent: "Étudiant",
        edit: "Modifier",
        about: "À propos de moi",
        subjectsLevels: "Matières & Niveaux",
        goals: "Objectifs",
        preferencesAvailability: "Préférences & Disponibilités",
        online: "En ligne",
        inperson: "Présentiel",
        editTitle: "Modifier mes informations",
        cancel: "Annuler",
        subjectLevels: {
          debutant: "💡 Débutant",
          intermediaire: "🤝 Intermédiaire",
          avance: "🚀 Avancé"
        },
        toast: {
          saved: "Profil enregistré avec succès ! 🎉",
          savedDesc: "Redirection vers votre tableau de bord...",
          error: "Erreur lors de l'enregistrement"
        }
      },
      // --- NOUVEAU : FORMULAIRE DE PROFIL (édition) ---
      profileForm: {
        sections: {
          general: "Informations générales",
          subjectsLevels: "Matières & Niveaux",
          goals: "Objectifs",
          preferences: "Préférences"
        },
        displayName: "Nom affiché",
        displayNamePlaceholder: "Ex: Thomas D.",
        city: "Ville",
        cityPlaceholder: "Ex: Nantes, Paris...",
        bio: "Bio",
        bioPlaceholder: "Présentez-vous en quelques mots...",
        school: "Établissement",
        schoolPlaceholder: "Ex: CESI, Université...",
        level: "Niveau d'études",
        levelPlaceholder: "Sélectionnez",
        subjectPlaceholder: "Ex: Mathématiques, Management...",
        add: "Ajouter",
        quickSuggestions: "Suggestions rapides (ajoutées en \"Intermédiaire\") :",
        goalPlaceholder: "Ex: Préparer un concours...",
        studyStyle: "Style d'apprentissage",
        availability: "Disponibilités",
        sessionsOnline: "Sessions en ligne",
        sessionsInPerson: "Sessions en présentiel",
        save: "Enregistrer mon profil",
        validation: {
          incomplete: "Ajoutez un nom affiché, au moins une matière, et votre niveau d'études ou votre établissement."
        },
        subjectLevels: {
          debutant: "💡 Débutant (Besoin d'aide)",
          intermediaire: "🤝 Intermédiaire (Je gère)",
          avance: "🚀 Avancé (Je peux aider)"
        },
        styles: {
          visuel: "Visuel",
          auditif: "Auditif",
          pratique: "Pratique",
          lecture: "Lecture",
          mixte: "Mixte"
        },
        // Les valeurs stockées en base restent "Matin"/"Après-midi"/etc. (voir note
        // envoyée avec ce fichier) ; ces clés ne servent qu'à l'affichage traduit.
        availabilityLabels: {
          "Matin": "Matin",
          "Après-midi": "Après-midi",
          "Soir": "Soir",
          "Week-end": "Week-end"
        }
      },
      // --- NOUVEAU : PAGE PARAMÈTRES ---
      settings: {
        title: "Paramètres",
        subtitle: "Consultez vos informations et personnalisez votre expérience.",
        tabs: {
          account: "Mon Compte",
          appearance: "Apparence",
          preferences: "Préférences"
        },
        account: {
          title: "Informations du compte",
          email: "Adresse Email",
          fullName: "Nom complet",
          defaultStudent: "Étudiant",
          syncNotice: "Ces informations sont synchronisées avec votre compte Google"
        },
        appearance: {
          title: "Thème de l'application",
          subtitle: "Choisissez l'ambiance visuelle qui vous convient le mieux.",
          light: "Mode Clair",
          lightDesc: "Luminosité maximale pour une concentration diurne.",
          dark: "Mode Sombre",
          darkDesc: "Style élégant et reposant, idéal pour les sessions nocturnes.",
          lightToast: "Mode clair activé",
          darkToast: "Mode sombre activé"
        },
        preferences: {
          title: "Préférences Générales",
          notifications: "Notifications",
          requestAlerts: "Alertes de demandes",
          requestAlertsDesc: "Afficher une notification quand quelqu'un accepte votre demande ou vous en envoie une. Ce réglage est propre à cet appareil.",
          privacy: "Confidentialité",
          profileVisibility: "Visibilité du profil",
          profileVisibilityDesc: "Permettre aux autres étudiants de vous trouver via la recherche."
        },
        toast: {
          saved: "Préférence enregistrée",
          error: "Impossible d'enregistrer la préférence"
        }
      },
      // --- NOUVEAU : TABLEAU BLANC ---
      whiteboard: {
        closeBoard: "Fermer le tableau",
        title: "Tableau blanc",
        undo: "Défaire",
        undoTitle: "Défaire le dernier trait (Ctrl+Z)",
        export: "Exporter",
        customColor: "Couleur personnalisée",
        textPlaceholder: "Écrivez ici...",
        clearConfirm: "Voulez-vous vraiment tout effacer ?",
        saveError: "Synchronisation impossible : vos derniers tracés n'ont pas été enregistrés.",
        tooLarge: "Le tableau est trop chargé pour être synchronisé. Exportez-le puis effacez-le pour continuer.",
        tools: {
          pen: "Stylo",
          text: "Texte",
          eraser: "Gomme",
          clearAll: "Effacer tout le tableau"
        }
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
        logout: "Logout",
        menu: "Menu"
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
      // --- LANDING: navigation bar ---
      home: {
        nav: {
          login: "Login",
          signup: "Sign Up",
          dashboard: "Dashboard",
          switchLanguage: "Switch language"
        }
      },
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
        previewAlt: "Preview of BuddyEtude's collaborative whiteboard and chat",
        social: {
          early: "Platform is <bold>launching</bold> — join the first students!",
          active: "Join <bold>{{count}} students</bold> already active on the platform!"
        }
      },
      features: {
        title: "Study together, with the right tools",
        subtitle: "Find a partner, chat, schedule and study on a shared whiteboard: everything happens in one place.",
        items: {
          filters: {
            title: "Targeted search",
            desc: "Filter by subject, study level, city and mode (online or in-person) to find someone studying the same material as you."
          },
          chat: {
            title: "Integrated chat",
            desc: "Messaging with file sharing, built into the app — no need for WhatsApp or Discord."
          },
          whiteboard: {
            title: "Real-time whiteboard",
            desc: "Draw, write, and solve problems together on a fluid collaborative workspace."
          },
          requests: {
            title: "One request, one message",
            desc: "Introduce yourself in a few words. If they accept, the chat opens and you can schedule a session."
          },
          schedule: {
            title: "Scheduled sessions",
            desc: "Pick a buddy, a date, a time and a duration, online or in person. Your sessions are gathered on a dedicated page."
          },
          subjects: {
            title: "All subjects",
            desc: "Maths, law, medicine, languages... The subject field is free: enter yours and see who shares it."
          }
        }
      },
      cta: {
        title: "Ready to find your buddy?",
        subtitle: "Sign in with Google, complete your profile and send your first buddy request. It's free.",
        button: "Create my account",
        buttonLoggedIn: "Go to my dashboard"
      },
      footer: {
        tagline: "Created by a student, for students. Our mission is to make academic peer support accessible to everyone, everywhere in France, through powerful collaborative tools.",
        platform: "Platform",
        about: "About us",
        findBuddy: "Find a buddy",
        support: "Support & Legal",
        legal: "Legal Notice & Terms",
        privacy: "Privacy Policy",
        rights: "All rights reserved"
      },
      // --- NEW: "FIND A BUDDY" PAGE ---
      search: {
        title: "Find a buddy",
        subtitle: "Filter profiles to find the ideal study partner",
        searchPlaceholder: "Search by name or school...",
        subjectPlaceholder: "Filter by subject (e.g. Law, Cinema...)",
        cityPlaceholder: "Filter by city...",
        defaultSubject: "General",
        defaultStudent: "Student",
        levels: {
          all: "All levels",
          college: "Middle school",
          lycee: "High school",
          prepa: "Prep school",
          bts_iut: "Associate degree",
          licence: "Bachelor's",
          master: "Master's",
          doctorat: "PhD"
        },
        types: {
          all: "Online & In-person",
          online: "Online only",
          inperson: "In-person only"
        },
        loginRequired: {
          title: "Login required",
          desc: "You need to be logged in to your BuddyEtude account to search for buddies and contact students.",
          button: "Back to home / Log in"
        },
        noResults: {
          title: "No matching profile",
          desc: "Try broadening your search by removing some filters or changing your keywords.",
          reset: "Reset filters"
        },
        requestDialog: {
          title: "Propose a session",
          desc: "Send a short note to <bold>{{name}}</bold> to introduce yourself and propose studying together.",
          placeholder: "Hi! I saw you're also preparing for the same exams...",
          cancel: "Cancel",
          send: "Send my request"
        },
        toast: {
          success: "Request sent successfully!",
          error: "Couldn't send the request",
          loadError: "Couldn't load profiles."
        }
      },
      // --- NEW: PROFILE CARD (search results) ---
      buddyCard: {
        defaultStudent: "Student",
        noBio: "This student hasn't written a bio yet.",
        report: "Report",
        requestSent: "Request sent",
        contact: "Contact",
        levels: {
          college: "Middle school",
          lycee: "High school",
          prepa: "Prep school",
          bts_iut: "Associate degree",
          licence: "Bachelor's",
          master: "Master's",
          doctorat: "PhD",
          autre: "Other"
        },
        reportDialog: {
          title: "Report a profile",
          reasonLabel: "Reason for reporting",
          reasonPlaceholder: "Choose a reason...",
          reasons: {
            harassment: "Harassment or insults",
            spam: "Advertising content / Spam",
            fake: "Fake profile / Impersonation",
            inappropriate: "Inappropriate content",
            other: "Other"
          },
          detailsLabel: "Details (Optional)",
          detailsPlaceholder: "Briefly explain the issue...",
          cancel: "Cancel",
          confirm: "Confirm",
          missingReason: "Please choose a reason",
          success: "Report sent. We'll review this profile.",
          error: "Error while reporting"
        }
      },
      // --- NEW: MESSAGES PAGE ---
      messages: {
        contacts: "My Contacts",
        noConversation: "No conversation",
        new: "New",
        studyBuddy: "Study buddy",
        openWhiteboard: "Open Whiteboard",
        edited: "(edited)",
        edit: "Edit",
        delete: "Delete",
        inputPlaceholder: "Write a message to {{name}}...",
        fileDefaultName: "Document",
        pendingRequest: {
          title: "New request",
          desc: "<bold>{{name}}</bold> wants to study with you. Accept to start messaging.",
          accept: "Accept",
          reject: "Decline"
        },
        emptyState: {
          title: "Your messages",
          desc: "Select a contact on the left to view the conversation."
        },
        toast: {
          accepted: "Request accepted! You can now chat.",
          acceptError: "Error while accepting.",
          rejected: "Request declined.",
          rejectError: "Error while declining.",
          sendError: "Error while sending.",
          deleted: "Message deleted",
          deleteError: "Couldn't delete the message",
          edited: "Message edited",
          editError: "Couldn't edit the message",
          fileNotAllowed: "This file type is not allowed."
        },
        rejectModal: {
          title: "Decline the request?",
          desc: "This action is final. You won't be able to chat with this person unless a new request is sent.",
          cancel: "Cancel",
          confirm: "Yes, decline"
        },
        deleteModal: {
          title: "Delete this message?",
          desc: "Are you sure you want to delete this message? It will be permanently removed for you and the other person.",
          cancel: "Cancel",
          confirm: "Delete"
        }
      },
      // --- NEW: SESSIONS PAGE ---
      sessions: {
        title: "Study sessions",
        subtitle: "Plan and track your sessions",
        newSession: "New session",
        upcoming: "Upcoming sessions",
        noUpcoming: "No session planned",
        history: "History",
        with: "With {{name}}",
        joinWhiteboard: "Join the whiteboard",
        markCompleted: "Completed",
        cancel: "Cancel",
        defaultOrganizer: "Me",
        defaultBuddy: "Buddy",
        noBuddyAlert: {
          title: "You don't have an accepted buddy yet.",
          desc: "Go to the Search tab to find a partner!"
        },
        status: {
          upcoming: "Upcoming",
          past: "Past",
          completed: "Completed"
        },
        mode: {
          online: "Online",
          inperson: "In-person"
        },
        createDialog: {
          title: "New study session",
          titleLabel: "Session title",
          titlePlaceholder: "E.g. Algebra revision",
          buddyLabel: "Choose a buddy",
          buddyPlaceholder: "Select a buddy",
          dateLabel: "Date",
          timeLabel: "Time",
          durationLabel: "Duration (min)",
          modeLabel: "Mode",
          modeOnline: "Online (Whiteboard)",
          modeInPerson: "In-person",
          locationLabel: "Location",
          locationPlaceholder: "E.g. University library, room 2",
          cancel: "Cancel",
          submit: "Schedule session"
        },
        toast: {
          created: "Session scheduled!",
          createError: "Error while creating the session",
          statusUpdated: "Status updated",
          statusError: "Error"
        }
      },
      // --- NEW: PROFILE PAGE (display view) ---
      profile: {
        title: "My profile",
        subtitle: "Manage your information and preferences",
        public: "Public profile",
        defaultStudent: "Student",
        edit: "Edit",
        about: "About me",
        subjectsLevels: "Subjects & Levels",
        goals: "Goals",
        preferencesAvailability: "Preferences & Availability",
        online: "Online",
        inperson: "In-person",
        editTitle: "Edit my information",
        cancel: "Cancel",
        subjectLevels: {
          debutant: "💡 Beginner",
          intermediaire: "🤝 Intermediate",
          avance: "🚀 Advanced"
        },
        toast: {
          saved: "Profile saved successfully! 🎉",
          savedDesc: "Redirecting to your dashboard...",
          error: "Error while saving"
        }
      },
      // --- NEW: PROFILE FORM (edit view) ---
      profileForm: {
        sections: {
          general: "General information",
          subjectsLevels: "Subjects & Levels",
          goals: "Goals",
          preferences: "Preferences"
        },
        displayName: "Display name",
        displayNamePlaceholder: "E.g. Thomas D.",
        city: "City",
        cityPlaceholder: "E.g. Nantes, Paris...",
        bio: "Bio",
        bioPlaceholder: "Introduce yourself in a few words...",
        school: "School",
        schoolPlaceholder: "E.g. CESI, University...",
        level: "Study level",
        levelPlaceholder: "Select",
        subjectPlaceholder: "E.g. Maths, Management...",
        add: "Add",
        quickSuggestions: "Quick suggestions (added as \"Intermediate\"):",
        goalPlaceholder: "E.g. Prepare for a competitive exam...",
        studyStyle: "Learning style",
        availability: "Availability",
        sessionsOnline: "Online sessions",
        sessionsInPerson: "In-person sessions",
        save: "Save my profile",
        validation: {
          incomplete: "Add a display name, at least one subject, and your study level or school."
        },
        subjectLevels: {
          debutant: "💡 Beginner (Needs help)",
          intermediaire: "🤝 Intermediate (Comfortable)",
          avance: "🚀 Advanced (Can help)"
        },
        styles: {
          visuel: "Visual",
          auditif: "Auditory",
          pratique: "Hands-on",
          lecture: "Reading",
          mixte: "Mixed"
        },
        // Stored values in the database stay "Matin"/"Après-midi"/etc. (see note
        // sent with this file) ; these keys are only used for translated display.
        availabilityLabels: {
          "Matin": "Morning",
          "Après-midi": "Afternoon",
          "Soir": "Evening",
          "Week-end": "Weekend"
        }
      },
      // --- NEW: SETTINGS PAGE ---
      settings: {
        title: "Settings",
        subtitle: "View your information and personalize your experience.",
        tabs: {
          account: "My Account",
          appearance: "Appearance",
          preferences: "Preferences"
        },
        account: {
          title: "Account information",
          email: "Email address",
          fullName: "Full name",
          defaultStudent: "Student",
          syncNotice: "This information is synced with your Google account"
        },
        appearance: {
          title: "App theme",
          subtitle: "Choose the visual style that suits you best.",
          light: "Light mode",
          lightDesc: "Maximum brightness for daytime focus.",
          dark: "Dark mode",
          darkDesc: "Elegant, restful style, ideal for night sessions.",
          lightToast: "Light mode enabled",
          darkToast: "Dark mode enabled"
        },
        preferences: {
          title: "General preferences",
          notifications: "Notifications",
          requestAlerts: "Request alerts",
          requestAlertsDesc: "Show a notification when someone accepts your request or sends you one. This setting is specific to this device.",
          privacy: "Privacy",
          profileVisibility: "Profile visibility",
          profileVisibilityDesc: "Allow other students to find you through search."
        },
        toast: {
          saved: "Preference saved",
          error: "Couldn't save the preference"
        }
      },
      // --- NEW: WHITEBOARD ---
      whiteboard: {
        closeBoard: "Close whiteboard",
        title: "Whiteboard",
        undo: "Undo",
        undoTitle: "Undo last stroke (Ctrl+Z)",
        export: "Export",
        customColor: "Custom color",
        textPlaceholder: "Write here...",
        clearConfirm: "Are you sure you want to clear everything?",
        saveError: "Sync failed: your latest strokes were not saved.",
        tooLarge: "The whiteboard is too full to sync. Export it, then clear it to keep going.",
        tools: {
          pen: "Pen",
          text: "Text",
          eraser: "Eraser",
          clearAll: "Clear the whole whiteboard"
        }
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