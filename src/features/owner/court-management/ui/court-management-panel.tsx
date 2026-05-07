'use client';

import { FormEvent, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Trash2 } from 'lucide-react';
import {
  createCourt,
  deleteCourt,
  fetchCourtsByBranchId,
  updateCourt,
  type Court,
} from '@/entities/court';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Field, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

type CourtFormState = {
  name: string;
  surfaceType: string;
  defaultHourlyRate: string;
  isActive: boolean;
};

const initialCourtForm: CourtFormState = {
  name: '',
  surfaceType: 'Synthetic',
  defaultHourlyRate: '0',
  isActive: true,
};

type CourtManagementPanelProps = {
  branchId: string;
  initialCourts?: Court[];
};

export function CourtManagementPanel({
  branchId,
  initialCourts = [],
}: CourtManagementPanelProps) {
  const [form, setForm] = useState<CourtFormState>(initialCourtForm);
  const [editingCourtId, setEditingCourtId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const tCommon = useTranslations('Common');
  const tCourtManagement = useTranslations('CourtManagement');

  const courtsQuery = useQuery({
    queryKey: ['courts', 'branch', branchId],
    queryFn: () => fetchCourtsByBranchId(branchId),
    initialData: initialCourts,
    enabled: !!branchId,
  });

  const invalidateBranchData = () => {
    queryClient.invalidateQueries({ queryKey: ['courts', 'branch', branchId] });
    queryClient.invalidateQueries({ queryKey: ['branch', branchId] });
    queryClient.invalidateQueries({
      queryKey: ['bookings', 'branch', branchId],
    });
  };

  const createCourtMutation = useMutation({
    mutationFn: createCourt,
    onSuccess: () => {
      invalidateBranchData();
      setForm(initialCourtForm);
      toast.success(tCourtManagement('successCreate'));
    },
    onError: (error: Error) => {
      toast.error(error.message || tCourtManagement('errorCreate'));
    },
  });

  const updateCourtMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof updateCourt>[1];
    }) => updateCourt(id, data),
    onSuccess: () => {
      invalidateBranchData();
      setForm(initialCourtForm);
      setEditingCourtId(null);
      toast.success(tCourtManagement('successUpdate'));
    },
    onError: (error: Error) => {
      toast.error(error.message || tCourtManagement('errorUpdate'));
    },
  });

  const deleteCourtMutation = useMutation({
    mutationFn: deleteCourt,
    onSuccess: () => {
      invalidateBranchData();
      toast.success(tCourtManagement('successDelete'));
    },
    onError: (error: Error) => {
      toast.error(error.message || tCourtManagement('errorDelete'));
    },
  });

  const courts = courtsQuery.data ?? [];
  const isSubmitting =
    createCourtMutation.isPending || updateCourtMutation.isPending;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      name: form.name.trim(),
      surfaceType: form.surfaceType.trim(),
      defaultHourlyRate: Number(form.defaultHourlyRate),
      isActive: form.isActive,
    };

    if (editingCourtId) {
      updateCourtMutation.mutate({ id: editingCourtId, data: payload });
      return;
    }

    createCourtMutation.mutate({
      branchId,
      ...payload,
    });
  };

  const handleEdit = (court: Court) => {
    setEditingCourtId(court.id);
    setForm({
      name: court.name,
      surfaceType: court.surfaceType,
      defaultHourlyRate: String(court.defaultHourlyRate),
      isActive: court.isActive,
    });
  };

  const handleCancelEdit = () => {
    setEditingCourtId(null);
    setForm(initialCourtForm);
  };

  return (
    <Card className='border-border/60 bg-card/80'>
      <CardHeader className='gap-1'>
        <CardTitle>{tCourtManagement('title')}</CardTitle>
        <CardDescription>{tCourtManagement('description')}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-5'>
        <form
          className='border-border/60 bg-muted/20 grid gap-3 rounded-lg border p-4 md:grid-cols-[1.3fr_1fr_1fr_auto_auto]'
          onSubmit={handleSubmit}
        >
          <Field>
            <FieldLabel htmlFor='court-name'>
              {tCourtManagement('courtName')}
            </FieldLabel>
            <Input
              id='court-name'
              value={form.name}
              onChange={event =>
                setForm(current => ({ ...current, name: event.target.value }))
              }
              placeholder={tCourtManagement('courtNamePlaceholder')}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor='court-surface'>
              {tCourtManagement('surface')}
            </FieldLabel>
            <Input
              id='court-surface'
              value={form.surfaceType}
              onChange={event =>
                setForm(current => ({
                  ...current,
                  surfaceType: event.target.value,
                }))
              }
              placeholder={tCourtManagement('surfacePlaceholder')}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor='court-rate'>
              {tCourtManagement('hourlyRate')}
            </FieldLabel>
            <Input
              id='court-rate'
              type='number'
              min='0'
              step='1000'
              value={form.defaultHourlyRate}
              onChange={event =>
                setForm(current => ({
                  ...current,
                  defaultHourlyRate: event.target.value,
                }))
              }
              required
            />
          </Field>
          <Field className='justify-end'>
            <FieldLabel htmlFor='court-active'>
              {tCourtManagement('active')}
            </FieldLabel>
            <input
              id='court-active'
              type='checkbox'
              checked={form.isActive}
              onChange={event =>
                setForm(current => ({
                  ...current,
                  isActive: event.target.checked,
                }))
              }
              className='accent-primary h-9 w-4'
            />
          </Field>
          <div className='flex items-end gap-2'>
            <Button type='submit' isLoading={isSubmitting}>
              {editingCourtId ? tCommon('save') : tCommon('add')}
            </Button>
            {editingCourtId && (
              <Button
                type='button'
                variant='outline'
                onClick={handleCancelEdit}
              >
                {tCommon('cancel')}
              </Button>
            )}
          </div>
        </form>

        {courts.length === 0 ? (
          <div className='border-border/70 text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm'>
            {tCourtManagement('empty')}
          </div>
        ) : (
          <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-3'>
            {courts.map(court => (
              <div
                key={court.id}
                className='border-border/60 bg-background/80 rounded-lg border p-4 shadow-sm'
              >
                <div className='flex items-start justify-between gap-3'>
                  <div>
                    <h3 className='font-semibold'>{court.name}</h3>
                    <p className='text-muted-foreground text-sm'>
                      {court.surfaceType} ·{' '}
                      {tCourtManagement('ratePerHour', {
                        rate: court.defaultHourlyRate.toLocaleString(),
                      })}
                    </p>
                    <p className='text-muted-foreground mt-1 text-xs'>
                      {court.isActive ? tCommon('active') : tCommon('inactive')}
                    </p>
                  </div>
                  <div className='flex gap-1'>
                    <Button
                      type='button'
                      variant='outline'
                      size='icon-sm'
                      onClick={() => handleEdit(court)}
                    >
                      <Pencil className='size-4' />
                      <span className='sr-only'>
                        {tCourtManagement('editCourt')}
                      </span>
                    </Button>
                    <Button
                      type='button'
                      variant='outline'
                      size='icon-sm'
                      colorPattern='red'
                      onClick={() => deleteCourtMutation.mutate(court.id)}
                      disabled={deleteCourtMutation.isPending}
                    >
                      <Trash2 className='size-4' />
                      <span className='sr-only'>
                        {tCourtManagement('deleteCourt')}
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
