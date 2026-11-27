// Textes de l'interface (anglais). Chargé à la demande, seulement si l'anglais est affiché : voir src/i18n.js.
export default {
    translation: {
      notFound: {
        title: "Page not found",
        desc: "The page \"{{page}}\" does not exist.",
        home: "Back to home"
      },
      moderationNotice: {
        photo: "Moderators removed your profile photo (reason: {{reason}}). You can't add a new one for now.",
        bio: "Moderators removed your bio (reason: {{reason}}). You can't write a new one for now.",
        hide: "Moderators hid your profile from search (reason: {{reason}}).",
        restrict: "Your account has been restricted by moderators (reason: {{reason}}): your profile no longer appears in search and you can't send new requests. You can still message your study buddies.",
        ban: "Your account has been suspended by moderators (reason: {{reason}}).",
        contact: "A question or a mistake? Write to us at {{email}}.",
        close: "Close message",
        bioLockedField: "Bio removed by moderators",
        nameLockedField: "Name replaced by moderators",
        name: "Moderators replaced your name with “Étudiant·e” (reason: {{reason}}). You can't change it for now.",
        reasons: {
          offtopic: "off-topic content",
          inappropriate: "inappropriate content",
          name: "inappropriate name",
          photo: "non-compliant photo",
          impersonation: "impersonation",
          spam: "advertising or spam",
          other: "breach of the terms of use"
        }
      },
      admin: {
        profiles: {
          title: "Profiles",
          subtitle: "Remove an off-topic photo or bio, hide, restrict or ban an account. The student sees a message explaining the action and its reason.",
          searchPlaceholder: "Search by name, school, city or uid",
          none: "No profile found.",
          open: "View profile",
          reason: "Reason",
          noPhoto: "No photo",
          noName: "No name",
          noBio: "No bio",
          showRestricted: "Lift the restriction first to make this profile visible.",
          flags: { banned: "Banned", restricted: "Restricted", hidden: "Hidden", bioLocked: "Bio locked", photoLocked: "Photo locked", nameLocked: "Name locked" },
          actions: {
            name: "Reset name", unlockName: "Allow a new name",
            photo: "Remove photo", bio: "Remove bio", unlockPhoto: "Allow a new photo", unlockBio: "Allow a bio",
            hide: "Hide", show: "Make visible", restrict: "Restrict", unrestrict: "Lift restriction", ban: "Ban", unban: "Unban"
          },
          done: {
            name: "{{name}}'s name replaced with “Étudiant·e”", unlockName: "{{name}} can choose a new name",
            photo: "{{name}}'s photo removed", bio: "{{name}}'s bio removed", unlockPhoto: "{{name}} can add a photo again", unlockBio: "{{name}} can write a bio again",
            hide: "{{name}}'s profile hidden", show: "{{name}}'s profile visible", restrict: "{{name}} is restricted", unrestrict: "{{name}}'s restriction lifted", ban: "{{name}} is banned", unban: "{{name}} is unbanned"
          }
        },
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
        verifyOk: "Email address verified ✓",
        verifyNotYet: "Your address isn't verified yet. Open the email you received (check your spam folder too), click the link, then come back here.",
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
        updated: "Last updated: November 26, 2026",
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
              { label: "Visitors of the home page", text: "may see an anonymised preview of a few profiles: level of study, up to three subjects and the “verified student” badge. Never your name, photo, city, school or bio. Hidden profiles and those of under-15s are never included." },
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
              { label: "Daily (Daily.co, United States):", text: "built-in video calls go through Daily's servers. Only invited participants can join a call, with a personal access created by BuddyEtude; calls are not recorded. Your display name is sent to Daily so it appears in the call." },
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
        language: "English",
        logout: "Logout",
        unreadMessages: "{{count}} new item(s) in Messages",
        menu: "Menu"
      },
      dashboard: {
        greeting: "Hello, {{name}}",
        subtitle: "Ready to boost your studies today?",
        findBuddy: "Find a buddy",
        streak: {
          title_one: "{{count}} study week in a row",
          title_other: "{{count}} study weeks in a row",
          done: "You've already studied this week. Nice work!",
          next: "A session this week will extend your streak.",
          action: "Plan one"
        },
        todo: {
          title: "To do now",
          request: "{{name}} wants to study with you",
          requestHelp: "{{name}} is asking for your help",
          requestAction: "Reply",
          unread_one: "1 new message from {{name}}",
          unread_other: "{{count}} new messages from {{name}}",
          unreadAction: "Read",
          session: "Next session: {{title}}",
          sessionAction: "View"
        },
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
          stickyCta: "Find my study buddy",
          stickyFree: "Free",
          hasAccount: "I already have an account",
          dashboard: "Dashboard",
          switchLanguage: "Switch language"
        }
      },
      landing: {
        faq: { eyebrow: "FAQ", title: "Your questions, our answers", subtitle: "Everything you need to know before you start." },
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
        preview: {
          title: "Already studying on BuddyEtude",
          subtitle: "A few anonymised profiles of registered students: you'll see names and details once signed in.",
          student: "Student",
          verified: "Verified student",
          cta: "See compatible profiles",
          note: "Anonymous preview, updated regularly."
        },
        intent: {
          title: "What are you looking for?",
          items: {
            duo: { title: "Study with a buddy", desc: "Someone at your level, in your subjects." },
            help: { title: "Get unstuck in a subject", desc: "A more advanced student explains what's blocking you." },
            group: { title: "Study in a group", desc: "Join a study group or start your own." }
          }
        },
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
        btn_start: "Find my study buddy for free",
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
            title: "Chat and video calls",
            desc: "Messaging with file sharing and built-in video calls, right in the app — no need for WhatsApp or Discord."
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
        subjects: "Study by subject",
        schools: "For schools",
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
        subjectPlaceholder: "Subject (e.g. law, maths)",
        filters: "Filters",
        filtersHide: "Hide filters",
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
        externalLink: "Open the external link",
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
          meetingLabel: "External link (optional)",
          callIncluded: "Video call included: a “Join the video call” button will appear on the session for both of you, right inside BuddyEtude.",
          generateLink: "Create a link",
          meetingHint: "Only if you prefer another tool (Zoom, Teams, Google Meet…).",
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
      // --- Built-in video call and student profile ---
      call: {
        title: "Video call",
        titleWith: "Call with {{name}}",
        start: "Video call",
        back: "Back",
        copyLink: "Copy link",
        copied: "Link copied: send it to your study buddy",
        copyPrompt: "Copy this link:",
        openBoard: "Whiteboard",
        newTab: "New tab",
        loading: "Getting the call ready…",
        errorTitle: "Can't join the call",
        privacy: "Only participants can join this call. Nothing is recorded.",
        errors: {
          "not-allowed": "This call is only for members of the pair, group or session.",
          "calls-not-configured": "Video calls aren't enabled on the site yet. Please try again later.",
          "calls-unavailable": "The call service isn't responding right now. Please try again in a moment.",
          "bad-request": "This call link is incomplete."
        }
      },
      student: {
        viewProfile: "View profile",
        yourBuddy: "Your study buddy",
        message: "Message",
        contact: "Contact",
        answer: "Reply to their request",
        pending: "Request sent",
        common: "In common with you",
        inCommon: "In common",
        memberSince: "Member since",
        noBio: "{{name}} hasn't written a bio yet.",
        missingTitle: "Profile not found",
        missingDesc: "This profile no longer exists or isn't visible.",
        backToSearch: "Back to search"
      },
      // --- Support and "For schools" page ---
      support: {
        title: "Support BuddyEtude",
        desc: "The site is free and ad-free. A small donation helps pay for the servers and keep it that way.",
        button: "Support the project"
      },
      schools: {
        eyebrow: "For schools",
        title1: "Peer tutoring,",
        titleHighlight: "finally easy to organise",
        subtitle: "BuddyEtude helps your students find a study buddy or a tutor at their level, then study together online. We are looking for pilot universities, schools and student unions to build what comes next with them.",
        ctaPilot: "Become a pilot school",
        ctaPlatform: "See the platform",
        trust: { free: "Always free for students", noAds: "No ads, no data resale", europe: "Data hosted in the EU" },
        problems: {
          eyebrow: "The problem",
          title: "Studying alone is where many students drop out",
          isolation: { title: "Isolation during revision", desc: "Many students, especially in first year or far from home, don't know who to study with." },
          spreadsheets: { title: "Tutoring that's hard to sustain", desc: "Spreadsheets, emails, group chats: organising and following tutoring takes teams a lot of time." },
          matching: { title: "Poorly matched pairs", desc: "Matching students by subject, level and availability is almost impossible by hand." }
        },
        features: {
          eyebrow: "Available today",
          title: "A platform that's already complete",
          subtitle: "Everything below already works, for free, for any student.",
          matching: { title: "Level-based matching", desc: "Students are matched by shared subjects, their level in each, their school and their availability." },
          mentoring: { title: "Peer mentoring", desc: "Students advanced in a subject can help beginners, who explain what they're stuck on." },
          sessions: { title: "Video sessions", desc: "Planned sessions with a video call link, email reminders and calendar export." },
          whiteboard: { title: "Shared whiteboard", desc: "Draw, write and annotate PDF notes together in real time, across several pages." },
          groups: { title: "Study groups", desc: "Up to six students, with a shared chat and whiteboard." },
          safety: { title: "A safe environment", desc: "“Verified student” badge via the school email address, reporting, blocking and moderation." }
        },
        pilot: {
          eyebrow: "With pilot schools",
          title: "What we're building with you",
          subtitle: "School-specific needs will be developed with our first partners, based on their feedback.",
          space: { title: "A space reserved for your students", desc: "Access limited to your school's email addresses, so your students find each other." },
          tracking: { title: "Tutoring follow-up", desc: "See who supports whom and how many sessions took place, without spreadsheets." },
          stats: { title: "Anonymous statistics", desc: "Most requested subjects, activity over the semester: what you need to adjust your support." },
          launch: { title: "Launch support", desc: "Presentation to students, with your teams or the student union, and communication materials." }
        },
        steps: {
          eyebrow: "How it works",
          title: "A pilot in three steps",
          call: { title: "A first conversation", desc: "Half an hour to understand your organisation, needs and constraints." },
          launch: { title: "Launch", desc: "We present BuddyEtude to your students with you, and stay available throughout the semester." },
          review: { title: "Review", desc: "At the end of the semester: student feedback, usage figures and next steps together." }
        },
        promise: "Students never pay anything. Their data is never sold or used for advertising.",
        contact: {
          title: "Let's talk about your school",
          desc: "A question, an idea, want to try it with one class? Write to us, we reply quickly."
        },
        mail: {
          subject: "BuddyEtude pilot school",
          body: "Hello,\n\nI would like to know more about BuddyEtude for our school.\n\nSchool:\nYour role:\nNumber of students involved:\nYour needs:\n\nThank you!"
        }
      },
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
        welcome: { title: "Welcome to BuddyEtude 👋", desc: "Create your profile to find your study buddy: it takes a minute." },
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
};
