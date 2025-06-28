import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign } from 'lucide-react';

export interface Wage {
  rate: number | string;
  unit: 'per_hour' | 'per_day' | 'fixed';
}

interface WageEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string | null;
  currentWage: Wage | null;
  onSave: (category: string, newWage: Wage) => void;
}

export const WageEditModal: React.FC<WageEditModalProps> = ({ isOpen, onClose, category, currentWage, onSave }) => {
  const [wage, setWage] = useState<Wage>({ rate: '', unit: 'per_hour' });

  useEffect(() => {
    if (currentWage) {
      setWage(currentWage);
    } else {
      setWage({ rate: '', unit: 'per_hour' });
    }
  }, [currentWage]);

  const handleSave = () => {
    if (category) {
      onSave(category, wage);
    }
  };

  if (!category) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Rate for: <span className="text-blue-600">{category}</span></DialogTitle>
        </DialogHeader>
        <div className="py-6 space-y-4">
          <div>
            <Label htmlFor="rate" className="text-sm">Rate (₹)</Label>
            <div className="relative mt-1">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="rate"
                type="number"
                placeholder="e.g., 500"
                value={wage.rate}
                onChange={(e) => setWage(w => ({...w, rate: e.target.value === '' ? '' : Number(e.target.value)}))}
                className="pl-8"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="unit" className="text-sm">Basis</Label>
            <Select
              value={wage.unit}
              onValueChange={(value: Wage['unit']) => setWage(w => ({...w, unit: value}))}
            >
              <SelectTrigger id="unit" className="mt-1">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="per_hour">Per Hour</SelectItem>
                <SelectItem value="per_day">Per Day</SelectItem>
                <SelectItem value="fixed">Fixed Rate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleSave}>Save Rate</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
