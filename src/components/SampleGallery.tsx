const SAMPLE_IMAGES = [
  { url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80", label: "Pizza" },
  { url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80", label: "Burger" },
  { url: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&q=80", label: "Sushi" },
  { url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80", label: "Samosa" },
];

interface SampleGalleryProps {
  onSelect: (file: File, dataUrl: string) => void;
}

const SampleGallery = ({ onSelect }: SampleGalleryProps) => {
  const handleClick = async (url: string) => {
    const res = await fetch(url);
    const blob = await res.blob();
    const file = new File([blob], "sample.jpg", { type: "image/jpeg" });
    const reader = new FileReader();
    reader.onload = () => onSelect(file, reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="mt-6">
      <p className="mb-3 text-center font-heading text-sm font-medium text-muted-foreground">
        Or try a sample image
      </p>
      <div className="grid grid-cols-4 gap-2">
        {SAMPLE_IMAGES.map((img) => (
          <button
            key={img.label}
            onClick={() => handleClick(img.url)}
            className="group overflow-hidden rounded-xl border border-border transition-all hover:border-primary/50 hover:shadow-md"
          >
            <img
              src={img.url}
              alt={img.label}
              className="h-20 w-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
            <p className="py-1.5 text-center text-xs font-medium text-muted-foreground">
              {img.label}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SampleGallery;
