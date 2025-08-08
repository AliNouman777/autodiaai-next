// Markers.tsx
export function Markers() {
  return (
    <svg width="0" height="0">
      <defs>
        {/* One marker ( | ) */}
        <marker
          id="one-start"
          refX="2"
          refY="5"
          markerWidth="20"
          markerHeight="10"
          orient="auto"
        >
          <path d="M5,0 L5,10" stroke="black" strokeWidth="1" />
        </marker>

        <marker
          id="one-end"
          refX="8"
          refY="5"
          markerWidth="20"
          markerHeight="10"
          orient="auto"
        >
          <path d="M5,0 L5,10" stroke="black" strokeWidth="1" />
        </marker>

        {/* Many Marker (points right by default) */}
        <marker
          id="many-end"
          viewBox="0 0 10 10"
          refX="10"
          refY="5"
          markerWidth="10"
          markerHeight="10"
          orient="auto"
        >
          <path
            d="M 10 0 L 0 5 L 10 10"
            fill="none"
            stroke="black"
            strokeWidth="1"
          />
        </marker>
        {/* Many Marker Flipped (points left) */}
        <marker
          id="many-start"
          viewBox="0 0 10 10"
          refX="0"
          refY="5"
          markerWidth="10"
          markerHeight="10"
          orient="auto"
        >
          <path
            d="M 0 0 L 10 5 L 0 10"
            fill="none"
            stroke="black"
            strokeWidth="1"
          />
        </marker>

        {/* Zero-to-One Marker (points right by default) */}
        <marker
          id="zero-to-one-start"
          viewBox="0 0 20 10"
          refX="-8"
          refY="5"
          markerWidth="30"
          markerHeight="10"
          orient="auto"
        >
          <path d="M5,0 L5,10" stroke="black" strokeWidth="1" />
          <circle
            cx="-2"
            cy="5"
            r="4"
            fill="white"
            stroke="black"
            strokeWidth="1"
          />
        </marker>
        {/* Zero-to-One Marker Flipped (points left) */}
        <marker
          id="zero-to-one-end"
          viewBox="0 0 20 10"
          refX="17"
          refY="5"
          markerWidth="30"
          markerHeight="10"
          orient="auto"
        >
          <path d="M5,0 L5,10" stroke="black" strokeWidth="1" />
          <circle
            cx="12"
            cy="5"
            r="4"
            fill="white"
            stroke="black"
            strokeWidth="1"
          />
        </marker>

        {/* Zero-to-Many Marker (points right by default) */}
        <marker
          id="zero-to-many-end"
          viewBox="0 0 20 10"
          refX="10"
          refY="5"
          markerWidth="40"
          markerHeight="10"
          orient="auto"
        >
          <circle
            cx="-5"
            cy="5"
            r="4"
            fill="white"
            stroke="black"
            strokeWidth="1"
          />

          <path
            d="M 10 0 L 0 5 L 10 10"
            fill="none"
            stroke="black"
            strokeWidth="1"
          />
        </marker>
        {/* Zero-to-Many Marker Flipped (points left) */}
        <marker
          id="zero-to-many-start"
          viewBox="0 0 20 10"
          refX="0"
          refY="5"
          markerWidth="40"
          markerHeight="10"
          orient="auto"
        >
          <circle
            cx="15"
            cy="5"
            r="4"
            fill="white"
            stroke="black"
            strokeWidth="1"
          />
          <path
            d="M 0 0 L 10 5 L 0 10"
            fill="white"
            stroke="black"
            strokeWidth="1"
          />
        </marker>

        {/* Only Zero Marker (circle, symmetric) */}
        <marker
          id="zero-end"
          viewBox="0 0 10 10"
          refX="10"
          refY="5"
          markerWidth="10"
          markerHeight="10"
          orient="auto"
        >
          <circle
            cx="5"
            cy="5"
            r="4"
            fill="white"
            stroke="black"
            strokeWidth="1"
          />
        </marker>

        <marker
          id="zero-start"
          viewBox="0 0 10 10"
          refX="0"
          refY="5"
          markerWidth="10"
          markerHeight="10"
          orient="auto"
        >
          <circle
            cx="5"
            cy="5"
            r="4"
            fill="white"
            stroke="black"
            strokeWidth="1"
          />
        </marker>
      </defs>
    </svg>
  );
}
