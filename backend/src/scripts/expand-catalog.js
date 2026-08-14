import { connectDatabase, disconnectDatabase } from '../config/database.js'
import Product from '../models/Product.js'
import Setting from '../models/Setting.js'
import Category from '../models/Category.js'
import { defaultShippingRates } from '../data/pakistan-locations.js'

const products = [
  { name: 'Urban Mono Hoodie', slug: 'urban-mono-hoodie', category: 'hoodies', gender: 'unisex', price: 3490, purchasePrice: 1850, image: 'https://images.unsplash.com/photo-1724763626380-ee4188fdcf6f?auto=format&fit=crop&w=1000&q=85', sizes: ['S','M','L','XL','2XL'], stock: 24, badge: 'NEW' },
  { name: 'Concrete Grey Hoodie', slug: 'concrete-grey-hoodie', category: 'hoodies', gender: 'men', price: 3290, purchasePrice: 1725, image: 'https://www.cruxclothingco.com/cdn/shop/files/dsc09980.jpg?v=1718622658', sizes: ['S','M','L','XL'], stock: 18, badge: 'NEW' },
  { name: 'Neighborhood Graphic Tee', slug: 'neighborhood-graphic-tee', category: 'tshirts', gender: 'unisex', price: 1890, purchasePrice: 920, image: 'https://feature.com/cdn/shop/articles/ED-1.jpg?v=1677525480', sizes: ['XS','S','M','L','XL'], stock: 32 },
  { name: 'Autumn Street Tee', slug: 'autumn-street-tee', category: 'tshirts', gender: 'women', price: 1790, purchasePrice: 875, image: 'https://thehundreds.com/cdn/shop/articles/d9dedc75-dadu_flat_13-scaled.jpg?v=1708026275&width=1200', sizes: ['XS','S','M','L','XL'], stock: 28, isFeatured: true },
  { name: 'Utility Crossbody Pack', slug: 'utility-crossbody-pack', category: 'accessories', gender: 'unisex', price: 2190, purchasePrice: 1100, image: 'https://www.realismclo.com/cdn/shop/files/Surrealism_Edit_5_27ffcd3a-d87c-4885-a389-35dd21c154bc.jpg?v=1748570864&width=960', sizes: ['One Size'], stock: 16 },
]

async function expand() {
  await connectDatabase()
  let inserted = 0
  for (const product of products) {
    const result = await Product.updateOne({ slug: product.slug }, { $setOnInsert: { ...product, images: [product.image], originalPrice: 0, isOnSale: false, isActive: true, description: 'A premium Komrez streetwear essential selected for the expanded collection.' } }, { upsert: true })
    inserted += result.upsertedCount
  }
  await Setting.updateOne({ key: 'payments' }, { $setOnInsert: { value: { methods: [
    { id: 'cod', name: 'Cash on Delivery', type: 'cod', enabled: true, instructions: 'Pay when your order arrives.' },
    { id: 'bank-primary', name: 'Bank Transfer', type: 'bank', enabled: true, bankName: 'Add bank name', accountTitle: 'Add account title', accountNumber: 'Add account number', instructions: 'Transfer the order total and upload a clear screenshot.' },
  ] }, description: 'Checkout payment methods' } }, { upsert: true })
  await Setting.updateOne({ key: 'hero' }, { $setOnInsert: { value: { slides: [
    { id: '1', title: 'New Collection is Here', subtitle: 'Street Style Redefined', buttonText: 'Shop Now', buttonLink: '/shop', image: '/images/banners/banner2.jpg' },
    { id: '2', title: 'Summer Sale is Live', subtitle: 'Selected styles at better prices', buttonText: 'Shop Sale', buttonLink: '/sale', image: '/images/banners/banner3.jpg' },
  ] }, description: 'Homepage hero slides' } }, { upsert: true })
  const storeSetting = await Setting.findOne({ key: 'store' })
  if (storeSetting) {
    storeSetting.value = { name: 'Komrez', currency: 'PKR', freeShippingThreshold: 2000, flatShipping: 250, ...storeSetting.value, shippingRates: { ...defaultShippingRates, ...storeSetting.value?.shippingRates } }
    storeSetting.markModified('value')
    await storeSetting.save()
  }
  await Category.updateMany({ slug: { $in: ['tshirts', 'hoodies'] } }, { $set: { sections: ['men', 'women'] } })
  await Category.updateMany({ slug: 'accessories' }, { $set: { sections: ['men', 'women', 'accessories'] } })
  await Category.updateMany({ $or: [{ sections: { $exists: false } }, { sections: { $size: 0 } }] }, { $set: { sections: ['men'] } })
  await Category.updateOne({ slug: 'tshirts' }, { $set: { label: '', sortOrder: 1, subcategories: ['Graphic Tees', 'Oversized Tees', 'Crop Tops', 'Half Sleeve'], subcategoryBadges: { 'Graphic Tees': 'NEW' } } })
  await Category.updateOne({ slug: 'hoodies' }, { $set: { label: '', sortOrder: 2, subcategories: ['Pullover', 'Zip Hoodie', 'Oversized Hoodie'], subcategoryBadges: { Pullover: 'NEW' } } })
  await Category.updateOne({ slug: 'accessories' }, { $set: { label: '', sortOrder: 3, subcategories: ['Caps', 'Tote Bags'], subcategoryBadges: {} } })
  console.log(`Catalog expansion complete: ${inserted} new products inserted, ${products.length} checked.`)
  await disconnectDatabase()
}

expand().catch(async (error) => { console.error('Catalog expansion failed:', error); await disconnectDatabase(); process.exit(1) })
