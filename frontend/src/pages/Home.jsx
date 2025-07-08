import React from "react";
import { motion } from "framer-motion";
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

const Home = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex flex-col items-center justify-center text-center py-16 px-4 bg-gradient-to-b from-desi-primary/10 to-white"
      >
        <h1 className="font-brand text-4xl md:text-5xl font-bold text-desi-primary mb-4">Welcome to Desi Etsy</h1>
        <p className="text-desi-secondary text-lg md:text-xl mb-6">Shop handmade, shop Desi</p>
        <motion.div whileHover={{ scale: 1.08 }}>
          <Button className="bg-desi-primary text-white px-8 py-3 rounded-xl shadow-lg font-semibold text-lg hover:bg-desi-accent transition-colors duration-200">
            Explore Now
          </Button>
        </motion.div>
      </motion.section>

      {/* Featured Categories */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-7xl mx-auto py-12 px-4"
      >
        <h2 className="font-brand text-2xl md:text-3xl font-bold text-desi-secondary mb-8 text-center">Featured Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {categories.map((cat) => (
            <motion.div
              key={cat.name}
              whileHover={{ scale: 1.04 }}
              className="rounded-xl shadow-lg overflow-hidden bg-white flex flex-col items-center p-4 cursor-pointer hover:shadow-xl transition-shadow duration-200 min-h-[220px]"
            >
              <img src={cat.img} alt={cat.name} className="h-32 w-full object-cover rounded-lg mb-3" onError={e => e.target.style.display='none'} />
              <span className="font-semibold text-desi-primary text-lg mt-2">{cat.name}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Why Shop Handmade */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-7xl mx-auto py-12 px-4"
      >
        <h2 className="font-brand text-2xl md:text-3xl font-bold text-desi-secondary mb-8 text-center">Why Shop Handmade?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {whyHandmade.map((item) => (
            <motion.div
              key={item.title}
              whileHover={{ y: -6, boxShadow: "0 8px 32px rgba(231,111,81,0.10)" }}
              className="rounded-xl bg-white shadow-lg p-8 text-center flex flex-col items-center min-h-[160px]"
            >
              <span className="font-brand text-xl text-desi-primary font-semibold mb-2">{item.title}</span>
              <p className="text-desi-secondary text-base">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
