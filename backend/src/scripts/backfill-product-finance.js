import { connectDatabase, disconnectDatabase } from '../config/database.js'
import Product from '../models/Product.js'

async function backfill() {
  await connectDatabase()
  const products = await Product.find({}).select('+purchasePrice')
  let updated = 0
  for (const product of products) {
    let changed = false
    if (!product.purchasePrice) {
      product.purchasePrice = Math.round(product.price * 0.55)
      changed = true
    }
    const shouldBeOnSale = product.originalPrice > product.price
    if (product.isOnSale !== shouldBeOnSale) {
      product.isOnSale = shouldBeOnSale
      changed = true
    }
    if (changed) { await product.save(); updated += 1 }
  }
  console.log(`Product finance backfill complete: ${updated} updated, ${products.length} checked.`)
  await disconnectDatabase()
}

backfill().catch(async (error) => { console.error('Product finance backfill failed:', error); await disconnectDatabase(); process.exit(1) })
