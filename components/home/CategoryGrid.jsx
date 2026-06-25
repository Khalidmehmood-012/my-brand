// import Link from 'next/link'
// import categories from '@/data/categories'

// export default function CategoryGrid() {
//   return (
//     <section className="max-w-7xl mx-auto px-4 py-12">

//       {/* Heading */}
//       <h2 className="text-2xl font-bold uppercase tracking-widest text-center mb-8">
//         Shop By Category
//       </h2>

//       {/* Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//         {categories.map((category) => (
//           <Link
//             key={category.id}
//             href={`/collections/${category.slug}`}
//             className="group relative rounded-2xl overflow-hidden aspect-square bg-gray-100"
//           >
//             {/* Image */}
//             <img
//               src={category.image}
//               alt={category.name}
//               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//             />

//             {/* Overlay */}
//             <div className="absolute inset-0  bg-opacity-30 group-hover:bg-opacity-40 transition" />

//             {/* Label */}
//             <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
//               <h3 className="text-2xl font-bold uppercase tracking-widest">
//                 {category.name}
//               </h3>
//               <span className="mt-2 text-sm border border-white px-4 py-1 rounded-full group-hover:bg-white group-hover:text-black transition">
//                 Shop Now
//               </span>
//             </div>

//           </Link>
//         ))}
//       </div>

//     </section>
//   )
// }

import Link from 'next/link'
import categories from '@/data/categories'

export default function CategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">

      {/* Heading */}
      <div className="border-b-2 border-black pb-4 mb-10">
        <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-widest text-black text-center">
          Shop By Category
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/collections/${category.slug}`}
            className="group relative rounded-2xl overflow-hidden aspect-square bg-black border-2 border-black hover:shadow-2xl transition-all duration-300"
          >
            {/* Image */}
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />

            {/* Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-widest drop-shadow-lg">
                {category.name}
              </h3>
              <span className="mt-3 text-sm font-bold uppercase tracking-wider border-2 border-white px-6 py-2 rounded-full group-hover:bg-white group-hover:text-black transition-all duration-300">
                Shop Now
              </span>
            </div>

          </Link>
        ))}
      </div>

    </section>
  )
}