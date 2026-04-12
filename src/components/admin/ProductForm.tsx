'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2, X, ImagePlus, Save } from 'lucide-react'

type Translation = { name: string; description: string; long_description: string }
type Translations = { es: Translation; en: Translation; pt: Translation }
type Flavor = { flavor_key: string; is_signature: boolean }

interface Props {
  product?: any
  translations?: any[]
  flavors?: any[]
}

const LOCALES = [
  { key: 'es', label: '🇪🇸 Español' },
  { key: 'en', label: '🇬🇧 English' },
  { key: 'pt', label: '🇵🇹 Português' },
]

const FLAVOR_OPTIONS = [
  'dulce-leche', 'chocolate', 'limon', 'framboesa', 'cafe', 'pistacio', 'flor-sal', 'trufa'
]

const emptyTranslation = (): Translation => ({ name: '', description: '', long_description: '' })

export default function ProductForm({ product, translations = [], flavors = [] }: Props) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [activeLocale, setActiveLocale] = useState<'es' | 'en' | 'pt'>('es')
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [imagePreview, setImagePreview] = useState<string>(product?.image_url ?? '')
  const [imageFile, setImageFile] = useState<File | null>(null)

  const [fields, setFields] = useState({
    slug:        product?.slug        ?? '',
    price:       product?.price       ? (product.price / 100).toFixed(2) : '',
    pieces:      product?.pieces      ?? '',
    weight:      product?.weight      ?? '',
    ingredients: product?.ingredients ?? '',
    available:   product?.available   ?? true,
    is_featured: product?.is_featured ?? true,
    badge:       product?.badge       ?? '',
  })

  const [trans, setTrans] = useState<Translations>({
    es: translations.find(t => t.locale === 'es') ?? emptyTranslation(),
    en: translations.find(t => t.locale === 'en') ?? emptyTranslation(),
    pt: translations.find(t => t.locale === 'pt') ?? emptyTranslation(),
  })

  const [productFlavors, setProductFlavors] = useState<Flavor[]>(
    flavors.map(f => ({ flavor_key: f.flavor_key, is_signature: f.is_signature }))
  )

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const toggleFlavor = (key: string) => {
    setProductFlavors(prev => {
      const exists = prev.find(f => f.flavor_key === key)
      if (exists) return prev.filter(f => f.flavor_key !== key)
      return [...prev, { flavor_key: key, is_signature: false }]
    })
  }

  const setSignature = (key: string) => {
    setProductFlavors(prev => prev.map(f => ({ ...f, is_signature: f.flavor_key === key })))
  }

  const handleSave = async () => {
    setStatus('saving')
    setErrorMsg('')
    const supabase = createClient()

    let imageUrl = fields.slug ? `/images/packs/${fields.slug}.jpg` : imagePreview

    // Upload image if new file selected
    if (imageFile) {
      const ext = imageFile.name.split('.').pop()
      const path = `products/${fields.slug}-${Date.now()}.${ext}`
      const { error: uploadErr } = await supabase.storage
        .from('product-images')
        .upload(path, imageFile, { upsert: true })

      if (uploadErr) {
        setErrorMsg('Image upload failed: ' + uploadErr.message)
        setStatus('error')
        return
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(path)
      imageUrl = publicUrl
    }

    const priceInCents = Math.round(parseFloat(fields.price) * 100)

    const productData = {
      slug:        fields.slug,
      price:       priceInCents,
      pieces:      Number(fields.pieces),
      weight:      fields.weight,
      ingredients: fields.ingredients,
      available:   fields.available,
      is_featured: fields.is_featured,
      badge:       fields.badge || null,
      image_url:   imageUrl,
    }

    let productId = product?.id

    if (productId) {
      // Update existing
      const { error } = await supabase.from('products').update(productData).eq('id', productId)
      if (error) { setErrorMsg(error.message); setStatus('error'); return }
    } else {
      // Create new
      const { data, error } = await supabase.from('products').insert(productData).select().single()
      if (error || !data) { setErrorMsg(error?.message ?? 'Error'); setStatus('error'); return }
      productId = data.id
    }

    // Upsert translations
    for (const locale of ['es', 'en', 'pt'] as const) {
      const t = trans[locale]
      await supabase.from('product_translations').upsert({
        product_id: productId, locale, ...t
      }, { onConflict: 'product_id,locale' })
    }

    // Upsert flavors: delete all then reinsert
    await supabase.from('product_flavors').delete().eq('product_id', productId)
    if (productFlavors.length > 0) {
      await supabase.from('product_flavors').insert(
        productFlavors.map((f, i) => ({ product_id: productId, ...f, sort_order: i }))
      )
    }

    router.push('/admin/products')
    router.refresh()
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-dark-brown">
            {product ? 'Edit Product' : 'New Product'}
          </h1>
          <p className="text-sm text-text-muted font-sans mt-1">
            {product ? `Editing: ${product.slug}` : 'Add a new product to the catalog'}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={status === 'saving'}
          className="flex items-center gap-2 bg-dark-brown text-cream font-sans font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-dark-brown/90 transition-all disabled:opacity-50"
        >
          {status === 'saving' ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {status === 'saving' ? 'Saving...' : 'Save Product'}
        </button>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-sans">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Image + Base fields */}
        <div className="lg:col-span-1 space-y-5">
          {/* Image upload */}
          <div className="bg-white rounded-xl border border-border-light p-5 shadow-sm">
            <p className="text-xs font-sans font-semibold text-dark-brown uppercase tracking-wider mb-3">Product Image</p>
            <div
              onClick={() => fileRef.current?.click()}
              className="relative aspect-square rounded-xl border-2 border-dashed border-border-light bg-warm-white hover:border-dark-brown/30 transition-colors cursor-pointer overflow-hidden flex items-center justify-center"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <ImagePlus size={28} className="mx-auto text-text-muted mb-2" strokeWidth={1.5} />
                  <p className="text-xs text-text-muted font-sans">Click to upload</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
            {imagePreview && (
              <button onClick={() => { setImagePreview(''); setImageFile(null) }} className="mt-2 text-xs text-red-500 font-sans flex items-center gap-1 hover:underline">
                <X size={12} /> Remove image
              </button>
            )}
          </div>

          {/* Status toggles */}
          <div className="bg-white rounded-xl border border-border-light p-5 shadow-sm space-y-4">
            <p className="text-xs font-sans font-semibold text-dark-brown uppercase tracking-wider">Visibility</p>
            {[
              { key: 'available', label: 'Available for sale' },
              { key: 'is_featured', label: 'Show on homepage' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-sans text-text-secondary">{label}</span>
                <div
                  onClick={() => setFields(p => ({ ...p, [key]: !p[key as keyof typeof p] }))}
                  className={`w-10 h-5 rounded-full transition-colors relative ${fields[key as keyof typeof fields] ? 'bg-dark-brown' : 'bg-border'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${fields[key as keyof typeof fields] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
              </label>
            ))}

            <div>
              <label className="block text-xs font-sans font-semibold text-dark-brown uppercase tracking-wider mb-2">Badge</label>
              <select
                value={fields.badge}
                onChange={e => setFields(p => ({ ...p, badge: e.target.value }))}
                className="w-full px-3 py-2 bg-warm-white border border-border rounded-lg font-sans text-sm text-dark-brown"
              >
                <option value="">No badge</option>
                <option value="mostPopular">⭐ Most Popular</option>
                <option value="limitedEdition">🏷️ Limited Edition</option>
              </select>
            </div>
          </div>
        </div>

        {/* RIGHT: Main fields + translations */}
        <div className="lg:col-span-2 space-y-5">
          {/* Base fields */}
          <div className="bg-white rounded-xl border border-border-light p-6 shadow-sm">
            <p className="text-xs font-sans font-semibold text-dark-brown uppercase tracking-wider mb-5">Product Details</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-sans font-semibold text-dark-brown mb-2 uppercase tracking-wider">Slug (URL)</label>
                <input type="text" value={fields.slug} onChange={e => setFields(p => ({ ...p, slug: e.target.value }))}
                  placeholder="classic-6"
                  className="w-full px-4 py-2.5 bg-warm-white border border-border rounded-lg font-sans text-sm text-dark-brown" />
              </div>
              <div>
                <label className="block text-xs font-sans font-semibold text-dark-brown mb-2 uppercase tracking-wider">Price (€)</label>
                <input type="number" step="0.01" value={fields.price} onChange={e => setFields(p => ({ ...p, price: e.target.value }))}
                  placeholder="18.90"
                  className="w-full px-4 py-2.5 bg-warm-white border border-border rounded-lg font-sans text-sm text-dark-brown" />
              </div>
              <div>
                <label className="block text-xs font-sans font-semibold text-dark-brown mb-2 uppercase tracking-wider">Pieces</label>
                <input type="number" value={fields.pieces} onChange={e => setFields(p => ({ ...p, pieces: e.target.value }))}
                  placeholder="6"
                  className="w-full px-4 py-2.5 bg-warm-white border border-border rounded-lg font-sans text-sm text-dark-brown" />
              </div>
              <div>
                <label className="block text-xs font-sans font-semibold text-dark-brown mb-2 uppercase tracking-wider">Weight</label>
                <input type="text" value={fields.weight} onChange={e => setFields(p => ({ ...p, weight: e.target.value }))}
                  placeholder="180g"
                  className="w-full px-4 py-2.5 bg-warm-white border border-border rounded-lg font-sans text-sm text-dark-brown" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-sans font-semibold text-dark-brown mb-2 uppercase tracking-wider">Ingredients</label>
                <input type="text" value={fields.ingredients} onChange={e => setFields(p => ({ ...p, ingredients: e.target.value }))}
                  placeholder="Farinha de trigo, manteiga..."
                  className="w-full px-4 py-2.5 bg-warm-white border border-border rounded-lg font-sans text-sm text-dark-brown" />
              </div>
            </div>
          </div>

          {/* Flavors */}
          <div className="bg-white rounded-xl border border-border-light p-6 shadow-sm">
            <p className="text-xs font-sans font-semibold text-dark-brown uppercase tracking-wider mb-4">Flavors</p>
            <div className="flex flex-wrap gap-2">
              {FLAVOR_OPTIONS.map(key => {
                const selected = productFlavors.find(f => f.flavor_key === key)
                const isSignature = selected?.is_signature
                return (
                  <div key={key} className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => toggleFlavor(key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-sans font-semibold transition-all ${
                        selected ? 'bg-dark-brown text-cream' : 'bg-warm-white border border-border text-text-muted hover:border-dark-brown/40'
                      }`}
                    >
                      {key}
                    </button>
                    {selected && (
                      <button
                        type="button"
                        onClick={() => setSignature(key)}
                        title="Set as signature"
                        className={`p-1 rounded-full text-xs transition-colors ${isSignature ? 'text-warm-gold' : 'text-text-muted hover:text-warm-gold'}`}
                      >
                        ★
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
            <p className="text-[10px] text-text-muted font-sans mt-3">★ = signature flavor</p>
          </div>

          {/* Translations */}
          <div className="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden">
            {/* Locale tabs */}
            <div className="flex border-b border-border-light">
              {LOCALES.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveLocale(key as any)}
                  className={`flex-1 py-3.5 text-xs font-sans font-semibold uppercase tracking-wider transition-colors ${
                    activeLocale === key
                      ? 'bg-white text-dark-brown border-b-2 border-dark-brown -mb-px'
                      : 'bg-warm-white text-text-muted hover:text-dark-brown'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="p-6 space-y-4">
              {(['name', 'description', 'long_description'] as const).map(field => (
                <div key={field}>
                  <label className="block text-xs font-sans font-semibold text-dark-brown mb-2 uppercase tracking-wider">
                    {field.replace('_', ' ')}
                  </label>
                  {field === 'long_description' ? (
                    <textarea
                      rows={4}
                      value={trans[activeLocale][field]}
                      onChange={e => setTrans(prev => ({
                        ...prev,
                        [activeLocale]: { ...prev[activeLocale], [field]: e.target.value }
                      }))}
                      className="w-full px-4 py-2.5 bg-warm-white border border-border rounded-lg font-sans text-sm text-dark-brown resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={trans[activeLocale][field]}
                      onChange={e => setTrans(prev => ({
                        ...prev,
                        [activeLocale]: { ...prev[activeLocale], [field]: e.target.value }
                      }))}
                      className="w-full px-4 py-2.5 bg-warm-white border border-border rounded-lg font-sans text-sm text-dark-brown"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
