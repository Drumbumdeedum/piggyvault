"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const ProductPreviewImage = () => {
  return (
    <motion.div
      initial={{ opacity: 1, x: 600 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ style: "tween", duration: 0.5 }}
    >
      <Image
        src="/images/placeholders/product_placeholder.svg"
        width={600}
        height={600}
        alt="Product preview"
      />
    </motion.div>
  );
};

export default ProductPreviewImage;
