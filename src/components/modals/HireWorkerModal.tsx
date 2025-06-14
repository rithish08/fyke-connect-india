
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface HireWorkerModalProps {
  open: boolean;
  onClose: () => void;
  onHire: () => void;
  workerName: string;
}

const HireWorkerModal: React.FC<HireWorkerModalProps> = ({
  open,
  onClose,
  onHire,
  workerName,
}) => {
  const { translateText } = useTranslation();
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl shadow-xl bg-white max-w-xs p-0 border border-gray-100">
        <div className="flex flex-col items-center px-6 py-6">
          <CheckCircle className="w-12 h-12 text-blue-500 mb-2" />
          <div className="font-bold text-lg text-gray-900 mb-1">
            {translateText('hire.hire_worker', `Hire ${workerName}?`)}
          </div>
          <div className="text-gray-600 mb-4 text-sm text-center">
            {translateText('hire.hire_confirm', `Are you sure you want to send a hire request to ${workerName}?`)}
          </div>
          <div className="w-full flex gap-2">
            <Button
              className="flex-1 rounded-xl"
              onClick={onHire}
              type="button"
            >
              {translateText('hire.hire', 'Yes, Hire')}
            </Button>
            <Button
              className="flex-1 rounded-xl"
              variant="outline"
              onClick={onClose}
              type="button"
            >
              {translateText('common.cancel', 'Cancel')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HireWorkerModal;
