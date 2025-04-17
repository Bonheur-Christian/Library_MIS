export default function Loader() {
  return (
    <div className="bg-indigo-900 flex flex-col justify-center items-center min-h-screen">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
        width="196"
        height="196"
        style={{
          shapeRendering: "auto",
          display: "block",
          background: "rgb(49, 46, 129)",
        }}
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <g>
          <rect fill="#ffffff" height="40" width="9" y="30" x="15.5">
            <animate
              begin="-0.4195804195804196"
              values="1;0.2;1"
              keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
              keyTimes="0;0.5;1"
              calcMode="spline"
              repeatCount="indefinite"
              dur="0.6993006993006994s"
              attributeName="opacity"
            ></animate>
          </rect>
          <rect fill="#ffffff" height="40" width="9" y="30" x="35.5">
            <animate
              begin="-0.27972027972027974"
              values="1;0.2;1"
              keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
              keyTimes="0;0.5;1"
              calcMode="spline"
              repeatCount="indefinite"
              dur="0.6993006993006994s"
              attributeName="opacity"
            ></animate>
          </rect>
          <rect fill="#ffffff" height="40" width="9" y="30" x="55.5">
            <animate
              begin="-0.13986013986013987"
              values="1;0.2;1"
              keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
              keyTimes="0;0.5;1"
              calcMode="spline"
              repeatCount="indefinite"
              dur="0.6993006993006994s"
              attributeName="opacity"
            ></animate>
          </rect>
          <rect fill="#ffffff" height="40" width="9" y="30" x="75.5">
            <animate
              begin="-0.6993006993006994"
              values="1;0.2;1"
              keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
              keyTimes="0;0.5;1"
              calcMode="spline"
              repeatCount="indefinite"
              dur="0.6993006993006994s"
              attributeName="opacity"
            ></animate>
          </rect>
          <g></g>
        </g>
      </svg>
      <div className="mt-[-3rem]">
          <h1 className="text-white text-3xl ms-8 font-bold">Loading <span className="text-5xl">...</span></h1>
      </div>
    </div>
  );
}
