import {
  Camera,
  ChevronDown,
  MessageSquare,
  MoreHorizontal,
  Smile,
  Star,
  ThumbsUp,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TopRightModal } from "@/components/ui/top-right-modal";
import { cn } from "@/lib/utils";

import type { ReviewMetric, ReviewThread } from "../dashboard.types";

type ReviewsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  summary: { rating: number; total: number };
  metrics: ReviewMetric[];
  reviews: ReviewThread[];
};

const LikePill = ({ count, active }: { count: number; active?: boolean }) => (
  <span
    className={cn(
      "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
      active
        ? "border-brand-600 bg-brand-600 text-white"
        : "border-gray-100 bg-gray-50 text-gray-700"
    )}
  >
    <ThumbsUp className="h-3.5 w-3.5" />
    {count}
  </span>
);

export const ReviewsModal = ({
  isOpen,
  onClose,
  summary,
  metrics,
  reviews,
}: ReviewsModalProps) => (
  <TopRightModal
    isOpen={isOpen}
    onClose={onClose}
    title="Reviews"
    contentClassName="max-w-[860px] sm:max-w-[860px]"
    bodyClassName="p-0"
  >
    <div className="flex flex-col h-[620px]">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[220px_1fr]">
        <div className="px-6 py-6">
          <div className="space-y-3">
            <div className="rounded-2xl bg-gray-900 text-white px-4 py-3 text-center text-sm font-semibold">
              Rating {summary.rating.toFixed(1)}
            </div>
            <Button
              variant="ghost"
              className="w-full rounded-2xl bg-gray-50 border border-gray-100 text-gray-800 hover:bg-gray-100"
              leftIcon={<Star className="h-4 w-4 text-yellow-400" />}
            >
              Rate us
            </Button>
          </div>

          <div className="mt-6 space-y-3 text-sm text-gray-700">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="flex items-center justify-between"
              >
                <span>{metric.label}</span>
                <span className="font-semibold text-gray-900">
                  {metric.score.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-l border-gray-100 px-6 py-6">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-gray-900">
              Reviews ({summary.total})
            </p>
            <Button
              variant="ghost"
              className="rounded-2xl border border-gray-100 bg-white text-gray-500 hover:bg-gray-50"
              rightIcon={<ChevronDown className="h-4 w-4" />}
            >
              Most recent
            </Button>
          </div>

          <div className="mt-5 space-y-6 max-h-[400px] overflow-y-auto pr-3">
            {reviews.map((review) => (
              <div key={review.id} className="relative pl-8">
                <span className="absolute left-3 top-10 bottom-4 w-px bg-gray-100" />
                <div className="flex items-start gap-3">
                  <Avatar size="sm">
                    <AvatarImage src={review.avatar} alt={review.name} />
                    <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900">
                          {review.name}
                        </p>
                        <span className="text-sm text-gray-400">
                          {review.time}
                        </span>
                      </div>
                      <Button variant="ghost" size="icon-xs">
                        <MoreHorizontal className="h-4 w-4 text-gray-400" />
                      </Button>
                    </div>
                    <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                      {review.text}
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <LikePill count={review.likes} />
                      <button className="inline-flex items-center gap-2 text-sm font-medium text-brand-600">
                        <MessageSquare className="h-4 w-4" />
                        Reply
                      </button>
                    </div>

                    {review.reply ? (
                      <div className="mt-5 ml-2 flex items-start gap-3">
                        <Avatar size="sm">
                          <AvatarImage
                            src={review.reply.avatar ?? review.avatar}
                            alt={review.reply.name}
                          />
                          <AvatarFallback>
                            {review.reply.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-gray-900">
                                {review.reply.name}
                              </p>
                              <span className="text-sm text-gray-400">
                                {review.reply.time}
                              </span>
                            </div>
                            <Button variant="ghost" size="icon-xs">
                              <MoreHorizontal className="h-4 w-4 text-gray-400" />
                            </Button>
                          </div>
                          <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                            {review.reply.text}
                          </p>
                          {typeof review.reply.likes === "number" ? (
                            <div className="mt-3">
                              <LikePill count={review.reply.likes} active />
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 px-6 py-4">
        <div className="flex items-center gap-4">
          <Avatar size="sm">
            <AvatarImage src="/images/user/user-01.jpg" alt="You" />
            <AvatarFallback>Y</AvatarFallback>
          </Avatar>
          <div className="flex-1 flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3">
            <input
              type="text"
              placeholder="Write your own review"
              className="flex-1 text-sm text-gray-600 placeholder:text-gray-400 outline-none bg-transparent"
            />
            <button className="text-gray-400 hover:text-gray-500">
              <Camera className="h-5 w-5" />
            </button>
            <button className="text-gray-400 hover:text-gray-500">
              <Smile className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </TopRightModal>
);
