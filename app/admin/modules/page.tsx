'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  Boxes,
  ExternalLink,
  Globe,
  BarChart3,
  Smartphone,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';

import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  fetchModules,
  updateModule,
  type PlatformModule,
} from '@/entities/admin/api/platform-api';

const ICON_MAP: Record<string, React.ReactNode> = {
  bolt: <Zap className='size-5' />,
  trophy: <Trophy className='size-5' />,
  spark: <Sparkles className='size-5' />,
  box: <Boxes className='size-5' />,
  users: <Users className='size-5' />,
  chart: <BarChart3 className='size-5' />,
  globe: <Globe className='size-5' />,
  phone: <Smartphone className='size-5' />,
};

const CATEGORIES = ['All', 'Revenue', 'Engagement', 'Operations', 'Growth', 'Enterprise'];

export default function AdminModulesPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selected, setSelected] = useState<PlatformModule | null>(null);

  const { data: modules = [], isLoading } = useQuery({
    queryKey: ['admin-platform', 'modules'],
    queryFn: fetchModules,
  });

  const filtered =
    activeCategory === 'All'
      ? modules
      : modules.filter(m => m.category === activeCategory);

  return (
    <div className='space-y-6 py-8'>
      {/* Header */}
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>Module marketplace</h1>
        <p className='text-muted-foreground mt-1 text-sm'>
          Tenants buy add-ons à-la-carte · attach rate{' '}
          <strong className='text-foreground'>62%</strong> · MRR contribution{' '}
          <strong className='text-foreground'>$28.4k</strong>
        </p>
      </div>

      {/* Category tabs */}
      <div className='flex flex-wrap gap-2'>
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              activeCategory === c
                ? 'bg-foreground text-background'
                : 'bg-card text-muted-foreground hover:bg-muted border'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Module grid */}
      {isLoading ? (
        <div className='text-muted-foreground py-12 text-center text-sm'>Loading modules…</div>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {filtered.map(m => (
            <ModuleCard key={m.id} module={m} onConfigure={() => setSelected(m)} />
          ))}
        </div>
      )}

      <ModuleConfigDialog
        module={selected}
        onOpenChange={open => {
          if (!open) setSelected(null);
        }}
      />
    </div>
  );
}

function ModuleCard({
  module: m,
  onConfigure,
}: {
  module: PlatformModule;
  onConfigure: () => void;
}) {
  return (
    <Card
      className={`relative gap-3 p-5 transition-shadow hover:shadow-md ${
        m.isBestSeller ? 'ring-primary/30 ring-2' : ''
      }`}
    >
      {m.isBestSeller && (
        <Badge className='absolute right-3 top-3 bg-gradient-to-br from-amber-500 to-red-600 text-white'>
          ★ best-seller
        </Badge>
      )}
      {m.isEnterprise && (
        <Badge className='absolute right-3 top-3 bg-gray-900 text-white'>
          enterprise
        </Badge>
      )}
      <div
        className='flex size-11 items-center justify-center rounded-xl text-white'
        style={{ backgroundColor: m.color }}
      >
        {ICON_MAP[m.iconName] ?? <Boxes className='size-5' />}
      </div>
      <div>
        <p className='text-sm font-bold'>{m.name}</p>
        <p className='text-muted-foreground mt-0.5 text-xs'>{m.description}</p>
      </div>
      <p className='text-muted-foreground text-xs'>
        <span className='font-mono'>{m.category}</span> · installed by{' '}
        <strong className='text-primary'>{m.installedCount}</strong> tenants
      </p>
      <div className='mt-auto flex items-center justify-between pt-1'>
        <span className='text-lg font-bold'>{m.price}</span>
        <Button
          size='sm'
          icon={<ExternalLink className='size-3' />}
          iconPlacement='right'
          onClick={onConfigure}
        >
          Configure
        </Button>
      </div>
    </Card>
  );
}

function ModuleConfigDialog({
  module: m,
  onOpenChange,
}: {
  module: PlatformModule | null;
  onOpenChange: (open: boolean) => void;
}) {
  if (!m) return null;
  return (
    <Dialog open={!!m} onOpenChange={onOpenChange}>
      <ModuleConfigDialogContent key={m.id} module={m} onOpenChange={onOpenChange} />
    </Dialog>
  );
}

function ModuleConfigDialogContent({
  module: m,
  onOpenChange,
}: {
  module: PlatformModule;
  onOpenChange: (open: boolean) => void;
}) {
  const qc = useQueryClient();
  const [price, setPrice] = useState(m.price);

  const mutation = useMutation({
    mutationFn: updateModule,
    onSuccess: () => {
      toast.success('Module updated');
      qc.invalidateQueries({ queryKey: ['admin-platform', 'modules'] });
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message || 'Update failed'),
  });

  const disableMutation = useMutation({
    mutationFn: updateModule,
    onSuccess: () => {
      toast.success('Module hidden from marketplace');
      qc.invalidateQueries({ queryKey: ['admin-platform', 'modules'] });
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message || 'Update failed'),
  });

  return (
    <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <span
              className='flex size-8 items-center justify-center rounded-lg text-white'
              style={{ backgroundColor: m.color }}
            >
              {ICON_MAP[m.iconName] ?? <Boxes className='size-4' />}
            </span>
            {m.name}
          </DialogTitle>
          <DialogDescription>{m.description}</DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='bg-muted/50 grid grid-cols-2 gap-3 rounded-md p-3 text-xs'>
            <div>
              <p className='text-muted-foreground'>Category</p>
              <p className='font-bold'>{m.category}</p>
            </div>
            <div>
              <p className='text-muted-foreground'>Installed tenants</p>
              <p className='font-bold'>{m.installedCount}</p>
            </div>
          </div>

          <form
            id='module-config-form'
            onSubmit={e => {
              e.preventDefault();
              if (mutation.isPending) return;
              mutation.mutate({ id: m.id, price });
            }}
            className='space-y-2'
          >
            <Label htmlFor='module-price'>Price</Label>
            <Input
              id='module-price'
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder='$49/mo'
              required
            />
            <p className='text-muted-foreground text-[11px]'>
              Free-form pricing label · shown on the marketplace card.
            </p>
          </form>
        </div>

        <DialogFooter className='sm:justify-between'>
          <Button
            type='button'
            variant='outline'
            colorPattern='red'
            disabled={mutation.isPending || disableMutation.isPending}
            isLoading={disableMutation.isPending}
            onClick={() =>
              disableMutation.mutate({ id: m.id, disabled: true })
            }
          >
            Hide from marketplace
          </Button>
          <div className='flex gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending || disableMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              form='module-config-form'
              isLoading={mutation.isPending}
              disabled={disableMutation.isPending}
            >
              Save
            </Button>
          </div>
      </DialogFooter>
    </DialogContent>
  );
}
