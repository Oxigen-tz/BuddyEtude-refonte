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
          free: "Gratuit",
          realtime_value: "Live",
          realtime: "Collaboration"
        },
        social: {
          early: "Plateforme en <bold>lancement</bold> — rejoins les premiers étudiants !",
          active: "Rejoins déjà <bold>{{count}} étudiants</bold> actifs sur la plateforme !"
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
        button: "Créer mon compte",
        buttonLoggedIn: "Accéder à mon tableau de bord"
      },
      footer: {
        tagline: "Créé par un étudiant, pour les étudiants. Notre mission est de rendre l'entraide académique accessible à tous, partout en France, grâce à des outils collaboratifs puissants.",
        platform: "Plateforme",
        about: "À propos de nous",
        findBuddy: "Trouver un binôme",
        referral: "Programme de parrainage",
        soon: "Bientôt",
        support: "Support & Légal",
        legal: "Mentions Légales & CGU",
        privacy: "Politique de Confidentialité",
        rights: "Tous droits réservés",
        systemsOperational: "Systèmes opérationnels"
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
          error: "Impossible d'envoyer la demande"
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
          editError: "Impossible de modifier le message"
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
          messageAlerts: "Alertes de messagerie",
          messageAlertsDesc: "Recevoir une notification lors d'un nouveau message.",
          calendarReminders: "Rappels de calendrier",
          calendarRemindersDesc: "Être prévenu avant le début d'une session d'étude.",
          privacy: "Confidentialité",
          profileVisibility: "Visibilité du profil",
          profileVisibilityDesc: "Permettre aux autres étudiants de vous trouver via la recherche.",
          onlineStatus: "Statut de connexion",
          onlineStatusDesc: "Afficher quand vous êtes en train de travailler sur le site."
        }
      },
      // --- NOUVEAU : TABLEAU BLANC ---
      whiteboard: {
        closeBoard: "Fermer le tableau",
        titleLight: "Tableau Blanc Interactif",
        titleDark: "Tableau Noir Interactif",
        undo: "Défaire",
        undoTitle: "Défaire le dernier trait (Ctrl+Z)",
        export: "Exporter",
        customColor: "Couleur personnalisée",
        textPlaceholder: "Écrivez ici...",
        clearConfirm: "Voulez-vous vraiment tout effacer ?",
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
        },
        social: {
          early: "Platform is <bold>launching</bold> — join the first students!",
          active: "Join <bold>{{count}} students</bold> already active on the platform!"
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
        button: "Create my account",
        buttonLoggedIn: "Go to my dashboard"
      },
      footer: {
        tagline: "Created by a student, for students. Our mission is to make academic peer support accessible to everyone, everywhere in France, through powerful collaborative tools.",
        platform: "Platform",
        about: "About us",
        findBuddy: "Find a buddy",
        referral: "Referral program",
        soon: "Coming soon",
        support: "Support & Legal",
        legal: "Legal Notice & Terms",
        privacy: "Privacy Policy",
        rights: "All rights reserved",
        systemsOperational: "All systems operational"
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
          error: "Couldn't send the request"
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
          editError: "Couldn't edit the message"
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
          messageAlerts: "Message alerts",
          messageAlertsDesc: "Get notified when you receive a new message.",
          calendarReminders: "Calendar reminders",
          calendarRemindersDesc: "Be notified before a study session starts.",
          privacy: "Privacy",
          profileVisibility: "Profile visibility",
          profileVisibilityDesc: "Allow other students to find you through search.",
          onlineStatus: "Online status",
          onlineStatusDesc: "Show when you're active on the site."
        }
      },
      // --- NEW: WHITEBOARD ---
      whiteboard: {
        closeBoard: "Close whiteboard",
        titleLight: "Interactive Whiteboard",
        titleDark: "Interactive Blackboard",
        undo: "Undo",
        undoTitle: "Undo last stroke (Ctrl+Z)",
        export: "Export",
        customColor: "Custom color",
        textPlaceholder: "Write here...",
        clearConfirm: "Are you sure you want to clear everything?",
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