export function YouTube({ id }: { id: string }) {
  return (
    <div className="youtube-embed">
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="youtube-iframe"
      />
    </div>
  );
}
