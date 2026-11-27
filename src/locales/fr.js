// Textes de l'interface (français). Chargé avec l'application (langue par défaut) : voir src/i18n.js.
export default {
    translation: {
      notFound: {
        title: "Page introuvable",
        desc: "La page « {{page}} » n'existe pas.",
        home: "Retour à l'accueil"
      },
      moderationNotice: {
        photo: "La modération a retiré ta photo de profil (motif : {{reason}}). Tu ne peux pas en remettre une pour le moment.",
        bio: "La modération a retiré ta présentation (motif : {{reason}}). Tu ne peux pas en écrire une nouvelle pour le moment.",
        hide: "La modération a masqué ton profil de la recherche (motif : {{reason}}).",
        restrict: "Ton compte est restreint par la modération (motif : {{reason}}) : ton profil n'apparaît plus dans la recherche et tu ne peux plus envoyer de nouvelles demandes. Tu peux toujours écrire à tes binômes.",
        ban: "Ton compte a été suspendu par la modération (motif : {{reason}}).",
        contact: "Une question ou une erreur ? Écris-nous à {{email}}.",
        close: "Fermer le message",
        bioLockedField: "Présentation retirée par la modération",
        nameLockedField: "Nom remplacé par la modération",
        name: "La modération a remplacé ton nom par « Étudiant·e » (motif : {{reason}}). Tu ne peux pas le changer pour le moment.",
        reasons: {
          offtopic: "contenu hors sujet",
          inappropriate: "contenu inapproprié",
          name: "nom inapproprié",
          photo: "photo non conforme",
          impersonation: "usurpation d'identité",
          spam: "publicité ou spam",
          other: "non-respect des règles d'utilisation"
        }
      },
      admin: {
        profiles: {
          title: "Profils",
          subtitle: "Retire une photo ou une présentation hors sujet, masque, restreins ou bannis un compte. L'étudiant voit un message qui explique la mesure et son motif.",
          searchPlaceholder: "Chercher par nom, établissement, ville ou uid",
          none: "Aucun profil trouvé.",
          open: "Voir le profil",
          reason: "Motif",
          noPhoto: "Pas de photo",
          noName: "Sans nom",
          noBio: "Pas de présentation",
          showRestricted: "Lève d'abord la restriction pour rendre ce profil visible.",
          flags: { banned: "Banni", restricted: "Restreint", hidden: "Masqué", bioLocked: "Présentation bloquée", photoLocked: "Photo bloquée", nameLocked: "Nom bloqué" },
          actions: {
            name: "Réinitialiser le nom", unlockName: "Autoriser un nouveau nom",
            photo: "Retirer la photo", bio: "Retirer la présentation", unlockPhoto: "Autoriser une nouvelle photo", unlockBio: "Autoriser une présentation",
            hide: "Masquer", show: "Rendre visible", restrict: "Restreindre", unrestrict: "Lever la restriction", ban: "Bannir", unban: "Débannir"
          },
          done: {
            name: "Nom de {{name}} remplacé par « Étudiant·e »", unlockName: "{{name}} peut choisir un nouveau nom",
            photo: "Photo de {{name}} retirée", bio: "Présentation de {{name}} retirée", unlockPhoto: "{{name}} peut remettre une photo", unlockBio: "{{name}} peut réécrire une présentation",
            hide: "Profil de {{name}} masqué", show: "Profil de {{name}} visible", restrict: "{{name}} est restreint", unrestrict: "Restriction de {{name}} levée", ban: "{{name}} est banni", unban: "{{name}} est débanni"
          }
        },
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
        verifyOk: "Adresse e-mail vérifiée ✓",
        verifyNotYet: "Ton adresse n'est pas encore vérifiée. Ouvre l'e-mail reçu (regarde aussi dans « Courrier indésirable »), clique sur le lien, puis reviens ici.",
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
          text: "Notre objectif est simple : faire en sorte qu'aucun étudiant ne se retrouve bloqué seul devant ses cours. Que tu sois au lycée, en prépa ou à l'université, BuddyEtude te connecte avec les profils qui complètent tes compétences pour réussir ensemble."
        },
        join: {
          title: "Rejoins l'aventure",
          text: "BuddyEtude grandit chaque jour grâce à sa communauté. Si tu as des suggestions, des idées d'amélioration, ou si tu souhaites participer au projet, n'hésite pas à nous contacter !",
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
        updated: "Dernière mise à jour : 26 novembre 2026",
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
              { label: "Les visiteurs de l'accueil", text: "peuvent voir un aperçu anonymisé de quelques profils : niveau d'études, trois matières au plus et badge « étudiant vérifié ». Jamais votre nom, votre photo, votre ville, votre établissement ni votre présentation. Les profils masqués et ceux des moins de 15 ans n'y figurent jamais." },
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
              { label: "Daily (Daily.co, États-Unis) :", text: "les appels vidéo intégrés passent par les serveurs de Daily. Seuls les participants invités peuvent entrer dans un appel, avec un accès nominatif créé par BuddyEtude ; les appels ne sont pas enregistrés. Votre nom affiché est transmis à Daily pour apparaître dans l'appel." },
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
          acceptedBody: "{{name}} a accepté ta demande de binôme !",
          acceptedToast: "🎉 Bonne nouvelle !",
          inviteTitle: "Nouvelle invitation 👋",
          inviteBody: "{{name}} souhaite réviser avec toi !",
          inviteToast: "Nouvelle demande de {{name}} !",
          view: "Voir",
          sessionTitle: "Nouvelle session 📅",
          sessionBody: "{{name}} a planifié « {{title}} » avec toi.",
          sessionToast: "Nouvelle session planifiée !"
        },
        language: "Français",
        logout: "Déconnexion",
        unreadMessages: "{{count}} nouveauté(s) dans Messages",
        menu: "Menu"
      },
      dashboard: {
        greeting: "Bonjour, {{name}}",
        subtitle: "Prêt à booster tes révisions aujourd'hui ?",
        findBuddy: "Trouver un binôme",
        streak: {
          title_one: "{{count}} semaine de révision d'affilée",
          title_other: "{{count}} semaines de révision d'affilée",
          done: "Tu as déjà révisé cette semaine. Bien joué !",
          next: "Une session cette semaine prolongera ta série.",
          action: "Planifier"
        },
        todo: {
          title: "À faire maintenant",
          request: "{{name}} veut réviser avec toi",
          requestHelp: "{{name}} te demande de l'aide",
          requestAction: "Répondre",
          unread_one: "1 nouveau message de {{name}}",
          unread_other: "{{count}} nouveaux messages de {{name}}",
          unreadAction: "Lire",
          session: "Prochaine session : {{title}}",
          sessionAction: "Voir"
        },
        progress: "{{done}} sur {{total}} étapes",
        tutorial: {
          close: "Masquer le tutoriel",
          title_ready: "Félicitations, tu es prêt !",
          title_welcome: "Bienvenue sur ton espace !",
          desc_ready: "Tu as accompli toutes les étapes de base. Tu peux maintenant fermer ce tutoriel et profiter pleinement de BuddyEtude !",
          desc_welcome: "Suis ces 3 étapes simples pour débloquer tout le potentiel de BuddyEtude et commencer à réviser à plusieurs.",
          step1: "Compléter mon profil",
          step1_done: "Profil validé et visible.",
          step1_todo: "Ajoute tes matières et ton niveau.",
          step2: "Trouver un binôme",
          step2_done: "Tu as des partenaires d'étude.",
          step2_todo: "Cherche des étudiants compatibles.",
          step3: "Lancer une session",
          step3_done: "Première session planifiée !",
          step3_ready: "Organise ton premier tableau blanc !",
          step3_todo: "Disponible une fois ton binôme trouvé."
        },
        contacts: {
          title: "Nouveaux contacts",
          subtitle: "Fais le premier pas !",
          desc: "Découvre les étudiants qui partagent tes matières et propose-leur de travailler.",
          button: "Explorer les profils"
        },
        sessions: {
          title: "Prochaines sessions",
          subtitle: "Ton agenda est vide",
          desc: "Il est temps d'organiser ta prochaine session de révision au tableau blanc.",
          button: "Planifier une session"
        }
      },
      // --- LANDING : barre de navigation ---
      groups: {
        title: "Groupes de révision",
        subtitle: "Révise à plusieurs (jusqu'à 6) avec tes binômes : discussion et tableau blanc communs.",
        create: "Nouveau groupe",
        createTitle: "Créer un groupe",
        createDesc: "Tu pourras ensuite y ajouter tes binômes, un par un.",
        name: "Nom du groupe",
        namePlaceholder: "Ex. : Partiels de L2 maths",
        subject: "Matière (facultatif)",
        subjectPlaceholder: "Ex. : Analyse",
        createButton: "Créer le groupe",
        emptyTitle: "Aucun groupe pour l'instant",
        emptyDesc: "Crée un groupe et ajoutes-y tes binômes pour réviser à plusieurs.",
        pick: "Choisis un groupe pour afficher sa discussion.",
        memberCount_one: "{{count}} membre",
        memberCount_other: "{{count}} membres",
        whiteboard: "Tableau blanc",
        delete: "Supprimer le groupe",
        leave: "Quitter le groupe",
        owner: "Créateur du groupe",
        you: "Toi",
        remove: "Retirer {{name}}",
        add: "Ajouter",
        addPlaceholder: "Ajouter un binôme…",
        noBuddyToAdd: "Tous tes binômes sont déjà dans le groupe (ou tu n'en as pas encore).",
        noMessages: "Aucun message. Lance la discussion !",
        inputPlaceholder: "Écrire au groupe…",
        send: "Envoyer",
        back: "Retour aux groupes",
        leaveConfirm: "Quitter le groupe « {{name}} » ?",
        deleteConfirm: "Supprimer définitivement le groupe « {{name}} », sa discussion et son tableau blanc ?",
        toast: {
          created: "Groupe créé.",
          added: "{{name}} a rejoint le groupe.",
          removed: "{{name}} a été retiré(e) du groupe.",
          left: "Tu as quitté le groupe.",
          deleted: "Groupe supprimé.",
          error: "Action impossible. Réessaie."
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
          stickyCta: "Trouver mon binôme",
          stickyFree: "Gratuit",
          hasAccount: "J'ai déjà un compte",
          dashboard: "Tableau de bord",
          switchLanguage: "Changer de langue"
        }
      },
      landing: {
        faq: { eyebrow: "FAQ", title: "Tes questions, nos réponses", subtitle: "Tout ce qu'il faut savoir avant de te lancer." },
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
            study: { title: "Révise à deux", desc: "Discute, planifie une session avec appel vidéo et travaille sur le même tableau blanc que ton binôme." }
          }
        },
        featuresEyebrow: "Tout au même endroit",
        preview: {
          title: "Ils révisent déjà sur BuddyEtude",
          subtitle: "Quelques profils d'étudiants inscrits, anonymisés : tu verras les noms et les détails une fois connecté.",
          student: "Étudiant·e",
          verified: "Étudiant vérifié",
          cta: "Voir les profils compatibles",
          note: "Aperçu anonyme, mis à jour régulièrement."
        },
        intent: {
          title: "Tu cherches quoi ?",
          items: {
            duo: { title: "Réviser à deux", desc: "Un binôme de ton niveau, dans tes matières." },
            help: { title: "Débloquer une matière", desc: "Un étudiant plus avancé t'explique ce qui coince." },
            group: { title: "Réviser en groupe", desc: "Rejoins un groupe de révision ou crée le tien." }
          }
        },
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
        title1: "Trouve ton",
        title_highlight: "binôme d'études",
        title2: "idéal",
        subtitle_part1: "Ne révise plus seul. Trouve des étudiants de ton niveau, lance une session et ",
        subtitle_bold: "collabore en temps réel sur notre tableau blanc",
        subtitle_part2: ".",
        btn_dashboard: "Accéder à mon espace",
        btn_start: "Trouver mon binôme gratuitement",
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
            desc: "Les profils sont classés par compatibilité : matières en commun, même niveau, même école ou même ville, créneaux communs. Filtre aussi par mode (en ligne ou présentiel)."
          },
          chat: {
            title: "Discute et appelle en vidéo",
            desc: "Messagerie avec envoi de fichiers et appel vidéo intégré, directement dans l'appli, sans passer par WhatsApp ou Discord."
          },
          whiteboard: {
            title: "Tableau blanc temps réel",
            desc: "Dessine, écris et résous des problèmes à plusieurs sur un espace de travail collaboratif fluide."
          },
          requests: {
            title: "Une demande, un message",
            desc: "Présente-toi en quelques mots. Si l'autre accepte, la discussion s'ouvre et vous pouvez planifier une session."
          },
          schedule: {
            title: "Sessions planifiées",
            desc: "Date, heure, en ligne ou en présentiel : un lien d'appel vidéo se crée en un clic, la session s'ajoute à ton agenda et un rappel arrive par e-mail la veille et une heure avant."
          },
          subjects: {
            title: "Toutes les matières",
            desc: "Mathématiques, droit, médecine, langues… La matière est libre : indique la tienne et vois qui la partage."
          }
        }
      },
      cta: {
        title: "Prêt à trouver ton binôme ?",
        subtitle: "Inscris-toi avec Google ou ton adresse e-mail, complète ton profil et envoie ta première demande de binôme. C'est gratuit.",
        button: "Créer mon compte",
        buttonLoggedIn: "Accéder à mon tableau de bord"
      },
      footer: {
        tagline: "Créé par un étudiant, pour les étudiants. Notre mission est de rendre l'entraide académique accessible à tous, partout en France, grâce à des outils collaboratifs puissants.",
        platform: "Plateforme",
        about: "À propos de nous",
        findBuddy: "Trouver un binôme",
        subjects: "Réviser par matière",
        schools: "Pour les établissements",
        support: "Support & Légal",
        legal: "Mentions Légales & CGU",
        privacy: "Politique de Confidentialité",
        rights: "Tous droits réservés"
      },
      // --- NOUVEAU : PAGE "TROUVER UN BINÔME" ---
      search: {
        title: "Trouver un binôme",
        subtitle: "Filtre les profils pour trouver le partenaire d'étude idéal",
        searchPlaceholder: "Rechercher par nom ou école...",
        subjectPlaceholder: "Matière (ex : droit, maths)",
        filters: "Filtres",
        filtersHide: "Masquer les filtres",
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
          desc: "Essaie d'élargir ta recherche en retirant certains filtres ou en modifiant tes mots-clés.",
          reset: "Réinitialiser les filtres"
        },
        requestDialog: {
          title: "Proposer une session",
          desc: "Envoie un petit mot à <bold>{{name}}</bold> pour te présenter et proposer d'étudier ensemble.",
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
        blocked: "{{name}} est bloqué(e) : tu ne verras plus son profil.",
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
          detailsPlaceholder: "Explique-nous brièvement le problème...",
          cancel: "Annuler",
          confirm: "Confirmer",
          missingReason: "Choisis un motif",
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
          title: "Retirer {{name}} de tes binômes ?",
          desc: "La conversation disparaîtra de ta liste et vous ne pourrez plus planifier de session ensemble. Tu pourras renvoyer une demande plus tard.",
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
          desc: "<bold>{{name}}</bold> souhaite réviser avec toi. Accepte pour lancer la messagerie.",
          helpTitle: "Demande d'aide en {{subject}}",
          helpDesc: "<bold>{{name}}</bold> débute en {{subject}} et aimerait ton aide. Accepte pour lancer la discussion.",
          contactWarning: "Ce message contient des coordonnées ou un lien : reste sur BuddyEtude tant que vous ne vous connaissez pas.",
          accept: "Accepter",
          reject: "Refuser"
        },
        emptyState: {
          title: "Tes messages",
          desc: "Sélectionne un contact pour afficher la discussion."
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
          buddyRemoved: "{{name}} a été retiré(e) de tes binômes.",
          buddyRemoveError: "Impossible de retirer ce binôme."
        },
        rejectModal: {
          title: "Refuser la demande ?",
          desc: "Cette action est définitive. Tu ne pourras plus discuter avec cette personne à moins qu'une nouvelle demande ne soit envoyée.",
          cancel: "Annuler",
          confirm: "Oui, refuser"
        },
        deleteModal: {
          title: "Supprimer ce message ?",
          desc: "Tu veux vraiment supprimer ce message ? Il sera effacé pour toi et pour ton interlocuteur de manière irréversible.",
          cancel: "Annuler",
          confirm: "Supprimer"
        }
      },
      // --- NOUVEAU : PAGE SESSIONS ---
      sessions: {
        title: "Sessions d'étude",
        subtitle: "Planifie et suis tes sessions",
        newSession: "Nouvelle session",
        upcoming: "Prochaines sessions",
        noUpcoming: "Aucune session prévue",
        toClose: "À clôturer",
        joinCall: "Rejoindre l'appel vidéo",
        externalLink: "Ouvrir le lien externe",
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
        toCloseDesc: "Ces sessions sont passées : indique si elles ont eu lieu.",
        history: "Historique",
        with: "Avec {{name}}",
        joinWhiteboard: "Rejoindre le tableau blanc",
        markCompleted: "Terminée",
        cancel: "Annuler",
        defaultOrganizer: "Moi",
        defaultBuddy: "Binôme",
        noBuddyAlert: {
          title: "Tu n'as pas encore de binôme accepté.",
          desc: "Va dans l'onglet Recherche pour trouver un partenaire !"
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
          buddyPlaceholder: "Sélectionne un binôme",
          dateLabel: "Date",
          timeLabel: "Heure",
          durationLabel: "Durée (min)",
          modeLabel: "Mode",
          modeOnline: "En ligne (Tableau blanc)",
          modeInPerson: "Présentiel",
          locationLabel: "Lieu",
          locationPlaceholder: "Ex: Bibliothèque universitaire, salle 2",
          meetingLabel: "Lien externe (facultatif)",
          callIncluded: "Appel vidéo inclus : un bouton « Rejoindre l'appel vidéo » apparaîtra sur la session, pour vous deux, directement dans BuddyEtude.",
          generateLink: "Créer un lien",
          meetingHint: "Seulement si tu préfères un autre outil (Zoom, Teams, Google Meet…).",
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
        subtitle: "Gère tes informations et tes préférences",
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
          savedDesc: "Redirection vers ton tableau de bord...",
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
        bioPlaceholder: "Présente-toi en quelques mots...",
        school: "Établissement",
        schoolPlaceholder: "Ex: CESI, Université...",
        level: "Niveau d'études",
        levelPlaceholder: "Sélectionne",
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
          incomplete: "Ajoute un nom affiché, au moins une matière, et ton niveau d'études ou ton établissement."
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
      // --- Appel vidéo intégré et profil d'un étudiant ---
      call: {
        title: "Appel vidéo",
        titleWith: "Appel avec {{name}}",
        start: "Appel vidéo",
        back: "Retour",
        copyLink: "Copier le lien",
        copied: "Lien copié : envoie-le à ton binôme",
        copyPrompt: "Copie ce lien :",
        openBoard: "Tableau blanc",
        newTab: "Nouvel onglet",
        loading: "Préparation de l'appel…",
        errorTitle: "Impossible de rejoindre l'appel",
        privacy: "Seuls les participants peuvent rejoindre cet appel. Rien n'est enregistré.",
        errors: {
          "not-allowed": "Cet appel est réservé aux membres du binôme, du groupe ou de la session.",
          "calls-not-configured": "Les appels vidéo ne sont pas encore activés sur le site. Réessaie un peu plus tard.",
          "calls-unavailable": "Le service d'appel ne répond pas pour le moment. Réessaie dans quelques instants.",
          "bad-request": "Ce lien d'appel est incomplet."
        }
      },
      student: {
        viewProfile: "Voir le profil",
        yourBuddy: "Ton binôme",
        message: "Écrire",
        contact: "Contacter",
        answer: "Répondre à sa demande",
        pending: "Demande envoyée",
        common: "En commun avec toi",
        inCommon: "En commun",
        memberSince: "Inscrit depuis",
        noBio: "{{name}} n'a pas encore écrit de présentation.",
        missingTitle: "Profil introuvable",
        missingDesc: "Ce profil n'existe plus ou n'est pas visible.",
        backToSearch: "Retour à la recherche"
      },
      // --- Soutien et page « Pour les établissements » ---
      support: {
        title: "Soutenir BuddyEtude",
        desc: "Le site est gratuit et sans publicité. Un petit don aide à payer les serveurs et à le garder ainsi.",
        button: "Soutenir le projet"
      },
      schools: {
        eyebrow: "Pour les établissements",
        title1: "Le tutorat entre étudiants,",
        titleHighlight: "enfin simple à organiser",
        subtitle: "BuddyEtude aide vos étudiants à trouver un binôme ou un tuteur de leur niveau, puis à réviser ensemble en ligne. Nous recherchons des universités, écoles et BDE pilotes pour construire la suite avec eux.",
        ctaPilot: "Devenir établissement pilote",
        ctaPlatform: "Voir la plateforme",
        trust: { free: "Toujours gratuit pour les étudiants", noAds: "Sans publicité ni revente de données", europe: "Données hébergées dans l'UE" },
        problems: {
          eyebrow: "Le constat",
          title: "Réviser seul, c'est là que beaucoup décrochent",
          isolation: { title: "L'isolement pendant les révisions", desc: "Beaucoup d'étudiants, surtout en première année ou loin de chez eux, ne savent pas avec qui travailler." },
          spreadsheets: { title: "Un tutorat difficile à faire vivre", desc: "Tableurs, e-mails, groupes de messagerie : organiser et suivre le tutorat demande beaucoup de temps aux équipes." },
          matching: { title: "Des binômes mal assortis", desc: "Rapprocher les étudiants selon la matière, le niveau et les disponibilités est presque impossible à la main." }
        },
        features: {
          eyebrow: "Disponible dès aujourd'hui",
          title: "Une plateforme déjà complète",
          subtitle: "Tout ce qui suit fonctionne déjà, gratuitement, pour n'importe quel étudiant.",
          matching: { title: "Mise en relation par niveau", desc: "Les étudiants sont rapprochés selon leurs matières en commun, leur niveau dans chacune, leur établissement et leurs disponibilités." },
          mentoring: { title: "Mentorat entre étudiants", desc: "Les étudiants avancés dans une matière peuvent aider ceux qui débutent, qui leur expliquent sur quoi ils bloquent." },
          sessions: { title: "Sessions en visio", desc: "Sessions planifiées avec lien d'appel vidéo, rappels par e-mail et ajout à l'agenda." },
          whiteboard: { title: "Tableau blanc partagé", desc: "Dessiner, écrire et annoter des cours en PDF à plusieurs, en temps réel, sur plusieurs pages." },
          groups: { title: "Groupes de révision", desc: "Jusqu'à six étudiants, avec une discussion et un tableau blanc communs." },
          safety: { title: "Un cadre sûr", desc: "Badge « étudiant vérifié » par l'adresse e-mail de l'établissement, signalement, blocage et modération." }
        },
        pilot: {
          eyebrow: "Avec les établissements pilotes",
          title: "Ce que nous construisons avec vous",
          subtitle: "Les besoins propres aux établissements seront développés avec les premiers partenaires, à partir de leurs retours.",
          space: { title: "Un espace réservé à vos étudiants", desc: "Un accès limité aux adresses e-mail de votre établissement, pour que vos étudiants se retrouvent entre eux." },
          tracking: { title: "Le suivi du tutorat", desc: "Voir qui accompagne qui et combien de sessions ont eu lieu, sans tableur." },
          stats: { title: "Des statistiques anonymes", desc: "Les matières les plus demandées, l'activité au fil du semestre : de quoi ajuster votre accompagnement." },
          launch: { title: "Un accompagnement au lancement", desc: "Présentation aux étudiants, avec vos équipes ou le BDE, et supports de communication." }
        },
        steps: {
          eyebrow: "Comment ça se passe",
          title: "Un pilote en trois étapes",
          call: { title: "Un premier échange", desc: "Une demi-heure pour comprendre votre organisation, vos besoins et vos contraintes." },
          launch: { title: "Le lancement", desc: "Nous présentons BuddyEtude à vos étudiants avec vous, et restons disponibles tout au long du semestre." },
          review: { title: "Le bilan", desc: "En fin de semestre : retours des étudiants, chiffres d'utilisation et suite à donner ensemble." }
        },
        promise: "Les étudiants n'ont jamais rien à payer. Leurs données ne sont ni vendues ni utilisées pour de la publicité.",
        contact: {
          title: "Parlons de votre établissement",
          desc: "Une question, une idée, l'envie de tester avec une promotion ? Écrivez-nous, nous répondons rapidement."
        },
        mail: {
          subject: "Établissement pilote BuddyEtude",
          body: "Bonjour,\n\nJe souhaiterais en savoir plus sur BuddyEtude pour notre établissement.\n\nÉtablissement :\nVotre fonction :\nNombre d'étudiants concernés :\nVos besoins :\n\nMerci !"
        }
      },
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
        welcome: { title: "Bienvenue sur BuddyEtude 👋", desc: "Crée ton profil pour trouver ton binôme : ça prend une minute." },
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
          syncNotice: "Ces informations sont synchronisées avec ton compte Google"
        },
        appearance: {
          title: "Thème de l'application",
          subtitle: "Choisis l'ambiance visuelle qui te convient le mieux.",
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
        textPlaceholder: "Écris ici...",
        clearConfirm: "Tu veux vraiment tout effacer ?",
        clearPageConfirm: "Effacer tous les dessins de cette page ?",
        pageOf: "{{page}} / {{count}}",
        prevPage: "Page précédente",
        nextPage: "Page suivante",
        addPage: "Ajouter une page",
        exportNoBackground: "Le fond PDF n'a pas pu être inclus dans l'image : seuls les dessins sont exportés.",
        pdf: {
          import: "Importer un PDF",
          progress: "Import {{done}}/{{total}}",
          notPdf: "Choisis un fichier PDF.",
          tooBig: "PDF trop lourd (30 Mo maximum).",
          done_one: "{{count}} page importée : annote-la !",
          done_other: "{{count}} pages importées : annote-les !",
          truncated: "Seules les {{count}} premières pages ont été importées.",
          error: "Le PDF n'a pas pu être importé."
        },
        saveError: "Synchronisation impossible : tes derniers tracés n'ont pas été enregistrés.",
        tooLarge: "Le tableau est trop chargé pour être synchronisé. Exporte-le puis efface-le pour continuer.",
        tools: {
          pen: "Stylo",
          text: "Texte",
          eraser: "Gomme",
          clearAll: "Effacer tout le tableau"
        }
      }
    }
};
