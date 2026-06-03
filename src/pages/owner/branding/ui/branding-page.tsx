'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';

import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  fetchBranding,
  updateBranding,
  type BrandingConfig,
} from '@/entities/branding/api';
import { useActiveVenue } from '@/widgets/owner/venue-switcher';

const HEX_RE = /^#[0-9A-Fa-f]{6}$/;

type Draft = {
  displayName: string;
  subdomain: string;
  primaryColor: string;
  accentColor: string;
  logoUrl: string;
};

function toDraft(config: BrandingConfig): Draft {
  return {
    displayName: config.displayName ?? '',
    subdomain: config.subdomain ?? '',
    primaryColor: config.primaryColor ?? '#7C3AED',
    accentColor: config.accentColor ?? '#0EA5E9',
    logoUrl: config.logoUrl ?? '',
  };
}

export function OwnerBrandingPage() {
  const { activeVenueId, activeVenue, isLoading: venueLoading } = useActiveVenue();

  const brandingQuery = useQuery({
    queryKey: ['owner-branding', activeVenueId],
    queryFn: () => fetchBranding(activeVenueId as string),
    enabled: !!activeVenueId,
  });

  if (venueLoading) {
    return <div className='text-muted-foreground p-8 text-sm'>Loading venue…</div>;
  }

  if (!activeVenueId) {
    return (
      <div className='p-8 text-sm'>
        No active venue. Pick one from the sidebar.
      </div>
    );
  }

  return (
    <div className='space-y-6 p-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>Branding</h1>
        <p className='text-muted-foreground mt-1 text-sm'>
          Customise the look of player-facing pages for{' '}
          <strong>{activeVenue?.name}</strong>.
        </p>
      </div>

      {brandingQuery.isLoading ? (
        <div className='text-muted-foreground text-sm'>Loading branding…</div>
      ) : brandingQuery.isError ? (
        <div className='text-sm text-red-600'>
          Failed to load branding · {(brandingQuery.error as Error).message}
        </div>
      ) : brandingQuery.data ? (
        <BrandingForm
          key={activeVenueId}
          branchId={activeVenueId}
          config={brandingQuery.data}
          venueName={activeVenue?.name ?? null}
        />
      ) : null}
    </div>
  );
}

