import { useCallback, useEffect, useRef, useState } from "react";
import { To, useNavigate } from "react-router-dom";
import Sticky from "react-sticky-el";
import { useWindowSize } from "react-use";

import { SearchBarInput } from "@/components/form/SearchBar";
import { ThinContainer } from "@/components/layout/ThinContainer";
import { useSlashFocus } from "@/components/player/hooks/useSlashFocus";
import { HeroTitle } from "@/components/text/HeroTitle";
import { useRandomTranslation } from "@/hooks/useRandomTranslation";
import { useSearchQuery } from "@/hooks/useSearchQuery";
import { useBannerSize } from "@/stores/banner";

export interface HeroPartProps {
  setIsSticky: (val: boolean) => void;
  searchParams: ReturnType<typeof useSearchQuery>;
}

function getTimeOfDay(date: Date): "night" | "morning" | "day" | "420" | "69" {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  if (month === 4 && day === 20) return "420";
  if (month === 6 && day === 9) return "69";
  const hour = date.getHours();
  if (hour < 5) return "night";
  if (hour < 12) return "morning";
  if (hour < 19) return "day";
  return "night";
}

export function HeroPart({ setIsSticky, searchParams }: HeroPartProps) {
  const { t: randomT } = useRandomTranslation();
  const [search, setSearch, setSearchUnFocus] = searchParams;
  const [showBg, setShowBg] = useState(false);
  const navigate = useNavigate();
  const [isSticky, setIsStickyState] = useState(false);
  const bannerSize = useBannerSize();
  const stickStateChanged = useCallback(
    (isFixed: boolean) => {
      setShowBg(isFixed);
      setIsSticky(isFixed);
      setIsStickyState(isFixed);
    },
    [setShowBg, setIsSticky, setIsStickyState],
  );

  const { width: windowWidth } = useWindowSize();

  const topSpacing = 16;
  const [stickyOffset, setStickyOffset] = useState(topSpacing);
  useEffect(() => {
    if (windowWidth > 1200) {
      setStickyOffset(topSpacing);
    } else if (windowWidth > 768) {
      setStickyOffset(topSpacing + 40);
    } else {
      setStickyOffset(topSpacing + 60);
    }
  }, [windowWidth]);

  const time = getTimeOfDay(new Date());
  const title = randomT(`home.titles.${time}`);
  const placeholder = randomT(`home.search.placeholder`);
  const inputRef = useRef<HTMLInputElement>(null);
  useSlashFocus(inputRef);

  const handleClick = (path: To) => {
    window.scrollTo(0, 0);
    navigate(path);
  };

  const isMobile = windowWidth < 640;

  return (
    <ThinContainer>
      <div className="mt-44 md:mt-28 lg:mt-44 space-y-16 md:space-y-12 lg:space-y-16 text-center">
        <div className="relative z-10 mb-8 md:mb-12 lg:mb-16">
          <HeroTitle className="mx-auto max-w-md sm:max-w-sm md:max-w-md">
            {title}
          </HeroTitle>
        </div>
        <div className="relative h-20 z-30">
          <Sticky
            topOffset={stickyOffset * -1 + bannerSize}
            stickyStyle={{
              paddingTop: `${stickyOffset + bannerSize}px`,
              left: "50%",
              transform: "translateX(-50%)",
              right: "auto",
              zIndex: 30,
            }}
            onFixedToggle={stickStateChanged}
          >
            <div
              className={`flex ${isMobile ? "flex-col" : "flex-row"} justify-center items-center ${
                showBg ? "bg-background" : ""
              }`}
            >
              <div
                className={`flex flex-col items-center justify-center ${
                  showBg ? "w-full px-4 sm:px-8 md:px-12 lg:px-16" : ""
                }`}
              >
                <div
                  className={`flex-grow w-full ${
                    showBg ? "max-w-full sm:max-w-3xl" : ""
                  } transition-all duration-300 ease-in-out h-14 flex ${
                    isMobile ? "flex-col " : "flex-row"
                  } items-center`}
                >
                  <div
                    className={`flex-grow ${isMobile ? "flex-grow w-72" : ""}`}
                  >
                    <SearchBarInput
                      ref={inputRef}
                      onChange={setSearch}
                      value={search}
                      onUnFocus={setSearchUnFocus}
                      placeholder={placeholder ?? ""}
                    />
                  </div>
                  <div
                    className={`ml-4 flex-shrink-0 ${
                      isSticky ? "invisible" : ""
                    } ${isMobile ? "hidden" : "block"}`}
                  >
                    <div className="relative group">
                      <button
                        type="button"
                        className="p-2 rounded-full bg-largeCard-background text-buttons-secondaryText flex items-center justify-center w-14 h-14 hover:bg-opacity-80 transition-all duration-300 ease-in-out"
                        onClick={() => handleClick("/discover")}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                          className="w-6 h-6 fill-current"
                        >
                          <path d="M493.7 .9L299.4 75.6l2.3-29.3c1-12.8-12.8-21.5-24-15.1L101.3 133.4C38.6 169.7 0 236.6 0 309C0 421.1 90.9 512 203 512c72.4 0 139.4-38.6 175.7-101.3L480.8 234.3c6.5-11.1-2.2-25-15.1-24l-29.3 2.3L511.1 18.3c.6-1.5 .9-3.2 .9-4.8C512 6 506 0 498.5 0c-1.7 0-3.3 .3-4.8 .9zM192 192a128 128 0 1 1 0 256 128 128 0 1 1 0-256zm0 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm16 96a16 16 0 1 0 0-32 16 16 0 1 0 0 32z" />
                        </svg>
                      </button>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-2 bg-[#0A0A12] text-white text-base rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 whitespace-nowrap">
                        Browse
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-[#0A0A12]" />
                      </div>
                    </div>
                  </div>
                </div>
                {isMobile && (
                  <div
                    className={`mt-4 sm:hidden w-full ${
                      isSticky ? "hidden" : "block"
                    }`}
                  >
                    <div className="relative group">
                      <button
                        type="button"
                        className="w-full h-14 p-2 rounded-3xl bg-largeCard-background text-buttons-secondaryText flex items-center justify-center hover:bg-opacity-80 transition-all duration-300 ease-in-out"
                        onClick={() => handleClick("/discover")}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                          className="w-6 h-6 fill-current mr-2"
                        >
                          <path d="M493.7 .9L299.4 75.6l2.3-29.3c1-12.8-12.8-21.5-24-15.1L101.3 133.4C38.6 169.7 0 236.6 0 309C0 421.1 90.9 512 203 512c72.4 0 139.4-38.6 175.7-101.3L480.8 234.3c6.5-11.1-2.2-25-15.1-24l-29.3 2.3L511.1 18.3c.6-1.5 .9-3.2 .9-4.8C512 6 506 0 498.5 0c-1.7 0-3.3 .3-4.8 .9zM192 192a128 128 0 1 1 0 256 128 128 0 1 1 0-256zm0 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm16 96a16 16 0 1 0 0-32 16 16 0 1 0 0 32z" />
                        </svg>
                        Browse
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Sticky>
        </div>
      </div>
    </ThinContainer>
  );
}
