import React from "react";
import { Scale } from "lucide-react";

export default function Legal() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center">
          <Scale className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mentions Légales & CGU</h1>
      </div>

      <div className="bg-white dark:bg-[#1e1f20] border border-gray-100 dark:border-[#333537] rounded-3xl p-8 shadow-sm space-y-8 text-gray-700 dark:text-gray-300">
        
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">1. Éditeur du site</h2>
          <p>
            Le site <strong>BuddyEtude</strong> est édité par :<br/>
            Charles BERTREUX<br/>
            13 rue du chanoine joseph mahé, 56000 Vannes<br/>
            Email : contact@buddyetude.fr<br/>
            Directeur de la publication : Charles BERTREUX
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">2. Hébergement</h2>
          <p>
            Ce site est hébergé par :<br/>
            Vercel Inc.<br/>
            440 N Barranca Ave #4133, Covina, CA 91723, États-Unis<br/>
            Site web : https://vercel.com
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">3. Conditions Générales d'Utilisation (CGU)</h2>
          <p className="mb-2"><strong>Objet :</strong> BuddyEtude est une plateforme de mise en relation pour étudiants visant à faciliter l'entraide scolaire.</p>
          <p className="mb-2"><strong>Responsabilité de l'utilisateur :</strong> L'utilisateur s'engage à fournir des informations réelles et à utiliser la plateforme dans un cadre strictement académique et respectueux. Tout contenu à caractère haineux, publicitaire, ou inapproprié entraînera la suppression immédiate du compte.</p>
          <p><strong>Modération :</strong> BuddyEtude se réserve le droit d'étudier les signalements et de bannir tout utilisateur ne respectant pas les règles de bienséance. Les messages échangés entre les utilisateurs peuvent être soumis à une modération en cas de signalement.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">4. Propriété intellectuelle</h2>
          <p>
            L'ensemble des éléments graphiques, la structure et, plus généralement, le contenu du site BuddyEtude sont protégés par le droit d'auteur, le droit des marques et le droit des dessins et modèles. Toute personne qui recueille ou télécharge du contenu ou des informations diffusées sur le site ne dispose sur ceux-ci que d’un droit d’usage privé, personnel et non transmissible.
          </p>
        </section>

      </div>
    </div>
  );
}