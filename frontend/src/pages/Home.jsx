import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button.jsx";

const categories = [
  { name: "Jewelry", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80" },
  { name: "Decor", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" },
  { name: "Clothing", img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80" },
  { name: "Art", img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80" },
];

const whyHandmade = [
  { title: "Unique Gifts", desc: "Every item is one-of-a-kind and made with love." },
  { title: "Support Artisans", desc: "Your purchase empowers local creators." },
  { title: "Quality Craftsmanship", desc: "Handmade means attention to detail and quality." },
];

const heroVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.8,
      ease: "easeOut",
    },
  }),
};

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full">
      {/* Full-Screen Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-desi-primary/20 via-desi-accent/10 to-white relative px-4">
        <motion.h1
          className="font-brand text-4xl md:text-6xl font-bold text-desi-primary mb-6 text-center drop-shadow-lg"
          initial="hidden"
          animate="visible"
          variants={heroVariants}
          custom={1}
        >
          Handmade with Love, From Artisans to You
        </motion.h1>
        <motion.p
          className="text-desi-secondary text-lg md:text-2xl mb-8 text-center max-w-2xl"
          initial="hidden"
          animate="visible"
          variants={heroVariants}
          custom={2}
        >
          Explore curated, handcrafted treasures for your home & soul.
        </motion.p>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={heroVariants}
          custom={3}
        >
          <button
            className="bg-orange-300 text-white px-10 py-4 rounded-xl font-brand text-lg md:text-xl shadow-lg hover:bg-orange-400 transition-colors duration-200 scale-100 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-desi-accent mt-6"
            onClick={() => navigate('/products')}
          >
            Shop Now
          </button>
        </motion.div>
      </section>

      {/* Shop by Category Section */}
      <section className="max-w-7xl mx-auto py-20 px-4">
        <motion.h2
          className="font-brand text-2xl md:text-3xl font-bold text-desi-secondary mb-10 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          Shop by Category
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              className="rounded-xl shadow-lg overflow-hidden bg-white flex flex-col items-center p-6 cursor-pointer border-2 border-transparent hover:border-desi-primary transition-all duration-200 min-h-[220px] group"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.7, ease: 'easeOut' }}
            >
              <img src={cat.img} alt={cat.name} className="h-24 w-24 object-cover rounded-full mb-4 border-4 border-desi-accent group-hover:border-desi-primary transition-all duration-200" onError={e => e.target.style.display='none'} />
              <span className="font-semibold text-desi-primary text-lg mt-2 font-brand tracking-wide">{cat.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Artisan Spotlight Section */}
      <section className="max-w-7xl mx-auto py-20 px-4 flex flex-col md:flex-row items-center gap-12">
        <motion.div
          className="flex-1 w-full"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <img
            src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80"
            alt="Artisan at work"
            className="rounded-3xl shadow-xl w-full max-w-md mx-auto object-cover"
          />
        </motion.div>
        <motion.div
          className="flex-1 w-full text-center md:text-left"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        >
          <h3 className="font-brand text-2xl text-desi-primary font-bold mb-4">Artisan Spotlight</h3>
          <blockquote className="text-xl md:text-2xl text-desi-secondary italic mb-4">“Every piece I create carries a story, a tradition, and a part of my heart. Thank you for supporting handmade.”</blockquote>
          <div className="text-desi-accent font-semibold">— Priya, Textile Artisan</div>
        </motion.div>
      </section>

      {/* Featured Products */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-7xl mx-auto py-12 px-4"
      >
        <h2 className="font-brand text-2xl md:text-3xl font-bold text-desi-secondary mb-8 text-center">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { name: 'Handmade Necklace', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', price: '₹799' },
            { name: 'Decor Vase', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80', price: '₹599' },
            { name: 'Cotton Kurta', img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80', price: '₹999' },
            { name: 'Canvas Art', img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80', price: '₹1299' },
          ].map((prod) => (
            <motion.div
              key={prod.name}
              whileHover={{ scale: 1.04 }}
              className="rounded-xl shadow-lg overflow-hidden bg-white flex flex-col items-center p-4 hover:shadow-xl transition-shadow duration-200 min-h-[260px]"
            >
              <img src={prod.img} alt={prod.name} className="h-32 w-full object-cover rounded-lg mb-3" onError={e => e.target.style.display='none'} />
              <span className="font-semibold text-desi-primary text-lg mt-2">{prod.name}</span>
              <span className="text-desi-accent font-medium mt-1">{prod.price}</span>
              <button className="mt-3 px-4 py-2 bg-desi-primary text-white rounded-lg font-medium hover:bg-desi-accent transition-colors duration-200">View</button>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Why Shop Handmade Section */}
      <section className="max-w-7xl mx-auto py-20 px-4">
        <motion.h2
          className="font-brand text-2xl md:text-3xl font-bold text-desi-secondary mb-10 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          Why Shop Handmade?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: '🎨',
              title: 'Support Local Artists',
              desc: 'Your purchase empowers real artisans and keeps traditions alive.'
            },
            {
              icon: '✨',
              title: 'One-of-a-Kind Pieces',
              desc: 'Every item is unique, crafted with care and creativity.'
            },
            {
              icon: '🌱',
              title: 'Sustainable Gifting',
              desc: 'Handmade means thoughtful, eco-friendly, and meaningful gifts.'
            }
          ].map((item, i) => (
            <motion.div
              key={item.title}
              className="rounded-xl bg-white shadow-lg p-8 text-center flex flex-col items-center min-h-[200px] border-2 border-transparent hover:border-desi-accent transition-all duration-200"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.15, duration: 0.7, ease: 'easeOut' }}
            >
              <span className="text-4xl mb-4">{item.icon}</span>
              <span className="font-brand text-xl text-desi-primary font-semibold mb-2">{item.title}</span>
              <p className="text-desi-secondary text-base">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Banner Section */}
      <section className="max-w-4xl mx-auto my-20 px-4">
        <motion.div
          className="bg-desi-accent/20 rounded-2xl flex flex-col items-center gap-6 px-8 py-10 shadow-lg text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <span className="inline-flex items-center gap-2 font-brand text-2xl md:text-3xl text-desi-secondary font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-desi-primary">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25M6.364 6.364l-1.591 1.591M3 12h2.25m1.114 5.636l-1.591 1.591M12 21v-2.25m5.636-1.114l1.591 1.591M21 12h-2.25m-1.114-5.636l1.591-1.591" />
            </svg>
            Ready to Discover Something Unique?
          </span>
          <button
            className="bg-orange-300 text-white px-8 py-3 rounded-xl font-brand text-lg shadow-lg hover:bg-orange-400 transition-colors duration-200 scale-100 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-desi-accent mt-6"
            onClick={() => navigate('/products')}
          >
            Browse Products
          </button>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
