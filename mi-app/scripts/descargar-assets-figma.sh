#!/usr/bin/env bash
# Descarga los íconos e imágenes del diseño de Figma (archivo FixYa) a public/figma.
# Uso (desde la carpeta mi-app):  bash scripts/descargar-assets-figma.sh
# Ojo: los enlaces de Figma vencen 7 días después de generarse (4 nov 2026).
set -u
cd "$(dirname "$0")/.."
mkdir -p public/figma

LANDING=https://www.figma.com/api/mcp/asset/cc085711-a840-4874-acd0-8d47653d4422
PASO1=https://www.figma.com/api/mcp/asset/e0f3a6ca-e2c6-4e0e-a5df-09084b40af98
PASO2=https://www.figma.com/api/mcp/asset/e13bd188-1e60-44d3-85a6-cb2466d12f98
CONFIRMACION=https://www.figma.com/api/mcp/asset/53cb30ac-1d61-48c2-bc73-b925b70204f1

fallos=0
bajar() { # $1 = url base, $2 = archivo remoto, $3 = nombre local
  if curl -sfL -o "public/figma/$3" "$1/$2"; then echo "ok    $3"; else echo "FALLÓ $3"; fallos=$((fallos+1)); fi
}

bajar "$LANDING" c3de6.png tecnico-hero.png
for f in 306c8 116fb 88531 f3c36 1bd97 33d55 7648e a7d62 13f9c 0795f 55656 f8958 59f32 d3302 5510d 87ab4 805e3 a6a2f b0702; do
  bajar "$LANDING" "$f.svg" "$f.svg"
done
for f in bffb6 3ad68 77816 3ac5e 241a7 55e8e 36507 ac463 583c6 77060 4af3b; do
  bajar "$PASO1" "$f.svg" "$f.svg"
done
for f in bed14 0022d e9348 2b7a8 f2706 0f248 cdf88 73d4b 6456d 83e40 56ee3 e7752 4830c e5b10 40b1e 68120 2c49f; do
  bajar "$PASO2" "$f.svg" "$f.svg"
done
for f in 217ee 8af35 edd60 5fa98 433f5 aa935 f4968 9e10c 4c43e b8dbe e28c5 8bec9 d9b4c 929c9; do
  bajar "$CONFIRMACION" "$f.svg" "$f.svg"
done

echo
if [ "$fallos" -eq 0 ]; then echo "Listo: todos los archivos quedaron en public/figma"; else echo "$fallos archivos fallaron"; exit 1; fi
