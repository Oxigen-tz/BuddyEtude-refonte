import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  fr: {
    translation: {
      notFound: {
        title: "Page introuvable",
        desc: "La page « {{page}} » n'existe pas.",
        home: "Retour à l'accueil"
      },
      admin: {
        title: "Modération",
        subtitle: "Statistiques, signalements et avis négatifs après les sessions.",
        forbidden: "Cette page est réservée à la modération.",
        reports: "Signalements en attente",
        noReports: "Aucun signalement en attente.",
        ban: "Bannir",
        dismiss: "Classer sans suite",
        feedback: "Avis négatifs",
        feedbackDesc: "Sessions notées 1 ou 2 étoiles.",
        noFeedback: "Aucun avis négatif.",
        about: "Concerne",
        stats: {
          title: "Statistiques",
          refresh: "Actualiser",
          error: "Statistiques indisponibles.",
          accounts: "Comptes créés",
          students: "Profils complets",
          buddies: "Binômes formés",
          messages7d: "Messages (7 jours)",
          upcomingSessions: "Sessions à venir",
          completedSessions: "Sessions terminées",
          rating: "Note moyenne des sessions",
          ratingCount_one: "{{count}} avis",
          ratingCount_other: "{{count}} avis",
          pendingRequests: "Demandes en attente",
          pendingReports: "Signalements en attente",
          signupsTitle: "Inscriptions par semaine",
          weekOf: "Semaine du {{date}}",
          week: "Semaine",
          signups: "Inscriptions",
          verified: "Étudiants vérifiés",
          helpRequests: "Demandes d'aide",
          funnelTitle: "Parcours des étudiants",
          funnelDesc: "Combien de comptes atteignent chaque étape : c'est là où le chiffre chute qu'il faut agir.",
          funnelStep: "{{rate}} de l'étape précédente",
          funnel: {
            accounts: "Compte créé",
            profiles: "Profil complété",
            requested: "A envoyé ou reçu une demande",
            matched: "A trouvé un binôme",
            hadSession: "A planifié une session"
          }
        },
        cleanup: {
          title: "Anciennes données",
          desc: "Messages, demandes, sessions et tableaux blancs créés avant la mise à jour (au format e-mail) ne sont plus visibles. « Analyser » compte ce qui reste, sans rien supprimer.",
          preview: "Analyser",
          confirm: "Supprimer définitivement",
          nothing: "Aucune ancienne donnée à nettoyer.",
          done: "Anciennes données supprimées.",
          items: {
            messages_one: "{{count}} ancien message",
            messages_other: "{{count}} anciens messages",
            files_one: "dont {{count}} fichier joint",
            files_other: "dont {{count}} fichiers joints",
            requests_one: "{{count}} ancienne demande",
            requests_other: "{{count}} anciennes demandes",
            sessions_one: "{{count}} ancienne session",
            sessions_other: "{{count}} anciennes sessions",
            whiteboards_one: "{{count}} ancien tableau blanc",
            whiteboards_other: "{{count}} anciens tableaux blancs",
            profiles_one: "{{count}} profil dont l'e-mail sera retiré",
            profiles_other: "{{count}} profils dont l'e-mail sera retiré"
          }
        },
        toast: {
          banned: "{{name}} est banni(e).",
          dismissed: "Signalement classé.",
          error: "Action impossible."
        }
      },
      auth: {
        dialogTitle: "Se connecter",
        signupTitle: "Créer un compte",
        resetTitle: "Mot de passe oublié",
        dialogDesc: "Connecte-toi pour trouver un binôme, discuter et réviser ensemble.",
        studentEmailTip: "Astuce : utilise ton adresse étudiante (celle de ton école ou de ton université) plutôt que ton adresse personnelle. Tu pourras ensuite obtenir en un clic le badge « étudiant vérifié » ✓, qui rassure les autres étudiants.",
        withGoogle: "Continuer avec Google",
        withMicrosoft: "Continuer avec Microsoft",
        or: "ou",
        name: "Prénom et nom",
        email: "Adresse e-mail",
        password: "Mot de passe",
        forgot: "Mot de passe oublié ?",
        passwordHint: "8 caractères minimum.",
        loginButton: "Se connecter",
        signupButton: "Créer mon compte",
        resetButton: "Envoyer le lien de réinitialisation",
        noAccount: "Pas encore de compte ?",
        createAccount: "Créer un compte",
        backToLogin: "Retour à la connexion",
        resetSent: "Si un compte existe pour cette adresse, un e-mail de réinitialisation vient d'être envoyé.",
        verifyBanner: "Vérifie ton adresse e-mail ({{email}}) en cliquant sur le lien reçu.",
        verifySent: "E-mail de vérification renvoyé.",
        verifyResend: "Renvoyer l'e-mail",
        verifyDone: "C'est fait",
        errors: {
          invalidCredential: "Adresse e-mail ou mot de passe incorrect.",
          invalidEmail: "Adresse e-mail invalide.",
          emailInUse: "Un compte existe déjà avec cette adresse. Connecte-toi plutôt.",
          weakPassword: "Mot de passe trop faible (8 caractères minimum).",
          tooMany: "Trop de tentatives. Réessaie dans quelques minutes.",
          providerDisabled: "Ce mode de connexion n'est pas encore activé.",
          otherProvider: "Cette adresse est déjà liée à un autre mode de connexion (Google, Microsoft ou e-mail).",
          popupBlocked: "La fenêtre de connexion a été bloquée par le navigateur. Autorise les pop-ups et réessaie.",
          network: "Problème de connexion Internet. Réessaie.",
          nameRequired: "Indique ton prénom et ton nom.",
          generic: "La connexion a échoué. Réessaie."
        },
        requiredTitle: "Connexion requise",
        requiredDesc: "Connecte-toi avec ton compte Google pour accéder à ton espace BuddyEtude : binômes, messages, sessions et tableau blanc.",
        login: "Se connecter",
        backHome: "Retour à l'accueil"
      },
      about: {
        title: "À propos de BuddyEtude",
        subtitle: "L'histoire d'un projet né pour résoudre un problème que tous les étudiants connaissent : la solitude face aux révisions.",
        origin: {
          title: "Notre Origine",
          text: "BuddyEtude a été imaginé et développé par un étudiant. Devant la difficulté de trouver des partenaires motivés pour réviser la veille des partiels, l'idée est née : pourquoi ne pas créer un réseau social dédié uniquement à l'entraide scolaire et au travail de groupe ?"
        },
        mission: {
          title: "Notre Mission",
          text: "Notre objectif est simple : faire en sorte qu'aucun étudiant ne se retrouve bloqué seul devant ses cours. Que vous soyez au lycée, en prépa ou à l'université, BuddyEtude vous connecte avec les profils qui complètent vos compétences pour réussir ensemble."
        },
        join: {
          title: "Rejoignez l'aventure",
          text: "BuddyEtude grandit chaque jour grâce à sa communauté. Si vous avez des suggestions, des idées d'amélioration, ou si vous souhaitez participer au projet, n'hésitez pas à nous contacter !",
          button: "Nous écrire"
        }
      },
      legal: {
        title: "Mentions Légales & CGU",
        publisher: {
          title: "1. Éditeur du site",
          intro: "Le site <bold>BuddyEtude</bold> est édité par :",
          email: "Email",
          director: "Directeur de la publication"
        },
        hosting: {
          title: "2. Hébergement",
          intro: "Le site et ses données sont hébergés par :",
          site: "Site web",
          data: "Comptes, base de données et fichiers (Firebase)",
          us: "États-Unis",
          ie: "Irlande",
          website: "Site web"
        },
        terms: {
          title: "3. Conditions Générales d'Utilisation (CGU)",
          purposeLabel: "Objet :",
          purpose: "BuddyEtude est une plateforme de mise en relation pour étudiants visant à faciliter l'entraide scolaire.",
          userLabel: "Responsabilité de l'utilisateur :",
          user: "L'utilisateur s'engage à fournir des informations réelles et à utiliser la plateforme dans un cadre strictement académique et respectueux. Tout contenu à caractère haineux, publicitaire, ou inapproprié entraînera la suppression immédiate du compte.",
          ageLabel: "Âge :",
          age: "BuddyEtude est ouvert aux étudiants de 15 ans et plus ; en dessous de 15 ans, l'accord d'un parent est obligatoire.",
          moderationLabel: "Modération :",
          moderation: "BuddyEtude se réserve le droit d'étudier les signalements et de bannir tout utilisateur ne respectant pas les règles de bienséance. Les messages échangés entre les utilisateurs peuvent être soumis à une modération en cas de signalement."
        },
        ip: {
          title: "4. Propriété intellectuelle",
          text: "L'ensemble des éléments graphiques, la structure et, plus généralement, le contenu du site BuddyEtude sont protégés par le droit d'auteur, le droit des marques et le droit des dessins et modèles. Toute personne qui recueille ou télécharge du contenu ou des informations diffusées sur le site ne dispose sur ceux-ci que d'un droit d'usage privé, personnel et non transmissible."
        }
      },
      privacy: {
        title: "Politique de confidentialité",
        updated: "Dernière mise à jour : 18 novembre 2026",
        intro: "BuddyEtude met en relation des étudiants pour réviser ensemble. Cette page explique quelles données nous traitons, pourquoi, avec qui, combien de temps, et comment exercer vos droits, conformément au Règlement général sur la protection des données (RGPD).",
        sections: [
          {
            title: "1. Responsable du traitement",
            paragraphs: ["Le responsable du traitement est l'éditeur du site, indiqué dans les Mentions légales. Pour toute question sur vos données : {{email}}."]
          },
          {
            title: "2. Données traitées",
            items: [
              { label: "Compte :", text: "nom et adresse e-mail (fournis par Google ou saisis à l'inscription), photo de profil (celle de Google, ou celle que vous envoyez depuis votre profil). Le mot de passe est géré par Google Firebase ; nous n'y avons jamais accès. Votre adresse e-mail n'est jamais affichée aux autres étudiants." },
              { label: "Profil :", text: "ville, niveau d'études, matières, disponibilités, mode de révision, présentation." },
              { label: "Âge :", text: "tranche d'âge (15 ans ou plus / moins de 15 ans) et, le cas échéant, déclaration d'accord parental. Ces informations sont privées." },
              { label: "Statut étudiant (facultatif) :", text: "si vous demandez le badge « étudiant vérifié », l'adresse de votre établissement sert uniquement à vous envoyer un code ; elle est effacée dès la validation (ou au bout d'un jour), et seul son nom de domaine (ex. univ-rennes.fr) reste affiché sur votre profil. Une empreinte chiffrée de l'adresse est conservée pour qu'elle ne vérifie qu'un seul compte." },
              { label: "Activité :", text: "demandes de binôme, messages et fichiers échangés, groupes de révision et leurs discussions, sessions planifiées, dessins du tableau blanc et documents PDF qui y sont importés, avis laissés après une session, signalements et blocages." },
              { label: "Préférences :", text: "choix de recevoir ou non les e-mails de notification et le résumé du lundi, langue et thème d'affichage ; si vous activez les notifications push, un identifiant technique de votre appareil." },
              { label: "Données techniques :", text: "en cas d'erreur, un rapport technique (page, navigateur, message d'erreur) ; une vérification anti-abus (App Check) qui s'assure que les requêtes viennent bien du site." }
            ]
          },
          {
            title: "3. Pourquoi et sur quelle base",
            items: [
              { label: "Faire fonctionner le service", text: "(compte, recherche de binômes, messagerie, sessions, tableau blanc) : exécution des conditions d'utilisation que vous acceptez en créant un compte." },
              { label: "Notifications", text: "(e-mails : nouvelle demande, nouveau message, session, rappels, résumé du lundi des nouveaux inscrits compatibles ; notifications push si vous les activez) : exécution du service. Chacune se désactive à tout moment dans Paramètres → Préférences." },
              { label: "Sécurité et modération", text: "(signalements, bannissement, protection contre les abus, suivi des erreurs) : intérêt légitime à proposer un service sûr et fiable." },
              { label: "Statistiques internes", text: "(nombre d'inscrits, de binômes, de sessions) : intérêt légitime ; ce sont des comptages globaux, sans profilage ni publicité." }
            ]
          },
          {
            title: "4. Qui voit vos données",
            items: [
              { label: "Les autres étudiants connectés", text: "voient votre profil (nom, photo, ville, niveau, matières, disponibilités, présentation), sauf si vous le masquez dans les Paramètres." },
              { label: "Vos binômes et vos groupes", text: "voient les messages, fichiers, sessions et dessins que vous partagez avec eux, et eux seuls. Le résumé du lundi peut indiquer votre nom et vos matières communes aux étudiants compatibles qui viennent de s'inscrire, comme le fait déjà la recherche." },
              { label: "La modération", text: "voit les signalements, les avis après session et, en cas de signalement, les éléments nécessaires pour le traiter." },
              { label: "Personne d'autre :", text: "BuddyEtude ne vend ni ne loue vos données et n'affiche aucune publicité." }
            ]
          },
          {
            title: "5. Prestataires (sous-traitants)",
            paragraphs: ["Nous faisons appel à des prestataires qui traitent des données pour notre compte, uniquement pour les besoins décrits ici :"],
            items: [
              { label: "Google (Firebase, Google Cloud) :", text: "comptes, base de données, fichiers, fonctions serveur, notifications push, protection anti-abus. Les données de la base sont hébergées dans l'Union européenne." },
              { label: "Vercel :", text: "hébergement du site web (États-Unis)." },
              { label: "Brevo (France) :", text: "envoi des e-mails de notification." },
              { label: "Sentry :", text: "suivi des erreurs techniques, hébergé dans l'Union européenne." },
              { label: "Jitsi Meet :", text: "les appels vidéo se font sur meet.jit.si, un service externe ; BuddyEtude ne fait que générer le lien et n'enregistre pas les appels." },
              { label: "Services publics de l'État :", text: "pendant que vous tapez une ville ou un établissement, le texte saisi est envoyé à geo.api.gouv.fr et data.enseignementsup-recherche.gouv.fr pour proposer des suggestions (aucune autre donnée)." }
            ],
          },
          {
            title: "6. Transferts hors de l'Union européenne",
            paragraphs: ["Certains prestataires (Google, Vercel) sont établis aux États-Unis. Ces transferts sont encadrés par le cadre de protection des données UE–États-Unis (Data Privacy Framework) et/ou par les clauses contractuelles types de la Commission européenne."]
          },
          {
            title: "7. Durées de conservation",
            items: [
              { label: "Compte et contenus :", text: "tant que le compte existe. La suppression du compte (Paramètres → Supprimer mon compte) efface immédiatement le profil, les messages et fichiers envoyés, les demandes, les blocages, les données privées et les avis laissés ; les sessions sont annulées, les groupes créés sont supprimés et vous quittez les autres." },
              { label: "Comptes inactifs :", text: "supprimés après 3 ans sans connexion." },
              { label: "E-mails de notification envoyés :", text: "30 jours." },
              { label: "Avis et signalements traités :", text: "1 an." },
              { label: "Rapports d'erreur :", text: "30 jours au plus." },
              { label: "Sauvegardes :", text: "7 jours, renouvelées chaque jour." }
            ]
          },
          {
            title: "8. Mineurs",
            paragraphs: ["En France, un mineur peut consentir seul au traitement de ses données à partir de 15 ans. En dessous de 15 ans, l'utilisation de BuddyEtude nécessite l'accord d'un titulaire de l'autorité parentale, déclaré dans le profil. Un parent peut demander à tout moment la suppression du compte de son enfant en écrivant à {{email}}."]
          },
          {
            title: "9. Cookies et stockage local",
            paragraphs: ["BuddyEtude n'utilise ni cookie publicitaire ni outil de mesure d'audience. Seuls sont utilisés les éléments strictement nécessaires au service, qui ne demandent pas de consentement : le maintien de votre connexion, vos préférences d'affichage (langue, thème) et la protection anti-abus."]
          },
          {
            title: "10. Vos droits",
            paragraphs: [
              "Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité de vos données. Vous pouvez modifier votre profil et supprimer votre compte directement dans l'application ; pour les autres demandes, écrivez à {{email}}. Nous répondons dans un délai d'un mois.",
              "Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL (www.cnil.fr)."
            ]
          }
        ]
      },
      layout: {
        nav: {
          Dashboard: "Tableau de bord",
          Search: "Rechercher",
          Messages: "Messages",
          Sessions: "Sessions",
          Profile: "Mon profil",
          Settings: "Paramètres",
          Admin: "Modération",
          Groups: "Groupes"
        },
        tabs: { Dashboard: "Accueil", Search: "Chercher", Messages: "Messages", Sessions: "Sessions", Profile: "Profil" },
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
          view: "Voir",
          sessionTitle: "Nouvelle session 📅",
          sessionBody: "{{name}} a planifié « {{title}} » avec vous.",
          sessionToast: "Nouvelle session planifiée !"
        },
        language: "English",
        logout: "Déconnexion",
        unreadMessages: "{{count}} nouveauté(s) dans Messages",
        menu: "Menu"
      },
      dashboard: {
        greeting: "Bonjour, {{name}}",
        subtitle: "Prêt à booster vos révisions aujourd'hui ?",
        findBuddy: "Trouver un binôme",
        progress: "{{done}} sur {{total}} étapes",
        tutorial: {
          close: "Masquer le tutoriel",
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
      groups: {
        title: "Groupes de révision",
        subtitle: "Révisez à plusieurs (jusqu'à 6) avec vos binômes : discussion et tableau blanc communs.",
        create: "Nouveau groupe",
        createTitle: "Créer un groupe",
        createDesc: "Vous pourrez ensuite y ajouter vos binômes, un par un.",
        name: "Nom du groupe",
        namePlaceholder: "Ex. : Partiels de L2 maths",
        subject: "Matière (facultatif)",
        subjectPlaceholder: "Ex. : Analyse",
        createButton: "Créer le groupe",
        emptyTitle: "Aucun groupe pour l'instant",
        emptyDesc: "Créez un groupe et ajoutez-y vos binômes pour réviser à plusieurs.",
        pick: "Choisissez un groupe pour afficher sa discussion.",
        memberCount_one: "{{count}} membre",
        memberCount_other: "{{count}} membres",
        whiteboard: "Tableau blanc",
        delete: "Supprimer le groupe",
        leave: "Quitter le groupe",
        owner: "Créateur du groupe",
        you: "Vous",
        remove: "Retirer {{name}}",
        add: "Ajouter",
        addPlaceholder: "Ajouter un binôme…",
        noBuddyToAdd: "Tous vos binômes sont déjà dans le groupe (ou vous n'en avez pas encore).",
        noMessages: "Aucun message. Lancez la discussion !",
        inputPlaceholder: "Écrire au groupe…",
        send: "Envoyer",
        back: "Retour aux groupes",
        leaveConfirm: "Quitter le groupe « {{name}} » ?",
        deleteConfirm: "Supprimer définitivement le groupe « {{name}} », sa discussion et son tableau blanc ?",
        toast: {
          created: "Groupe créé.",
          added: "{{name}} a rejoint le groupe.",
          removed: "{{name}} a été retiré(e) du groupe.",
          left: "Vous avez quitté le groupe.",
          deleted: "Groupe supprimé.",
          error: "Action impossible. Réessayez."
        }
      },
      verification: {
        title: "Étudiant vérifié",
        desc: "Confirme une adresse e-mail de ton établissement pour afficher le badge ✓ sur ton profil. Seul le nom de domaine (ex. univ-rennes.fr) sera visible, jamais ton adresse.",
        verified: "Ton statut est vérifié avec une adresse @{{domain}}.",
        start: "Vérifier mon statut",
        emailLabel: "Adresse e-mail de ton établissement",
        emailPlaceholder: "prenom.nom@ton-ecole.fr",
        personalHint: "Utilise l'adresse fournie par ton établissement : les adresses personnelles (Gmail, Outlook…) ne sont pas acceptées.",
        loginEmailHint: "Ton adresse de connexion ({{email}}) semble être une adresse d'établissement : elle est déjà préremplie.",
        sendCode: "Recevoir un code",
        codeLabel: "Code reçu par e-mail",
        confirm: "Valider",
        changeEmail: "Changer d'adresse",
        remove: "Retirer le badge",
        removeConfirm: "Retirer le badge « étudiant vérifié » de ton profil ?",
        codeSent: "Code envoyé à {{email}} (regarde aussi les spams).",
        done: "C'est fait : tu es vérifié(e) avec @{{domain}} !",
        errors: {
          "invalid-email": "Adresse e-mail invalide.",
          "personal-email": "Utilise l'adresse fournie par ton établissement (pas Gmail, Outlook…).",
          "email-used": "Cette adresse a déjà servi à vérifier un autre compte.",
          "too-many-codes": "Trop de codes demandés aujourd'hui. Réessaie demain.",
          "no-code": "Demande d'abord un code.",
          expired: "Code expiré : demandes-en un nouveau.",
          "too-many-attempts": "Trop d'essais : demande un nouveau code.",
          "wrong-code": "Code incorrect.",
          generic: "La vérification a échoué. Réessaie."
        }
      },
      invite: {
        title: "Invite tes camarades",
        desc: "Plus il y a d'étudiants de ta promo, plus tu trouveras vite le bon binôme.",
        button: "Inviter",
        message: "Je révise avec BuddyEtude : on y trouve un binôme compatible, on discute et on travaille ensemble sur un tableau blanc. Inscris-toi, c'est gratuit :",
        copied: "Lien d'invitation copié : colle-le dans ton groupe de promo !",
        copyError: "Copie impossible. Partage l'adresse buddyetude.com."
      },
      home: {
        nav: {
          login: "Connexion",
          signup: "Inscription",
          dashboard: "Tableau de bord",
          switchLanguage: "Changer de langue"
        }
      },
      landing: {
        manifesto: "Réviser seul, c'est long, démotivant, et on bloque vite. À deux, on s'explique, on se motive et on avance pour de vrai. BuddyEtude te trouve la bonne personne.",
        scrollHint: "Fais défiler",
        story: {
          profileTitle: "Mon profil",
          subjects: "Matières",
          avail: "Disponibilités",
          evening: "Soir",
          weekend: "Week-end",
          online: "En ligne",
          beginner: "Débutant",
          advanced: "Avancé",
          intermediate: "Intermédiaire",
          results: "Les plus compatibles",
          call: "Appel vidéo",
          page: "Page 1 / 3",
          typing: "Léa écrit…",
          file: "fiche-chapitre-3.pdf",
          accepted: "Demande acceptée 🎉"
        },
        heroBadge: "Nouveau : le mentorat entre étudiants",
        secondaryCta: "Comment ça marche",
        trust: {
          free: "100 % gratuit",
          verified: "Étudiants vérifiés",
          europe: "Données hébergées en Europe"
        },
        mock: {
          name: "Léa M.",
          meta: "L2 Mathématiques · Lyon",
          match: "compatible",
          subjects: ["Analyse", "Probabilités", "Python"],
          contact: "Contacter",
          chat1: "On attaque les intégrales ce soir ?",
          chat2: "Carrément ! 18 h sur le tableau blanc 🙌",
          session: "Révision d'analyse",
          sessionWhen: "Demain · 18:00",
          video: "Appel vidéo prêt",
          board: "Tableau blanc",
          live: "En direct",
          verified: "Étudiante vérifiée",
          thanks: "Merci, parfait 🙏"
        },
        how: {
          eyebrow: "Comment ça marche",
          title: "Ton binôme en trois étapes",
          subtitle: "Pas de formulaire interminable : en cinq minutes, tu sais avec qui réviser.",
          steps: {
            profile: { title: "Crée ton profil", desc: "Tes matières, ton niveau dans chacune, ton école et tes disponibilités." },
            match: { title: "Trouve ton binôme", desc: "Les profils les plus compatibles apparaissent en premier. Envoie une demande avec un petit mot." },
            study: { title: "Révisez ensemble", desc: "Discutez, planifiez une session avec appel vidéo et travaillez sur le même tableau blanc." }
          }
        },
        featuresEyebrow: "Tout au même endroit",
        mentor: {
          eyebrow: "Mentorat",
          title: "Tu bloques ? Des étudiants avancés peuvent t'aider",
          desc: "Indique ton niveau dans chaque matière. Si tu débutes, l'onglet « Trouver de l'aide » te montre les étudiants « Avancé » qui acceptent d'épauler les autres.",
          points: {
            p1: "Demande ciblée sur une matière précise",
            p2: "Les avancés choisissent d'aider ou non",
            p3: "Ensuite, discussion et sessions comme avec un binôme"
          },
          card: {
            title: "Demande d'aide en Physique",
            from: "Tom, débutant",
            msg: "Je bloque sur les ondes stationnaires, tu aurais 30 min cette semaine ?",
            accept: "Accepter",
            badge: "Avancé"
          }
        },
        safety: {
          eyebrow: "Confiance",
          title: "Un espace pensé pour les étudiants",
          subtitle: "Tu choisis avec qui tu échanges, et tu gardes la main sur tes données.",
          items: {
            verified: { title: "Badge étudiant vérifié", desc: "Un code envoyé sur l'adresse de l'établissement confirme le statut. Seul le nom de domaine est affiché." },
            contact: { title: "Coordonnées protégées", desc: "Un avertissement apparaît avant d'envoyer un numéro ou un lien à quelqu'un que tu ne connais pas encore." },
            report: { title: "Signalement et blocage", desc: "Un profil gênant ? Bloque-le en un clic ou signale-le à l'équipe de modération." },
            privacy: { title: "Données protégées", desc: "Hébergement en Europe, aucune publicité, et suppression complète de ton compte quand tu veux." }
          }
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
            title: "Binômes compatibles",
            desc: "Les profils sont classés par compatibilité : matières en commun, même niveau, même école ou même ville, créneaux communs. Filtrez aussi par mode (en ligne ou présentiel)."
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
            desc: "Date, heure, en ligne ou en présentiel : un lien d'appel vidéo se crée en un clic, la session s'ajoute à votre agenda et un rappel arrive par e-mail la veille et une heure avant."
          },
          subjects: {
            title: "Toutes les matières",
            desc: "Mathématiques, droit, médecine, langues… La matière est libre : indiquez la vôtre et voyez qui la partage."
          }
        }
      },
      cta: {
        title: "Prêt à trouver votre binôme ?",
        subtitle: "Inscrivez-vous avec Google ou votre adresse e-mail, complétez votre profil et envoyez votre première demande de binôme. C'est gratuit.",
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
          pass_las: "Santé (PASS / LAS)",
          bachelor: "Bachelor",
          ecole_ingenieur: "École d'ingénieurs",
          ecole_commerce: "École de commerce",
          formation_continue: "Formation continue / alternance",
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
          helpSuccess: "Demande d'aide envoyée !",
          error: "Impossible d'envoyer la demande",
          loadError: "Impossible de charger les profils.",
          dailyLimit: "Tu as atteint la limite de {{count}} demandes par jour. Réessaie demain."
        },
        mode: {
          label: "Type de recherche",
          buddy: "Trouver un binôme",
          help: "Trouver de l'aide",
          helpDesc: "Étudiants « Avancé » dans les matières où tu es « Débutant » ou « Intermédiaire », et qui acceptent d'aider. Tape une matière pour chercher de l'aide sur un autre sujet.",
          helpNoNeed: "Ajoute à ton profil une matière au niveau « Débutant » ou « Intermédiaire », ou tape une matière ci-dessous, pour trouver qui peut t'aider."
        },
        helpDialog: {
          title: "Demander de l'aide",
          desc: "Explique à <bold>{{name}}</bold> sur quoi tu bloques : un chapitre, un exercice, une notion…",
          subject: "Matière",
          placeholder: "Bonjour ! Je débute en… et je bloque sur…"
        },
        verifiedOnly: "Étudiants vérifiés uniquement",
        contactWarning: "Ton message contient des coordonnées ou un lien. Pour ta sécurité, évite de les partager avant de connaître la personne : vous pourrez discuter dans BuddyEtude dès qu'elle aura accepté.",
        sendAnyway: "Envoyer quand même"
      },
      // --- NOUVEAU : CARTE DE PROFIL (résultats de recherche) ---
      buddyCard: {
        defaultStudent: "Étudiant",
        noBio: "Cet étudiant n'a pas encore rédigé de présentation.",
        report: "Signaler",
        requestSent: "Demande envoyée",
        openChat: "Ouvrir la conversation",
        block: "Bloquer",
        blocked: "{{name}} est bloqué(e) : vous ne verrez plus son profil.",
        blockError: "Impossible de bloquer cette personne.",
        verified: "Étudiant vérifié ({{domain}})",
        canHelp: "Peut t'aider en {{subjects}}",
        askHelp: "Demander de l'aide",
        match: {
          subjects_one: "1 matière en commun",
          subjects_other: "{{count}} matières en commun",
          level: "Même niveau",
          city: "Même ville",
          school: "Même école"
        },
        answerRequest: "Répondre à sa demande",
        contact: "Contacter",
        levels: {
          college: "Collège",
          lycee: "Lycée",
          prepa: "Prépa",
          bts_iut: "BTS/IUT",
          licence: "Licence",
          pass_las: "Santé (PASS / LAS)",
          bachelor: "Bachelor",
          ecole_ingenieur: "École d'ingénieurs",
          ecole_commerce: "École de commerce",
          formation_continue: "Formation continue / alternance",
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
        removeBuddy: "Retirer ce binôme",
        backToContacts: "Retour aux contacts",
        loadOlder: "Messages précédents",
        attachFile: "Joindre un fichier",
        removeFile: "Retirer le fichier",
        send: "Envoyer",
        saveEdit: "Enregistrer la modification",
        cancelEdit: "Annuler la modification",
        unreadCount: "{{count}} message(s) non lu(s)",
        removeModal: {
          title: "Retirer {{name}} de vos binômes ?",
          desc: "La conversation disparaîtra de votre liste et vous ne pourrez plus planifier de session ensemble. Vous pourrez renvoyer une demande plus tard.",
          cancel: "Annuler",
          confirm: "Retirer"
        },
        edited: "(modifié)",
        edit: "Modifier",
        delete: "Supprimer",
        inputPlaceholder: "Écrire un message à {{name}}...",
        fileDefaultName: "Document",
        pendingRequest: {
          title: "Nouvelle demande",
          desc: "<bold>{{name}}</bold> souhaite réviser avec vous. Acceptez pour lancer la messagerie.",
          helpTitle: "Demande d'aide en {{subject}}",
          helpDesc: "<bold>{{name}}</bold> débute en {{subject}} et aimerait ton aide. Accepte pour lancer la discussion.",
          contactWarning: "Ce message contient des coordonnées ou un lien : restez sur BuddyEtude tant que vous ne vous connaissez pas.",
          accept: "Accepter",
          reject: "Refuser"
        },
        emptyState: {
          title: "Vos messages",
          desc: "Sélectionnez un contact pour afficher la discussion."
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
          fileNotAllowed: "Ce type de fichier n'est pas autorisé.",
          fileTooLarge: "Fichier trop volumineux (10 Mo maximum).",
          buddyRemoved: "{{name}} a été retiré(e) de vos binômes.",
          buddyRemoveError: "Impossible de retirer ce binôme."
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
        toClose: "À clôturer",
        joinCall: "Rejoindre l'appel vidéo",
        addToCalendar: "Ajouter à mon agenda",
        feedback: {
          title: "Comment s'est passée la session ?",
          desc: "Ton avis reste confidentiel : il aide seulement la modération à repérer les problèmes.",
          ratingLabel: "Note",
          stars_one: "{{count}} étoile",
          stars_other: "{{count}} étoiles",
          placeholder: "Un commentaire ? (facultatif)",
          skip: "Plus tard",
          send: "Envoyer",
          thanks: "Merci pour ton avis !",
          error: "Avis non enregistré (déjà donné pour cette session ?).",
          give: "Donner mon avis"
        },
        toCloseDesc: "Ces sessions sont passées : indiquez si elles ont eu lieu.",
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
          meetingLabel: "Lien d'appel vidéo (facultatif)",
          generateLink: "Créer un lien",
          meetingHint: "Jitsi Meet : gratuit, sans compte, fonctionne dans le navigateur.",
          cancel: "Annuler",
          submit: "Planifier la session"
        },
        toast: {
          created: "Session planifiée !",
          inPast: "Cette date est déjà passée.",
          badLink: "Le lien d'appel doit commencer par https://",
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
        removeItem: "Retirer {{name}}",
        age: {
          title: "Ton âge",
          privateNote: "Information privée, jamais affichée aux autres étudiants.",
          "15plus": "J'ai 15 ans ou plus",
          under15: "J'ai moins de 15 ans",
          consent: "Un de mes parents (ou mon tuteur légal) a donné son accord pour que j'utilise BuddyEtude.",
          required: "Indique ta tranche d'âge.",
          consentRequired: "Avant 15 ans, l'accord d'un parent est nécessaire."
        },
        addGoal: "Ajouter l'objectif",
        goalPlaceholder: "Ex: Préparer un concours...",
        studyStyle: "Style d'apprentissage",
        availability: "Disponibilités",
        sessionsOnline: "Sessions en ligne",
        sessionsInPerson: "Sessions en présentiel",
        save: "Enregistrer mon profil",
        validation: {
          incomplete: "Ajoutez un nom affiché, au moins une matière, et votre niveau d'études ou votre établissement."
        },
        mentor: "J'aide les débutants",
        mentorDesc: "Les étudiants « Débutant » ou « Intermédiaire » pourront te demander de l'aide dans tes matières « Avancé ».",
        mentorNeedsAdvanced: "Indique au moins une matière au niveau « Avancé » pour proposer ton aide.",
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
      // --- Paramètres et profil (refonte visuelle) ---
      settingsUi: {
        nav: {
          account: { label: "Compte", desc: "Identité et connexion" },
          appearance: { label: "Apparence", desc: "Thème et langue" },
          notifications: { label: "Notifications", desc: "Appli, e-mails, appareil" },
          privacy: { label: "Confidentialité", desc: "Visibilité et blocages" }
        },
        infoTitle: "Informations",
        header: {
          connectedWith: "Connecté avec {{provider}}",
          viewProfile: "Voir mon profil",
          providers: { google: "Google", password: "e-mail", microsoft: "Microsoft" }
        },
        account: {
          identityTitle: "Identité",
          identityDesc: "Les informations de connexion à ton compte.",
          name: "Nom",
          email: "Adresse e-mail",
          emailPrivate: "Jamais visible par les autres étudiants",
          method: "Méthode de connexion",
          student: "Statut étudiant",
          verified: "Vérifié · @{{domain}}",
          notVerified: "Non vérifié",
          verify: "Vérifier",
          dangerTitle: "Zone de danger",
          dangerDesc: "Actions définitives sur ton compte."
        },
        appearance: {
          themeTitle: "Thème",
          themeDesc: "Choisis l'ambiance de l'application.",
          light: "Clair",
          dark: "Sombre",
          system: "Système",
          systemDesc: "Suit le réglage de ton appareil",
          systemToast: "Le thème suit maintenant ton appareil",
          languageTitle: "Langue",
          languageDesc: "Langue de l'interface sur cet appareil.",
          languageToast: "Langue modifiée"
        },
        notifications: {
          appTitle: "Dans l'application",
          appDesc: "Alertes affichées pendant que tu utilises BuddyEtude.",
          emailTitle: "Par e-mail",
          emailDesc: "Envoyés à ton adresse de connexion.",
          deviceTitle: "Sur cet appareil",
          deviceDesc: "Même quand BuddyEtude est fermé.",
          deviceUnavailable: "Ton navigateur ne permet pas les notifications push sur cet appareil."
        },
        privacy: {
          visibilityTitle: "Visibilité",
          visibilityDesc: "Qui peut te trouver sur BuddyEtude.",
          blockedTitle: "Personnes bloquées",
          blockedDesc: "Elles ne peuvent plus te contacter.",
          dataTitle: "Tes données",
          dataDesc: "Hébergées dans l'Union européenne, jamais vendues.",
          policy: "Politique de confidentialité",
          policyDesc: "Ce que nous collectons et pourquoi",
          legal: "Mentions légales et CGU",
          legalDesc: "Les règles d'utilisation du service",
          about: "À propos",
          aboutDesc: "Qui est derrière BuddyEtude",
          contact: "Nous écrire"
        }
      },
      profileUi: {
        editProfile: "Modifier le profil",
        photo: {
          change: "Changer la photo de profil",
          title: "Photo de profil",
          desc: "Une photo nette de ton visage aide les autres étudiants à te reconnaître.",
          cropHint: "Fais glisser l'image pour la recadrer, et utilise le curseur pour zoomer.",
          choose: "Choisir une image",
          formats: "JPG, PNG ou WebP · 20 Mo maximum",
          other: "Autre image",
          zoom: "Zoom",
          save: "Enregistrer la photo",
          saved: "Photo de profil mise à jour",
          remove: "Retirer la photo",
          revertGoogle: "Revenir à ma photo Google",
          removed: "Photo retirée",
          tooBig: "Image trop lourde (20 Mo maximum).",
          invalid: "Ce fichier n'est pas une image lisible (JPG, PNG ou WebP).",
          error: "La photo n'a pas pu être enregistrée. Réessaie."
        },
        publicNote: "C'est ce que voient les autres étudiants",
        stats: { subjects: "Matières", buddies: "Binômes", sessions: "Sessions faites", completion: "Profil complété" },
        strength: {
          title: "Force du profil",
          done: "Ton profil est complet, bravo !",
          hint: "Un profil complet reçoit plus de demandes.",
          items: {
            bio: "Écrire une présentation",
            city: "Indiquer ta ville",
            school: "Indiquer ton établissement",
            subjects: "Ajouter au moins 2 matières",
            availability: "Choisir tes disponibilités",
            goals: "Ajouter un objectif",
            verified: "Vérifier ton statut étudiant"
          }
        },
        about: "À propos",
        noBio: "Tu n'as pas encore écrit de présentation.",
        addBio: "Écrire ma présentation",
        subjects: "Matières et niveaux",
        noSubjects: "Aucune matière pour l'instant.",
        levels: { debutant: "Débutant", intermediaire: "Intermédiaire", avance: "Avancé" },
        goals: "Objectifs",
        availability: "Disponibilités",
        noAvailability: "Aucune disponibilité indiquée.",
        format: "Format des sessions",
        style: "Façon d'apprendre",
        mentor: "Mentor",
        mentorDesc: "Peut aider en {{subjects}}",
        form: {
          general: "Ce qui apparaît en haut de ton profil.",
          subjects: "Ton niveau dans chaque matière sert au calcul de compatibilité.",
          goals: "Ce que tu veux atteindre, en quelques mots.",
          preferences: "Quand et comment tu préfères réviser.",
          saveHint: "Pense à enregistrer tes modifications."
        }
      },
      settings: {
        danger: {
          title: "Supprimer mon compte",
          desc: "Efface définitivement ton profil, tes messages (et leurs fichiers) et tes demandes de binôme. Tes sessions prévues seront annulées. Les messages que tes binômes t'ont envoyés restent dans leur propre historique.",
          button: "Supprimer mon compte",
          modalTitle: "Supprimer définitivement ton compte ?",
          modalDesc: "Cette action est irréversible. Tu devras te reconnecter pour confirmer qu'il s'agit bien de toi.",
          typeToConfirm: "Tape {{word}} pour confirmer",
          confirmWord: "SUPPRIMER",
          cancel: "Annuler",
          confirm: "Supprimer définitivement",
          reauthCancelled: "Suppression annulée : la reconnexion n'a pas abouti.",
          error: "La suppression a échoué. Réessaie ou écris à contact@buddyetude.com."
        },
        title: "Paramètres",
        subtitle: "Ton compte, l'apparence de l'application et tes notifications.",
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
          requestAlertsDesc: "Une alerte quand quelqu'un accepte ta demande ou t'en envoie une. Propre à cet appareil.",
          privacy: "Confidentialité",
          profileVisibility: "Visibilité du profil",
          profileVisibilityDesc: "Permettre aux autres étudiants de te trouver dans la recherche.",
          emailNotifs: "Notifications par e-mail",
          emailNotifsDesc: "Nouvelle demande, nouveau message (au plus un e-mail par conversation et par demi-heure), rappels de session.",
          push: "Notifications sur cet appareil",
          pushDesc: "Nouveaux messages, demandes et rappels de session, même quand BuddyEtude est fermé.",
          pushDenied: "Les notifications sont bloquées dans ton navigateur : autorise-les dans les réglages du site.",
          weeklyDigest: "Résumé du lundi",
          weeklyDigestDesc: "Chaque lundi, les nouveaux étudiants de la semaine qui partagent une matière ou ton école.",
          blocked: "Personnes bloquées",
          noBlocked: "Tu n'as bloqué personne.",
          unknownUser: "Utilisateur",
          unblock: "Débloquer"
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
        colorLabel: "Couleur {{color}}",
        brushSize: "Épaisseur {{size}}",
        closePicker: "Fermer le sélecteur de couleur",
        saveColor: "Enregistrer cette couleur",
        ink: "Encre (noir / blanc selon le thème)",
        textPlaceholder: "Écrivez ici...",
        clearConfirm: "Voulez-vous vraiment tout effacer ?",
        clearPageConfirm: "Effacer tous les dessins de cette page ?",
        pageOf: "{{page}} / {{count}}",
        prevPage: "Page précédente",
        nextPage: "Page suivante",
        addPage: "Ajouter une page",
        exportNoBackground: "Le fond PDF n'a pas pu être inclus dans l'image : seuls les dessins sont exportés.",
        pdf: {
          import: "Importer un PDF",
          progress: "Import {{done}}/{{total}}",
          notPdf: "Choisissez un fichier PDF.",
          tooBig: "PDF trop lourd (30 Mo maximum).",
          done_one: "{{count}} page importée : annotez-la !",
          done_other: "{{count}} pages importées : annotez-les !",
          truncated: "Seules les {{count}} premières pages ont été importées.",
          error: "Le PDF n'a pas pu être importé."
        },
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
      notFound: {
        title: "Page not found",
        desc: "The page \"{{page}}\" does not exist.",
        home: "Back to home"
      },
      admin: {
        title: "Moderation",
        subtitle: "Statistics, reports and negative feedback after sessions.",
        forbidden: "This page is reserved for moderation.",
        reports: "Pending reports",
        noReports: "No pending report.",
        ban: "Ban",
        dismiss: "Dismiss",
        feedback: "Negative feedback",
        feedbackDesc: "Sessions rated 1 or 2 stars.",
        noFeedback: "No negative feedback.",
        about: "About",
        stats: {
          title: "Statistics",
          refresh: "Refresh",
          error: "Statistics unavailable.",
          accounts: "Accounts created",
          students: "Complete profiles",
          buddies: "Study buddies matched",
          messages7d: "Messages (7 days)",
          upcomingSessions: "Upcoming sessions",
          completedSessions: "Completed sessions",
          rating: "Average session rating",
          ratingCount_one: "{{count}} review",
          ratingCount_other: "{{count}} reviews",
          pendingRequests: "Pending requests",
          pendingReports: "Pending reports",
          signupsTitle: "Sign-ups per week",
          weekOf: "Week of {{date}}",
          week: "Week",
          signups: "Sign-ups",
          verified: "Verified students",
          helpRequests: "Help requests",
          funnelTitle: "Student journey",
          funnelDesc: "How many accounts reach each step: act where the number drops.",
          funnelStep: "{{rate}} of the previous step",
          funnel: {
            accounts: "Account created",
            profiles: "Profile completed",
            requested: "Sent or received a request",
            matched: "Found a study buddy",
            hadSession: "Scheduled a session"
          }
        },
        cleanup: {
          title: "Old data",
          desc: "Messages, requests, sessions and whiteboards created before the update (email format) are no longer visible. “Analyze” counts what is left, without deleting anything.",
          preview: "Analyze",
          confirm: "Delete permanently",
          nothing: "No old data to clean up.",
          done: "Old data deleted.",
          items: {
            messages_one: "{{count}} old message",
            messages_other: "{{count}} old messages",
            files_one: "including {{count}} attached file",
            files_other: "including {{count}} attached files",
            requests_one: "{{count}} old request",
            requests_other: "{{count}} old requests",
            sessions_one: "{{count}} old session",
            sessions_other: "{{count}} old sessions",
            whiteboards_one: "{{count}} old whiteboard",
            whiteboards_other: "{{count}} old whiteboards",
            profiles_one: "{{count}} profile whose email will be removed",
            profiles_other: "{{count}} profiles whose email will be removed"
          }
        },
        toast: {
          banned: "{{name}} has been banned.",
          dismissed: "Report dismissed.",
          error: "Action failed."
        }
      },
      auth: {
        dialogTitle: "Sign in",
        signupTitle: "Create an account",
        resetTitle: "Forgot password",
        dialogDesc: "Sign in to find a study buddy, chat and study together.",
        studentEmailTip: "Tip: use your student address (from your school or university) rather than your personal one. You can then get the “verified student” ✓ badge in one click, which reassures other students.",
        withGoogle: "Continue with Google",
        withMicrosoft: "Continue with Microsoft",
        or: "or",
        name: "First and last name",
        email: "Email address",
        password: "Password",
        forgot: "Forgot password?",
        passwordHint: "At least 8 characters.",
        loginButton: "Sign in",
        signupButton: "Create my account",
        resetButton: "Send the reset link",
        noAccount: "No account yet?",
        createAccount: "Create an account",
        backToLogin: "Back to sign in",
        resetSent: "If an account exists for this address, a reset email has just been sent.",
        verifyBanner: "Verify your email address ({{email}}) by clicking the link you received.",
        verifySent: "Verification email sent again.",
        verifyResend: "Resend the email",
        verifyDone: "Done",
        errors: {
          invalidCredential: "Incorrect email or password.",
          invalidEmail: "Invalid email address.",
          emailInUse: "An account already exists with this address. Sign in instead.",
          weakPassword: "Password too weak (at least 8 characters).",
          tooMany: "Too many attempts. Try again in a few minutes.",
          providerDisabled: "This sign-in method is not enabled yet.",
          otherProvider: "This address is already linked to another sign-in method (Google, Microsoft or email).",
          popupBlocked: "The sign-in window was blocked by the browser. Allow pop-ups and try again.",
          network: "Internet connection problem. Try again.",
          nameRequired: "Enter your first and last name.",
          generic: "Sign-in failed. Try again."
        },
        requiredTitle: "Login required",
        requiredDesc: "Sign in with your Google account to access your BuddyEtude space: study buddies, messages, sessions and whiteboard.",
        login: "Sign in",
        backHome: "Back to home"
      },
      about: {
        title: "About BuddyEtude",
        subtitle: "The story of a project born to solve a problem every student knows: feeling alone when revising.",
        origin: {
          title: "Our Origin",
          text: "BuddyEtude was imagined and built by a student. Faced with how hard it was to find motivated partners to revise with the night before exams, the idea was born: why not create a social network dedicated solely to peer support and group study?"
        },
        mission: {
          title: "Our Mission",
          text: "Our goal is simple: make sure no student ends up stuck alone with their coursework. Whether you're in high school, preparatory classes or university, BuddyEtude connects you with profiles that complement your skills so you can succeed together."
        },
        join: {
          title: "Join the adventure",
          text: "BuddyEtude grows every day thanks to its community. If you have suggestions, ideas for improvement, or would like to get involved in the project, feel free to contact us!",
          button: "Write to us"
        }
      },
      legal: {
        title: "Legal Notice & Terms of Use",
        publisher: {
          title: "1. Site publisher",
          intro: "The <bold>BuddyEtude</bold> website is published by:",
          email: "Email",
          director: "Publication director"
        },
        hosting: {
          title: "2. Hosting",
          intro: "The website and its data are hosted by:",
          site: "Website",
          data: "Accounts, database and files (Firebase)",
          us: "United States",
          ie: "Ireland",
          website: "Website"
        },
        terms: {
          title: "3. Terms of Use",
          purposeLabel: "Purpose:",
          purpose: "BuddyEtude is a platform that connects students to make peer support with studies easier.",
          userLabel: "User responsibility:",
          user: "Users agree to provide accurate information and to use the platform in a strictly academic and respectful way. Any hateful, promotional or inappropriate content will result in the immediate deletion of the account.",
          ageLabel: "Age:",
          age: "BuddyEtude is open to students aged 15 and over; under 15, a parent's consent is required.",
          moderationLabel: "Moderation:",
          moderation: "BuddyEtude reserves the right to review reports and to ban any user who does not follow the rules of courtesy. Messages exchanged between users may be moderated if they are reported."
        },
        ip: {
          title: "4. Intellectual property",
          text: "All graphic elements, the structure and, more generally, the content of the BuddyEtude website are protected by copyright, trademark law and design law. Anyone who collects or downloads content or information published on the site only has a private, personal and non-transferable right to use it."
        }
      },
      privacy: {
        title: "Privacy Policy",
        updated: "Last updated: November 18, 2026",
        intro: "BuddyEtude connects students so they can study together. This page explains what data we process, why, with whom, for how long, and how to exercise your rights, in line with the General Data Protection Regulation (GDPR).",
        sections: [
          {
            title: "1. Data controller",
            paragraphs: ["The data controller is the site publisher listed in the Legal Notice. For any question about your data: {{email}}."]
          },
          {
            title: "2. Data we process",
            items: [
              { label: "Account:", text: "name and email address (provided by Google or entered at sign-up), profile photo (your Google photo, or one you upload from your profile). Passwords are handled by Google Firebase; we never have access to them. Your email address is never shown to other students." },
              { label: "Profile:", text: "city, level of study, subjects, availability, study mode, bio." },
              { label: "Age:", text: "age bracket (15 or over / under 15) and, where applicable, a declaration of parental consent. This information is private." },
              { label: "Student status (optional):", text: "if you request the “verified student” badge, your school address is only used to send you a code; it is erased as soon as you confirm (or after one day), and only its domain name (e.g. univ-rennes.fr) is shown on your profile. A hashed fingerprint of the address is kept so it can verify only one account." },
              { label: "Activity:", text: "study buddy requests, messages and files exchanged, study groups and their chats, scheduled sessions, whiteboard drawings and PDF documents imported into it, feedback after a session, reports and blocks." },
              { label: "Preferences:", text: "whether you receive notification emails and the Monday digest, language and display theme; if you turn on push notifications, a technical identifier of your device." },
              { label: "Technical data:", text: "when an error occurs, a technical report (page, browser, error message); an anti-abuse check (App Check) that makes sure requests come from the real site." }
            ]
          },
          {
            title: "3. Why, and on what legal basis",
            items: [
              { label: "Running the service", text: "(account, buddy search, messaging, sessions, whiteboard): performance of the terms of use you accept when creating an account." },
              { label: "Notifications", text: "(emails: new request, new message, session, reminders, Monday digest of compatible new students; push notifications if you turn them on): performance of the service. Each can be turned off at any time in Settings → Preferences." },
              { label: "Security and moderation", text: "(reports, bans, abuse protection, error tracking): legitimate interest in providing a safe and reliable service." },
              { label: "Internal statistics", text: "(number of sign-ups, buddies, sessions): legitimate interest; these are overall counts, with no profiling or advertising." }
            ]
          },
          {
            title: "4. Who sees your data",
            items: [
              { label: "Other signed-in students", text: "see your profile (name, photo, city, level, subjects, availability, bio), unless you hide it in Settings." },
              { label: "Your study buddies and groups", text: "see the messages, files, sessions and drawings you share with them, and only they do. The Monday digest may show your name and shared subjects to compatible students who have just signed up, as the search already does." },
              { label: "Moderation", text: "sees reports, post-session feedback and, when something is reported, what is needed to handle it." },
              { label: "No one else:", text: "BuddyEtude does not sell or rent your data and shows no advertising." }
            ]
          },
          {
            title: "5. Service providers (processors)",
            paragraphs: ["We rely on providers that process data on our behalf, only for the purposes described here:"],
            items: [
              { label: "Google (Firebase, Google Cloud):", text: "accounts, database, files, server functions, push notifications, abuse protection. Database data is hosted in the European Union." },
              { label: "Vercel:", text: "website hosting (United States)." },
              { label: "Brevo (France):", text: "sending notification emails." },
              { label: "Sentry:", text: "technical error tracking, hosted in the European Union." },
              { label: "Jitsi Meet:", text: "video calls take place on meet.jit.si, an external service; BuddyEtude only generates the link and does not record calls." },
              { label: "French government open data services:", text: "while you type a city or a school, the typed text is sent to geo.api.gouv.fr and data.enseignementsup-recherche.gouv.fr to suggest options (no other data)." }
            ]
          },
          {
            title: "6. Transfers outside the European Union",
            paragraphs: ["Some providers (Google, Vercel) are based in the United States. These transfers are covered by the EU–US Data Privacy Framework and/or the European Commission's standard contractual clauses."]
          },
          {
            title: "7. Retention periods",
            items: [
              { label: "Account and content:", text: "for as long as the account exists. Deleting your account (Settings → Delete my account) immediately erases your profile, the messages and files you sent, requests, blocks, private data and feedback you left; sessions are cancelled, groups you created are deleted and you leave the others." },
              { label: "Inactive accounts:", text: "deleted after 3 years without sign-in." },
              { label: "Notification emails sent:", text: "30 days." },
              { label: "Feedback and handled reports:", text: "1 year." },
              { label: "Error reports:", text: "30 days at most." },
              { label: "Backups:", text: "7 days, renewed daily." }
            ]
          },
          {
            title: "8. Minors",
            paragraphs: ["In France, minors can consent on their own to the processing of their data from the age of 15. Under 15, using BuddyEtude requires the consent of a holder of parental authority, declared in the profile. A parent can ask at any time for their child's account to be deleted by writing to {{email}}."]
          },
          {
            title: "9. Cookies and local storage",
            paragraphs: ["BuddyEtude uses no advertising cookies and no audience measurement tool. Only what is strictly necessary for the service is used, which requires no consent: keeping you signed in, your display preferences (language, theme) and abuse protection."]
          },
          {
            title: "10. Your rights",
            paragraphs: [
              "You have the right to access, rectify, erase, restrict, object to and port your data. You can edit your profile and delete your account directly in the app; for any other request, write to {{email}}. We reply within one month.",
              "If you believe your rights are not respected, you can lodge a complaint with the CNIL, the French data protection authority (www.cnil.fr)."
            ]
          }
        ]
      },
      layout: {
        nav: {
          Dashboard: "Dashboard",
          Search: "Search",
          Messages: "Messages",
          Sessions: "Sessions",
          Profile: "My Profile",
          Settings: "Settings",
          Admin: "Moderation",
          Groups: "Groups"
        },
        tabs: { Dashboard: "Home", Search: "Search", Messages: "Messages", Sessions: "Sessions", Profile: "Profile" },
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
          view: "View",
          sessionTitle: "New session 📅",
          sessionBody: "{{name}} scheduled \"{{title}}\" with you.",
          sessionToast: "New session scheduled!"
        },
        language: "Français",
        logout: "Logout",
        unreadMessages: "{{count}} new item(s) in Messages",
        menu: "Menu"
      },
      dashboard: {
        greeting: "Hello, {{name}}",
        subtitle: "Ready to boost your studies today?",
        findBuddy: "Find a buddy",
        progress: "{{done}} of {{total}} steps",
        tutorial: {
          close: "Hide tutorial",
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
      groups: {
        title: "Study groups",
        subtitle: "Study together (up to 6) with your study buddies: shared chat and whiteboard.",
        create: "New group",
        createTitle: "Create a group",
        createDesc: "You can then add your study buddies, one by one.",
        name: "Group name",
        namePlaceholder: "E.g. Year 2 maths finals",
        subject: "Subject (optional)",
        subjectPlaceholder: "E.g. Calculus",
        createButton: "Create group",
        emptyTitle: "No groups yet",
        emptyDesc: "Create a group and add your study buddies to study together.",
        pick: "Pick a group to see its chat.",
        memberCount_one: "{{count}} member",
        memberCount_other: "{{count}} members",
        whiteboard: "Whiteboard",
        delete: "Delete group",
        leave: "Leave group",
        owner: "Group creator",
        you: "You",
        remove: "Remove {{name}}",
        add: "Add",
        addPlaceholder: "Add a study buddy…",
        noBuddyToAdd: "All your study buddies are already in the group (or you don't have any yet).",
        noMessages: "No messages yet. Start the conversation!",
        inputPlaceholder: "Write to the group…",
        send: "Send",
        back: "Back to groups",
        leaveConfirm: "Leave the group “{{name}}”?",
        deleteConfirm: "Permanently delete the group “{{name}}”, its chat and its whiteboard?",
        toast: {
          created: "Group created.",
          added: "{{name}} joined the group.",
          removed: "{{name}} was removed from the group.",
          left: "You left the group.",
          deleted: "Group deleted.",
          error: "Action failed. Please try again."
        }
      },
      verification: {
        title: "Verified student",
        desc: "Confirm an email address from your school to show the ✓ badge on your profile. Only the domain name (e.g. univ-rennes.fr) will be visible, never your address.",
        verified: "Your status is verified with an @{{domain}} address.",
        start: "Verify my status",
        emailLabel: "Your school email address",
        emailPlaceholder: "firstname.lastname@your-school.edu",
        personalHint: "Use the address provided by your school: personal addresses (Gmail, Outlook…) are not accepted.",
        loginEmailHint: "Your sign-in address ({{email}}) looks like a school address: it's already filled in.",
        sendCode: "Get a code",
        codeLabel: "Code received by email",
        confirm: "Confirm",
        changeEmail: "Change address",
        remove: "Remove badge",
        removeConfirm: "Remove the “verified student” badge from your profile?",
        codeSent: "Code sent to {{email}} (check your spam folder too).",
        done: "Done: you're verified with @{{domain}}!",
        errors: {
          "invalid-email": "Invalid email address.",
          "personal-email": "Use the address provided by your school (not Gmail, Outlook…).",
          "email-used": "This address has already been used to verify another account.",
          "too-many-codes": "Too many codes requested today. Try again tomorrow.",
          "no-code": "Request a code first.",
          expired: "Code expired: request a new one.",
          "too-many-attempts": "Too many attempts: request a new code.",
          "wrong-code": "Wrong code.",
          generic: "Verification failed. Please try again."
        }
      },
      invite: {
        title: "Invite your classmates",
        desc: "The more students from your class join, the faster you'll find the right study buddy.",
        button: "Invite",
        message: "I'm studying with BuddyEtude: you find a compatible study buddy, chat and work together on a whiteboard. Sign up, it's free:",
        copied: "Invitation link copied: paste it in your class group!",
        copyError: "Couldn't copy. Share the address buddyetude.com."
      },
      home: {
        nav: {
          login: "Login",
          signup: "Sign Up",
          dashboard: "Dashboard",
          switchLanguage: "Switch language"
        }
      },
      landing: {
        manifesto: "Studying alone is slow, demotivating, and you get stuck fast. Together, you explain things, keep each other going and really make progress. BuddyEtude finds you the right person.",
        scrollHint: "Scroll",
        story: {
          profileTitle: "My profile",
          subjects: "Subjects",
          avail: "Availability",
          evening: "Evening",
          weekend: "Weekend",
          online: "Online",
          beginner: "Beginner",
          advanced: "Advanced",
          intermediate: "Intermediate",
          results: "Best matches",
          call: "Video call",
          page: "Page 1 / 3",
          typing: "Léa is typing…",
          file: "chapter-3-notes.pdf",
          accepted: "Request accepted 🎉"
        },
        heroBadge: "New: peer mentoring",
        secondaryCta: "How it works",
        trust: {
          free: "100% free",
          verified: "Verified students",
          europe: "Data hosted in Europe"
        },
        mock: {
          name: "Léa M.",
          meta: "2nd-year Maths · Lyon",
          match: "match",
          subjects: ["Calculus", "Probability", "Python"],
          contact: "Contact",
          chat1: "Shall we tackle integrals tonight?",
          chat2: "Absolutely! 6 pm on the whiteboard 🙌",
          session: "Calculus revision",
          sessionWhen: "Tomorrow · 6:00 pm",
          video: "Video call ready",
          board: "Whiteboard",
          live: "Live",
          verified: "Verified student",
          thanks: "Thanks, perfect 🙏"
        },
        how: {
          eyebrow: "How it works",
          title: "Your study buddy in three steps",
          subtitle: "No endless forms: in five minutes you know who to study with.",
          steps: {
            profile: { title: "Create your profile", desc: "Your subjects, your level in each, your school and your availability." },
            match: { title: "Find your buddy", desc: "The most compatible profiles show up first. Send a request with a short note." },
            study: { title: "Study together", desc: "Chat, schedule a session with a video call and work on the same whiteboard." }
          }
        },
        featuresEyebrow: "All in one place",
        mentor: {
          eyebrow: "Mentoring",
          title: "Stuck? Advanced students can help you",
          desc: "Set your level in each subject. If you're a beginner, the “Find help” tab shows “Advanced” students who are happy to help others.",
          points: {
            p1: "Requests targeted at one specific subject",
            p2: "Advanced students choose whether to help",
            p3: "Then chat and sessions, just like with a study buddy"
          },
          card: {
            title: "Help request in Physics",
            from: "Tom, beginner",
            msg: "I'm stuck on standing waves, would you have 30 min this week?",
            accept: "Accept",
            badge: "Advanced"
          }
        },
        safety: {
          eyebrow: "Trust",
          title: "A space designed for students",
          subtitle: "You choose who you talk to, and you stay in control of your data.",
          items: {
            verified: { title: "Verified student badge", desc: "A code sent to the school address confirms the status. Only the domain name is shown." },
            contact: { title: "Protected contact details", desc: "A warning appears before you send a phone number or a link to someone you don't know yet." },
            report: { title: "Report and block", desc: "An unpleasant profile? Block it in one click or report it to the moderation team." },
            privacy: { title: "Protected data", desc: "Hosted in Europe, no ads, and full account deletion whenever you want." }
          }
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
            title: "Compatible buddies",
            desc: "Profiles are ranked by compatibility: shared subjects, same level, same school or city, overlapping time slots. You can also filter by mode (online or in person)."
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
            desc: "Date, time, online or in person: a video call link is created in one click, the session goes into your calendar, and an email reminder arrives the day before and one hour before."
          },
          subjects: {
            title: "All subjects",
            desc: "Maths, law, medicine, languages... The subject field is free: enter yours and see who shares it."
          }
        }
      },
      cta: {
        title: "Ready to find your buddy?",
        subtitle: "Sign up with Google or your email address, complete your profile and send your first buddy request. It's free.",
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
          pass_las: "Health studies (PASS / LAS)",
          bachelor: "Bachelor",
          ecole_ingenieur: "Engineering school",
          ecole_commerce: "Business school",
          formation_continue: "Continuing education / work-study",
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
          loadError: "Couldn't load profiles.",
          helpSuccess: "Help request sent!",
          dailyLimit: "You've reached the limit of {{count}} requests per day. Try again tomorrow."
        },
        mode: {
          label: "Search type",
          buddy: "Find a study buddy",
          help: "Find help",
          helpDesc: "“Advanced” students in the subjects where you're “Beginner” or “Intermediate”, who are happy to help. Type a subject to look for help on another topic.",
          helpNoNeed: "Add a subject at “Beginner” or “Intermediate” level to your profile, or type a subject below, to find who can help you."
        },
        helpDialog: {
          title: "Ask for help",
          desc: "Tell <bold>{{name}}</bold> what you're stuck on: a chapter, an exercise, a concept…",
          subject: "Subject",
          placeholder: "Hi! I'm a beginner in… and I'm stuck on…"
        },
        verifiedOnly: "Verified students only",
        contactWarning: "Your message contains contact details or a link. For your safety, avoid sharing them before you know the person: you can chat on BuddyEtude as soon as they accept.",
        sendAnyway: "Send anyway"
      },
      // --- NEW: PROFILE CARD (search results) ---
      buddyCard: {
        defaultStudent: "Student",
        noBio: "This student hasn't written a bio yet.",
        report: "Report",
        requestSent: "Request sent",
        openChat: "Open conversation",
        block: "Block",
        blocked: "{{name}} is blocked: you will no longer see their profile.",
        blockError: "Could not block this person.",
        verified: "Verified student ({{domain}})",
        canHelp: "Can help you with {{subjects}}",
        askHelp: "Ask for help",
        match: {
          subjects_one: "1 subject in common",
          subjects_other: "{{count}} subjects in common",
          level: "Same level",
          city: "Same city",
          school: "Same school"
        },
        answerRequest: "Answer their request",
        contact: "Contact",
        levels: {
          college: "Middle school",
          lycee: "High school",
          prepa: "Prep school",
          bts_iut: "Associate degree",
          licence: "Bachelor's",
          pass_las: "Health studies (PASS / LAS)",
          bachelor: "Bachelor",
          ecole_ingenieur: "Engineering school",
          ecole_commerce: "Business school",
          formation_continue: "Continuing education / work-study",
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
        removeBuddy: "Remove this buddy",
        backToContacts: "Back to contacts",
        loadOlder: "Earlier messages",
        attachFile: "Attach a file",
        removeFile: "Remove the file",
        send: "Send",
        saveEdit: "Save the change",
        cancelEdit: "Cancel the change",
        unreadCount: "{{count}} unread message(s)",
        removeModal: {
          title: "Remove {{name}} from your buddies?",
          desc: "The conversation will disappear from your list and you will no longer be able to schedule sessions together. You can send a new request later.",
          cancel: "Cancel",
          confirm: "Remove"
        },
        edited: "(edited)",
        edit: "Edit",
        delete: "Delete",
        inputPlaceholder: "Write a message to {{name}}...",
        fileDefaultName: "Document",
        pendingRequest: {
          title: "New request",
          desc: "<bold>{{name}}</bold> wants to study with you. Accept to start messaging.",
          helpTitle: "Help request in {{subject}}",
          helpDesc: "<bold>{{name}}</bold> is a beginner in {{subject}} and would like your help. Accept to start chatting.",
          contactWarning: "This message contains contact details or a link: stay on BuddyEtude until you know each other.",
          accept: "Accept",
          reject: "Decline"
        },
        emptyState: {
          title: "Your messages",
          desc: "Select a contact to view the conversation."
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
          fileNotAllowed: "This file type is not allowed.",
          fileTooLarge: "File too large (10 MB maximum).",
          buddyRemoved: "{{name}} has been removed from your buddies.",
          buddyRemoveError: "Could not remove this buddy."
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
        toClose: "To close",
        joinCall: "Join the video call",
        addToCalendar: "Add to my calendar",
        feedback: {
          title: "How did the session go?",
          desc: "Your feedback stays confidential: it only helps moderation spot problems.",
          ratingLabel: "Rating",
          stars_one: "{{count}} star",
          stars_other: "{{count}} stars",
          placeholder: "Any comment? (optional)",
          skip: "Later",
          send: "Send",
          thanks: "Thanks for your feedback!",
          error: "Feedback not saved (already given for this session?).",
          give: "Give feedback"
        },
        toCloseDesc: "These sessions are over: tell us whether they took place.",
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
          meetingLabel: "Video call link (optional)",
          generateLink: "Create a link",
          meetingHint: "Jitsi Meet: free, no account needed, works in the browser.",
          cancel: "Cancel",
          submit: "Schedule session"
        },
        toast: {
          created: "Session scheduled!",
          inPast: "This date is already in the past.",
          badLink: "The call link must start with https://",
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
        removeItem: "Remove {{name}}",
        age: {
          title: "Your age",
          privateNote: "Private information, never shown to other students.",
          "15plus": "I am 15 or older",
          under15: "I am under 15",
          consent: "One of my parents (or my legal guardian) has agreed to let me use BuddyEtude.",
          required: "Select your age range.",
          consentRequired: "Under 15, a parent's consent is required."
        },
        addGoal: "Add goal",
        goalPlaceholder: "E.g. Prepare for a competitive exam...",
        studyStyle: "Learning style",
        availability: "Availability",
        sessionsOnline: "Online sessions",
        sessionsInPerson: "In-person sessions",
        save: "Save my profile",
        validation: {
          incomplete: "Add a display name, at least one subject, and your study level or school."
        },
        mentor: "I help beginners",
        mentorDesc: "Students at “Beginner” or “Intermediate” level can ask you for help in your “Advanced” subjects.",
        mentorNeedsAdvanced: "Add at least one subject at “Advanced” level to offer your help.",
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
      // --- Settings and profile (visual redesign) ---
      settingsUi: {
        nav: {
          account: { label: "Account", desc: "Identity and sign-in" },
          appearance: { label: "Appearance", desc: "Theme and language" },
          notifications: { label: "Notifications", desc: "App, email, device" },
          privacy: { label: "Privacy", desc: "Visibility and blocking" }
        },
        infoTitle: "Information",
        header: {
          connectedWith: "Signed in with {{provider}}",
          viewProfile: "View my profile",
          providers: { google: "Google", password: "email", microsoft: "Microsoft" }
        },
        account: {
          identityTitle: "Identity",
          identityDesc: "Your account's sign-in information.",
          name: "Name",
          email: "Email address",
          emailPrivate: "Never visible to other students",
          method: "Sign-in method",
          student: "Student status",
          verified: "Verified · @{{domain}}",
          notVerified: "Not verified",
          verify: "Verify",
          dangerTitle: "Danger zone",
          dangerDesc: "Permanent actions on your account."
        },
        appearance: {
          themeTitle: "Theme",
          themeDesc: "Choose the look of the app.",
          light: "Light",
          dark: "Dark",
          system: "System",
          systemDesc: "Follows your device setting",
          systemToast: "The theme now follows your device",
          languageTitle: "Language",
          languageDesc: "Interface language on this device.",
          languageToast: "Language changed"
        },
        notifications: {
          appTitle: "In the app",
          appDesc: "Alerts shown while you use BuddyEtude.",
          emailTitle: "By email",
          emailDesc: "Sent to your sign-in address.",
          deviceTitle: "On this device",
          deviceDesc: "Even when BuddyEtude is closed.",
          deviceUnavailable: "Your browser doesn't support push notifications on this device."
        },
        privacy: {
          visibilityTitle: "Visibility",
          visibilityDesc: "Who can find you on BuddyEtude.",
          blockedTitle: "Blocked people",
          blockedDesc: "They can no longer contact you.",
          dataTitle: "Your data",
          dataDesc: "Hosted in the European Union, never sold.",
          policy: "Privacy policy",
          policyDesc: "What we collect and why",
          legal: "Legal notice & terms",
          legalDesc: "The rules for using the service",
          about: "About",
          aboutDesc: "Who is behind BuddyEtude",
          contact: "Write to us"
        }
      },
      profileUi: {
        editProfile: "Edit profile",
        photo: {
          change: "Change profile photo",
          title: "Profile photo",
          desc: "A clear photo of your face helps other students recognize you.",
          cropHint: "Drag the image to crop it, and use the slider to zoom.",
          choose: "Choose an image",
          formats: "JPG, PNG or WebP · 20 MB max",
          other: "Other image",
          zoom: "Zoom",
          save: "Save photo",
          saved: "Profile photo updated",
          remove: "Remove photo",
          revertGoogle: "Go back to my Google photo",
          removed: "Photo removed",
          tooBig: "Image too large (20 MB max).",
          invalid: "This file isn't a readable image (JPG, PNG or WebP).",
          error: "The photo couldn't be saved. Try again."
        },
        publicNote: "This is what other students see",
        stats: { subjects: "Subjects", buddies: "Buddies", sessions: "Sessions done", completion: "Profile complete" },
        strength: {
          title: "Profile strength",
          done: "Your profile is complete, well done!",
          hint: "A complete profile gets more requests.",
          items: {
            bio: "Write a short bio",
            city: "Add your city",
            school: "Add your school",
            subjects: "Add at least 2 subjects",
            availability: "Choose your availability",
            goals: "Add a goal",
            verified: "Verify your student status"
          }
        },
        about: "About",
        noBio: "You haven't written a bio yet.",
        addBio: "Write my bio",
        subjects: "Subjects and levels",
        noSubjects: "No subjects yet.",
        levels: { debutant: "Beginner", intermediaire: "Intermediate", avance: "Advanced" },
        goals: "Goals",
        availability: "Availability",
        noAvailability: "No availability set.",
        format: "Session format",
        style: "Learning style",
        mentor: "Mentor",
        mentorDesc: "Can help with {{subjects}}",
        form: {
          general: "What appears at the top of your profile.",
          subjects: "Your level in each subject is used to compute compatibility.",
          goals: "What you want to achieve, in a few words.",
          preferences: "When and how you prefer to study.",
          saveHint: "Remember to save your changes."
        }
      },
      settings: {
        danger: {
          title: "Delete my account",
          desc: "Permanently erases your profile, your messages (and their files) and your buddy requests. Your planned sessions will be cancelled. Messages your buddies sent you stay in their own history.",
          button: "Delete my account",
          modalTitle: "Permanently delete your account?",
          modalDesc: "This cannot be undone. Google will ask you to sign in again to confirm it's really you.",
          typeToConfirm: "Type {{word}} to confirm",
          confirmWord: "DELETE",
          cancel: "Cancel",
          confirm: "Delete permanently",
          reauthCancelled: "Deletion cancelled: the Google sign-in did not complete.",
          error: "Deletion failed. Try again or write to contact@buddyetude.com."
        },
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
          profileVisibilityDesc: "Allow other students to find you through search.",
          emailNotifs: "Email notifications",
          emailNotifsDesc: "New request, new message (at most one email per conversation every half hour), session reminders.",
          push: "Notifications on this device",
          pushDesc: "New messages, requests and session reminders, even when BuddyEtude is closed.",
          pushDenied: "Notifications are blocked in your browser: allow them in the site settings.",
          weeklyDigest: "Monday digest",
          weeklyDigestDesc: "Every Monday, the week's new students who share a subject or your school.",
          blocked: "Blocked people",
          noBlocked: "You haven't blocked anyone.",
          unknownUser: "User",
          unblock: "Unblock"
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
        colorLabel: "Color {{color}}",
        brushSize: "Brush size {{size}}",
        closePicker: "Close the color picker",
        saveColor: "Save this color",
        ink: "Ink (black / white depending on the theme)",
        textPlaceholder: "Write here...",
        clearConfirm: "Are you sure you want to clear everything?",
        clearPageConfirm: "Clear all drawings on this page?",
        pageOf: "{{page}} / {{count}}",
        prevPage: "Previous page",
        nextPage: "Next page",
        addPage: "Add a page",
        exportNoBackground: "The PDF background couldn't be included in the image: only the drawings are exported.",
        pdf: {
          import: "Import a PDF",
          progress: "Importing {{done}}/{{total}}",
          notPdf: "Choose a PDF file.",
          tooBig: "PDF too large (30 MB max).",
          done_one: "{{count}} page imported: annotate it!",
          done_other: "{{count}} pages imported: annotate them!",
          truncated: "Only the first {{count}} pages were imported.",
          error: "The PDF couldn't be imported."
        },
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

// Garde l'attribut <html lang> aligné sur la langue affichée (lecteurs d'écran, correcteur, SEO)
const syncHtmlLang = (lng) => {
  if (typeof document !== 'undefined' && lng) document.documentElement.lang = lng.split('-')[0];
};
syncHtmlLang(i18n.language);
i18n.on('languageChanged', syncHtmlLang);

export default i18n;