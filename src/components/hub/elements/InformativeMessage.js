import addSuffix from "@utils/navigation/add_suffix";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function InformativeMessage({
  text,
  params,
  isPrevMesssageUsers,
}) {
  const { pathname, hash } = useLocation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className={"informative-message" + (isPrevMesssageUsers ? " mt-10" : "")}
      onClick={() =>
        addSuffix(pathname + hash, `/user?uid=${params?.user?._id}`)
      }
    >
      {text}
    </motion.div>
  );
}
