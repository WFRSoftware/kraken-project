import React from "react";

export default function FindingIcon(props: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={"icon"} {...props}>
            <svg
                className="neon"
                width="800px"
                height="800px"
                viewBox="0 0 128 128"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g clipPath="url(#clip0)">
                    <path
                        d="m72.235 79.21c0.8345-2.722 1.1439-4.4416 0.7211-7.2584-0.4613-3.0734-1.0598-5.062-3.2451-7.2583-2.461-2.4734-9.0143-3.2663-9.0143-3.2663s0 7.858-2.1634 8.7101c-1.0821 0.4261-7.0109-4.287-7.2115-8.7101-0.0407-0.8972 6.0251-8.7277 11.899-9.4359 1.4419-0.1739 14.945 6.8788 16.226 15.606 0.7836 5.339-0.4864 8.8003-3.2451 13.428-2.1634 3.6292-23.798 20.687-23.798 20.687s3.0494 1.895 10.817 1.088c7.4974-0.778 19.686-4.2359 21.634-5.4435 3.966-2.4587 18.029-21.049 19.11-34.114 1.082-13.065-23.437-41.976-29.927-43.187-4.3269-0.8079-30.649 7.5406-35.336 11.976-2.6845 2.5404-13.702 22.501-13.702 26.856 0 2.1775 7.2114 19.477 10.096 22.138 2.8846 2.6615 23.438 11.062 25.601 10.162 2.524-1.05 10.704-9.2543 11.538-11.976z"
                        fill="#000000"
                    />
                </g>
                <defs>
                    <clipPath id="clip0">
                        <rect width="128" height="128" fill="#ffffff" />
                    </clipPath>
                </defs>
            </svg>
        </div>
    );
}
