'use client';

import { TJetSki } from '@/type/type';
import Image from 'next/image';

interface JetSkiShowcaseCardProps {
  jetSki: TJetSki;
}

export default function JetSkiShowcaseCard({ jetSki }: JetSkiShowcaseCardProps) {
  // Get brand from model/name
  const getBrandFromModel = (name: string): string => {
    if (name.includes('Sea-Doo')) return 'SEADOO';
    if (name.includes('Yamaha')) return 'YAMAHA';
    if (name.includes('Kawasaki')) return 'KAWASAKI';
    return 'SEADOO'; // fallback
  };

  const brand = getBrandFromModel(jetSki.name);
  const model = jetSki.model || 'Unknown Model';
  const hp = jetSki.hp ?? 0;
  const price = jetSki.price ?? 0;
  const description = jetSki.description || 'High-performance personal watercraft built for speed and comfort. Ideal for beginners and experts alike.';

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg transition-all duration-300 bg-white hover:shadow-xl flex flex-col">
      {/* Image Section */}
      <div className="relative h-56 sm:h-64 2xl:h-72">
        <Image
          src={
            jetSki.images?.[0]?.trim() ||
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80'
          }
          alt={model}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority={false}
        />

        {/* Overlay Text */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white pointer-events-none">
          <div>
            <p className="text-sm uppercase tracking-wider font-medium mix-blend-difference opacity-90">
              {brand}
            </p>
            <h3 className="text-2xl font-bold leading-tight mix-blend-difference">{model}</h3>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold mix-blend-difference">
              <span className="text-3xl">{hp}</span> HP
            </span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-6 bg-gray-50 flex flex-col">
        {/* Price */}
        <p className="text-sm font-medium mb-3 text-gray-900">${price}/Day</p>

        {/* Description */}
        <p className="text-sm leading-relaxed text-gray-600 line-clamp-3">{description}</p>
      </div>
    </div>
  );
}