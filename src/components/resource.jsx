import { useState } from "react";
import "./resource.css";

function Resource({ image, title, url, description, tag = "Resource" }) {
  const [imgError, setImgError] = useState(false);

  const displayUrl = (() => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  })();

  return (
      <article className="resource-card">
        <div className="resource-card__image-wrapper">
          {!imgError ? (
            <img
              className="resource-card__image"
              src={image}
              alt={title}
              onError={() => setImgError(true)}
            />
          ) : (
            <div style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.7rem",
              color: "#444455",
              letterSpacing: "0.1em",
            }}>
              [ NO IMAGE ]
            </div>
          )}
          <span className="resource-card__tag">{tag}</span>
        </div>

        <div className="resource-card__body">
          <a
            className="resource-card__title-link"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className="resource-card__title">{title}</h2>
          </a>

          <p className="resource-card__description">{description}</p>

          <div className="resource-card__footer">
            <span className="resource-card__url">{displayUrl}</span>
            <a
              className="resource-card__cta"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore →
            </a>
          </div>
        </div>
      </article>
  );
}

export default Resource;