import bcrypt from 'bcryptjs'
import products from '../../../data/products.js'
import { connectDatabase, disconnectDatabase } from '../config/database.js'
import { env } from '../config/env.js'
import User from '../models/User.js'
import Product from '../models/Product.js'
import Category from '../models/Category.js'
import Setting from '../models/Setting.js'
import { defaultShippingRates } from '../../../data/pakistan-locations.js'

const categories = [
  { name: 'T-Shirts', slug: 'tshirts', description: 'Premium graphic, oversized and everyday T-shirts.', sections: ['men', 'women'], subcategories: ['Graphic Tees', 'Oversized Tees', 'Crop Tops', 'Half Sleeve'], subcategoryBadges: { 'Graphic Tees': 'NEW' }, sortOrder: 1 },
  { name: 'Hoodies', slug: 'hoodies', description: 'Comfortable hoodies and sweatshirts.', sections: ['men', 'women'], subcategories: ['Pullover', 'Zip Hoodie', 'Oversized Hoodie'], subcategoryBadges: { Pullover: 'NEW' }, sortOrder: 2 },
  { name: 'Accessories', slug: 'accessories', description: 'Caps, bags and everyday accessories.', sections: ['men', 'women', 'accessories'], subcategories: ['Caps', 'Tote Bags'], subcategoryBadges: {}, sortOrder: 3 },
]

async function seed() {
  await connectDatabase()

  await User.findOneAndUpdate(
    { email: env.adminEmail.toLowerCase() },
    {
      name: env.adminName,
      email: env.adminEmail.toLowerCase(),
      passwordHash: await bcrypt.hash(env.adminPassword, 12),
      role: 'admin',
      isActive: true,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  )

  for (const category of categories) {
    await Category.findOneAndUpdate({ slug: category.slug }, category, { upsert: true, new: true, setDefaultsOnInsert: true })
  }

  for (const product of products) {
    await Product.findOneAndUpdate(
      { slug: product.slug },
      {
        legacyId: String(product.id),
        ...product,
        purchasePrice: Math.round(product.price * 0.55),
        isOnSale: Number(product.originalPrice || 0) > Number(product.price),
        stock: 100,
        isFeatured: Number(product.id) <= 8,
        isActive: true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    )
  }

  await Setting.findOneAndUpdate(
    { key: 'store' },
    { value: { name: 'Komrez', currency: 'PKR', freeShippingThreshold: 2000, flatShipping: 250, shippingRates: defaultShippingRates } },
    { upsert: true, new: true },
  )

  console.log(`Seed complete: ${products.length} products, ${categories.length} categories, 1 admin.`)
  await disconnectDatabase()
}

seed().catch(async (error) => {
  console.error('Seed failed:', error)
  await disconnectDatabase()
  process.exit(1)
})
