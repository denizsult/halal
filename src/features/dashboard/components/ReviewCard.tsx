import { Star } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import type { ReviewItem } from "../dashboard.types";

export const ReviewCard = ({ review }: { review: ReviewItem }) => (
  <div className="rounded-2xl border border-gray-100 p-4 shadow-sm">
    <div className="flex items-center justify-between text-xs text-gray-500">
      <div className="flex items-center gap-1 text-yellow-500">
        <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400" />
        <span className="text-gray-700 font-medium">{review.rating}</span>
      </div>
      <span>{review.date}</span>
    </div>
    <p className="mt-3 text-sm text-gray-600 leading-relaxed">{review.text}</p>
    <div className="mt-4 flex items-center gap-3">
      <Avatar size="sm">
        <AvatarImage src={review.avatar} alt={review.name} />
        <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-medium text-gray-900">{review.name}</p>
        <p className="text-xs text-gray-500">{review.meta}</p>
      </div>
    </div>
  </div>
);
