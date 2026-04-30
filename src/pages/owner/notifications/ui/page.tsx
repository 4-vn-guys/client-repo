'use client';

import { Bell, CheckCheck, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useNotifications } from '@/features/notifications';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';
import { cn } from '@/shared/lib/utils';

export default function OwnerNotificationsPage() {
  const t = useTranslations('OwnerNotificationsPage');
  const { notifications, unreadCount, isLoadingNotifications, markRead, markAllRead, isMarkingRead } =
    useNotifications();

  return (
    <div className='container mx-auto max-w-4xl space-y-5 pt-6 pb-20'>
      <Card className='rounded-3xl border-slate-200'>
        <CardHeader className='flex flex-row items-center justify-between gap-3'>
          <div className='flex items-center gap-3'>
            <div className='flex size-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600'>
              <Bell className='size-5' />
            </div>
            <div>
              <CardTitle>{t('title')}</CardTitle>
              <p className='text-muted-foreground text-sm'>{t('description')}</p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Badge variant='secondary'>{t('unreadCount', { count: unreadCount })}</Badge>
            <Button
              type='button'
              size='sm'
              variant='outline'
              onClick={() => markAllRead()}
              disabled={isMarkingRead || unreadCount === 0}
            >
              <CheckCheck className='size-4' />
              {t('markAllRead')}
            </Button>
          </div>
        </CardHeader>
        <CardContent className='space-y-3'>
          {isLoadingNotifications ? (
            <p className='text-muted-foreground text-sm'>{t('loading')}</p>
          ) : notifications.length === 0 ? (
            <p className='text-muted-foreground text-sm'>{t('empty')}</p>
          ) : (
            notifications.map(item => {
              const isRead = !!item.readAt;
              return (
                <article
                  key={item.id}
                  className={cn(
                    'rounded-2xl border p-4 transition-colors',
                    isRead ? 'border-slate-200 bg-slate-50' : 'border-violet-200 bg-violet-50/40'
                  )}
                >
                  <div className='flex items-start justify-between gap-3'>
                    <div className='space-y-1'>
                      <p className='font-semibold'>{item.title}</p>
                      <p className='text-sm text-slate-700'>{item.message}</p>
                      <p className='text-muted-foreground text-xs'>
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!isRead && (
                      <Button
                        type='button'
                        size='sm'
                        variant='ghost'
                        onClick={() => markRead(item.id)}
                        disabled={isMarkingRead}
                      >
                        <CheckCircle2 className='size-4' />
                        {t('markRead')}
                      </Button>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
