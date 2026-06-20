export function Tweet({ id }: { id: string }) {
  return (
    <div className="tweet-embed">
      <blockquote className="twitter-tweet">
        <a href={`https://twitter.com/x/status/${id}`}>Loading tweet...</a>
      </blockquote>
      <script async src="https://platform.twitter.com/widgets.js" />
    </div>
  );
}
