import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Login() {
  return (
    <div className='mx-auto max-w-4xl space-y-8 p-8'>
      <h1 className='text-2xl font-bold'>
        Updated Components - Sharper Corners
      </h1>

      {/* Button Tests */}
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold'>Buttons with Sharper Corners</h2>
        <div className='flex flex-wrap gap-4'>
          <Button>Default</Button>
          <Button variant='secondary'>Secondary</Button>
          <Button variant='outline'>Outline</Button>
          <Button variant='ghost'>Ghost</Button>
          <Button variant='destructive'>Destructive</Button>
          <Button variant='link'>Link</Button>
        </div>

        <h3 className='text-lg font-medium'>Button Sizes</h3>
        <div className='flex items-center gap-4'>
          <Button size='sm'>Small</Button>
          <Button size='default'>Default</Button>
          <Button size='lg'>Large</Button>
          <Button size='xl'>Extra Large</Button>
          <Button size='icon'>🎾</Button>
        </div>

        <h3 className='text-lg font-medium'>Button States</h3>
        <div className='flex gap-4'>
          <Button disabled>Disabled</Button>
          <Button>Click me!</Button>
        </div>
      </section>

      {/* Card Test */}
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold'>Cards with Sharper Corners</h2>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                This card now has sharper corners instead of rounded corners.
              </p>
              <Badge className='mt-2'>New Badge</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <p>Another card with sharper border radius.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Select Test */}
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold'>Select with Sharper Corners</h2>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div>
            <label className='mb-2 block text-sm font-medium'>
              Choose a sport:
            </label>
            <Select>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select a sport' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='football'>⚽ Football</SelectItem>
                <SelectItem value='badminton'>🏸 Badminton</SelectItem>
                <SelectItem value='pickleball'>🥍 Pickleball</SelectItem>
                <SelectItem value='tennis'>🎾 Tennis</SelectItem>
                <SelectItem value='basketball'>🏀 Basketball</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium'>Duration:</label>
            <Select>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select duration' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='30min'>30 minutes</SelectItem>
                <SelectItem value='1hour'>1 hour</SelectItem>
                <SelectItem value='2hours'>2 hours</SelectItem>
                <SelectItem value='halfday'>Half day</SelectItem>
                <SelectItem value='fullday'>Full day</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <p className='text-muted-foreground text-sm'>
          All components now have sharper corners for a more modern, angular
          look!
        </p>
      </section>
    </div>
  );
}
