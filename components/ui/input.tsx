interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, className, ...props }: Props) {
  return (
    <div className="flex flex-col mb-2">
      {label && <label className="text-sm font-medium mb-1">{label}</label>}
      <input
        {...props}
        className={`border p-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 ${className || ""}`}
      />
    </div>
  );
}
