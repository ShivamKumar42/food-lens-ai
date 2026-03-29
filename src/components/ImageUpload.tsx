import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ImagePlus, RotateCcw, X } from "lucide-react";

interface ImageUploadProps {
  image: string | null;
  onImageSelect: (file: File, dataUrl: string) => void;
  onReset: () => void;
}

const ImageUpload = ({ image, onImageSelect, onReset }: ImageUploadProps) => {
  const [showWebcam, setShowWebcam] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => onImageSelect(file, reader.result as string);
      reader.readAsDataURL(file);
    },
    [onImageSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const captureWebcam = useCallback(() => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (!screenshot) return;
    fetch(screenshot)
      .then((r) => r.blob())
      .then((blob) => {
        const file = new File([blob], "webcam-capture.jpg", { type: "image/jpeg" });
        onImageSelect(file, screenshot);
        setShowWebcam(false);
      });
  }, [onImageSelect]);

  if (image) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-2xl border border-border bg-card"
        style={{ boxShadow: "var(--shadow-md)" }}
      >
        <img src={image} alt="Uploaded food" className="h-72 w-full object-cover sm:h-80" />
        <button
          onClick={onReset}
          className="absolute top-3 right-3 rounded-full bg-card/80 p-2 backdrop-blur-sm transition-colors hover:bg-destructive hover:text-destructive-foreground"
          aria-label="Remove image"
        >
          <X className="h-4 w-4" />
        </button>
      </motion.div>
    );
  }

  if (showWebcam) {
    return (
      <div className="overflow-hidden rounded-2xl border border-border bg-card" style={{ boxShadow: "var(--shadow-md)" }}>
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          className="h-72 w-full object-cover sm:h-80"
          videoConstraints={{ facingMode: "environment" }}
        />
        <div className="flex gap-3 p-4">
          <button
            onClick={captureWebcam}
            className="flex-1 rounded-xl bg-primary px-4 py-2.5 font-heading font-semibold text-primary-foreground"
          >
            Capture
          </button>
          <button
            onClick={() => setShowWebcam(false)}
            className="rounded-xl border border-border bg-card px-4 py-2.5 font-heading font-medium text-foreground"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`group cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-secondary/50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-2xl bg-secondary p-4 text-primary transition-transform group-hover:scale-110">
            <ImagePlus className="h-8 w-8" />
          </div>
          <div>
            <p className="font-heading text-lg font-semibold text-foreground">
              {isDragActive ? "Drop your image here" : "Drag & drop a food image"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              or click to browse · PNG, JPG, WEBP · Max 10 MB
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowWebcam(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 font-heading text-sm font-medium text-foreground transition-colors hover:bg-secondary"
      >
        <Camera className="h-4 w-4 text-primary" />
        Use Webcam
      </button>
    </div>
  );
};

export default ImageUpload;
