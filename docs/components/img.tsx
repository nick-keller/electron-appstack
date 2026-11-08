import type { StaticImageData } from 'next/image'

type ImgProps = {
  src: StaticImageData
  alt?: string
  /** Render at half the intrinsic size (image was captured at 2x) */
  retina?: boolean
  /** Shrink the wrapper to the image and center it, instead of full width */
  center?: boolean
  /** Image touches the wrapper's top edge: no top padding, no top corner radius */
  top?: boolean
  right?: boolean
  bottom?: boolean
  left?: boolean
}

export function Img({ src, alt = '', retina = false, center = false, top, right, bottom, left }: ImgProps) {
  const width = retina ? Math.round(src.width / 2) : src.width
  const height = retina ? Math.round(src.height / 2) : src.height

  const wrapper = [
    "mt-6 overflow-hidden rounded-xl bg-neutral-100 bg-[url('/image-background.webp')] bg-cover bg-center dark:bg-neutral-800",
    center ? 'mx-auto w-fit max-w-full' : 'flex w-full justify-center',
    top ? 'pt-0' : 'pt-8',
    right ? 'pr-0' : 'pr-8',
    bottom ? 'pb-0' : 'pb-8',
    left ? 'pl-0' : 'pl-8'
  ]

  const image = [
    'block h-auto max-w-full shadow-xl',
    !top && !left && 'rounded-tl-2xl',
    !top && !right && 'rounded-tr-2xl',
    !bottom && !left && 'rounded-bl-2xl',
    !bottom && !right && 'rounded-br-2xl'
  ]

  return (
    <div className={wrapper.filter(Boolean).join(' ')}>
      <img
        src={src.src}
        width={width}
        height={height}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={image.filter(Boolean).join(' ')}
      />
    </div>
  )
}
