import React from "react";
import { ShieldCheck } from "lucide-react";

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Politique de Confidentialité</h1>
      </div>

      <div className="bg-white dark:bg-[#1e1f20] border border-gray-100 dark:border-[#333537] rounded-3xl p-8 shadow-sm space-y-8 text-gray-700 dark:text-gray-300">
        
        <p className="text-lg font-medium text-gray-900 dark:text-white">
          La protection de vos données est une priorité absolue pour BuddyEtude. Nous nous engageons à respecter le Règlement Général sur la Protection des Données (RGPD).
        </p>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">1. Données collectées</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Données d'identification :</strong> Nom, prénom, adresse email (récupérés de manière sécurisée via Google Authentication).</li>
            <li><strong>Données de profil :</strong> Ville, niveau d'études, matières étudiées, biographie.</li>
            <li><strong>Données d'utilisation :</strong> Demandes de binômes envoyées/reçues, messages privés.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">2. Utilisation de vos données</h2>
          <p>
            Vos données sont exclusivement utilisées pour le bon fonctionnement de la plateforme : vous permettre de trouver des partenaires d'étude compatibles, vous connecter à la plateforme, et assurer la sécurité de vos échanges. <strong>BuddyEtude ne vendra jamais vos données personnelles à des tiers.</strong>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">3. Durée de conservation</h2>
          <p>
            Vos données sont conservées tant que votre compte est actif. En cas d'inactivité prolongée (supérieure à 3 ans) ou de demande de suppression, l'ensemble de vos données sera définitivement effacé de nos serveurs sécurisés.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">4. Vos droits (RGPD)</h2>
          <p>
            Conformément à la loi informatique et libertés, vous disposez d'un droit d'accès, de rectification, de portabilité et de suppression de vos données. Vous pouvez exercer ce droit à tout moment en nous contactant directement à : <strong>contact@buddyetude.fr</strong>.
          </p>
        </section>

      </div>
    </div>
  );
}