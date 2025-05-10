const PulsingUnderline = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <span className="animate-pulseColor absolute -bottom-2 left-0 z-0 h-[6px] w-full rounded-sm shadow-sm blur-[0.5px]" />
    </span>
  );
};

export default PulsingUnderline;
