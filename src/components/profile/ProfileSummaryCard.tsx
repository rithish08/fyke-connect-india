
import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Award, Star } from "lucide-react";

interface ProfileSummaryCardProps {
  name: string;
  primaryCategory: string;
  rating?: number;
  reviewCount?: number;
  avatarUrl?: string;
  isVerified?: boolean;
  location?: string;
  phone?: string;
  email?: string;
}

const ProfileSummaryCard: React.FC<ProfileSummaryCardProps> = ({
  name,
  primaryCategory,
  rating,
  reviewCount,
  avatarUrl,
  isVerified,
  location,
  phone,
  email,
}) => {
  return (
    <Card className="p-6 mb-6 rounded-2xl shadow-md border-gray-100 bg-white">
      <div className="flex flex-col md:flex-row items-center md:items-center gap-4 md:gap-6">
        <div className="relative">
          <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
            <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
              {name?.split(" ").map((n) => n[0]).join("") || "W"}
            </AvatarFallback>
          </Avatar>
          {isVerified && (
            <Badge variant="secondary" className="absolute -bottom-2 -right-2 flex items-center space-x-1">
              <Award className="w-4 h-4" />
              <span>Verified</span>
            </Badge>
          )}
        </div>
        <div className="flex-1 space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">{name || "Worker Name"}</h1>
          <p className="text-gray-600 mt-1">{primaryCategory || "Category"}</p>
          {rating !== undefined && (
            <div className="flex items-center space-x-2 pt-2">
              <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
              <span className="font-bold text-lg">{rating.toFixed(1)}</span>
              <span className="text-gray-500">({reviewCount || 0} reviews)</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 mt-4 text-sm text-gray-600">
        {location && <span className="flex-1 truncate">📍 {location}</span>}
        {phone && <span className="truncate">📞 {phone}</span>}
        {email && <span className="truncate">✉️ {email}</span>}
      </div>
    </Card>
  );
};

export default ProfileSummaryCard;
