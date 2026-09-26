#!/bin/sh
# Rebuild the shipped Roboto woff2 files from the TTF masters (needs fonttools:
# pip install fonttools brotli). Coverage: Basic Latin + Latin-1 (German),
# Romanian letters, the typographic punctuation in use. No arrows on purpose:
# the site's arrows render in the fallback font, as they always have.
set -e
U="U+0020-007E,U+00A0-00FF,U+0102-0103,U+0218-021B,U+2013-2014,U+2018-201E,U+2022,U+2026,U+20AC"
cd "$(dirname "$0")/../assets/fonts"
for w in 300 400 500 600 700; do
  pyftsubset "roboto-$w.ttf" --unicodes="$U" --layout-features='*' --flavor=woff2 --output-file="roboto-$w.woff2"
done
