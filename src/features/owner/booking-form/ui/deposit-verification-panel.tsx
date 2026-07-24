'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ExternalLink, ReceiptText } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import {
  confirmBookingDeposit,
  rejectBookingDeposit,
  type Booking,
} from '@/entities/booking';
import { Button } from '@/shared/ui/button';

interface DepositVerificationPanelProps {
  bookingId: string;
  branchId: string;
  depositAmount?: number;
  depositDueAt?: string | null;
  lifecycleStatus?: Booking['lifecycleStatus'];
  payments?: Booking['payments'];
  onResolved: () => void;
}

function formatStoredVnd(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount * 1000);
}

export function DepositVerificationPanel({
  bookingId,
  branchId,
  depositAmount = 0,
  depositDueAt,
  lifecycleStatus,
  payments,
  onResolved,
}: DepositVerificationPanelProps) {
  const t = useTranslations('BookingForm');
  const queryClient = useQueryClient();
  const deposit = payments?.find(payment => payment.purpose === 'deposit');

  const refreshTimeline = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['bookings', 'branch', branchId],
    });
    onResolved();
  };

  const confirmMutation = useMutation({
    mutationFn: () => confirmBookingDeposit(bookingId),
    onSuccess: async () => {
      toast.success(t('depositConfirmed'));
      await refreshTimeline();
    },
    onError: () => toast.error(t('depositConfirmFailed')),
  });

  const rejectMutation = useMutation({
    mutationFn: () => rejectBookingDeposit(bookingId),
    onSuccess: async () => {
      toast.success(t('depositRejected'));
      await refreshTimeline();
    },
    onError: () => toast.error(t('depositRejectFailed')),
  });

  if (
    !deposit ||
    (lifecycleStatus !== 'awaiting_deposit' && deposit.status !== 'pending')
  ) {
    return null;
  }

  const isWorking = confirmMutation.isPending || rejectMutation.isPending;
  const receipt = deposit.receiptFile;

  return (
    <section className='mx-6 mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950'>
      <div className='mb-3 flex items-start gap-3'>
        <ReceiptText className='mt-0.5 size-5 shrink-0' />
        <div className='min-w-0'>
          <h3 className='font-semibold'>{t('depositVerification')}</h3>
          <p className='mt-1 text-amber-800'>
            {t('depositVerificationHint')}
          </p>
        </div>
      </div>

      <dl className='grid gap-2 sm:grid-cols-2'>
        <div>
          <dt className='text-amber-700'>{t('depositAmount')}</dt>
          <dd className='font-medium'>{formatStoredVnd(depositAmount)}</dd>
        </div>
        <div>
          <dt className='text-amber-700'>{t('depositDeadline')}</dt>
          <dd className='font-medium'>
            {depositDueAt
              ? new Date(depositDueAt).toLocaleString()
              : t('notAvailable')}
          </dd>
        </div>
      </dl>

      <div className='mt-3 rounded-md bg-white/70 p-3'>
        {receipt ? (
          <a
            href={receipt.url}
            target='_blank'
            rel='noreferrer'
            className='inline-flex items-center gap-2 font-medium text-blue-700 underline-offset-4 hover:underline'
          >
            {t('viewReceipt', { name: receipt.fileName })}
            <ExternalLink className='size-4' />
          </a>
        ) : (
          <span className='text-amber-800'>{t('receiptNotSubmitted')}</span>
        )}
      </div>

      <div className='mt-4 flex flex-wrap justify-end gap-2'>
        <Button
          type='button'
          variant='outline'
          colorPattern='red'
          disabled={isWorking}
          isLoading={rejectMutation.isPending}
          onClick={() => {
            if (window.confirm(t('rejectDepositConfirmation'))) {
              rejectMutation.mutate();
            }
          }}
        >
          {t('rejectDeposit')}
        </Button>
        <Button
          type='button'
          colorPattern='green'
          disabled={isWorking}
          isLoading={confirmMutation.isPending}
          onClick={() => confirmMutation.mutate()}
        >
          {t('confirmDeposit')}
        </Button>
      </div>
    </section>
  );
}
