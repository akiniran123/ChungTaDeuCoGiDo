'use client';

interface BuildHeaderProps {
  buildName?: string;
  totalPrice?: string;
}

export default function BuildHeader({
  buildName = 'My Custom Build',
  totalPrice = '$1,234.56',
}: BuildHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-center mb-6">
      <h1 className="text-3xl font-semibold">{buildName}</h1>
      <div className="mt-2 sm:mt-0 text-gray-700 dark:text-gray-300 font-medium text-lg">
        Total Price: <span className="text-green-600 dark:text-green-400">{totalPrice}</span>
      </div>
    </header>
  );
}
