export function Markers({ color }: { color: string }) {
  const strokeWidth = color === "#0042ff" ? 1.5 : 1; // thicker when hover color

  return (
    <svg width="0" height="0" style={{ pointerEvents: "none" }}>
      <defs>
        {/* One marker ( | ) */}
        <marker
          id="one-start"
          refX="2"
          refY="5"
          markerWidth="20"
          markerHeight="10"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path
            d="M5,0 L5,10"
            stroke={color}
            strokeWidth={strokeWidth}
            vectorEffect="non-scaling-stroke"
          />
        </marker>

        <marker
          id="one-end"
          refX="8"
          refY="5"
          markerWidth="20"
          markerHeight="10"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path
            d="M5,0 L5,10"
            stroke={color}
            strokeWidth={strokeWidth}
            vectorEffect="non-scaling-stroke"
          />
        </marker>

        {/* Many Marker */}
        <marker
          id="many-end"
          viewBox="0 0 10 10"
          refX="10"
          refY="5"
          markerWidth="10"
          markerHeight="10"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path
            d="M 10 0 L 0 5 L 10 10"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            vectorEffect="non-scaling-stroke"
          />
        </marker>

        <marker
          id="many-start"
          viewBox="0 0 10 10"
          refX="0"
          refY="5"
          markerWidth="10"
          markerHeight="10"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path
            d="M 0 0 L 10 5 L 0 10"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            vectorEffect="non-scaling-stroke"
          />
        </marker>

        {/* Zero-to-One */}
        <marker
          id="zero-to-one-start"
          viewBox="0 0 20 10"
          refX="-8"
          refY="5"
          markerWidth="30"
          markerHeight="10"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path
            d="M5,0 L5,10"
            stroke={color}
            strokeWidth={strokeWidth}
            vectorEffect="non-scaling-stroke"
          />
          <circle
            cx="-2"
            cy="5"
            r="4"
            fill="white"
            stroke={color}
            strokeWidth={strokeWidth}
            vectorEffect="non-scaling-stroke"
          />
        </marker>

        <marker
          id="zero-to-one-end"
          viewBox="0 0 20 10"
          refX="17"
          refY="5"
          markerWidth="30"
          markerHeight="10"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path
            d="M5,0 L5,10"
            stroke={color}
            strokeWidth={strokeWidth}
            vectorEffect="non-scaling-stroke"
          />
          <circle
            cx="12"
            cy="5"
            r="4"
            fill="white"
            stroke={color}
            strokeWidth={strokeWidth}
            vectorEffect="non-scaling-stroke"
          />
        </marker>

        {/* Zero-to-Many */}
        <marker
          id="zero-to-many-end"
          viewBox="0 0 20 10"
          refX="10"
          refY="5"
          markerWidth="40"
          markerHeight="10"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <circle
            cx="-5"
            cy="5"
            r="4"
            fill="white"
            stroke={color}
            strokeWidth={strokeWidth}
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 10 0 L 0 5 L 10 10"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            vectorEffect="non-scaling-stroke"
          />
        </marker>

        <marker
          id="zero-to-many-start"
          viewBox="0 0 20 10"
          refX="0"
          refY="5"
          markerWidth="40"
          markerHeight="10"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <circle
            cx="15"
            cy="5"
            r="4"
            fill="white"
            stroke={color}
            strokeWidth={strokeWidth}
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 0 0 L 10 5 L 0 10"
            fill="white"
            stroke={color}
            strokeWidth={strokeWidth}
            vectorEffect="non-scaling-stroke"
          />
        </marker>

        {/* Only Zero */}
        <marker
          id="zero-end"
          viewBox="0 0 10 10"
          refX="10"
          refY="5"
          markerWidth="10"
          markerHeight="10"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <circle
            cx="5"
            cy="5"
            r="4"
            fill="white"
            stroke={color}
            strokeWidth={strokeWidth}
            vectorEffect="non-scaling-stroke"
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
          markerUnits="userSpaceOnUse"
        >
          <circle
            cx="5"
            cy="5"
            r="4"
            fill="white"
            stroke={color}
            strokeWidth={strokeWidth}
            vectorEffect="non-scaling-stroke"
          />
        </marker>
      </defs>
    </svg>
  );
}
