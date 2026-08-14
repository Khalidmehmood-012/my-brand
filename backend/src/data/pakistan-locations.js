export const pakistanLocations = {
  'Islamabad Capital Territory': ['Islamabad'],
  Punjab: ['Ahmedpur East', 'Arifwala', 'Attock', 'Bahawalnagar', 'Bahawalpur', 'Bhakkar', 'Bhalwal', 'Burewala', 'Chakwal', 'Chichawatni', 'Chiniot', 'Daska', 'Dera Ghazi Khan', 'Faisalabad', 'Gojra', 'Gujranwala', 'Gujrat', 'Hafizabad', 'Jalalpur Jattan', 'Jaranwala', 'Jhang', 'Jhelum', 'Kamalia', 'Kamoke', 'Kasur', 'Khanewal', 'Kharian', 'Khushab', 'Kot Addu', 'Lahore', 'Layyah', 'Lodhran', 'Mandi Bahauddin', 'Mian Channu', 'Mianwali', 'Multan', 'Muridke', 'Muzaffargarh', 'Narowal', 'Okara', 'Pakpattan', 'Pattoki', 'Rahim Yar Khan', 'Rajanpur', 'Rawalpindi', 'Sadiqabad', 'Sahiwal', 'Sambrial', 'Sargodha', 'Sheikhupura', 'Sialkot', 'Toba Tek Singh', 'Vehari', 'Wazirabad'],
  Sindh: ['Badin', 'Dadu', 'Daharki', 'Ghotki', 'Hyderabad', 'Jacobabad', 'Jamshoro', 'Karachi', 'Kashmore', 'Khairpur', 'Kotri', 'Larkana', 'Matiari', 'Mirpur Khas', 'Moro', 'Nawabshah', 'Naushahro Feroze', 'Qambar', 'Sanghar', 'Sehwan', 'Shahdadkot', 'Shikarpur', 'Sukkur', 'Tando Adam', 'Tando Allahyar', 'Tando Muhammad Khan', 'Thatta', 'Umerkot'],
  'Khyber Pakhtunkhwa': ['Abbottabad', 'Bannu', 'Batkhela', 'Charsadda', 'Chitral', 'Dera Ismail Khan', 'Haripur', 'Karak', 'Kohat', 'Lakki Marwat', 'Mansehra', 'Mardan', 'Mingora', 'Nowshera', 'Parachinar', 'Peshawar', 'Swabi', 'Swat', 'Tank', 'Timergara'],
  Balochistan: ['Chaman', 'Dera Murad Jamali', 'Gwadar', 'Hub', 'Khuzdar', 'Loralai', 'Mastung', 'Nushki', 'Panjgur', 'Pasni', 'Quetta', 'Sibi', 'Turbat', 'Zhob'],
  'Azad Jammu and Kashmir': ['Bagh', 'Bhimber', 'Hajira', 'Kotli', 'Mirpur', 'Muzaffarabad', 'Neelum', 'Palandri', 'Rawalakot'],
  'Gilgit-Baltistan': ['Aliabad', 'Astore', 'Chilas', 'Gahkuch', 'Gilgit', 'Khaplu', 'Shigar', 'Skardu'],
}

export const defaultShippingRates = {
  'Islamabad Capital Territory': 180,
  Punjab: 220,
  Sindh: 250,
  'Khyber Pakhtunkhwa': 280,
  Balochistan: 350,
  'Azad Jammu and Kashmir': 320,
  'Gilgit-Baltistan': 400,
}

export function shippingFor(province, subtotal, store = {}) {
  const threshold = Number(store.freeShippingThreshold ?? 2000)
  if (threshold > 0 && subtotal >= threshold) return 0
  return Number(store.shippingRates?.[province] ?? defaultShippingRates[province] ?? store.flatShipping ?? 250)
}

