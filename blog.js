import Link from "../../../components/Link";
import { useTranslation } from "next-i18next";
import { getStaticPaths, makeStaticProps } from "../../../lib/getStatic";
import i18nextConfig from "../../../next-i18next.config";

import MediaCard from "../../../components/MediaCard";

import { useEffect, useState } from "react";
import { db } from "../../../lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useRouter } from "next/router";

const styles = {
  h1: "text-5xl font-bold font-playflair",
  h3: "text-xl font-light	font-montserrat",
  head: "font-md text-xl font-montserrat",
  text: "font-light font-montserrat",
  listingImage: "w-[100vw] object-contain",
  outlineButton:
    "border border-black px-4 py-2 hover:bg-black hover:text-white",
  activeTab:
    "inline-block rounded-sm py-2 px-4 bg-black hover:bg-gray-800 text-white",
  regularTab:
    "inline-block border border-white rounded hover:border-gray-200 text-black hover:bg-gray-200 py-2 px-4",
};

const Media = () => {
  const router = useRouter();
  const { t } = useTranslation("common");

  const [allNews, setAllNews] = useState([]);
  const [activeTab, setActiveTab] = useState("News");

  const getPosts = async () => {
    const collectionRef = collection(db, "medias");
    const q = query(collectionRef, orderBy("publishDate", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAllNews(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div>
      {/* Banner */}
      <div className="w-full h-[40vh]  bg-[url('../public/images/Media/banner.jpg')] bg-cover bg-center">
        <div className="bg-black/[.33] p-4 w-full h-full flex items-center justify-center">
          <div className="px-5 lg:w-1/2 text-center text-white font-playflair leading-10 tracking-wide	text-5xl lg:text-6xl  drop-shadow-xl">
            {t("media-title")}
          </div>
        </div>
      </div>
      {/* Content Section */}
      <section className="max-w-5xl mx-auto">
        <section className="flex flex-col justify-center items-center gap-5 my-5 lg:mx-0">
          <ul className="flex justify-between gap-3 cursor-pointer">
            <li
              onClick={() => setActiveTab("News")}
              className={
                activeTab == "News"
                  ? `${styles.activeTab}`
                  : `${styles.regularTab}`
              }
            >
              NEWS
            </li>
            <li
              onClick={() => setActiveTab("Blog")}
              className={
                activeTab == "Blog"
                  ? `${styles.activeTab}`
                  : `${styles.regularTab}`
              }
            >
              BLOG
            </li>
          </ul>
          <div className="w-full flex items-center flex-wrap gap-10 my-5">
            <div className="flex  items-center gap-1">
              {activeTab == "News" && (
                <div className="flex items-center gap-10">
                  <div className="flex flex-col justify-start items-start gap-3">
                    <div className="flex">
                      <div className="flex gap-3">
                        {allNews.map((media) => (
                          <MediaCard key={media.id} media={media} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab == "Blog" && (
                <div className="flex items-center gap-10">
                  <div className="flex flex-col justify-start items-start gap-3 min-h-[40vh]">
                    <h1>Blogs will be added soon</h1>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </section>
    </div>
  );
};

export default Media;

const getStaticProps = makeStaticProps("common");
export { getStaticPaths, getStaticProps };
