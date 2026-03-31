import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, X, Clock, MessageSquare, HelpCircle } from "lucide-react";

export default function RequestCard({ request, type, onAccept, onDecline }) {
  // Sécurité pour le nom
  const name = type === "received" ? request.from_name : request.to_name;
  const initials = (name || "?").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  // Sécurité pour le badge de statut (évite le crash si le statut est null ou différent)
  const statusConfig = {
    pending: { label: "En attente", class: "bg-amber-50 text-amber-700", icon: Clock },
    accepted: { label: "Acceptée", class: "bg-green-50 text-green-700", icon: Check },
    declined: { label: "Refusée", class: "bg-red-50 text-red-700", icon: X },
  };

  const currentStatus = statusConfig[request.status] || { 
    label: "Inconnu", 
    class: "bg-gray-50 text-gray-500", 
    icon: HelpCircle 
  };

  const StatusIcon = currentStatus.icon;

  return (
    <Card className="border-0 shadow-sm rounded-xl bg-white">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 rounded-lg">
            <AvatarFallback className="bg-indigo-100 text-indigo-700 rounded-lg text-sm font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 text-sm truncate">{name || "Utilisateur"}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`inline-flex items-center gap-1 text-[10px] md:text-xs px-2 py-0.5 rounded-full font-medium ${currentStatus.class}`}>
                <StatusIcon className="w-3 h-3" />
                {currentStatus.label}
              </span>
              {request.subject && (
                <span className="text-xs text-gray-400 truncate">{request.subject}</span>
              )}
            </div>
          </div>

          {/* Boutons d'action pour les demandes reçues en attente */}
          {type === "received" && request.status === "pending" && (
            <div className="flex gap-1.5 ml-2">
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 h-8 w-8 p-0 rounded-lg"
                onClick={() => onAccept(request)}
              >
                <Check className="w-4 h-4 text-white" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 border-red-100"
                onClick={() => onDecline(request)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Message d'accompagnement */}
        {request.message && (
          <div className="mt-3 p-3 bg-gray-50/50 rounded-lg border border-gray-50">
            <p className="text-sm text-gray-600 flex items-start gap-2 italic">
              <MessageSquare className="w-3.5 h-3.5 mt-0.5 text-gray-400 shrink-0" />
              "{request.message}"
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}