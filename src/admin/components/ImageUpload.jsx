import { useState, useRef, useCallback } from 'react';
import { Upload, X, FileIcon } from 'lucide-react';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
const ACCEPTED_DOC_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export default function ImageUpload({
  value, // existing URL or File
  onChange,
  accept = 'image/*',
  label = 'Upload Image',
  error,
  onRemove,
  helperText,
  multiple = false,
}) {
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState('');
  const inputRef = useRef(null);

  const validateFile = (file) => {
    const types = accept === '*' ? [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_DOC_TYPES] :
                  accept === 'image/*' ? ACCEPTED_IMAGE_TYPES :
                  accept === '.pdf,.doc,.docx' ? ACCEPTED_DOC_TYPES :
                  ACCEPTED_IMAGE_TYPES;

    if (!types.includes(file.type)) {
      setFileError(`Invalid file type. Accepted: ${accept}`);
      return false;
    }
    if (file.size > MAX_SIZE) {
      setFileError('File too large. Max 5MB');
      return false;
    }
    return true;
  };

  const handleFile = useCallback((files) => {
    if (!files?.length) return;
    const file = files[0];
    if (!validateFile(file)) return;

    setFileError('');
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    if (multiple) {
      onChange?.({ target: { files } });
    } else {
      onChange?.({ target: { files, file } });
    }
  }, [onChange, multiple]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files);
  };

  const handleRemove = () => {
    setPreview(null);
    setFileError('');
    if (inputRef.current) inputRef.current.value = '';
    onChange?.({ target: { files: null, file: null, value: '' } });
    onRemove?.();
  };

  const hasExistingImage = typeof value === 'string' && value && !preview;

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-brand-ink">{label}</label>}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors ${
          dragOver ? 'border-brand-green bg-brand-pale/50' : 'border-gray-300 hover:border-brand-green hover:bg-gray-50'
        } ${error || fileError ? 'border-red-400 bg-red-50' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFile(e.target.files)}
          className="hidden"
        />

        {preview || hasExistingImage ? (
          <div className="relative inline-block">
            <img
              src={preview || value}
              alt="Preview"
              className="max-h-48 rounded-lg object-cover"
            />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleRemove(); }}
              className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-md border border-gray-200 text-brand-hot hover:bg-red-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-brand-gray">
            <Upload className="w-10 h-10" />
            <p className="text-sm font-medium">Drop files here or click to browse</p>
            <p className="text-xs">JPG, PNG, WebP, SVG up to 5MB</p>
          </div>
        )}
      </div>

      {(error || fileError) && (
        <p className="text-xs text-red-500">{error || fileError}</p>
      )}
      {helperText && !error && !fileError && (
        <p className="text-xs text-brand-gray">{helperText}</p>
      )}
    </div>
  );
}
