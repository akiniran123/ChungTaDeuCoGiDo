import { Control, Controller } from 'react-hook-form';
import { ProductFormData } from '@/types/form';

type Props = {
  control: Control<ProductFormData>;
  error?: {
    message?: string;
  };
};

export default function DescriptionEditor({ control, error }: Props) {
  return (
    <div className="space-y-3">
      <label className="font-semibold text-lg block">Product description <span className="text-red-500">*</span></label>
      <div className="grid md:grid-cols-2 gap-4">
        {/* Input */}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              placeholder="Describe your listing: the more details, the better for buyers!"
              rows={10}
              className="w-full border rounded px-3 py-2"
            />
          )}
        />

        {/* Markdown Guide */}
        <div className="bg-gray-50 border rounded px-3 py-2 text-sm text-gray-700">
          <p className="font-medium mb-2">Markdown guide:</p>
          <p>This is some normal text.</p>
          <p><em>*Single asterisks italicize text*</em></p>
          <p><strong>**Double asterisks make bold text**</strong></p>
          <p>`Backticks` for inline code</p>
          <p>- List item 1</p>
          <p>- List item 2</p>
        </div>
      </div>
      {error?.message && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
}
