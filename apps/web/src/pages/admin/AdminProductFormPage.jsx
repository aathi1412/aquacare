import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../services/api.js';
import { useToastStore } from '../../stores/toastStore.js';
import FormField from '../../components/common/FormField.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  RotateCw,
  Star,
} from 'lucide-react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

export default function AdminProductFormPage() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { addToast } = useToastStore();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [purificationTechnology, setPurificationTechnology] = useState('RO + UV + UF');
  const [capacity, setCapacity] = useState('10 Liters');
  const [warranty, setWarranty] = useState('1 Year Comprehensive Warranty');
  const [installationInfo, setInstallationInfo] = useState('Free standard installation included.');
  const [price, setPrice] = useState('');
  const [priceDisplayMode, setPriceDisplayMode] = useState('request_price');
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  // Dynamic Features List
  const [features, setFeatures] = useState([
    '7-Stage RO + UV + UF Multi-filtration',
    'Real-time Digital TDS & Filter Life Monitor',
  ]);
  const [newFeatureText, setNewFeatureText] = useState('');

  // Dynamic Specifications
  const [specifications, setSpecifications] = useState([
    { key: 'Purification Technology', value: 'RO + UV + UF' },
    { key: 'Storage Capacity', value: '10 Liters' },
  ]);
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  // Gallery Images List
  const [images, setImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageAlt, setNewImageAlt] = useState('');

  // 360 Viewer Configuration
  const [threeSixtyEnabled, setThreeSixtyEnabled] = useState(false);
  const [threeSixtySensitivity, setThreeSixtySensitivity] = useState(1);
  const [threeSixtyFrames, setThreeSixtyFrames] = useState([]);
  const [newFrameUrl, setNewFrameUrl] = useState('');

  // Auto-slugify product name if slug is untouched
  const handleNameChange = (val) => {
    setName(val);
    if (!isEditMode && !slug) {
      setSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[\s\W-]+/g, '-')
          .replace(/^-+|-+$/g, '')
      );
    }
  };

  // Load Categories & Product Data
  useEffect(() => {
    async function loadData() {
      try {
        const catRes = await api.get('/categories/admin/all');
        setCategories(catRes.data || []);
        if (catRes.data?.length > 0 && !category) {
          setCategory(catRes.data[0]._id);
        }

        if (isEditMode) {
          const prodRes = await api.get(`/products/admin/${id}`);
          const p = prodRes.data;
          setName(p.name || '');
          setSlug(p.slug || '');
          setCategory(p.category?._id || p.category || '');
          setShortDescription(p.shortDescription || '');
          setFullDescription(p.fullDescription || '');
          setPurificationTechnology(p.purificationTechnology || '');
          setCapacity(p.capacity || '');
          setWarranty(p.warranty || '');
          setInstallationInfo(p.installationInfo || '');
          setPrice(p.price !== null && p.price !== undefined ? p.price : '');
          setPriceDisplayMode(p.priceDisplayMode || 'request_price');
          setIsPublished(p.isPublished !== undefined ? p.isPublished : true);
          setIsFeatured(p.isFeatured || false);
          setFeatures(p.features || []);
          setSpecifications(p.specifications || []);
          setImages(p.images || []);
          setThreeSixtyEnabled(Boolean(p.threeSixty?.isEnabled));
          setThreeSixtySensitivity(p.threeSixty?.sensitivity || 1);
          setThreeSixtyFrames(p.threeSixty?.frames || []);
        }
      } catch (err) {
        addToast({ type: 'error', message: err.message || 'Failed to load details.' });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, isEditMode]);

  // Add Feature
  const handleAddFeature = () => {
    if (newFeatureText.trim()) {
      setFeatures([...features, newFeatureText.trim()]);
      setNewFeatureText('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  // Add Specification
  const handleAddSpec = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setSpecifications([...specifications, { key: newSpecKey.trim(), value: newSpecValue.trim() }]);
      setNewSpecKey('');
      setNewSpecValue('');
    }
  };

  const handleRemoveSpec = (index) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  // Gallery Management
  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    const isFirst = images.length === 0;
    const newImg = {
      url: newImageUrl.trim(),
      alt: newImageAlt.trim() || `${name} photo`,
      isPrimary: isFirst,
      order: images.length + 1,
    };
    setImages([...images, newImg]);
    setNewImageUrl('');
    setNewImageAlt('');
  };

  const handleSetPrimaryImage = (index) => {
    setImages(
      images.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };

  const handleRemoveImage = (index) => {
    const updated = images.filter((_, i) => i !== index);
    if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
      updated[0].isPrimary = true;
    }
    setImages(updated);
  };

  // 360 Frames Management
  const handleAddFrame = () => {
    if (!newFrameUrl.trim()) return;
    const newFrame = {
      url: newFrameUrl.trim(),
      order: threeSixtyFrames.length + 1,
      publicId: `frame_${threeSixtyFrames.length + 1}`,
    };
    setThreeSixtyFrames([...threeSixtyFrames, newFrame]);
    setNewFrameUrl('');
  };

  const handleRemoveFrame = (index) => {
    const updated = threeSixtyFrames.filter((_, i) => i !== index).map((f, i) => ({
      ...f,
      order: i + 1,
    }));
    setThreeSixtyFrames(updated);
  };

  // Save Product Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast({ type: 'error', message: 'Product name is required.' });
      return;
    }
    if (!category) {
      addToast({ type: 'error', message: 'Category is required.' });
      return;
    }
    if (!shortDescription.trim()) {
      addToast({ type: 'error', message: 'Short description is required.' });
      return;
    }

    setSaving(true);
    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      category,
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription.trim(),
      purificationTechnology: purificationTechnology.trim(),
      capacity: capacity.trim(),
      warranty: warranty.trim(),
      installationInfo: installationInfo.trim(),
      price: price !== '' ? Number(price) : null,
      priceDisplayMode,
      isPublished,
      isFeatured,
      features,
      specifications,
      images,
      threeSixty: {
        isEnabled: threeSixtyEnabled,
        frames: threeSixtyFrames,
        frameCount: threeSixtyFrames.length,
        sensitivity: Number(threeSixtySensitivity),
      },
    };

    try {
      if (isEditMode) {
        await api.put(`/products/admin/${id}`, payload);
        addToast({ type: 'success', message: 'Product updated successfully.' });
      } else {
        await api.post('/products/admin', payload);
        addToast({ type: 'success', message: 'Product created successfully.' });
      }
      navigate('/admin/products');
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Failed to save product.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading product data..." fullScreen />;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-5xl">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isEditMode ? `Edit Purifier: ${name}` : 'Add New Water Purifier'}
            </h2>
            <p className="text-xs text-slate-500">
              Configure catalogue info, specifications, gallery images, and 360 viewer sequence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            component={Link}
            to="/admin/products"
            variant="outlined"
            size="small"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            size="small"
            disabled={saving}
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <Save className="w-4 h-4" />}
            sx={{ backgroundColor: '#0284c7', '&:hover': { backgroundColor: '#0369a1' } }}
          >
            {saving ? 'Saving...' : 'Save Product'}
          </Button>
        </div>
      </div>

      {/* 1. Basic Information Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 mb-2">1. Basic Information</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Product Name" required>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. AquaCare Grand RO + UV"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500"
            />
          </FormField>

          <FormField label="URL Slug" required helperText="Unique URL identifier">
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. aquacare-grand-ro-uv"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-brand-500"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="Category Assignment" required>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-brand-500"
            >
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Pricing Display Mode">
            <select
              value={priceDisplayMode}
              onChange={(e) => setPriceDisplayMode(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-brand-500"
            >
              <option value="request_price">Request Price (Custom Quote)</option>
              <option value="show_price">Display Public Price</option>
              <option value="hidden">Hide Price Completely</option>
            </select>
          </FormField>

          <FormField label="Price (₹ INR, Optional)">
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 14999"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500"
            />
          </FormField>
        </div>

        <FormField label="Short Description" required helperText="Displayed on product cards & overview">
          <textarea
            rows={2}
            required
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="Brief summary of purification technology and benefits..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 resize-none"
          />
        </FormField>

        <FormField label="Full Description / Overview">
          <textarea
            rows={4}
            value={fullDescription}
            onChange={(e) => setFullDescription(e.target.value)}
            placeholder="Comprehensive description of the product, internal filter stages, and advantages..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500"
          />
        </FormField>

        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <span>Published on website</span>
          </label>

          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <span>Showcase as Featured Product</span>
          </label>
        </div>
      </div>

      {/* 2. Technical Details & Warranty */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 mb-2">2. Specifications & Warranty</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Purification Technology">
            <input
              type="text"
              value={purificationTechnology}
              onChange={(e) => setPurificationTechnology(e.target.value)}
              placeholder="e.g. RO + UV + UF + Alkaline"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
            />
          </FormField>

          <FormField label="Capacity / Output Flow">
            <input
              type="text"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="e.g. 10 Liters Tank / 20 LPH"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Warranty Details">
            <input
              type="text"
              value={warranty}
              onChange={(e) => setWarranty(e.target.value)}
              placeholder="e.g. 1 Year Comprehensive Warranty"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
            />
          </FormField>

          <FormField label="Installation Policy">
            <input
              type="text"
              value={installationInfo}
              onChange={(e) => setInstallationInfo(e.target.value)}
              placeholder="e.g. Free standard certified installation included."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
            />
          </FormField>
        </div>

        {/* Dynamic Key Features */}
        <div className="pt-4 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
            Key Features (Bullet Points)
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newFeatureText}
              onChange={(e) => setNewFeatureText(e.target.value)}
              placeholder="Add key feature (e.g. Smart Auto-Flush System)..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
            />
            <Button
              variant="outlined"
              onClick={handleAddFeature}
              size="small"
              startIcon={<Plus className="w-4 h-4" />}
            >
              Add
            </Button>
          </div>

          <div className="space-y-1.5">
            {features.map((feat, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs sm:text-sm">
                <span>{feat}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(i)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Specifications Table */}
        <div className="pt-4 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
            Detailed Technical Specifications
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-3">
            <input
              type="text"
              value={newSpecKey}
              onChange={(e) => setNewSpecKey(e.target.value)}
              placeholder="Spec Name (e.g. Body Material)"
              className="sm:col-span-2 px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
            />
            <input
              type="text"
              value={newSpecValue}
              onChange={(e) => setNewSpecValue(e.target.value)}
              placeholder="Value (e.g. Food Grade ABS)"
              className="sm:col-span-2 px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
            />
            <Button
              variant="outlined"
              onClick={handleAddSpec}
              size="small"
              startIcon={<Plus className="w-4 h-4" />}
            >
              Add Spec
            </Button>
          </div>

          <div className="space-y-1.5">
            {specifications.map((spec, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs sm:text-sm">
                <div>
                  <strong className="text-slate-900">{spec.key}:</strong>{' '}
                  <span className="text-slate-600">{spec.value}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSpec(i)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Image Gallery Management */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">3. Multi-Image Gallery</h3>
          <span className="text-xs text-slate-400">{images.length} Image(s) added</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          <input
            type="url"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="Image URL (e.g. Cloudinary or HTTPS asset)..."
            className="sm:col-span-3 px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
          />
          <input
            type="text"
            value={newImageAlt}
            onChange={(e) => setNewImageAlt(e.target.value)}
            placeholder="Descriptive alt text"
            className="sm:col-span-1 px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
          />
          <Button
            variant="contained"
            onClick={handleAddImage}
            size="small"
            startIcon={<Plus className="w-4 h-4" />}
            sx={{ backgroundColor: '#0284c7' }}
          >
            Add Image
          </Button>
        </div>

        {/* Gallery thumbnails list with Primary selection */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            {images.map((img, i) => (
              <div
                key={i}
                className={`relative group rounded-2xl border p-2 flex flex-col items-center bg-slate-50 transition ${img.isPrimary ? 'border-brand-500 ring-2 ring-brand-300' : 'border-slate-200'
                  }`}
              >
                <div className="w-full aspect-square bg-white rounded-xl overflow-hidden p-2 flex items-center justify-center mb-2">
                  <img src={img.url} alt={img.alt} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="text-[11px] text-slate-500 text-center truncate w-full px-1">
                  {img.alt || `Photo ${i + 1}`}
                </div>

                <div className="flex items-center justify-between w-full mt-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleSetPrimaryImage(i)}
                    className={`text-[10px] font-bold flex items-center gap-1 ${img.isPrimary ? 'text-brand-600' : 'text-slate-400 hover:text-slate-700'
                      }`}
                  >
                    <Star className="w-3 h-3" />
                    <span>{img.isPrimary ? 'Primary' : 'Make Primary'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. 360-Degree Viewer Sequence */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <RotateCw className="w-4 h-4 text-brand-600" />
              <span>4. Interactive 360-Degree Frame Sequence</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Provide ordered rotational frames for horizontal mouse drag / swipe 360 viewer
            </p>
          </div>

          <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={threeSixtyEnabled}
              onChange={(e) => setThreeSixtyEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <span>Enable 360° Viewer</span>
          </label>
        </div>

        {threeSixtyEnabled && (
          <div className="pt-4 border-t border-slate-100 space-y-4 animate-in fade-in">
            <div className="flex items-center gap-4">
              <FormField label="Rotation Drag Sensitivity (0.5 to 2.0)" className="w-64">
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="3"
                  value={threeSixtySensitivity}
                  onChange={(e) => setThreeSixtySensitivity(e.target.value)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-sm"
                />
              </FormField>

              <div className="text-xs text-slate-500 pt-5">
                Total Frames: <strong className="text-slate-900">{threeSixtyFrames.length}</strong>
              </div>
            </div>

            {/* Add Frame URL */}
            <div className="flex gap-2">
              <input
                type="url"
                value={newFrameUrl}
                onChange={(e) => setNewFrameUrl(e.target.value)}
                placeholder="Rotational Frame Image URL..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
              />
              <Button
                variant="outlined"
                onClick={handleAddFrame}
                size="small"
                startIcon={<Plus className="w-4 h-4" />}
              >
                Add Frame
              </Button>
            </div>

            {/* Frames Strip */}
            {threeSixtyFrames.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-3 pt-2">
                {threeSixtyFrames.map((frame, i) => (
                  <div
                    key={i}
                    className="relative w-20 h-24 bg-slate-50 rounded-xl border border-slate-200 p-1 shrink-0 flex flex-col items-center justify-between"
                  >
                    <img src={frame.url} alt={`Frame ${i + 1}`} className="w-full h-14 object-contain" />
                    <div className="flex items-center justify-between w-full px-1 text-[10px] text-slate-500 font-bold">
                      <span>#{frame.order || i + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFrame(i)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Save Button Bottom */}
      <div className="flex justify-end gap-3 pt-4">
        <Button component={Link} to="/admin/products" variant="outlined">
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={saving}
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <Save className="w-4 h-4" />}
          sx={{ backgroundColor: '#0284c7', px: 4 }}
        >
          {saving ? 'Saving...' : 'Save & Publish'}
        </Button>
      </div>
    </form>
  );
}
