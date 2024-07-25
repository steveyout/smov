import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { To, useNavigate } from "react-router-dom";

import { WideContainer } from "@/components/layout/WideContainer";
import { useDebounce } from "@/hooks/useDebounce";
import { useRandomTranslation } from "@/hooks/useRandomTranslation";
import { useSearchQuery } from "@/hooks/useSearchQuery";
import { Button } from "@/pages/About";
import { HomeLayout } from "@/pages/layouts/HomeLayout";
import { BookmarksPart } from "@/pages/parts/home/BookmarksPart";
import { HeroPart } from "@/pages/parts/home/HeroPart";
import { WatchingPart } from "@/pages/parts/home/WatchingPart";
import { SearchListPart } from "@/pages/parts/search/SearchListPart";
import { SearchLoadingPart } from "@/pages/parts/search/SearchLoadingPart";

function useSearch(search: string) {
  const [searching, setSearching] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const debouncedSearch = useDebounce<string>(search, 500);
  useEffect(() => {
    setSearching(search !== "");
    setLoading(search !== "");
  }, [search]);
  useEffect(() => {
    setLoading(false);
  }, [debouncedSearch]);

  return {
    loading,
    searching,
  };
}

// What the sigma?

export function HomePage() {
  const { t } = useTranslation();
  const { t: randomT } = useRandomTranslation();
  const emptyText = randomT(`home.search.empty`);
  const navigate = useNavigate();
  const [showBg, setShowBg] = useState<boolean>(false);
  const searchParams = useSearchQuery();
  const [search] = searchParams;
  const s = useSearch(search);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showWatching, setShowWatching] = useState(false);

  const handleClick = (path: To) => {
    window.scrollTo(0, 0);
    navigate(path);
  };

  return (
    <HomeLayout showBg={showBg}>
      <div className="mb-16 sm:mb-24">
        <Helmet>
          <style type="text/css">{`
            html, body {
              scrollbar-gutter: stable;
            }
          `}</style>
          <title>{t("global.name")}</title>
        </Helmet>
        <HeroPart searchParams={searchParams} setIsSticky={setShowBg} />
      </div>
      <WideContainer>
        {s.loading ? (
          <SearchLoadingPart />
        ) : s.searching ? (
          <SearchListPart searchQuery={search} />
        ) : (
          <>
            <div className="flex flex-col gap-8">
              <BookmarksPart onItemsChange={setShowBookmarks} />
              <WatchingPart onItemsChange={setShowWatching} />
            </div>
            {!(showBookmarks || showWatching) ? (
              <div className="flex flex-col items-center justify-center">
                <p className="text-[18.5px] pb-3">{emptyText}</p>
                <Button
                  className="px-py p-[0.35em] mt-3 rounded-xl text-type-dimmed box-content text-[18px] bg-largeCard-background text-buttons-secondaryText justify-center items-center flex"
                  onClick={() => handleClick("/discover")}
                >
                  {t("Browse")}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="w-[1em] h-[1em] ml-2 fill-current"
                  >
                    <path d="M493.7 .9L299.4 75.6l2.3-29.3c1-12.8-12.8-21.5-24-15.1L101.3 133.4C38.6 169.7 0 236.6 0 309C0 421.1 90.9 512 203 512c72.4 0 139.4-38.6 175.7-101.3L480.8 234.3c6.5-11.1-2.2-25-15.1-24l-29.3 2.3L511.1 18.3c.6-1.5 .9-3.2 .9-4.8C512 6 506 0 498.5 0c-1.7 0-3.3 .3-4.8 .9zM192 192a128 128 0 1 1 0 256 128 128 0 1 1 0-256zm0 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm16 96a16 16 0 1 0 0-32 16 16 0 1 0 0 32z" />
                  </svg>
                </Button>
              </div>
            ) : null}
          </>
        )}
      </WideContainer>
    </HomeLayout>
  );
}
