import { Button, TypographyH1, TypographyP } from '@/src/shared/ui';
import { SPORTS } from '@/src/entities/sport';
import { SearchBar } from '@/src/features/search-courts';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

export async function HeroSection() {
  const tCommon = await getTranslations('HomePage');

  return (
    <section className='bg-primary text-primary-foreground relative py-20'>
      <Image
        className='absolute inset-0 h-full w-full object-cover object-center opacity-70'
        loading='eager'
        src='/images/background-home.jpeg'
        alt='Sports Court'
        width={1920}
        height={1080}
      />
      <div className='relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8'>
        <TypographyH1 className='text-shadow-accent-foreground text-shadow-lg'>
          {tCommon('slogan')}
          <br />
          <span className='text-yellow-300'>{tCommon('subSlogan')}</span>
        </TypographyH1>
        <TypographyP className='text-shadow-accent-foreground mx-auto mb-8 max-w-3xl text-xl text-shadow-md md:text-2xl'>
          {tCommon('infoText')}
        </TypographyP>

        {/* Sport Selection */}
        <div className='mb-8 flex flex-wrap justify-center gap-4'>
          {SPORTS.map(sport => (
            <Button
              key={sport.name}
              variant='ghost'
              className='shadow-accent-foreground pointer-events-none h-auto rounded-full px-6 py-3 shadow-lg'
            >
              <span className='text-2xl'>{sport.emoji}</span>
              <span>{sport.name}</span>
            </Button>
          ))}
        </div>

        {/* Search Bar */}
        <SearchBar />
      </div>
    </section>
  );
}
