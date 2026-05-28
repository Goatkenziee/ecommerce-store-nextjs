'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProductFormProps {
  onSubmit: (formData: FormData) => Promise<any>;
  initialData?: {
    name: string;
    description?: string | null;
    imageUrl: string;
    price: number;
  };
}

export default function ProductForm({ onSubmit, initialData }: ProductFormProps) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = await onSubmit(formData);

    if (result?.errors) {
      setErrors(result.errors);
    } else {
      router.push('/admin/products');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={initialData?.name || ''}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          name="description"
          defaultValue={initialData?.description || ''}
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description[0]}</p>}
      </div>
      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
        <input
          type="url"
          id="imageUrl"
          name="imageUrl"
          defaultValue={initialData?.imageUrl || ''}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
        {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl[0]}</p>}
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          id="price"
          name="price"
          defaultValue={initialData?.price || ''}
          step="0.01"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price[0]}</p>}
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        Save Product
      </button>
    </form>
  );
}
