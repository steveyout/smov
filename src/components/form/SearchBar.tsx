import c from "classnames";
import { forwardRef, useEffect, useState } from "react";

import { Flare } from "@/components/utils/Flare";

import { Icon, Icons } from "../Icon";
import { TextInputControl } from "../text-inputs/TextInputControl";

export interface SearchBarProps {
  placeholder?: string;
  onChange: (value: string, force: boolean) => void;
  onUnFocus: (newSearch?: string) => void;
  value: string;
}

export const SearchBarInput = forwardRef<HTMLInputElement, SearchBarProps>(
  (props, ref) => {
    const [focused, setFocused] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    function setSearch(value: string) {
      props.onChange(value, true);
    }

    function toggleExpand() {
      setExpanded(!expanded);
      if (!expanded) {
        setTimeout(() => {
          if (ref && typeof ref !== "function") {
            ref.current?.focus();
          }
        }, 100);
      }
    }

    return (
      <Flare.Base
        className={c({
          "hover:flare-enabled group flex items-center rounded-[28px] transition-all relative":
            true,
          "w-full max-w-[90vw] h-10 sm:w-[400px] sm:h-auto md:w-[500px] lg:w-[600px]":
            true,
          "bg-search-background": !focused,
          "bg-search-focused": focused,
        })}
      >
        <Flare.Light
          flareSize={400}
          enabled={focused}
          className="rounded-[28px]"
          backgroundClass={c({
            "transition-colors": true,
            "bg-search-background": !focused,
            "bg-search-focused": focused,
          })}
        />
        <Flare.Child className="flex flex-1 items-center">
          <div
            className={c(
              "flex items-center justify-center cursor-pointer sm:pointer-events-none",
              {
                "w-10 h-10 sm:w-auto sm:h-auto": true,
              },
            )}
            onClick={toggleExpand}
          >
            <Icon
              icon={Icons.SEARCH}
              className="w-5 h-5 text-search-icon sm:w-4 sm:h-4 sm:absolute sm:left-5 sm:top-1/2 sm:-translate-y-1/2"
            />
          </div>

          <div
            className={c("flex-1 transition-all overflow-hidden", {
              "w-0 sm:w-full": !expanded,
              "w-full": expanded,
            })}
          >
            <TextInputControl
              ref={ref}
              onUnFocus={() => {
                setFocused(false);
                props.onUnFocus();
                setExpanded(false);
              }}
              onFocus={() => setFocused(true)}
              onChange={(val) => setSearch(val)}
              value={props.value}
              className="w-full bg-transparent px-4 py-3 sm:py-4 text-sm sm:text-base text-search-text placeholder-search-placeholder focus:outline-none sm:pl-14"
              placeholder={props.placeholder}
            />
          </div>

          {props.value.length > 0 && (expanded || windowWidth >= 640) && (
            <div
              onClick={() => {
                props.onUnFocus("");
                if (ref && typeof ref !== "function") {
                  ref.current?.focus();
                }
              }}
              className="cursor-pointer hover:text-white flex justify-center h-10 w-10 items-center hover:scale-110 active:scale-110 text-search-icon rounded-full transition-[transform,background-color] duration-200 absolute right-0 top-1/2 -translate-y-1/2"
            >
              <Icon
                icon={Icons.X}
                className="w-5 h-5 transition-colors duration-200"
              />
            </div>
          )}
        </Flare.Child>
      </Flare.Base>
    );
  },
);
