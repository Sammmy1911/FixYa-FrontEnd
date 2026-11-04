/* eslint-disable @next/next/no-img-element */

type FigmaIconProps = {
  /** Nombre del archivo exportado de Figma dentro de /public/figma (sin extensión). */
  name: string;
  width: number;
  height: number;
  className?: string;
  ext?: "svg" | "png";
};

/**
 * Ícono exportado del diseño de Figma. Los archivos se descargan con
 * scripts/descargar-assets-figma.sh y viven en /public/figma.
 */
export default function FigmaIcon({
  name,
  width,
  height,
  className = "",
  ext = "svg",
}: FigmaIconProps) {
  return (
    <img
      src={`/figma/${name}.${ext}`}
      alt=""
      aria-hidden
      width={width}
      height={height}
      style={{ width, height }}
      className={`block shrink-0 ${className}`}
    />
  );
}
