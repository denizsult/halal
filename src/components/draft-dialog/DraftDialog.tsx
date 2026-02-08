import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type DraftDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
  onStartFresh: () => void;
  title?: string;
  description?: string;
};

export function DraftDialog({
  open,
  onOpenChange,
  onContinue,
  onStartFresh,
  title = "Continue draft?",
  description = "You have a draft listing in progress. Would you like to continue where you left off or start a new listing?",
}: DraftDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <div className="absolute top-4 right-4">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="secondary" onClick={onStartFresh}>
            Start fresh
          </Button>
          <Button onClick={onContinue}>Continue draft</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
