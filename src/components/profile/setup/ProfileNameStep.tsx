import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ProfileSetupFormData } from '@/schemas/profileSetupSchema';

interface ProfileNameStepProps {
  form: UseFormReturn<ProfileSetupFormData>;
  onNext: () => void;
}

const ProfileNameStep = ({ form, onNext }: ProfileNameStepProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>What's your name?</CardTitle>
        <CardDescription>This will help employers know who you are</CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button onClick={onNext} className="mt-4">
          Continue
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileNameStep;
