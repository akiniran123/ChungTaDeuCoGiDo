'use client';

import { Control, Controller, FieldError } from 'react-hook-form';
import { ProductFormData } from '@/types/form';
import dynamic from 'next/dynamic';

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false });

type Props = {
  control: Control<ProductFormData>;
  error?: FieldError;
};

export default function DescriptionEditorSection({ control, error }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <label className="block font-medium mb-1">Product description <span className="text-red-500">*</span></label>
        <p className="text-sm text-gray-600 mb-2">
          Describe your listing: the more details, the better for buyers!
        </p>
        <p className="text-sm text-gray-600">
          Markdown formatting is supported: check out this{' '}
          <a
            href="https://www.markdownguide.org/cheat-sheet/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium"
          >
            cheat sheet
          </a>{' '}
          for syntax help.
        </p>
      </div>

      <div>
        <label className="block font-medium mb-1">Markdown guide:</label>
        <div className="text-sm border rounded p-4 bg-gray-50 whitespace-pre-wrap">
{`This is some normal text.
*Single asterisks italicize text*.
**Double asterisks make bold text**.

Use blank lines to create new paragraphs.

Use hyphens to make unordered lists:
- Item 1
- Item 2

To make ordered lists:
1. First item
2. Second item

Add horizontal rules with --- on a line by themselves.`}
        </div>
      </div>

      <div className="col-span-2 mt-4">
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <SimpleMDE
              {...field}
              placeholder="Describe your item..."
              className="border rounded"
            />
          )}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
      </div>
    </div>
  );
}
