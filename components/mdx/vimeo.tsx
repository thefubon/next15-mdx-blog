const Vimeo = ({ videoId }: { videoId: string }) => {
  const videoSrc = `https://player.vimeo.com/video/${videoId}`
  return (
    <div className="">
      <iframe
        title="vimeo-player"
        className="w-full aspect-video"
        src={videoSrc}
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
        allowFullScreen></iframe>
    </div>
  )
}

export default Vimeo
