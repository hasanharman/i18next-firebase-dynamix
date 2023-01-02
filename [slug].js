import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useTranslation } from "next-i18next";
import i18nextConfig from "../../../next-i18next.config";

export default function MediaDetails() {
  const router = useRouter();
  console.log(router);
  const queryInfo = router.query.slug;
  const { t } = useTranslation("common");
  const currentLocale = router.query.locale || i18nextConfig.i18n.defaultLocale;

  const [media, setMedia] = useState();

  async function getMediaWithId() {
    const docRef = doc(db, "medias", queryInfo);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setMedia(docSnap.data());
    } else {
      console.log("No such document!");
    }
  }

  useEffect(() => {
    getMediaWithId();
  }, []);

  return (
    <div>
      {/* Banner */}
      <div
        style={{ backgroundImage: `url(${media?.coverImage})` }}
        className="w-full h-[60vh] saturate-[.75] bg-cover bg-center"
      >
        <div className="bg-black/[.5] p-4 w-full h-full flex items-center justify-center">
          <div className="px-5 lg:w-1/2 text-center text-white font-playflair leading-10 tracking-wide	text-5xl lg:text-6xl  drop-shadow-xl">
            {currentLocale == "en" && media?.en.title}
            {currentLocale == "es" && media?.es.title}
            {currentLocale == "pr" && media?.pr.title}
            {currentLocale == "tr" && media?.tr.title}
          </div>
        </div>
      </div>
      <section className="max-w-5xl mx-auto py-10">
        {currentLocale == "en" && (
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-montserrat font-gray-900">
              {media?.en.title}
            </h1>
            {/* <img
              src={media?.coverImage}
              alt={media?.en.title}
              className="rounded shadow-md"
            /> */}
            <p className="text-gray-500">{media?.en.summary}</p>
            <i className="font-light text-gray-500"> {media?.source}</i>
            <iframe
              src={media?.videoSource}
              allowFullScreen
              height={500}
              className="rounded shadow-md"
            ></iframe>
          </div>
        )}
        {currentLocale == "es" && (
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-montserrat font-gray-900">
              {media?.es.title}
            </h1>
            <p className="font-light">{media?.es.summary}</p>
            <i className="font-light text-gray-500"> {media?.source}</i>
            <iframe
              src={media?.videoSource}
              allowFullScreen
              height={500}
              className="rounded shadow-md"
            ></iframe>
          </div>
        )}
        {currentLocale == "pr" && (
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-montserrat font-gray-900">
              {media?.pr.title}
            </h1>
            <p className="font-light">{media?.pr.summary}</p>
            <i className="font-light text-gray-500"> {media?.source}</i>
            <iframe
              src={media?.videoSource}
              allowFullScreen
              height={500}
              className="rounded shadow-md"
            ></iframe>
          </div>
        )}
        {currentLocale == "tr" && (
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-montserrat font-gray-900">
              {media?.tr.title}
            </h1>
            <p className="font-light">{media?.tr.summary}</p>
            <i className="font-light text-gray-500"> {media?.source}</i>
            <iframe
              src={media?.videoSource}
              allowFullScreen
              height={500}
              className="rounded shadow-md"
            ></iframe>
          </div>
        )}
      </section>
    </div>
  );
}

export async function getStaticPaths() {
  const posts = await getAllNews();
  const paths = posts
    .map((p) =>
      i18nextConfig.i18n.locales.map((l) => ({
        params: { slug: p.id },
        locale: l,
      }))
    )
    .flat();

  return {
    paths: paths,
    fallback: "blocking",
  };
}

export async function getStaticProps(context) {
  const slug = context.params.slug;
  const locale = context.params.locale;

  return {
    props: {
      slug: slug,
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
