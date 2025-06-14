
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Building2, User } from 'lucide-react';

interface QuickPostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuickPostModal: React.FC<QuickPostModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobType, setJobType] = useState<'commercial' | 'personal'>('personal');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    budget: '',
    urgency: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Quick job posted:', { ...formData, jobType });
    alert('Job posted successfully!');
    onClose();
    navigate('/my-jobs');
  };

  const handleDetailedPost = () => {
    onClose();
    navigate('/post-job');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Quick Job Post</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Job Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Job Type</label>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={jobType === 'personal' ? 'default' : 'outline'}
                onClick={() => setJobType('personal')}
                className="flex-1 flex items-center space-x-2"
              >
                <User className="w-4 h-4" />
                <span>Personal</span>
              </Button>
              <Button
                type="button"
                variant={jobType === 'commercial' ? 'default' : 'outline'}
                onClick={() => setJobType('commercial')}
                className="flex-1 flex items-center space-x-2"
              >
                <Building2 className="w-4 h-4" />
                <span>Commercial</span>
              </Button>
            </div>
          </div>

          <Input
            placeholder="Job title (e.g., Need plumber urgently)"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />

          <Textarea
            placeholder="Brief description of work needed"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            required
          />

          <Input
            placeholder="Location"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            required
          />

          <Input
            placeholder="Budget (₹)"
            value={formData.budget}
            onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
            required
          />

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Mark as urgent?</label>
            <Button
              type="button"
              variant={formData.urgency ? "default" : "outline"}
              size="sm"
              onClick={() => setFormData(prev => ({ ...prev, urgency: !prev.urgency }))}
            >
              {formData.urgency ? 'Urgent' : 'Normal'}
            </Button>
          </div>

          <div className="flex space-x-2 pt-2">
            <Button type="submit" className="flex-1">
              Post Now
            </Button>
            <Button type="button" variant="outline" onClick={handleDetailedPost}>
              Detailed Post
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuickPostModal;
