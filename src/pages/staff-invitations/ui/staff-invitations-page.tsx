'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { Check, Inbox, X } from 'lucide-react';

import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import {
  acceptStaffInvitation,
  declineStaffInvitation,
  type StaffInvitation,
} from '@/entities/branch-staff/api';
import { useStaffInvitations } from '@/features/authorization/model/use-staff-invitations';
import { useAuthStore } from '@/shared/store';

export const StaffInvitationsPage = () => {
  const t = useTranslations('StaffInvitationsPage');
  const router = useRouter();
  const qc = useQueryClient();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const { invitations, isLoading } = useStaffInvitations();
  // Tracks which branch's invitation is being responded to, so only the
  // clicked card shows a spinner.
  const [pendingBranchId, setPendingBranchId] = useState<string | null>(null);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['my-staff-invitations'] });
    qc.invalidateQueries({ queryKey: ['my-staff-memberships'] });
  };

  const acceptMutation = useMutation({
    mutationFn: acceptStaffInvitation,
    onSuccess: () => {
      toast.success(t('acceptSuccess'));
      invalidate();
      router.push('/owner/branches');
    },
    onError: (e: Error) => toast.error(e.message),
    onSettled: () => setPendingBranchId(null),
  });

  const declineMutation = useMutation({
    mutationFn: declineStaffInvitation,
    onSuccess: () => {
      toast.success(t('declineSuccess'));
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
    onSettled: () => setPendingBranchId(null),
  });

  const isResponding = acceptMutation.isPending || declineMutation.isPending;

  if (!isAuthenticated) {
    return (
      <div className='mx-auto max-w-2xl px-4 py-16 text-center'>
        <p className='text-muted-foreground mb-4'>{t('loginRequired')}</p>
        <Link href='/login'>
          <Button>{t('loginCta')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-2xl space-y-6 px-4 py-10 sm:px-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>{t('title')}</h1>
        <p className='text-muted-foreground mt-1 text-sm'>{t('subtitle')}</p>
      </div>

      {isLoading ? (
        <div className='text-muted-foreground text-sm'>{t('loading')}</div>
      ) : invitations.length === 0 ? (
        <Card>
          <CardContent className='py-12 text-center'>
            <Inbox className='text-muted-foreground mx-auto mb-3 size-8' />
            <p className='font-medium'>{t('emptyTitle')}</p>
            <p className='text-muted-foreground mt-1 text-sm'>
              {t('emptyDescription')}
            </p>
            <Link
              href='/'
              className='text-primary mt-4 inline-block text-sm font-medium underline underline-offset-2'
            >
              {t('backHome')}
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-4'>
          {invitations.map(invitation => (
            <InvitationCard
              key={invitation.branchId}
              invitation={invitation}
              isResponding={
                isResponding && pendingBranchId === invitation.branchId
              }
              disabled={isResponding}
              onAccept={() => {
                setPendingBranchId(invitation.branchId);
                acceptMutation.mutate(invitation.branchId);
              }}
              onDecline={() => {
                setPendingBranchId(invitation.branchId);
                declineMutation.mutate(invitation.branchId);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

function InvitationCard({
  invitation,
  isResponding,
  disabled,
  onAccept,
  onDecline,
}: {
  invitation: StaffInvitation;
  isResponding: boolean;
  disabled: boolean;
  onAccept: () => void;
  onDecline: () => void;
}) {
  const t = useTranslations('StaffInvitationsPage');

  return (
    <Card>
      <CardContent className='space-y-3 p-5'>
        <div className='flex flex-wrap items-center gap-2'>
          <span className='text-lg font-semibold'>{invitation.branchName}</span>
          <Badge variant='secondary'>{invitation.roleName}</Badge>
        </div>
        <p className='text-muted-foreground text-sm'>
          {t('invitedBy', { name: invitation.invitedByName })}
          {' · '}
          {t('invitedAt', {
            date: new Date(invitation.invitedAt).toLocaleDateString(),
          })}
        </p>
        {invitation.permissions.length > 0 && (
          <div className='flex flex-wrap gap-1'>
            {invitation.permissions.map(p => (
              <Badge key={p} variant='outline' className='font-mono text-[10px]'>
                {p}
              </Badge>
            ))}
          </div>
        )}
        <div className='flex gap-2 pt-1'>
          <Button
            icon={<Check className='size-4' />}
            iconPlacement='left'
            isLoading={isResponding}
            disabled={disabled}
            onClick={onAccept}
          >
            {t('accept')}
          </Button>
          <Button
            variant='outline'
            colorPattern='red'
            icon={<X className='size-4' />}
            iconPlacement='left'
            disabled={disabled}
            onClick={onDecline}
          >
            {t('decline')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