function BrandingForm({
  branchId,
  config,
  venueName,
}: {
  branchId: string;
  config: BrandingConfig;
  venueName: string | null;
}) {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Draft>(() => toDraft(config));

  const mutation = useMutation({
    mutationFn: updateBranding,
    onSuccess: data => {
      toast.success('Branding saved');
      qc.setQueryData(['owner-branding', branchId], data);
    },
    onError: (e: Error) => toast.error(e.message || 'Save failed'),
  });

  const dirty =
    draft.displayName !== (config.displayName ?? '') ||
    draft.subdomain !== (config.subdomain ?? '') ||
    draft.primaryColor !== (config.primaryColor ?? '') ||
    draft.accentColor !== (config.accentColor ?? '') ||
    draft.logoUrl !== (config.logoUrl ?? '');

  function handleSave() {
    if (!HEX_RE.test(draft.primaryColor) || !HEX_RE.test(draft.accentColor)) {
      toast.error('Colors must be #RRGGBB');
      return;
    }
    mutation.mutate({
      branchId,
      displayName: draft.displayName.trim() || undefined,
      subdomain: draft.subdomain.trim() || null,
      primaryColor: draft.primaryColor,
      accentColor: draft.accentColor,
      logoUrl: draft.logoUrl.trim() || null,
    });
  }

  return (
    <>
      <div className='flex justify-end'>
        <Button
          icon={<Save className='size-4' />}
          onClick={handleSave}
          isLoading={mutation.isPending}
          disabled={!dirty || mutation.isPending}
        >
          Save
        </Button>
      </div>

      <div className='grid gap-6 lg:grid-cols-[2fr_1fr]'>
        <Card>
          <CardHeader>
            <CardTitle>Identity</CardTitle>
            <CardDescription>
              Shown on receipts, emails, and the public booking page.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-1.5'>
              <Label htmlFor='b-displayname'>Display name</Label>
              <Input
                id='b-displayname'
                value={draft.displayName}
                onChange={e =>
                  setDraft(d => ({ ...d, displayName: e.target.value }))
                }
                placeholder={venueName ?? ''}
              />
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='b-subdomain'>Subdomain</Label>
              <Input
                id='b-subdomain'
                value={draft.subdomain}
                onChange={e =>
                  setDraft(d => ({ ...d, subdomain: e.target.value }))
                }
                placeholder='tvc'
              />
              <p className='text-muted-foreground text-[11px]'>
                Resolves to{' '}
                <span className='font-mono'>
                  {draft.subdomain || 'your-name'}.courtconnect.app
                </span>
              </p>
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='b-logo'>Logo URL</Label>
              <Input
                id='b-logo'
                value={draft.logoUrl}
                onChange={e =>
                  setDraft(d => ({ ...d, logoUrl: e.target.value }))
                }
                placeholder='https://…/logo.png'
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-1.5'>
                <Label htmlFor='b-primary'>Primary color</Label>
                <div className='flex items-center gap-2'>
                  <input
                    id='b-primary'
                    type='color'
                    className='size-9 cursor-pointer rounded-md border'
                    value={
                      HEX_RE.test(draft.primaryColor)
                        ? draft.primaryColor
                        : '#7C3AED'
                    }
                    onChange={e =>
                      setDraft(d => ({
                        ...d,
                        primaryColor: e.target.value.toUpperCase(),
                      }))
                    }
                  />
                  <Input
                    value={draft.primaryColor}
                    onChange={e =>
                      setDraft(d => ({
                        ...d,
                        primaryColor: e.target.value.toUpperCase(),
                      }))
                    }
                    className='font-mono'
                  />
                </div>
              </div>
              <div className='space-y-1.5'>
                <Label htmlFor='b-accent'>Accent color</Label>
                <div className='flex items-center gap-2'>
                  <input
                    id='b-accent'
                    type='color'
                    className='size-9 cursor-pointer rounded-md border'
                    value={
                      HEX_RE.test(draft.accentColor)
                        ? draft.accentColor
                        : '#0EA5E9'
                    }
                    onChange={e =>
                      setDraft(d => ({
                        ...d,
                        accentColor: e.target.value.toUpperCase(),
                      }))
                    }
                  />
                  <Input
                    value={draft.accentColor}
                    onChange={e =>
                      setDraft(d => ({
                        ...d,
                        accentColor: e.target.value.toUpperCase(),
                      }))
                    }
                    className='font-mono'
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              Live preview of how the brand renders on player-facing surfaces.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className='rounded-xl border p-4'
              style={{
                background: HEX_RE.test(draft.primaryColor)
                  ? `linear-gradient(135deg, ${draft.primaryColor}, ${
                      HEX_RE.test(draft.accentColor)
                        ? draft.accentColor
                        : '#0EA5E9'
                    })`
                  : '#7c3aed',
                color: 'white',
              }}
            >
              {draft.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={draft.logoUrl}
                  alt=''
                  className='mb-3 h-10 w-auto rounded-md bg-white/10 p-1'
                />
              ) : (
                <div className='mb-3 inline-block rounded-md bg-white/10 px-2 py-1 text-[11px] font-bold tracking-wider uppercase'>
                  Logo
                </div>
              )}
              <div className='text-lg font-bold'>
                {draft.displayName || venueName || 'Your venue'}
              </div>
              <div className='mt-1 text-xs opacity-80'>
                {draft.subdomain || 'your-name'}.courtconnect.app
              </div>
              <div className='mt-3 flex gap-2'>
                <Badge className='bg-white/15 text-white'>Open today</Badge>
                <Badge className='bg-white/15 text-white'>Book now</Badge>
              </div>
            </div>
            {!HEX_RE.test(draft.primaryColor) && (
              <p className='mt-2 text-xs text-red-600'>
                Primary color must be a valid <code>#RRGGBB</code>.
              </p>
            )}
            {!HEX_RE.test(draft.accentColor) && (
              <p className='mt-2 text-xs text-red-600'>
                Accent color must be a valid <code>#RRGGBB</code>.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
