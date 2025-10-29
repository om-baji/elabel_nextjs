import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/queryClient';
import { Product } from '@shared/schema';
import { useEffect, useState } from 'react';
import { useParams } from 'wouter';

const PublicProductPage = () => {
  const params = useParams();
  if (!params.id) return <div>Product not found</div>;

  const id = parseInt(params.id);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await apiRequest(`/api/products/${id}`);
      setProduct(res.data || res); // depending on how apiRequest returns data
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-500">
        Loading product...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-lg my-10 space-y-8">
      <h1 className="text-3xl font-bold text-center">{product.name}</h1>

      {/* Product Image */}
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-500">No Image Available</span>
        )}
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-2 gap-4">
        <Info label="Brand" value={product.brand} />
        <Info label="Net Volume" value={product.netVolume} />
        <Info label="Vintage" value={product.vintage} />
        <Info label="Wine Type" value={product.wineType} />
      </div>

      <Separator />

      {/* Nutrition Declaration */}
      <Section title="Nutrition Declaration">
        <div className="grid grid-cols-2 gap-4">
          <Info
            label="Energy"
            value={
              product.kcal
                ? `${product.kcal} kcal${product.kj ? ` / ${product.kj} kJ` : ''}`
                : undefined
            }
          />
          <Info label="Fat" value={product.fat} />
          <Info label="Carbohydrates" value={product.carbohydrates} />
          <Info label="Sugar Content" value={product.sugarContent} />
          <Info label="Alcohol Content" value={product.alcoholContent} />
          <Info label="Portion Size" value={product.portionSize} />
        </div>
      </Section>

      <Separator />

      {/* Certifications */}
      <Section title="Certifications">
        <div className="flex flex-wrap gap-2">
          {product.organic && <Badge variant="secondary">Organic</Badge>}
          {product.vegetarian && <Badge variant="secondary">Vegetarian</Badge>}
          {product.vegan && <Badge variant="secondary">Vegan</Badge>}
          {!product.organic && !product.vegetarian && !product.vegan && (
            <span className="text-gray-500">No certifications specified</span>
          )}
        </div>
      </Section>

      <Separator />

      {/* FBO Details */}
      <Section title="Food Business Operator (FBO) Details">
        <Info label="Operator Type" value={product.operatorType} />
        <Info label="Operator Name" value={product.operatorName} />
        <Info label="Address" value={product.operatorAddress} />
        <Info label="Additional Info" value={product.operatorInfo} />
      </Section>

      <Separator />

      {/* Additional Details */}
      <Section title="Additional Details">
        <div className="grid grid-cols-2 gap-4">
          <Info label="Country of Origin" value={product.countryOfOrigin} />
          <Info label="Appellation" value={product.appellation} />
          <Info label="SKU" value={product.sku} />
          <Info label="EAN" value={product.ean} />
          <Info label="Packaging Gases" value={product.packagingGases} />
        </div>
      </Section>
    </div>
  );
};

const Info = ({ label, value }: { label: string; value?: string | null }) => (
  <div>
    <h4 className="font-medium mb-1">{label}</h4>
    <p className="text-sm text-gray-600">{value || 'Not specified'}</p>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

export default PublicProductPage;
