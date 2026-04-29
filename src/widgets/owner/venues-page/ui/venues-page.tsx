'use client';

import { FormEvent, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BranchHeader } from '@/pages/owner/venues/ui/venue-header';
import { BranchesList } from '@/pages/owner/venues/ui/venues-list';
import { createBranch, fetchBranches, uploadBranchFile } from '@/entities/venue';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Field, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { LocationPicker } from '@/shared/ui/location-picker';
import toast from 'react-hot-toast';

type BranchFormState = {
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  openTime: string;
  closeTime: string;
  hotline: string;
  policyFile: File | null;
};

const initialBranchForm: BranchFormState = {
  name: '',
  address: '',
  latitude: '10.762622',
  longitude: '106.660172',
  openTime: '06:00',
  closeTime: '23:00',
  hotline: '',
  policyFile: null,
};

const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export function VenuesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form, setForm] = useState<BranchFormState>(initialBranchForm);
  const queryClient = useQueryClient();

  const { data: branches = [], isLoading } = useQuery({
    queryKey: ['branches'],
    queryFn: fetchBranches,
  });

  const createBranchMutation = useMutation({
    mutationFn: async () => {
      const policyFile = form.policyFile
        ? await uploadBranchFile(form.policyFile)
        : null;

      return createBranch({
        name: form.name.trim(),
        address: form.address.trim(),
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        openTime: form.openTime,
        closeTime: form.closeTime,
        hotline: form.hotline.trim() || undefined,
        policyFileId: policyFile?.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      setForm(initialBranchForm);
      setIsCreateOpen(false);
      toast.success('Branch created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create branch');
    },
  });

  const handleAddBranch = () => {
    setIsCreateOpen(true);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createBranchMutation.mutate();
  };

  return (
    <div className='container mx-auto min-h-screen max-w-7xl space-y-8 pt-6'>
      <BranchHeader
        branchCount={branches.length}
        onAddBranch={handleAddBranch}
      />
      <BranchesList
        branches={branches}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateBranch={handleAddBranch}
      />
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className='sm:max-w-2xl'>
          <form className='space-y-6' onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create New Branch</DialogTitle>
              <DialogDescription>
                Add a branch so courts, schedule, and bookings can be managed
                from the owner workspace.
              </DialogDescription>
            </DialogHeader>

            <div className='grid gap-4 md:grid-cols-2'>
              <Field className='md:col-span-2'>
                <FieldLabel htmlFor='branch-name'>Branch Name</FieldLabel>
                <Input
                  id='branch-name'
                  value={form.name}
                  onChange={event =>
                    setForm(current => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder='Downtown Badminton Center'
                  required
                />
              </Field>

              <Field className='md:col-span-2'>
                <FieldLabel htmlFor='branch-address'>Address</FieldLabel>
                <Input
                  id='branch-address'
                  value={form.address}
                  onChange={event =>
                    setForm(current => ({
                      ...current,
                      address: event.target.value,
                    }))
                  }
                  placeholder='123 Nguyen Trai, District 1'
                  required
                />
              </Field>

              <div className='md:col-span-2'>
                <LocationPicker
                  accessToken={mapboxAccessToken}
                  latitude={Number(form.latitude)}
                  longitude={Number(form.longitude)}
                  onChange={({ latitude, longitude }) =>
                    setForm(current => ({
                      ...current,
                      latitude: String(latitude),
                      longitude: String(longitude),
                    }))
                  }
                />
              </div>

              <Field>
                <FieldLabel htmlFor='branch-open-time'>Open Time</FieldLabel>
                <Input
                  id='branch-open-time'
                  type='time'
                  value={form.openTime}
                  onChange={event =>
                    setForm(current => ({
                      ...current,
                      openTime: event.target.value,
                    }))
                  }
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor='branch-close-time'>Close Time</FieldLabel>
                <Input
                  id='branch-close-time'
                  type='time'
                  value={form.closeTime}
                  onChange={event =>
                    setForm(current => ({
                      ...current,
                      closeTime: event.target.value,
                    }))
                  }
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor='branch-hotline'>Hotline</FieldLabel>
                <Input
                  id='branch-hotline'
                  value={form.hotline}
                  onChange={event =>
                    setForm(current => ({
                      ...current,
                      hotline: event.target.value,
                    }))
                  }
                  placeholder='0901234567'
                />
              </Field>

              <Field className='md:col-span-2'>
                <FieldLabel htmlFor='branch-policy'>Policy</FieldLabel>
                <Input
                  id='branch-policy'
                  type='file'
                  accept='application/pdf,.pdf'
                  onChange={event =>
                    setForm(current => ({
                      ...current,
                      policyFile: event.target.files?.[0] ?? null,
                    }))
                  }
                />
                <p className='text-muted-foreground text-xs'>
                  Upload the branch policy as a PDF so long cancellation or
                  house rules can be opened from the branch card.
                </p>
                {form.policyFile && (
                  <p className='text-sm font-medium'>{form.policyFile.name}</p>
                )}
              </Field>
            </div>

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button type='submit' isLoading={createBranchMutation.isPending}>
                Create Branch
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
