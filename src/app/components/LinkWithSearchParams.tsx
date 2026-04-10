"use client";

import Link, { type LinkProps } from "next/link";
import { useSearchParams } from "next/navigation";
import type { ComponentPropsWithoutRef } from "react";

type Props = LinkProps & ComponentPropsWithoutRef<typeof Link>;

function mergeHref(
    href: LinkProps["href"],
    currentSearchParams: URLSearchParams,
): LinkProps["href"] {
    if (typeof href === "string") {
        if (!href.startsWith("/") || href.startsWith("//")) {
            return href;
        }

        const url = new URL(href, "http://localhost");
        currentSearchParams.forEach((value, key) => {
            if (!url.searchParams.has(key)) {
                url.searchParams.append(key, value);
            }
        });

        return `${url.pathname}${url.search}${url.hash}`;
    }

    const nextQuery = { ...(href.query ?? {}) };
    currentSearchParams.forEach((value, key) => {
        if (!(key in nextQuery)) {
            nextQuery[key] = value;
        }
    });

    return {
        ...href,
        query: nextQuery,
    };
}

export default function LinkWithSearchParams({ href, ...props }: Props) {
    const searchParams = useSearchParams();
    const currentSearchParams = new URLSearchParams(searchParams.toString());

    return <Link href={mergeHref(href, currentSearchParams)} {...props} />;
}
