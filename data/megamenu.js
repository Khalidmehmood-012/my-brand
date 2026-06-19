const megaMenuData = {
  tshirts: {
    columns: [
      {
        heading: 'Shop By Style',
        links: [
          { name: 'All T-Shirts', href: '/collections/tshirts' },
          { name: 'Graphic Tees', href: '/collections/tshirts', badge: 'NEW' },
          { name: 'Oversized Tees', href: '/collections/tshirts' },
          { name: 'Plain Tees', href: '/collections/tshirts' },
          { name: 'Polo Shirts', href: '/collections/tshirts' },
        ],
      },
      {
        heading: 'Shop By Fit',
        links: [
          { name: 'Regular Fit', href: '/collections/tshirts' },
          { name: 'Slim Fit', href: '/collections/tshirts' },
          { name: 'Oversized Fit', href: '/collections/tshirts' },
          { name: 'Relaxed Fit', href: '/collections/tshirts' },
        ],
      },
      {
        heading: 'Shop By Color',
        links: [
          { name: 'Black', href: '/collections/tshirts' },
          { name: 'White', href: '/collections/tshirts' },
          { name: 'Grey', href: '/collections/tshirts' },
          { name: 'Navy Blue', href: '/collections/tshirts' },
        ],
      },
    ],
    images: [
      { src: '/images/banners/tshirts.jpg', label: 'New In', href: '/collections/tshirts' },
      { src: '/images/banners/tshirts.jpg', label: 'Best Sellers', href: '/collections/tshirts' },
    ],
  },

  hoodies: {
    columns: [
      {
        heading: 'Shop By Style',
        links: [
          { name: 'All Hoodies', href: '/collections/hoodies' },
          { name: 'Pullover Hoodies', href: '/collections/hoodies', badge: 'NEW' },
          { name: 'Zip Up Hoodies', href: '/collections/hoodies' },
          { name: 'Oversized Hoodies', href: '/collections/hoodies' },
        ],
      },
      {
        heading: 'Shop By Fabric',
        links: [
          { name: 'Fleece', href: '/collections/hoodies' },
          { name: 'Cotton', href: '/collections/hoodies' },
          { name: 'French Terry', href: '/collections/hoodies' },
          { name: 'Sherpa', href: '/collections/hoodies' },
        ],
      },
    ],
    // Hoodies pe sirf 2 columns, koi image nahi
    images: [],
  },

  accessories: {
    columns: [
      {
        heading: 'Headwear',
        links: [
          { name: 'All Caps', href: '/collections/accessories' },
          { name: 'Snapback Caps', href: '/collections/accessories', badge: 'NEW' },
          { name: 'Beanies', href: '/collections/accessories' },
          { name: 'Bucket Hats', href: '/collections/accessories' },
        ],
      },
      {
        heading: 'Bags',
        links: [
          { name: 'Tote Bags', href: '/collections/accessories' },
          { name: 'Backpacks', href: '/collections/accessories' },
          { name: 'Crossbody Bags', href: '/collections/accessories' },
          { name: 'Waist Bags', href: '/collections/accessories' },
        ],
      },
      {
        heading: 'Others',
        links: [
          { name: 'Socks', href: '/collections/accessories' },
          { name: 'Phone Cases', href: '/collections/accessories' },
          { name: 'Stickers', href: '/collections/accessories' },
          { name: 'Patches', href: '/collections/accessories' },
        ],
      },
    ],
    images: [
      { src: '/images/banners/accessories.jpg', label: 'Accessories', href: '/collections/accessories' },
    ],
  },

  sale: {
    columns: [
      {
        heading: 'Shop By Discount',
        links: [
          { name: 'All Sale Items', href: '/sale' },
          { name: 'Flat 30% Off', href: '/sale', badge: 'HOT' },
          { name: 'Flat 40% Off', href: '/sale', badge: 'HOT' },
        ],
      },
      {
        heading: 'Shop By Category',
        links: [
          { name: 'T-Shirts On Sale', href: '/sale' },
          { name: 'Hoodies On Sale', href: '/sale' },
          { name: 'Accessories On Sale', href: '/sale' },
        ],
      },
    ],
    // Sale pe koi image nahi — sirf chhota dropdown
    images: [],
  },
}

export default megaMenuData