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
        className="w-[600px] h-[600px]"
        width={600}
        height={600}
        alt="Product preview"
        priority
      />
    </motion.div>
  );
};

export default ProductPreviewImage;
